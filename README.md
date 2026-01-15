# Flat Budget 

Flat Budget is a full‑stack web application for tracking shared household expenses in a flat. It allows flatmates to record expenses, view monthly summaries, and see how costs are split per person, all backed by a secure, schema‑first GraphQL API on AWS.

This project is designed as a **realistic, production‑style system** to demonstrate modern backend and cloud engineering practices alongside a React frontend.

---

## Features

*  **User authentication** with AWS Cognito
*  **Flat creation** and membership management
*  **Expense tracking** (groceries, rent, power, Wi‑Fi, etc.)
*  **Monthly summaries** with per‑person cost splitting
*  **Visual dashboards** with charts
*  **Schema‑first GraphQL API**

---

##  Why GraphQL?

GraphQL was chosen over REST to:

* Provide a **strongly typed contract** between frontend and backend
* Enable flexible data fetching for dashboards and summaries
* Centralise domain logic (aggregation, splitting) in the API layer

The schema acts as the source of truth for the entire system.

---

##  Architecture Overview

**Frontend**

* React
* Apollo Client
* Cognito authentication

**Backend (AWS)**

* AWS AppSync (GraphQL API)
* AWS Lambda (business logic & resolvers)
* DynamoDB (single‑table design)
* AWS Cognito (user authentication)
* AWS CDK (infrastructure as code)

```
React App
   ↓
Apollo Client
   ↓
AWS AppSync (GraphQL)
   ↓
Lambda Resolvers
   ↓
DynamoDB
```

---

##  Data Modelling

A **single DynamoDB table** is used to support all access patterns efficiently.

##  GraphQL Schema (Core Types)

* `Flat`
* `User`
* `Expense`
* `Summary`

Queries and mutations are designed around **real user actions**, such as:

* Fetching monthly expenses
* Calculating per‑person cost splits
* Adding new expenses

---

## 🚀 Getting Started (Local Development)

### Prerequisites

* Node.js 18+
* AWS account (free tier)
* AWS CDK

### Install dependencies

```bash
npm install
```

### Deploy backend

```bash
cd infra
cdk deploy
```

### Run frontend

```bash
cd frontend
npm run dev
```

---

##  What This Project Demonstrates

* Schema‑first GraphQL API design
* Secure authentication & authorization
* DynamoDB single‑table modelling
* Serverless AWS architecture
* Infrastructure as Code using CDK
* Full‑stack integration with React

---

##  Future Improvements

* Weekly grocery budgets & alerts
* Expense categories analytics
* Flatmate invitations
* Receipt uploads (S3)
* Email notifications

---

##  Author

Built by **Hayley Kawelenga** as a personal engineering project to explore GraphQL, AWS serverless architecture, and full‑stack application design.

