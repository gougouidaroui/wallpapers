import React, { useState, useEffect } from 'react';
import CryptoJS from 'crypto-js';
import Popup from './Popup';
import Alert from './Alert';
import './App.css';

const images = import.meta.glob('./assets/*.{jpg,png,svg}', { eager: true });
const SECRET_KEY = "c308ca49589aef7dc0cc1203f4b0c0509f5be7d20700fb80b4a45236f35a8ad7";


const encryptData = (data) => CryptoJS.AES.encrypt(JSON.stringify(data), SECRET_KEY).toString();
const decryptData = (cipherText) => {
  try {
    const bytes = CryptoJS.AES.decrypt(cipherText, SECRET_KEY);
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  } catch (error) {
    console.error("Failed to decrypt data:", error);
    return null;
  }
};

const downloadImage = async (imageUrl, setAlertMessage, setDownloadedImages) => {
  try {
    const response = await fetch(imageUrl);
    const blob = await response.blob();

    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = imageUrl.split('/').pop();
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    const downloaded = decryptData(localStorage.getItem('downloadedImages')) || [];
    const updatedDownloaded = [...downloaded, imageUrl];
    localStorage.setItem('downloadedImages', encryptData(updatedDownloaded));
    setDownloadedImages(new Set(updatedDownloaded));

    setAlertMessage('Image downloaded successfully!');
  } catch (error) {
    console.error('Failed to download image:', error);
    setAlertMessage('Failed to download image.');
  }
};

function App() {
  const [alertMessage, setAlertMessage] = useState('');
  const [downloadedImages, setDownloadedImages] = useState(new Set());
  const [showPopup, setShowPopup] = useState(false);
  const [pendingImageUrl, setPendingImageUrl] = useState(null);

  useEffect(() => {
    const cachedDownloads = decryptData(localStorage.getItem('downloadedImages')) || [];
    setDownloadedImages(new Set(cachedDownloads));
  }, []);

  const handleImageClick = (imageUrl) => {
    if (downloadedImages.has(imageUrl)) {
      setPendingImageUrl(imageUrl);
      setShowPopup(true);
    } else {
      downloadImage(imageUrl, setAlertMessage, setDownloadedImages);
    }
  };

  const handleConfirmDownload = () => {
    if (pendingImageUrl) {
      downloadImage(pendingImageUrl, setAlertMessage, setDownloadedImages);
      setPendingImageUrl(null);
    }
    setShowPopup(false);
  };

  const handleCancelDownload = () => {
    setPendingImageUrl(null);
    setShowPopup(false);
  };

  const handleAlertClose = () => setAlertMessage('');

  const imageElements = Object.entries(images).map(([imagePath, imageModule], index) => {
    const imageUrl = imageModule.default;

    return (
      <div key={index} className="image-container">
        <img
          src={imageUrl}
          alt={`image${index + 1}`}
          onClick={() => handleImageClick(imageUrl)}
          className={downloadedImages.has(imageUrl) ? 'downloaded' : ''}
          style={{ cursor: 'pointer' }}
        />
      </div>
    );
  });

  return (
    <>
      <header>
        <ul>
          <li><a href=""><h2>Wallpapers Project</h2></a></li>
          <li><a href="https://github.com/gougouidaroui"><span className="fa-brands fa-github"></span></a></li>
          <li><a href="https://www.instagram.com/gougouidaroui/"><span className="fa-brands fa-instagram"></span></a></li>
        </ul>
      </header>
      <main>
        <section id="images">
          {imageElements}
          {alertMessage && (
            <Alert
              message={alertMessage}
              duration={2000}
              onClose={handleAlertClose}
            />
          )}
        </section>
      </main>
            <footer>
                <ul>
                <li><a href="https://github.com/gougouidaroui"><span className="fa-brands fa-github"></span></a></li>
                <li><a href="https://www.instagram.com/gougouidaroui/"><span className="fa-brands fa-instagram"></span></a></li>
                </ul>
                <p><small>&copy; 2024 Gougoui Daroui. All rights reserverd.</small></p>
            </footer>
      {showPopup && (
        <Popup
          message="This image has already been downloaded. Download again?"
          onConfirm={handleConfirmDownload}
          onCancel={handleCancelDownload}
        />
      )}
    </>
  );
}

export default App;

