const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox','--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  page.setDefaultTimeout(10000);

  console.log('Opening frontend...');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });

  console.log('Navigating to login...');
  await page.goto('http://localhost:3000/login', { waitUntil: 'networkidle2' });

  // Fill login form
  await page.type('input[placeholder="Username"]', 'admin');
  await page.type('input[placeholder="Password"]', 'adminpass');
  await Promise.all([
    page.click('button.btn'),
    page.waitForNavigation({ waitUntil: 'networkidle2' }),
  ]);

  console.log('Logged in — checking dashboard');
  const roleText = await page.evaluate(() => document.body.innerText);
  console.log('Dashboard contains:', roleText.substring(0,200));

  console.log('Going to Billing page...');
  await page.goto('http://localhost:3000/billing', { waitUntil: 'networkidle2' });

  // Wait for billing table rows
  await page.waitForSelector('.table tbody tr');
  const bills = await page.$$eval('.table tbody tr', rows => rows.map(r => {
    const tds = Array.from(r.querySelectorAll('td')).map(td => td.innerText);
    return { id: tds[0], patient: tds[1], service: tds[2], amount: tds[3], status: tds[4] };
  }));

  console.log('Found bills:', bills);
  const firstUnpaid = bills.find(b => b.status !== 'Paid');
  if (!firstUnpaid) {
    console.log('No unpaid bills found, nothing to pay.');
    await browser.close();
    return;
  }

  console.log('Paying bill id:', firstUnpaid.id);
  // Click the Pay Now button in the corresponding row
  await page.$$eval('.table tbody tr', (rows, id) => {
    for (const r of rows) {
      const tds = r.querySelectorAll('td');
      if (tds[0].innerText === id) {
        const btn = r.querySelector('button');
        if (btn) btn.click();
      }
    }
  }, firstUnpaid.id);

  // Wait briefly for the page to refresh
  await page.waitForTimeout(1000);
  const billsAfter = await page.$$eval('.table tbody tr', rows => rows.map(r => Array.from(r.querySelectorAll('td')).map(td => td.innerText)));
  console.log('Bills after:', billsAfter.slice(0,5));

  await browser.close();
  console.log('Done.');
})();
