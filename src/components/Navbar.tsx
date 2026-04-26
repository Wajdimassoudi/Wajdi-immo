import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, User as UserIcon, PlusCircle, Home as HomeIcon } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white text-primary border-b border-gray-200 h-16 sticky top-0 z-50 flex items-center">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">W</span>
          </div>
          <span className="text-xl font-extrabold tracking-tight">Wajdi Immo</span>
        </Link>

        <div className="flex items-center gap-6">
          <div className="hidden lg:flex gap-6 text-sm font-medium">
            <Link to="/" className="text-accent hover:text-accent-hover transition-geometric">
              الرئيسية
            </Link>
            <Link to="/?category=Real Estate" className="text-gray-500 hover:text-primary transition-geometric">
              عقارات
            </Link>
            <Link to="/?category=Cars" className="text-gray-500 hover:text-primary transition-geometric">
              سيارات
            </Link>
          </div>

          <div className="h-4 w-[1px] bg-gray-200 hidden lg:block"></div>

          <div className="flex items-center gap-4">
            {user ? (
              <>
                <Link to="/create" className="bg-accent text-white px-5 py-2.5 rounded-full text-sm font-bold blue-glow hover:bg-accent-hover transition-geometric flex items-center gap-2">
                  <PlusCircle className="w-4 h-4" />
                  <span>أضف إعلان</span>
                </Link>
                <Link to="/dashboard" className="text-gray-500 hover:text-primary transition-geometric flex items-center gap-1">
                  <UserIcon className="w-4 h-4" />
                  <span className="text-sm font-semibold">حسابي</span>
                </Link>
                <button 
                  onClick={handleLogout}
                  className="text-gray-400 hover:text-red-500 transition-geometric flex items-center gap-1"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-sm font-semibold text-gray-600 hover:text-primary transition-geometric">دخول</Link>
                <Link to="/register" className="bg-primary text-white border border-primary hover:bg-neutral-800 px-5 py-2 rounded-full text-sm font-bold transition-geometric">
                  تسجيل جديد
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
