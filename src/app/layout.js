import { Providers } from './Providers';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './globals.css';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          {/* We wrap the layout in your original container class */}
          <div className="app-mobile-container">
            
            <Navbar />
            
            {/* We apply your content class to the main element */}
            <main className="content" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
              {children}
            </main>
            
            <Footer />
            
          </div>
        </Providers>
      </body>
    </html>
  );
}