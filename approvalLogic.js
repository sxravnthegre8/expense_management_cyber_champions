function isExpenseApproved(expense, approvals, rules) {
  // Percentage rule example
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