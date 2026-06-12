import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as path from 'path';

export class CartServiceStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const cartLambda = new lambda.Function(this, 'CartServiceLambda', {
      runtime: lambda.Runtime.NODEJS_20_X,
      handler: 'dist/lambda.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, '../../../deploy')),
      timeout: cdk.Duration.seconds(30),
      memorySize: 512,
      environment: {
        DB_HOST: process.env.DB_HOST || '',
        DB_PORT: process.env.DB_PORT || '',
        DB_NAME: process.env.DB_NAME || '',
        DB_USER: process.env.DB_USER || '',
        DB_PASSWORD: process.env.DB_PASSWORD || '',
      },
    });

    new apigateway.LambdaRestApi(this, 'CartServiceApi', {
      handler: cartLambda,
      proxy: true,
    });
  }
}
