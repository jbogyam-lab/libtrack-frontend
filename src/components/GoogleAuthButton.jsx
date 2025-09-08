import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import GoogleIcon from './GoogleIcon';
import toast from 'react-hot-toast';

const GoogleAuthButton = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleGoogleLogin = async () => {
    try {
      // First get the OAuth URL from the backend
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/google/url`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error('Failed to get OAuth URL');
      }

      const { url } = await response.json();
      const popup = window.open(
        url,
        'Google Login',
        'width=500,height=600,menubar=no,toolbar=no,location=no'
      );

      window.addEventListener('message', async (event) => {
        if (event.origin === import.meta.env.VITE_API_URL) {
          if (event.data.token) {
            login(event.data.token);
            navigate('/books');
            toast.success('Successfully logged in with Google!');
          }
          popup.close();
        }
      });
    } catch (error) {
      console.error('Google login error:', error);
      toast.error('Failed to login with Google');
    }
  };

  return (
    <button
      type="button"
      onClick={handleGoogleLogin}
      className="w-full flex items-center justify-center gap-2 bg-white text-gray-700 border border-gray-300 rounded-lg px-4 py-2 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
    >
      <GoogleIcon />
      Continue with Google
    </button>
  );
};

export default GoogleAuthButton;
