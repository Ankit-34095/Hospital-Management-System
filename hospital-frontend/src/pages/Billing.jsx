import React, { useEffect, useState } from 'react';
import api from '../services/api';

export default function Billing(){
  const [bills, setBills] = useState([]);
  const [error, setError] = useState('');
  const role = localStorage.getItem('role');
  const patientId = localStorage.getItem('patientId');

  async function load(){
    try {
      const url = role === 'PATIENT' && patientId ? `/api/billing/by-patient/${patientId}` : '/api/billing';
      const res = await api.get(url);
      setBills(Array.isArray(res.data) ? res.data : []);
    } catch(e) {
      console.error(e);
      setError('Failed to load bills.');
    }
  }
  useEffect(()=>{load()},[role, patientId]);

  async function handlePay(id){
    try {
      await api.post(`/api/billing/simulate/${id}`);
      load();
    } catch(e) {
      setError('Payment simulation failed.');
    }
  }

  return (
    <div>
      <div className="page-header">
        <h2 className="page-title">Billing & Invoices</h2>
        <p className="page-subtitle">Manage patient bills and simulate payments.</p>
      </div>

      {error && <div className="alert error">{error}</div>}

      <div className="card">
        <div className="card-header">
          <h3>Invoices</h3>
        </div>
        <div className="table-container">
          <table className="modern-table">
            <thead><tr><th>ID</th><th>Patient</th><th>Service</th><th>Amount</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {bills.length === 0 ? (
                <tr><td colSpan="6" style={{textAlign: 'center'}}>No billing records found.</td></tr>
              ) : bills.map(b=> (
                <tr key={b.id}>
                  <td>{b.id}</td>
                  <td>{b.patient?.name || b.patientId}</td>
                  <td>{b.serviceType}</td>
                  <td>₹{b.amount}</td>
                  <td>
                    <span className={`badge ${b.paymentStatus === 'Paid' ? 'success' : 'warning'}`}>
                      {b.paymentStatus}
                    </span>
                  </td>
                  <td>
                    {b.paymentStatus !== 'Paid' && (
                      <button className="btn-primary" style={{padding: '6px 12px', fontSize: '13px', width: 'auto'}} onClick={()=>handlePay(b.id)}>
                        Pay Now
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
