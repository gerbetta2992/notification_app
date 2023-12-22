import { Auth } from 'aws-amplify';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

const SignOutPage = () => {
    const router = useRouter();

    useEffect(() => {
        async function performSignOut() {
            try {
                await Auth.signOut();
                router.push('/login');
            } catch (error) {
                console.error('Error while signing out:', error);
            }
        }

        performSignOut();
    }, [router]);

    return (
        <div>
            <p>Signing out...</p>
        </div>
    );
};

export default SignOutPage;
