import { gql } from '@apollo/client';

export const GET_MONTHLY_SUMMARY = gql`
  query GetMonthlySummary($month: String!) {
    monthlySummary(month: $month) {
      total
      perPerson
    }
  }
`;

export const GET_EXPENSES = gql`
  query GetExpenses($month: String!) {
    expenses(month: $month) {
      id
      amount
      category
      date
      paidBy {
        id
        name
      }
    }
  }
`;

export const ADD_EXPENSE = gql`
  mutation AddExpense($amount: Float!, $category: ExpenseCategory!, $date: AWSDate!) {
    addExpense(amount: $amount, category: $category, date: $date) {
      id
      amount
      category
      date
      paidBy {
        id
        name
      }
    }
  }
`;
