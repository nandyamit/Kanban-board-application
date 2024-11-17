// client/src/utils/auth.ts
import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
  username: string;
  exp: number;
}

class AuthService {
  private tokenCheckInterval: number | null = null;

  constructor() {
    // Start checking token expiration when service is instantiated
    this.initTokenCheck();
  }

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
      // Get expiration time minus 60 seconds to ensure we logout before actual expiration
      const expirationWithBuffer = (decoded.exp * 1000) - 60000;
      return Date.now() >= expirationWithBuffer;
    } catch (err) {
      return true;
    }
  }

  getToken() {
    return localStorage.getItem('token');
  }

  login(idToken: string) {
    localStorage.setItem('token', idToken);
    this.initTokenCheck();
    window.location.assign('/');
  }

  logout() {
    localStorage.removeItem('token');
    this.clearTokenCheck();
    window.location.assign('/login');
  }

  private initTokenCheck() {
    // Clear any existing interval
    this.clearTokenCheck();

    // Check token every minute
    this.tokenCheckInterval = window.setInterval(() => {
      const token = this.getToken();
      if (token) {
        try {
          const decoded = jwtDecode<DecodedToken>(token);
          const timeUntilExpiration = (decoded.exp * 1000) - Date.now();

          // If token is expired, logout
          if (timeUntilExpiration <= 0) {
            this.logout();
            return;
          }

          // Show warning 5 minutes before expiration
          if (timeUntilExpiration <= 300000) { // 5 minutes in milliseconds
            this.showExpirationWarning(Math.floor(timeUntilExpiration / 1000 / 60));
          }
        } catch (err) {
          this.logout();
        }
      }
    }, 60000); // Check every minute
  }

  private clearTokenCheck() {
    if (this.tokenCheckInterval) {
      window.clearInterval(this.tokenCheckInterval);
      this.tokenCheckInterval = null;
    }
  }

  private showExpirationWarning(minutesLeft: number) {
    // Create or update warning message
    let warningDiv = document.getElementById('session-warning');
    if (!warningDiv) {
      warningDiv = document.createElement('div');
      warningDiv.id = 'session-warning';
      warningDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background-color: #fef3c7;
        border: 1px solid #f59e0b;
        padding: 1rem;
        border-radius: 0.375rem;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        z-index: 1000;
      `;
      document.body.appendChild(warningDiv);
    }

    warningDiv.innerHTML = `
      <div style="display: flex; align-items: center; gap: 1rem;">
        <p style="margin: 0;">Your session will expire in ${minutesLeft} minute${minutesLeft !== 1 ? 's' : ''}.</p>
        <button onclick="location.reload()" style="
          background-color: #f59e0b;
          color: white;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 0.25rem;
          cursor: pointer;
        ">
          Extend Session
        </button>
      </div>
    `;
  }
}

export default new AuthService();