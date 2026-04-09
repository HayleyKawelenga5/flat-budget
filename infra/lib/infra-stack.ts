import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as appsync from 'aws-cdk-lib/aws-appsync';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as lambda from 'aws-cdk-lib/aws-lambda';

export class InfraStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const api = new appsync.GraphqlApi(this, 'FlatBudgetApi', {
      name: 'flat-budget-api',
      schema: appsync.SchemaFile.fromAsset(
        '../backend/schema/schema.graphql'
      ),
      authorizationConfig: {
        defaultAuthorization: {
          authorizationType: appsync.AuthorizationType.API_KEY,
        },
      },
      xrayEnabled: true,
    });

    const table = new dynamodb.Table(this, 'FlatBudgetTable', {
      partitionKey: { name: 'PK', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'SK', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
    });

    // Lambda: Get Budget Summary (monthlySummary query)
    const getBudgetSummaryFn = new lambda.Function(this, 'GetBudgetSummaryFn', {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset('lambda/getBudgetSummary'),
      environment: {
        TABLE_NAME: table.tableName,
      },
    });

    // Lambda: Add Expense (addExpense mutation)
    const addExpenseFn = new lambda.Function(this, 'AddExpenseFn', {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset('lambda/addExpense'),
      environment: {
        TABLE_NAME: table.tableName,
      },
    });

    // Lambda: Get Expenses (expenses query)
    const getExpensesFn = new lambda.Function(this, 'GetExpensesFn', {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset('lambda/getExpenses'),
      environment: {
        TABLE_NAME: table.tableName,
      },
    });

    // Data Sources
    const summaryDataSource = api.addLambdaDataSource(
      'BudgetSummaryDS',
      getBudgetSummaryFn
    );

    const addExpenseDataSource = api.addLambdaDataSource(
      'AddExpenseDS',
      addExpenseFn
    );

    const getExpensesDataSource = api.addLambdaDataSource(
      'GetExpensesDS',
      getExpensesFn
    );

    // Resolvers
    summaryDataSource.createResolver('MonthlySummaryResolver', {
      typeName: 'Query',
      fieldName: 'monthlySummary',
    });

    addExpenseDataSource.createResolver('AddExpenseResolver', {
      typeName: 'Mutation',
      fieldName: 'addExpense',
    });

    getExpensesDataSource.createResolver('GetExpensesResolver', {
      typeName: 'Query',
      fieldName: 'expenses',
    });

    // Permissions
    table.grantReadData(getBudgetSummaryFn);
    table.grantReadWriteData(addExpenseFn);
    table.grantReadData(getExpensesFn);
  }
}
