import { useState } from 'react'
import { Summary } from './components/Summary'
import { ExpenseList } from './components/ExpenseList'
import { AddExpenseForm } from './components/AddExpenseForm'
import './App.css'

function getCurrentMonth() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}

function App() {
  const [month, setMonth] = useState(getCurrentMonth());

  return (
    <div className="app">
      <header>
        <h1>🏠 Flat Budget</h1>
        <div className="month-selector">
          <label>
            Month:
            <input
              type="month"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
            />
          </label>
        </div>
      </header>

      <main>
        <Summary month={month} />
        <div className="content-grid">
          <ExpenseList month={month} />
          <AddExpenseForm month={month} />
        </div>
      </main>
    </div>
  )
}

export default App
