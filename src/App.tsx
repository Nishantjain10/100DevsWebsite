import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Login } from './pages/Login';
import { SignUp } from './pages/SignUp';
import { Dashboard } from './pages/Dashboard';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { RedirectIfAuthenticated } from './components/auth/RedirectIfAuthenticated';
import { LandingPage } from './pages/LandingPage';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-yellow-400 via-pink-500 to-purple-600 text-white">
        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute left-1/4 top-1/4 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
          <div className="absolute right-1/4 bottom-1/4 w-64 h-64 bg-green-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
          <div className="absolute left-1/2 bottom-1/2 w-64 h-64 bg-red-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
        </div>

        <Routes>
          <Route 
            path="/" 
            element={
              <RedirectIfAuthenticated>
                <LandingPage />
              </RedirectIfAuthenticated>
            } 
          />
          <Route 
            path="/login" 
            element={
              <RedirectIfAuthenticated>
                <Login />
              </RedirectIfAuthenticated>
            } 
          />
          <Route 
            path="/signup" 
            element={
              <RedirectIfAuthenticated>
                <SignUp />
              </RedirectIfAuthenticated>
            } 
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          {/* Catch all route - redirect to dashboard if authenticated, otherwise to landing */}
          <Route 
            path="*" 
            element={<Navigate to="/" replace />} 
          />
        </Routes>

        <Toaster position="top-right" />
      </div>
    </Router>
  );
}

export default App;
