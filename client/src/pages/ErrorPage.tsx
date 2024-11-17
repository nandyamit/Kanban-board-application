// client/src/pages/ErrorPage.tsx
import { Link } from 'react-router-dom';
import Auth from '../utils/auth';

const ErrorPage = () => {
  const isLoggedIn = Auth.loggedIn();

  return (
    <div className="error-page fade-in">
      <div className="error-content">
        <div className="error-icon">404</div>
        <h1>Page Not Found</h1>
        <p>The page you're looking for doesn't exist or has been moved.</p>
        <div className="error-actions">
          <Link 
            to={isLoggedIn ? "/" : "/login"}
            className="btn btn-primary"
          >
            {isLoggedIn ? "Return to Board" : "Go to Login"}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;