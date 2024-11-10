import './awesome/css/all.min.css';
import ImageGallery from './imagegallery';

export default function Home() {
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
