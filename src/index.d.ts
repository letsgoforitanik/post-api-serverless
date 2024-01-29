interface ApiGatewayEvent {
    body: string;
    requestContext: { authorizer: any };
    pathParameters: any;
}

interface PostCreatePayload {
    content: string;
}

interface TokenCreatePayload {
    email: string;
    password: string;
}

interface TokenValidationEvent {
    identitySource: string[];
    routeArn: string;
}

interface TokenPayload {
    email: string;
    firstName: string;
    lastName: string;
}