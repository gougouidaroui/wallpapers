'use client'
import { useState, useEffect, FormEvent} from 'react';
import { signInWithEmailAndPassword, signInAnonymously, GoogleAuthProvider, signInWithPopup,onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../lib/firebaseconfig';
import './login.css';
import Link from 'next/link';

const LoginPage: React.FC = () => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string>('');
    const googleProvider = new GoogleAuthProvider();

    const handleLogin = async (e: FormEvent) => {
        e.preventDefault();
        try {
            await signInWithEmailAndPassword(auth, email, password);
            window.location.href = '/';
        } catch (err: unknown) {
            if (err instanceof Error){
            setError(err.message);
            }
        }
    };

    useEffect(() => {
        const storedId = localStorage.getItem('anonymousUserId');
        onAuthStateChanged(auth, (user) => {
            if (user) {
                window.location.href = '/';
            } else if (storedId) {
                console.log('Found stored ID:', storedId);
                window.location.href = '/';
            }
        });
    }, []);


    const handleAnonymousLogin = async () => {
        try {
            const userCredential = await signInAnonymously(auth);
            const userId = userCredential.user.uid;
            localStorage.setItem('anonymousUserId', userId);
            window.location.href = '/';
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            }
        }
    };

    const handleGoogleLogin = async () => {
        try {
            await signInWithPopup(auth, googleProvider);
            window.location.href = '/';
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
        <p>Don&apos;t have an account? <Link href="sign-in">Sign in</Link></p>
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
