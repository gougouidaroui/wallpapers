'use client'
import { useState, FormEvent} from 'react';
import { signInWithEmailAndPassword, signInAnonymously, GoogleAuthProvider, signInWithPopup,onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../lib/firebaseconfig';
import './login.css';
import '../awesome/css/all.min.css';

const LoginPage: React.FC = () => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string>('');
    const googleProvider = new GoogleAuthProvider();

    const handleLogin = async (e: FormEvent) => {
        e.preventDefault();
        try {
            await signInWithEmailAndPassword(auth, email, password);
            window.location.href = '../wallpapers';
        } catch (err: unknown) {
            if (err instanceof Error){
                setError(err.message);
            }
        }
    };

    const handleAnonymousLogin = async () => {
        const storedUserId = localStorage.getItem('anonymousUserId');

        if (storedUserId && storedUserId !== "") {
            onAuthStateChanged(auth, (user) => {
                if (user && user.isAnonymous && user.uid === storedUserId) {
                    window.location.href = '../wallpapers';
                } else {
                    signInAnonymously(auth)
                        .then((userCredential) => {
                            const newUserId = userCredential.user.uid;
                            localStorage.setItem('anonymousUserId', newUserId);
                            window.location.href = '../wallpapers';
                        })
                        .catch((err: unknown) => {
                            if (err instanceof Error) {
                                setError(err.message);
                        }
                        });
                }
            });
        } else {
            try {
                const userCredential = await signInAnonymously(auth);
                const userId = userCredential.user.uid;
                localStorage.setItem('anonymousUserId', userId);
                window.location.href = '../wallpapers';
            } catch (err: unknown) {
                if (err instanceof Error) {
                    setError(err.message);
            }
        }
    }
};

const handleGoogleLogin = async () => {
    try {
        await signInWithPopup(auth, googleProvider);
        window.location.href = '../wallpapers';

    } catch (err: unknown) {
        if (err instanceof Error) {
                setError(err.message);
    }
}
    };



return (
    <div className='login-container'>
      <h1>Login</h1>
      <form onSubmit={handleLogin}>
        <div className='login-fields'>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className='login-fields'>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
<p>Don&apos;t have an account? <a href="../wallpapers/sign-in">Sign in</a></p>
{error && <p style={{ color: 'red' }}>{error}</p>}
<button type="submit">Login</button>
</form>
<hr />
<button onClick={handleGoogleLogin}><span className="fa-brands fa-google"></span>oogle</button>
<button onClick={handleAnonymousLogin}><span className="fa-solid fa-hat-wizard"></span> Anonymous</button>
</div>
);
};

export default LoginPage;
