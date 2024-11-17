// client/src/pages/Login.tsx
import { useState, FormEvent, ChangeEvent } from "react";
import Auth from '../utils/auth';
import { login } from "../api/authAPI";

const Login = () => {
  const [loginData, setLoginData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError(null);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const data = await login(loginData);
      Auth.login(data.token);
    } catch (err: any) {
      console.error('Failed to login:', err);
      setError(err.message || 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="auth-container">
        <div className="auth-card fade-in">
          <div className="auth-header">
            <h1>Welcome Back</h1>
            <p>Sign in to access your Kanban board</p>
          </div>
          
          {error && (
            <div className="error-message" role="alert">
              <span className="error-icon">⚠️</span>
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="username">Username</label>
              <input 
                type="text"
                id="username"
                name="username"
                value={loginData.username}
                onChange={handleChange}
                className={`form-input ${error ? 'input-error' : ''}`}
                placeholder="Enter your username"
                required
                autoFocus
              />
            </div>
            
            <div className="form-group">
              <label className="form-label" htmlFor="password">Password</label>
              <input 
                type="password"
                id="password"
                name="password"
                value={loginData.password}
                onChange={handleChange}
                className={`form-input ${error ? 'input-error' : ''}`}
                placeholder="Enter your password"
                required
              />
            </div>
            
            <button 
              type="submit" 
              className={`auth-button ${loading ? 'loading' : ''}`}
              disabled={loading}
            >
              <span className="button-content">
                {loading ? (
                  <>
                    <span className="spinner" />
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;