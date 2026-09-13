//import React from "react";
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/auth/ProtectedRoute';
import PublicOnlyRoute from './components/auth/PublicOnlyRoute';
import LoginPage from "./pages/LoginPage"
import LandingPage from "./pages/LandingPage"
import SignupPage from "./pages/SignupPage"
import EditorPage from './pages/EditorPage'
import DashboardPage from './pages/DashBoardPage'
import ViewBookPage from './pages/ViewBookPage'
import ProfilePage from './pages/ProfilePage'
const App = () => {
  return (
    <div>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<PublicOnlyRoute><LoginPage /></PublicOnlyRoute>} />
        <Route path="/signup" element={<PublicOnlyRoute><SignupPage /></PublicOnlyRoute>} />

        {/* Protected Routes */}

          <Route
          path='/dashboard'
          element={<ProtectedRoute><DashboardPage /></ProtectedRoute>}
        />

        <Route
          path='/editor/:bookId'
          element={<ProtectedRoute><EditorPage /></ProtectedRoute>}
        />

        <Route 
        path='/view-book/:bookId'
        element={<ProtectedRoute><ViewBookPage /></ProtectedRoute>}
        />

        <Route
        path='/profile'
        element={<ProtectedRoute><ProfilePage /></ProtectedRoute>}
        />
      </Routes>
    </div>
  )
}

export default App
