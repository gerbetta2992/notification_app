import { Authenticator, useAuthenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import { Auth } from 'aws-amplify';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

const Login = () => {
    const router = useRouter();
    const { user } = useAuthenticator((context) => [context.user]);

    useEffect(() => {
        const checkUser = async () => {
            try {
                const user = await Auth.currentAuthenticatedUser();
                if (user) {
                    const session = await Auth.currentSession();
                    const jwtToken = session.getIdToken().getJwtToken();
                    router.push('/dashboard');
                }
            } catch (error) {
                console.log('error login');
            }
        };
        checkUser();
    }, [router, user]);

    return <Authenticator />;
};

export default Login;
