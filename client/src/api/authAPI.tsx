// client/src/api/authAPI.tsx
import { UserLogin } from "../interfaces/UserLogin";

const login = async (userInfo: UserLogin) => {
  try {
    console.log('Login attempt with:', { username: userInfo.username }); // Debug log (omit password)

    const response = await fetch('http://localhost:3001/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userInfo)
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to login');
    }

    console.log('Login successful'); // Debug log
    return data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

export { login };