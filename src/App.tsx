import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Welcome from './pages/Welcome';
import Home from './pages/Home';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import ReportItem from './pages/ReportItem';
import SearchItems from './pages/SearchItems';
import Profile from './pages/Profile';
import GoogleMapsWrapper from './components/GoogleMapsWrapper';

const AppRoutes = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-usf-green"></div>
      </div>
    );
  }

  // When running locally (dev), always show landing and auth pages so we can test them
  const isDev = import.meta.env.DEV;
  const showLandingAtRoot = !isAuthenticated || isDev;
  const showAuthPages = !isAuthenticated || isDev;

  return (
    <Routes>
      <Route path="/" element={showLandingAtRoot ? <Welcome /> : <Navigate to="/home" replace />} />
      <Route path="/login" element={showAuthPages ? <Login /> : <Navigate to="/home" replace />} />
      <Route path="/signup" element={showAuthPages ? <Login /> : <Navigate to="/home" replace />} />
      <Route path="/forgot-password" element={showAuthPages ? <ForgotPassword /> : <Navigate to="/home" replace />} />
      <Route path="/reset-password" element={<ResetPassword />} />
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
      {/* Catch-all: unknown paths redirect to landing */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <GoogleMapsWrapper>
            <AppRoutes />
          </GoogleMapsWrapper>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;