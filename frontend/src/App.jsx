import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="*" element={
              <div className="empty-state" style={{ minHeight: 'calc(100vh - 64px)' }}>
                <div className="empty-state-icon">🌀</div>
                <h3>Page Not Found</h3>
                <p>The page you're looking for doesn't exist.</p>
                <a href="/" className="btn btn-primary">Go Home</a>
              </div>
            } />
          </Routes>
        </main>
        <Footer />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3500,
            style: {
              background: '#1a1a28',
              color: '#e8e8f0',
              border: '1px solid #2a2a3d',
              borderRadius: '8px',
              fontFamily: "'DM Sans', sans-serif",
              fontSize: '0.875rem',
            },
            success: { iconTheme: { primary: '#4ade80', secondary: '#1a1a28' } },
            error: { iconTheme: { primary: '#f87171', secondary: '#1a1a28' } },
          }}
        />
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
