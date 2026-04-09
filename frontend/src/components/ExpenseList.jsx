import { useQuery } from '@apollo/client';
import { GET_EXPENSES } from '../graphql/queries';

const categoryEmoji = {
  GROCERIES: '🛒',
  POWER: '⚡',
  WIFI: '📶',
  RENT: '🏠',
  OTHER: '📦',
};

export function ExpenseList({ month }) {
  const { loading, error, data } = useQuery(GET_EXPENSES, {
    variables: { month },
  });

  if (loading) return <div className="expense-list loading">Loading expenses...</div>;
  if (error) return <div className="expense-list error">Error: {error.message}</div>;

  const expenses = data.expenses;

  if (expenses.length === 0) {
    return (
      <div className="expense-list empty">
        <p>No expenses for {month}</p>
      </div>
    );
  }

  return (
    <div className="expense-list">
      <h2>Expenses</h2>
      <ul>
        {expenses.map((expense) => (
          <li key={expense.id} className="expense-item">
            <span className="emoji">{categoryEmoji[expense.category] || '📦'}</span>
            <div className="details">
              <span className="category">{expense.category}</span>
              <span className="paid-by">Paid by {expense.paidBy.name}</span>
              <span className="date">{expense.date}</span>
            </div>
            <span className="amount">${expense.amount.toFixed(2)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
