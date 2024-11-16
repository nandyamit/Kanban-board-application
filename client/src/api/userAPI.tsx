// client/src/api/userAPI.tsx
import Auth from '../utils/auth';
import { UserData } from '../interfaces/UserData';

const getAuthHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${Auth.getToken()}`
});

const getUsers = async () => {
  try {
    const response = await fetch('http://localhost:3001/api/users', {
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error('Failed to fetch users');
    }

    return response.json();
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

const getUser = async (id: number) => {
  try {
    const response = await fetch(`http://localhost:3001/api/users/${id}`, {
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user');
    }

    return response.json();
  } catch (error) {
    console.error('Error fetching user:', error);
    throw error;
  }
};

const updateUser = async (id: number, userData: UserData) => {
  try {
    const response = await fetch(`http://localhost:3001/api/users/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(userData)
    });

    if (!response.ok) {
      throw new Error('Failed to update user');
    }

    return response.json();
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};

export { getUsers, getUser, updateUser };