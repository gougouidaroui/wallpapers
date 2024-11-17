'use client'
import './awesome/css/all.min.css';
import ImageGallery from './imagegallery';
import { useEffect, useState } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../lib/firebaseconfig';

export default function Home() {
        const [user, setUser] = useState(auth.currentUser);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((currentUser) => {
            setUser(currentUser);
        });
        return () => unsubscribe();
    }, []);

    const handleLogout = async () => {
        await signOut(auth);
    };
    return (
        <>
            <header>
                <ul>
                    <li><a href=""><h2>Wallpapers Project</h2></a></li>
                    {user ? (
                        <>
                            <li>{user.email || 'Anonymous'}</li>
                            <li><button onClick={handleLogout}>Logout</button></li>
                        </>
                    ) : (
                            <li><a href="/wallpapers/login">Login</a></li>
                        )}
                    <li><a href="https://github.com/gougouidaroui"><span className="fa-brands fa-github"></span></a></li>
                    <li><a href="https://www.instagram.com/gougouidaroui/"><span className="fa-brands fa-instagram"></span></a></li>
                </ul>
            </header>
            <main>
                <section id="images">
                    <ImageGallery>
                    </ImageGallery>
                </section>
            </main>
            <footer>
                <ul>
                    <li><a href="https://github.com/gougouidaroui"><span className="fa-brands fa-github"></span></a></li>
                    <li><a href="https://www.instagram.com/gougouidaroui/"><span className="fa-brands fa-instagram"></span></a></li>
                </ul>
                <p><small>&copy; 2024 Gougoui Daroui. All rights reserverd.</small></p>
            </footer>
       </>
    );
}
