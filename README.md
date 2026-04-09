# Flat Budget 

A full-stack budgeting application for flatmates to track shared household expenses. Built with React, AWS AppSync GraphQL, Lambda, and DynamoDB.

---

## Features

- **Monthly expense summaries** with automatic per-person cost splitting
- **Expense tracking** by category (Groceries, Power, WiFi, Rent, Other)
- **Month-by-month view** with historical data access
- **Real-time updates** using Apollo Client cache
- **API Key authentication** (ready to upgrade to Cognito)
- **Responsive design** for desktop and mobile

---

## Architecture

### **Backend (AWS Serverless)**

```
React Frontend
      ↓
Apollo Client (GraphQL)
      ↓
AWS AppSync API
      ↓
Lambda Functions
      ↓
DynamoDB (Single-table design)
```

### **Technology Stack**

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | React 18 + Vite | UI framework & build tool |
| | Apollo Client 3.x | GraphQL client & state management |
| **API** | AWS AppSync | Managed GraphQL API service |
| **Compute** | AWS Lambda | Serverless business logic |
| **Database** | DynamoDB | NoSQL database with single-table design |
| **IaC** | AWS CDK (TypeScript) | Infrastructure as Code |

---

## Project Structure

```
flat-budget/
├── backend/
│   └── schema/
│       └── schema.graphql          # GraphQL schema definition
├── frontend/
│   ├── src/
│   │   ├── components/             # React components
│   │   │   ├── Summary.jsx         # Monthly summary display
│   │   │   ├── ExpenseList.jsx     # Expense list
│   │   │   └── AddExpenseForm.jsx  # Add expense form
│   │   ├── graphql/
│   │   │   └── queries.js          # GraphQL queries & mutations
│   │   ├── apollo.js               # Apollo Client configuration
│   │   ├── App.jsx                 # Main app component
│   │   └── main.jsx                # App entry point
│   └── package.json
└── infra/
    ├── lambda/                     # Lambda function code
    │   ├── getBudgetSummary/       # Monthly summary query
    │   ├── getExpenses/            # Get expenses query
    │   └── addExpense/             # Add expense mutation
    └── lib/
        └── infra-stack.ts          # CDK infrastructure definition
```

---

## Database Schema (DynamoDB)

**Single-table design** with composite keys:

| PK | SK | Attributes |
|----|----|------------|
| `FLAT#1` | `METADATA` | name, memberCount |
| `FLAT#1` | `EXPENSE#2026-04#<uuid>` | amount, category, date, paidBy |
| `FLAT#1` | `USER#<id>` | name, email |

**Benefits:**
- All flat data in one partition (fast queries)
- Monthly expenses sorted by SK prefix
- No table joins needed

---

## Getting Started

### **Prerequisites**

- Node.js 18+
- AWS Account (free tier eligible)
- AWS CLI configured with credentials
- AWS CDK installed: `npm install -g aws-cdk`

### **1. Install Dependencies**

```bash
# Install CDK dependencies
cd infra
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### **2. Deploy Backend Infrastructure**

```bash
cd infra
cdk bootstrap  # First time only
cdk deploy
```

This creates:
- DynamoDB table
- 3 Lambda functions
- AppSync GraphQL API
- IAM roles and permissions

**Note:** Save the API URL and API Key from the output!

### **3. Configure Frontend**

Update `frontend/src/apollo.js` with your AppSync endpoint and API key:

```javascript
uri: 'https://YOUR-API-ID.appsync-api.REGION.amazonaws.com/graphql',
headers: {
  'x-api-key': 'YOUR-API-KEY',
}
```

### **4. Seed Initial Data**

Create a flat metadata record in DynamoDB:

```json
{
  "PK": "FLAT#1",
  "SK": "METADATA",
  "name": "My Flat",
  "memberCount": 3
}
```

### **5. Run Frontend**

```bash
cd frontend
npm run dev
```

Open **http://localhost:5173** in your browser.

---

## Development

### **Adding a New Expense**

The app automatically:
1. Generates a UUID for the expense
2. Uses current month in SK (`EXPENSE#2026-04#uuid`)
3. Includes paidBy with user info
4. Refetches summary and expense list

### **Testing GraphQL API**

Use the AppSync console to test queries:

```graphql
query GetSummary {
  monthlySummary(month: "2026-04") {
    total
    perPerson
  }
}

mutation AddExpense {
  addExpense(
    amount: 50.00
    category: GROCERIES
    date: "2026-04-07"
  ) {
    id
    amount
    category
  }
}
```

---

## Future Improvements

### **Phase 1: Authentication & Multi-user**
- [ ] Integrate AWS Cognito for user authentication
- [ ] User login/signup flow
- [ ] Associate expenses with authenticated users
- [ ] Flat membership invitations

### **Phase 2: Enhanced Features**
- [ ] Edit/delete expenses
- [ ] Expense approval workflow
- [ ] Budget limits per category
- [ ] Budget alerts (e.g., "80% of monthly budget spent")
- [ ] Search and filter expenses
- [ ] Export to CSV

### **Phase 3: Analytics & Insights**
- [ ] Expense trends over time (charts)
- [ ] Category breakdown (pie charts)
- [ ] Per-person spending analytics
- [ ] Monthly comparison reports
- [ ] Spending patterns (who pays for what most often)

### **Phase 4: Advanced Functionality**
- [ ] Receipt uploads (S3 + image recognition)
- [ ] Recurring expenses (automatic entry)
- [ ] Split expenses unevenly (custom percentages)
- [ ] Settlement tracking (who owes whom)
- [ ] Payment integration (Stripe/PayPal)
- [ ] Mobile app (React Native)

### **Phase 5: Collaboration & Notifications**
- [ ] Email notifications for new expenses
- [ ] Monthly summary emails
- [ ] Comment/notes on expenses
- [ ] Expense approval/dispute system
- [ ] Push notifications

### **Phase 6: DevOps & Scale**
- [ ] CI/CD pipeline (GitHub Actions)
- [ ] Automated testing (Jest, React Testing Library)
- [ ] Monitoring & logging (CloudWatch dashboards)
- [ ] Error tracking (Sentry)
- [ ] Performance optimization (lazy loading, code splitting)
- [ ] Multi-flat support with better data isolation

---

## Cost Estimate

**AWS Free Tier (first 12 months):**
- DynamoDB: 25 GB storage, 25 RCU/WCU
- Lambda: 1M requests/month, 400,000 GB-seconds
- AppSync: 250,000 queries/mutations

**Expected cost (beyond free tier):**
- ~$1-5/month for small household usage
- Scales automatically with usage

---

## Author

**Hayley Kawelenga**

Built as a personal project to explore:
- GraphQL API design
- AWS serverless architecture
- Single-table DynamoDB modeling
- Full-stack development with React
- Infrastructure as Code



