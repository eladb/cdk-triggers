#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import * as sns from '@aws-cdk/aws-sns';
import * as path from 'path';
import * as triggers from '../lib';
import { NodejsFunction } from '@aws-cdk/aws-lambda-nodejs';

export class CdkTriggersStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const topic = new sns.Topic(this, 'MyTopic');
    const publisher = new NodejsFunction(this, 'Publisher', {
      entry: path.join(__dirname, 'publisher.ts'),
      environment: {
        TOPIC_ARN: topic.topicArn,
        MESSAGE: 'Hello, hello!'
      }
    });

    topic.grantPublish(publisher);

    // call "publisher" after topic is created
    new triggers.AfterCreate(this, 'PublishToTopic', {
      resources: [topic],
      handler: publisher
    });
  }
}

const app = new cdk.App();
new CdkTriggersStack(app, 'CdkTriggersStack');
