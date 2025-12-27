import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from './api/supabase';
import { Toaster } from 'react-hot-toast';
// Pages
import Landing from './pages/Landing';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import CommonChatbot from './components/shared/CommonChatbot';
import LegalPage from './pages/LegalPage';
import Contact from './pages/Contact';
// Layout Components
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';

function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Check if a user is already logged in when the app starts
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // 2. Listen for changes (Login, Logout, Token Expired)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Show a simple loading screen while checking authentication
  if (loading) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-gray-50">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-600 font-medium">Loading Health Portal...</p>
      </div>
    );
  }

  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-gray-50">
        {/* Pass session to Header so it can show the Logout button or Clinic Name */}
        <Header session={session} />

        <main className="flex-grow">
          <Routes>
            {/* PUBLIC ROUTE: Landing Page */}
            <Route 
              path="/" 
              element={!session ? <Landing /> : <Navigate to="/dashboard" />} 
            />

            {/* AUTH ROUTE: Login/Signup */}
            <Route 
              path="/auth" 
              element={!session ? <Auth /> : <Navigate to="/dashboard" />} 
            />

            {/* PROTECTED ROUTE: Dashboard (Only for logged-in users) */}
            <Route 
              path="/dashboard" 
              element={session ? <Dashboard /> : <Navigate to="/auth" />} 
            />

            {/* FALLBACK: Redirect any unknown URL to Landing */}
            <Route path="*" element={<Navigate to="/" />} />
            <Route path="/privacy" element={<LegalPage type="privacy" />} />
            <Route path="/guidelines" element={<LegalPage type="guidelines" />} />
            <Route path="/terms" element={<LegalPage type="terms" />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>

        <Toaster position="top-center" reverseOrder={false} />
        </main>
         {/* Only show chatbot if session exists (user is logged in) */}
        {session && <CommonChatbot />}
        <Footer />
      </div>
    </Router>
  );
}

export default App;