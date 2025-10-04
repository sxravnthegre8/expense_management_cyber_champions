# Expense Management & Approval Platform – UI/UX Design Spec

## 1. Authentication & Company Setup

### Login / Signup
- **Fields:** Email, Password, Country (dropdown, sets currency via API)
- **Actions:** Login, Signup
- **On Signup:**  
  - Auto-create Company with selected country's currency
  - Auto-create Admin user

---

## 2. Admin Dashboard

### Sidebar Navigation
- Dashboard
- Users & Roles
- Expenses
- Approval Rules
- Settings
- Logout

### Users & Roles Management
- **List:** Table of Employees/Managers (Name, Email, Role, Manager)
- **Actions:** Add User, Edit User, Assign Manager, Change Role
- **Manager Relationship:** Dropdown or drag-and-drop assignment

### Approval Rules Configuration
- **Rule Builder UI:**  
  - Add/Edit sequence steps (Manager → Finance → Director)
  - Set conditional logic (percentage, specific approver, hybrid)
  - Example:  
    - Step 1: Manager  
    - Step 2: Finance  
    - Step 3: Director  
    - Condition: 60% approval OR CFO approval

---

## 3. Employee Experience

### Expense Submission Form
- **Fields:** Amount, Currency (dropdown), Category, Description, Date, Receipt Upload
- **OCR Integration:**  
  - On upload, run OCR and auto-fill fields (amount, date, merchant, etc.)
  - Confirm/edit extracted fields before submission

### Expense History
- Table of submitted expenses (Status: Pending, Approved, Rejected)
- Filters: Status, Date
- View details (shows approval history, comments)

---

## 4. Manager Experience

### Pending Approvals List
- Table of expenses awaiting action
- Actions: Approve, Reject, Add Comments
- Approval progress (stepper showing current step)
- Escalate option if needed

### Team Expenses Overview
- List and filter view for all team expenses

---

## 5. Approval Workflow

### Multi-Level Approval UI
- Stepper showing sequence (Manager → Finance → Director)
- Only current approver can act
- Status updates in real-time

### Conditional Approval Display
- Shows % of approvals, special approver status (e.g., CFO)
- Hybrid rule summary (e.g., "60% approved OR CFO approval required")

---

## 6. Expense Details View

- Original amount/currency
- Converted amount (using ExchangeRate API)
- Receipt preview (show OCR data)
- Approval history (who approved/rejected, comments)

---

## 7. Settings

### Company Info & Currency
- Edit company name, country (currency auto-updated via API)

### API Status
- Last sync for country/currency and exchange rates

---

## 8. Additional Features

### OCR for Receipts
- Receipt upload triggers OCR
- Modal: Auto-extracted fields (editable before submission)

### Currency Conversion
- Display original and company currency amounts
- Auto-convert using ExchangeRate API

---

## 9. Technology Stack (Recommended)

- **Frontend:** React + Material UI/Ant Design
- **Backend:** Node.js (Express) or Python (Flask/Django)
- **Auth:** JWT or OAuth2
- **OCR:** Tesseract.js or Google Vision API
- **APIs:** RESTCountries & ExchangeRate API integration
- **Database:** PostgreSQL/MySQL
- **Storage:** AWS S3 or equivalent

---

## 10. Sample Component Breakdown

### ExpenseForm.jsx

```jsx
import React, { useState } from 'react';

function ExpenseForm({ onSubmit, ocrApi, currencies }) {
  const [form, setForm] = useState({
    amount: '',
    currency: currencies[0],
    category: '',
    description: '',
    date: '',
    receipt: null,
  });
  const [ocrData, setOcrData] = useState(null);

  const handleReceiptUpload = async (e) => {
    const file = e.target.files[0];
    setForm({ ...form, receipt: file });

    // OCR API call (pseudo-code)
    const extracted = await ocrApi(file);
    setOcrData(extracted);
    setForm({ ...form, ...extracted });
  };

  return (
    <form onSubmit={e => { e.preventDefault(); onSubmit(form); }}>
      <input type="number" placeholder="Amount" value={form.amount} onChange={e => setForm({...form, amount: e.target.value})} />
      <select value={form.currency} onChange={e => setForm({...form, currency: e.target.value})}>
        {currencies.map(cur => <option key={cur} value={cur}>{cur}</option>)}
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
```

---

## 11. API Calls

```js
// Get country/currency
fetch('https://restcountries.com/v3.1/all?fields=name,currencies')
  .then(res => res.json())
  .then(data => /* populate dropdowns */);

// Currency conversion
fetch(`https://api.exchangerate-api.com/v4/latest/${baseCurrency}`)
  .then(res => res.json())
  .then(data => /* use data.rates[targetCurrency] */);
```

---

## 12. Approval Logic (Pseudo-code)

```js
function isExpenseApproved(expense, approvals, rules) {
  // Percentage rule
  if (rules.type === 'percentage') {
    const approvedCount = approvals.filter(a => a.status === 'approved').length;
    return (approvedCount / rules.totalApprovers) >= rules.threshold;
  }
  // Specific approver rule
  if (rules.type === 'specific') {
    return approvals.some(a => a.approverRole === rules.specificRole && a.status === 'approved');
  }
  // Hybrid rule
  if (rules.type === 'hybrid') {
    return isExpenseApproved(expense, approvals, {type:'percentage', ...rules.percentage}) ||
           isExpenseApproved(expense, approvals, {type:'specific', ...rules.specific});
  }
  return false;
}
```

---

# Summary

This design covers all requirements, maps every user action and flow, and includes sample component and logic code for implementation.

**Next steps:**  
- Create wireframes/mockups  
- Start frontend/backend development  
- Integrate OCR and currency APIs

If you need Figma wireframes, user stories, or a full repo template, just let me know!