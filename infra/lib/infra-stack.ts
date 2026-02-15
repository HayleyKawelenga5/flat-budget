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

    new dynamodb.Table(this, 'FlatBudgetTable', {
      partitionKey: { name: 'PK', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'SK', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
    });

    const getBudgetSummaryFn = new lambda.Function(this, 'GetBudgetSummaryFn', {
    runtime: lambda.Runtime.NODEJS_18_X,
    handler: 'index.handler',
    code: lambda.Code.fromAsset('lambda/getBudgetSummary'),
    });

    const lambdaDataSource = api.addLambdaDataSource(
    'BudgetLambdaDS',
    getBudgetSummaryFn
    );

    lambdaDataSource.createResolver('MonthlySummaryResolver', {
    typeName: 'Query',
    fieldName: 'monthlySummary',
    });
  }
}
