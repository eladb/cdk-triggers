import * as AWS from 'aws-sdk';

const sns = new AWS.SNS();

export async function handler(event: any) {
  const topicArn = process.env.TOPIC_ARN!;
  const message = process.env.MESSAGE!;

  console.log(JSON.stringify(event, undefined, 2));  

  const request: AWS.SNS.PublishInput = {
    TopicArn: topicArn,
    Message: message,
  };

  console.log({ request });
  const response = await sns.publish(request).promise();
  console.log({ response });
}