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

  return (
    <Routes>
      <Route path="/" element={!isAuthenticated ? <Welcome /> : <Navigate to="/home" replace />} />
      <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/home" replace />} />
      <Route path="/signup" element={!isAuthenticated ? <Login /> : <Navigate to="/home" replace />} />
      <Route path="/forgot-password" element={!isAuthenticated ? <ForgotPassword /> : <Navigate to="/home" replace />} />
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