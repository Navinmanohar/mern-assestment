import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(navigate);
  };

  return (
    <nav className="bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link 
            to={user ? '/' : '/login'} 
            className="text-xl font-bold text-slate-900 tracking-tight"
          >
            HN Reader
          </Link>

          <div className="flex items-center gap-4 sm:gap-6">
            {user ? (
              <>
                <Link 
                  to="/" 
                  className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors"
                >
                  Stories
                </Link>
                <Link 
                  to="/bookmarks" 
                  className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors"
                >
                  Bookmarks
                </Link>
                <span className="text-sm text-slate-500 hidden sm:block">
                  {user.name}
                </span>
                <button
                  onClick={handleLogout}
                  className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors"
                >
                  Login
                </Link>
                <Link 
                  to="/register"
                  className="text-sm font-medium text-white bg-indigo-600 px-4 py-2 rounded-xl hover:bg-indigo-700 transition-colors shadow-sm"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
