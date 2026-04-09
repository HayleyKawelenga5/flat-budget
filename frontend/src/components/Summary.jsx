import { useQuery } from '@apollo/client';
import { GET_MONTHLY_SUMMARY } from '../graphql/queries';

export function Summary({ month }) {
  const { loading, error, data } = useQuery(GET_MONTHLY_SUMMARY, {
    variables: { month },
  });

  if (loading) return <div className="summary loading">Loading summary...</div>;
  if (error) return <div className="summary error">Error: {error.message}</div>;

  const { total, perPerson } = data.monthlySummary;

  return (
    <div className="summary">
      <h2>Monthly Summary</h2>
      <p className="month-label">{month}</p>
      <div className="summary-cards">
        <div className="card">
          <span className="label">Total</span>
          <span className="value">${total.toFixed(2)}</span>
        </div>
        <div className="card">
          <span className="label">Per Person</span>
          <span className="value">${perPerson.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}
