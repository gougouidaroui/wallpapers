"use client";

import React, { useState, useEffect } from 'react';
import CustomAlert from './customalert';
import images from './urls.json';
import Image from 'next/image';
import './imagegallery.css';
import { setDoc, doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebaseconfig';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import Modal from './modal';

const ImageGallery = () => {
    const [favorites, setFavorites] = useState<Set<string>>(new Set());
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [alertMessage, setAlertMessage] = useState<string>('');
    const [filter, setFilter] = useState<'all' | 'favorites'>('all');
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState(true);

    // Listen for auth state changes and load favorites
    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user);
            if (user) {
                loadUserFavorites(user.uid);
            } else {
                setFavorites(new Set());
                setIsLoading(false);
            }
        });

        return () => unsubscribe();
    }, []);

    const loadUserFavorites = async (userId: string) => {
        setIsLoading(true);
        try {
            const userFavoritesRef = doc(db, 'userFavorites', userId);
            const docSnap = await getDoc(userFavoritesRef);

            if (docSnap.exists()) {
                const data = docSnap.data();
                if (data.favorites) {
                    setFavorites(new Set(data.favorites));
                }
            }
        } catch (error) {
            console.error('Error loading favorites:', error);
            setAlertMessage('Failed to load favorites from the cloud.');
        } finally {
            setIsLoading(false);
        }
    };


    const toggleFavorite = async (url: string) => {
    if (!currentUser) {
        setAlertMessage('Please log in to save favorites.');
        return;
    }

    try {
        const newFavorites = new Set(favorites);
        if (newFavorites.has(url)) {
            newFavorites.delete(url);
        } else {
            newFavorites.add(url);
        }

        // Update Firebase first
        const userFavoritesRef = doc(db, 'userFavorites', currentUser.uid);
        await setDoc(userFavoritesRef, {
            userId: currentUser.uid,
            favorites: Array.from(newFavorites),
            lastUpdated: new Date().toISOString()
        }, { merge: true });

        // Then update local state
        setFavorites(newFavorites);
        console.log('Favorites updated successfully');
    } catch (error) {
        console.error('Error updating favorites:', error);
        setAlertMessage('Failed to update favorites.');
    }
};

    const handleDownloadClick = (url: string) => {
        setSelectedImage(url);
        setIsModalVisible(true);
    };

    const handleConfirmDownload = () => {
        if (selectedImage) {
            downloadImage(selectedImage, setAlertMessage);
        }
        setIsModalVisible(false);
    };

    const handleCancelDownload = () => {
        setSelectedImage(null);
        setIsModalVisible(false);
    };

    const downloadImage = async (url: string, setAlertMessage: (msg: string) => void) => {
        try {
            const response = await fetch(url);
            const blob = await response.blob();
            const downloadUrl = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = downloadUrl;
            link.download = url.split('/').pop() || 'download';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(downloadUrl);

            setAlertMessage('Image downloaded successfully!');
        } catch (e) {
            setAlertMessage('Failed to download image.');
            console.log(e);
        }
    };

    const handleFilterChange = (filterType: 'all' | 'favorites') => {
        setFilter(filterType);
    };

    const isFavorite = (url: string) => favorites.has(url);

    const filteredImages = filter === 'favorites'
        ? images.filter(img => isFavorite(img.url))
        : images;

    if (isLoading) {
        return <div className="loading">Loading favorites...</div>;
    }
    const FavoriteButton = ({ isFavorite, onClick }: { isFavorite: boolean; onClick: () => void }) => (
        <button onClick={onClick} className={isFavorite ? 'favorite active' : 'favorite'}>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill={isFavorite ? 'red' : 'none'}
                stroke="currentColor"
                strokeWidth="2"
                className="heart-icon"
            >
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
        </button>
    );

    return (
        <>
            {alertMessage && (
                <CustomAlert message={alertMessage} onClose={() => setAlertMessage('')} />
            )}

            {/* Modal for confirmation */}
            <Modal
                message="Do you want to download this image?"
                onConfirm={handleConfirmDownload}
                onCancel={handleCancelDownload}
                isVisible={isModalVisible}
            />
            {/* Filter Buttons */}
            <div className="filter-buttons">
                <button onClick={() => handleFilterChange('all')} className={filter === 'all' ? 'active' : ''}>
                    All Images
                </button>
                <button onClick={() => handleFilterChange('favorites')} className={filter === 'favorites' ? 'active' : ''}>
                    Favorites
                </button>
            </div>

            {/* Image Gallery */}
            {filteredImages.map((img) => (
                <div key={img.key} className="image-container">
                    <div className="image-wrapper">
                        <Image
                            priority={true}
                            src={img.url}
                            alt={img.name}
                            width={300}
                            height={200}
                            quality={80}
                            onClick={() => {
                                 handleDownloadClick(img.url);
                            }
                            }
                            className="zoom-effect"
                        />
                        <div className="button-container">
                            <FavoriteButton
                                isFavorite={isFavorite(img.url)}
                                onClick={() => toggleFavorite(img.url)}
                            />
                        </div>
                    </div>
                </div>
            ))}
        </>
    );
};


export default ImageGallery;
