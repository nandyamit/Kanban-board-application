// client/src/utils/auth.ts
import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
  id: number;
  username: string;
  exp: number;
}

class AuthService {
  getProfile() {
    const token = this.getToken();
    return token ? jwtDecode<DecodedToken>(token) : null;
  }

  loggedIn() {
    const token = this.getToken();
    return token && !this.isTokenExpired(token);
  }
  
  isTokenExpired(token: string) {
    try {
      const decoded = jwtDecode<DecodedToken>(token);
      return decoded.exp < Date.now() / 1000;
    } catch {
      return true;
    }
  }

  getToken() {
    return localStorage.getItem('token') || '';
  }

  login(idToken: string) {
    localStorage.setItem('token', idToken);
    window.location.assign('/');
  }

  logout() {
    localStorage.removeItem('token');
    window.location.assign('/login');
  }

  // Add auto logout check
  checkTokenExpiration() {
    if (this.loggedIn()) {
      const token = this.getToken();
      const decoded = jwtDecode<DecodedToken>(token);
      const timeToExpire = (decoded.exp * 1000) - Date.now();
      
      if (timeToExpire > 0) {
        // Set timeout to logout when token expires
        setTimeout(() => {
          this.logout();
        }, timeToExpire);
      } else {
        this.logout();
      }
    }
  }
}

export default new AuthService();