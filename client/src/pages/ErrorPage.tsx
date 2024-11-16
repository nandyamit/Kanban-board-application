// client/src/pages/ErrorPage.tsx
import { Link } from 'react-router-dom';
import Auth from '../utils/auth';

const ErrorPage = () => {
  const isLoggedIn = Auth.loggedIn();
  console.log('ErrorPage - Auth Status:', isLoggedIn); // Debug log

  return (
    <div className="error-container">
      <h1>404: Page Not Found</h1>
      <p>¯\_(ツ)_/¯</p>
      <p>The page you're looking for doesn't exist.</p>
      <Link to={isLoggedIn ? "/" : "/login"}>
        {isLoggedIn ? "Return to Board" : "Go to Login"}
      </Link>
    </div>
  );
};

export default ErrorPage;