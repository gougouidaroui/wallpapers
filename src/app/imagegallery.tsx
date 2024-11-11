"use client";

import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import images from './urls.json';
import CustomAlert from './customalert';
import './imagegallery.css';
import './modal.css';

const getCookie = (name: string): string | null => {
    if (typeof window !== "undefined") {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
    }
    return null;
};

const setCookie = (name: string, value: string, days: number, sameSite: 'Lax' | 'Strict' | 'None' = 'Lax', secure: boolean = false) => {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = "expires=" + date.toUTCString();
    const secureFlag = secure ? "; Secure" : "";
    document.cookie = `${name}=${value}; ${expires}; path=/;  SameSite=${sameSite}${secureFlag}`;
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

const getFavoritesFromCookie = (): Set<string> => {
    if (typeof window !== "undefined") { // Ensure we are in the browser
        const cookie = getCookie('favorites');
        return cookie ? new Set(JSON.parse(cookie)) : new Set();
    }
    return new Set();
};

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

const ImageGallery = () => {
    const [favorites, setFavorites] = useState<Set<string>>(new Set());
    const [alertMessage, setAlertMessage] = useState<string>('');
    const [filter, setFilter] = useState<'all' | 'favorites'>('all');  // Filter state

    useEffect(() => {
        if (typeof window !== "undefined") {
            const savedFavorites = getCookie('favorites');
            if (savedFavorites) {
                setFavorites(new Set(JSON.parse(savedFavorites)));
            }
        }
    }, []);

    const toggleFavorite = (url: string) => {
        setFavorites((prev) => {
            const newFavorites = new Set(prev);
            if (newFavorites.has(url)) {
                newFavorites.delete(url);
            } else {
                newFavorites.add(url);
            }
            setCookie('favorites', JSON.stringify(Array.from(newFavorites)), 365, 'Strict', true);
            return newFavorites;
        });
    };

    const isFavorite = (url: string) => favorites.has(url);

    const handleFilterChange = (filterType: 'all' | 'favorites') => {
        setFilter(filterType);
    };

    useEffect(() => {
        setFavorites(getFavoritesFromCookie());
    }, []);

    const filteredImages = filter === 'favorites'
        ? images.filter(img => isFavorite(img.url))
        : images;

    return (
        <>
            {alertMessage && (
                <CustomAlert message={alertMessage} onClose={() => setAlertMessage('')} />
            )}

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
                                downloadImage(img.url, setAlertMessage);
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
