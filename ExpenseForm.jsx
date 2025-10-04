import React, { useState } from 'react';

function ExpenseForm({ onSubmit, ocrApi }) {
  const [form, setForm] = useState({
    amount: '',
    currency: 'USD',
    category: '',
    description: '',
    date: '',
    receipt: null,
  });
  const [ocrData, setOcrData] = useState(null);

  // Handle OCR upload
  const handleReceiptUpload = async (e) => {
    const file = e.target.files[0];
    setForm({ ...form, receipt: file });

    // Call OCR API (pseudo-code)
    const extracted = await ocrApi(file);
    setOcrData(extracted);
    // Optionally auto-fill
    setForm({ ...form, ...extracted });
  };

  return (
    <form onSubmit={e => { e.preventDefault(); onSubmit(form); }}>
      <input type="number" placeholder="Amount" value={form.amount} onChange={e => setForm({...form, amount: e.target.value})} />
      <select value={form.currency} onChange={e => setForm({...form, currency: e.target.value})}>
        {/* Populate currencies from country/currency API */}
        <option value="USD">USD</option>
        <option value="EUR">EUR</option>
        {/* ... */}
      </select>
      <input type="text" placeholder="Category" value={form.category} onChange={e => setForm({...form, category: e.target.value})} />
      <input type="text" placeholder="Description" value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
      <input type="date" value={form.date} onChange={e => setForm({...form, date: e.target.value})} />
      <input type="file" accept="image/*" onChange={handleReceiptUpload} />
      {ocrData && <div>
        <h4>OCR Extracted:</h4>
        <pre>{JSON.stringify(ocrData, null, 2)}</pre>
      </div>}
      <button type="submit">Submit Expense</button>
    </form>
  );
}