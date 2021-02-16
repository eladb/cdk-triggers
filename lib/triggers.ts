import { Construct, CustomResource, CustomResourceProvider, CustomResourceProviderRuntime } from "@aws-cdk/core";
import * as lambda from '@aws-cdk/aws-lambda';
import { join } from "path";

export interface AfterCreateProps {
  /**
   * Resources to trigger on.
   */
  readonly resources: Construct[];

  /**
   * The handler to execute once after all the resources are created.
   */
  readonly handler: lambda.IFunction;
}

export class AfterCreate extends Construct {
  constructor(scope: Construct, id: string, props: AfterCreateProps) {
    super(scope, id);

    const provider = CustomResourceProvider.getOrCreateProvider(this, 'AWSCDK.TriggerCustomResourceProvider', {
      runtime: CustomResourceProviderRuntime.NODEJS_12,
      codeDirectory: join(__dirname, 'handler'),
      policyStatements: [
        {
          Action: ['lambda:InvokeFunction'],
          
        }
      ]
    });

    new CustomResource(this, 'Resource', {
      resourceType: 'Custom::Trigger',
      serviceToken: provider.serviceToken,
      properties: {
        HANDLER_ARN: props.handler.functionArn
      }
    });

    props.handler.grantInvoke();

  }
}