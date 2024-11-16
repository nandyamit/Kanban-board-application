// client/src/utils/auth.ts
import { jwtDecode } from 'jwt-decode';

class AuthService {
  getProfile() {
    const token = this.getToken();
    return token ? jwtDecode(token) : null;
  }

  loggedIn() {
    const token = this.getToken();
    // Return true if there is a saved token and it's still valid
    return token && !this.isTokenExpired(token);
  }
  
  isTokenExpired(token: string) {
    try {
      const decoded: any = jwtDecode(token);
      return decoded.exp < Date.now() / 1000;
    } catch (err) {
      return true;
    }
  }

  getToken() {
    // Retrieves the user token from localStorage
    return localStorage.getItem('token');
  }

  login(idToken: string) {
    // Saves user token to localStorage
    localStorage.setItem('token', idToken);
    window.location.assign('/');
  }

  logout() {
    // Clear user token from localStorage
    localStorage.removeItem('token');
    // Redirect to login page
    window.location.assign('/login');
  }
}

export default new AuthService();