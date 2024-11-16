// client/src/api/authAPI.tsx
import { UserLogin } from "../interfaces/UserLogin";
import Auth from '../utils/auth';

const getAuthHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${Auth.getToken()}`
});

const login = async (userInfo: UserLogin) => {
  try {
    const response = await fetch('http://localhost:3001/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userInfo)
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to login');
    }

    return data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

const verifyToken = async () => {
  try {
    const response = await fetch('http://localhost:3001/auth/verify', {
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      Auth.logout(); // Logout if token is invalid
      throw new Error('Invalid token');
    }

    return response.json();
  } catch (error) {
    console.error('Token verification error:', error);
    throw error;
  }
};

export { login, verifyToken };