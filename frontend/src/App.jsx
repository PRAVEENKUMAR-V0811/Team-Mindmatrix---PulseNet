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
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-gray-50">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-600 font-medium animate-pulse">Loding PulseNet...</p>
      </div>
    );
  }

  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Header session={session} />

        <main className="flex-grow">
          <Routes>
            <Route path="/" element={!session ? <Landing /> : <Navigate to="/dashboard" />} />
            <Route path="/auth" element={!session ? <Auth /> : <Navigate to="/dashboard" />} />
            
            {/* PASS SESSION TO DASHBOARD */}
            <Route 
              path="/dashboard" 
              element={session ? <Dashboard session={session} /> : <Navigate to="/auth" />} 
            />

            <Route path="/privacy" element={<LegalPage type="privacy" />} />
            <Route path="/guidelines" element={<LegalPage type="guidelines" />} />
            <Route path="/terms" element={<LegalPage type="terms" />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>

        <Footer />
        
        {/* Chatbot & Toaster outside of Routes to stay persistent */}
        {session && <CommonChatbot />}
        <Toaster position="top-right" />
      </div>
    </Router>
  );
}

export default App;