import jwt from "jsonwebtoken";

export async function generateToken(event: ApiGatewayEvent) {

    const payload: TokenCreatePayload = JSON.parse(event.body);

    if (!payload.email || !payload.password) {
        return {
            statusCode: 400,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: 'Bad request format' })
        };
    }

    const { email, password } = payload;

    if (email !== 'letsgoforitanik@gmail.com' || password !== 'Hydrogen2') {
        return {
            statusCode: 404,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: 'User not found' })
        }
    }

    const tokenPayload = {
        email: 'letsgoforitanik@gmail.com',
        firstName: 'Anik',
        lastName: 'Banerjee'
    };

    const token = jwt.sign(tokenPayload, 'abanerjee-secret-key', { expiresIn: '1h' });

    return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token })
    };

}


export async function authenticateToken(event: TokenValidationEvent) {

    let effect: string = 'Deny';
    let email: string = '';

    try {
        const token = event.identitySource[0].split(' ')[1];
        const payload = jwt.verify(token, 'abanerjee-secret-key') as TokenPayload;

        if (payload.email === 'letsgoforitanik@gmail.com') {
            effect = 'Allow';
            email = payload.email;
        }

    }
    catch (error) {
        console.log('Error ->', error);
    }

    return {
        "principalId": email,
        "policyDocument": {
            "Version": "2012-10-17",
            "Statement": [{
                "Action": "execute-api:Invoke",
                "Effect": effect,
                "Resource": event.routeArn
            }]
        },
        "context": {
            "email": email
        }
    };
}
