'use client'
import { useState, useEffect, FormEvent } from 'react';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup,onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../lib/firebaseconfig';
import './signin.css';
import '../awesome/css/all.min.css';
import Link from 'next/link';


const SignInPage: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const googleProvider = new GoogleAuthProvider();

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                window.location.href = '/wallpapers';
            }
        });
    }, []);

      const handleEmailLogin = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
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
      <h1>Sign In</h1>
      <form onSubmit={handleEmailLogin}>
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
        <p>Already have an account? <Link href="/wallpapers/login">Login</Link></p>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit">Sign In</button>
      </form>
      <hr />
      <button onClick={handleGoogleLogin}><span className="fa-brands fa-google"></span> Sign In with Google</button>
    </div>
  );
};

export default SignInPage;
