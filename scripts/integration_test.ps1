# Integration test: login -> list billing -> simulate payment -> list billing
$ErrorActionPreference = 'Stop'

$body = @{ username = 'admin'; password = 'adminpass' } | ConvertTo-Json
Write-Output "Logging in..."
$r = Invoke-RestMethod -Uri 'http://localhost:8081/api/auth/login' -Method Post -Body $body -ContentType 'application/json'
$token = $r.token
Write-Output "TOKEN: $token"

Write-Output "Fetching bills..."
$bills = Invoke-RestMethod -Uri 'http://localhost:8081/api/billing' -Method Get -Headers @{ Authorization = "Bearer $token" }
Write-Output "BILLS (raw):"
$bills | ConvertTo-Json -Depth 5

if ($bills -and $bills.Count -gt 0) {
    $id = $bills[0].id
    Write-Output "SIMULATING PAYMENT FOR ID: $id"
    $pay = Invoke-RestMethod -Uri "http://localhost:8081/api/payment/simulate/$id" -Method Post -Headers @{ Authorization = "Bearer $token" }
    Write-Output "PAYMENT RESPONSE:"
    $pay | ConvertTo-Json -Depth 5

    Write-Output "Fetching bills after payment..."
    $bills2 = Invoke-RestMethod -Uri 'http://localhost:8081/api/billing' -Method Get -Headers @{ Authorization = "Bearer $token" }
    $bills2 | ConvertTo-Json -Depth 5
} else {
    Write-Output "No bills found"
}
