import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { ADD_EXPENSE, GET_EXPENSES, GET_MONTHLY_SUMMARY } from '../graphql/queries';

const CATEGORIES = ['GROCERIES', 'POWER', 'WIFI', 'RENT', 'OTHER'];

export function AddExpenseForm({ month }) {
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('GROCERIES');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const [addExpense, { loading }] = useMutation(ADD_EXPENSE, {
    refetchQueries: [
      { query: GET_EXPENSES, variables: { month } },
      { query: GET_MONTHLY_SUMMARY, variables: { month } },
    ],
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!amount || parseFloat(amount) <= 0) return;

    try {
      await addExpense({
        variables: {
          amount: parseFloat(amount),
          category,
          date,
        },
      });
      setAmount('');
    } catch (err) {
      console.error('Failed to add expense:', err);
      alert('Failed to add expense: ' + err.message);
    }
  };

  return (
    <form className="add-expense-form" onSubmit={handleSubmit}>
      <h2>Add Expense</h2>
      <div className="form-row">
        <label>
          Amount ($)
          <input
            type="number"
            step="0.01"
            min="0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            required
          />
        </label>
      </div>
      <div className="form-row">
        <label>
          Category
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="form-row">
        <label>
          Date
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </label>
      </div>
      <button type="submit" disabled={loading}>
        {loading ? 'Adding...' : 'Add Expense'}
      </button>
    </form>
  );
}
