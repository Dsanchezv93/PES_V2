import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult, Context } from "aws-lambda";

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent, context?: Context): Promise<APIGatewayProxyResult> => {
  console.log("Received event:", JSON.stringify(event, null, 2));
  console.log("Received context:", JSON.stringify(context, null));

  return Promise.resolve({
    statusCode: 200,
    body: JSON.stringify({
      message: "Hello World!",
      input: event,
    }),
  });
};
