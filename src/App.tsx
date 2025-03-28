import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { supabase } from './lib/supabase';
import Navbar from './components/Navbar';
import Welcome from './pages/Welcome';
import Home from './pages/Home';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import ReportItem from './pages/ReportItem';
import SearchItems from './pages/SearchItems';
import Profile from './pages/Profile';
import GoogleMapsWrapper from './components/GoogleMapsWrapper';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check current auth status
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setIsAuthenticated(!!session);
      } catch (error) {
        console.error('Auth check error:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const newAuthState = !!session;
      if (isAuthenticated !== newAuthState) {
        setIsAuthenticated(newAuthState);
        if (!newAuthState) {
          // Only redirect if the state actually changed
          window.location.href = '/';
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [isAuthenticated]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-usf-green"></div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        {isAuthenticated && <Navbar />}
        <GoogleMapsWrapper>
          <Routes>
            <Route path="/" element={!isAuthenticated ? <Welcome /> : <Navigate to="/home" replace />} />
            <Route path="/login" element={!isAuthenticated ? <Login onLogin={() => setIsAuthenticated(true)} /> : <Navigate to="/home" replace />} />
            <Route path="/signup" element={!isAuthenticated ? <Login onLogin={() => setIsAuthenticated(true)} /> : <Navigate to="/home" replace />} />
            <Route path="/forgot-password" element={!isAuthenticated ? <ForgotPassword /> : <Navigate to="/home" replace />} />
            <Route
              path="/home"
              element={isAuthenticated ? <Home /> : <Navigate to="/login" replace />}
            />
            <Route
              path="/report"
              element={isAuthenticated ? <ReportItem /> : <Navigate to="/login" replace />}
            />
            <Route
              path="/search"
              element={isAuthenticated ? <SearchItems /> : <Navigate to="/login" replace />}
            />
            <Route
              path="/profile"
              element={isAuthenticated ? <Profile /> : <Navigate to="/login" replace />}
            />
          </Routes>
        </GoogleMapsWrapper>
      </div>
    </Router>
  );
}

export default App;