import AWS from "aws-sdk";
import crypto from "crypto";

function generateId() {
    const timestamp = Date.now().toString();
    const randomBytes = crypto.randomBytes(16).toString('hex');
    return crypto.createHash('sha256').update(timestamp + randomBytes).digest('hex');
}


export async function createPost(event: ApiGatewayEvent) {

    const payload: PostCreatePayload = JSON.parse(event.body);
    const dynamoClient = new AWS.DynamoDB.DocumentClient();

    const params = {
        TableName: 'post',
        Item: {
            id: generateId(),
            content: payload.content,
            user: event.requestContext.authorizer.lambda.email
        }
    };

    await dynamoClient.put(params).promise();

    return {
        statusCode: 200,
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: 'Post created successfully' })
    }
}

export async function getPosts() {
    const dynamoClient = new AWS.DynamoDB.DocumentClient();
    const response = await dynamoClient.scan({ TableName: 'post' }).promise();

    return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(response.Items)
    }
}

export async function getPostById(event: ApiGatewayEvent) {
    const postId = event.pathParameters.id;
    const dynamoClient = new AWS.DynamoDB.DocumentClient();
    const response = await dynamoClient.get({ TableName: 'post', Key: { id: postId } }).promise();

    return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(response.Item)
    }

}