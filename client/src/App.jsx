import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getMe, selectIsInitialized, selectToken } from './store/authSlice';

import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ChatLayout from './pages/ChatLayout';

function App() {
  const dispatch = useDispatch();
  const isInitialized = useSelector(selectIsInitialized);
  const token = useSelector(selectToken);

  useEffect(() => {
    if (token) {
      dispatch(getMe());
    } else {
      // If no token, we can just mark as initialized since getMe won't succeed
      dispatch({ type: 'auth/getMe/rejected' }); 
    }
  }, [dispatch, token]);

  if (!isInitialized) {
    return (
      <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route 
          path="/" 
          element={
            <ProtectedRoute>
              <ChatLayout />
            </ProtectedRoute>
          } 
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
