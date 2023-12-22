import { Amplify } from 'aws-amplify';

const region = process.env.AWS_COGNITO_REGION;
const userPoolId = process.env.AWS_COGNITO_POOL_ID;
const userPoolWebClientId = process.env.AWS_COGNITO_APP_CLIENT_ID;

Amplify.configure({
    Auth: {
        region: region,
        userPoolId: userPoolId,
        userPoolWebClientId: userPoolWebClientId,
    },
});
