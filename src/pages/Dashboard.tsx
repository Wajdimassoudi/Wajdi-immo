import { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import { Trash2, ExternalLink, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const { user } = useAuth();
  const [userListings, setUserListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchUserListings();
    }
  }, [user]);

  const fetchUserListings = async () => {
    try {
      const res = await api.get('/listings'); // In a real app we'd filter by user on backend
      // Filtering locally for this demo as we didn't add a /my-listings route
      setUserListings(res.data.filter((l: any) => l.owner._id === user._id));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('هل أنت متأكد من حذف هذا الإعلان؟')) {
      try {
        await api.delete(`/listings/${id}`);
        toast.success('تم حذف الإعلان');
        fetchUserListings();
      } catch (err) {
        toast.error('حدث خطأ أثناء الحذف');
      }
    }
  };

  if (!user) return <div className="text-center py-20">يرجى تسجيل الدخول أولاً</div>;

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">مرحباً، {user.name}</h1>
          <p className="text-neutral-500">إليك ملخص لإعلاناتك ونشاطك على المنصة</p>
        </div>
        <div className="flex gap-4">
          <Link to="/create" className="bg-accent text-white px-6 py-2 rounded-xl font-bold hover:bg-blue-600 transition-smooth">
            إضافة إعلان جديد
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="md:col-span-1 bg-white p-8 rounded-3xl card-shadow h-fit space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">معلومات الحساب</h2>
            <Settings className="w-5 h-5 text-neutral-400" />
          </div>
          <div className="space-y-4">
            <div>
              <div className="text-xs text-neutral-400">الاسم</div>
              <div className="font-bold">{user.name}</div>
            </div>
            <div>
              <div className="text-xs text-neutral-400">البريد الإلكتروني</div>
              <div className="font-bold">{user.email}</div>
            </div>
            <div>
              <div className="text-xs text-neutral-400">الهاتف</div>
              <div className="font-bold">{user.phone}</div>
            </div>
          </div>
        </div>

        {/* Listings List */}
        <div className="md:col-span-2 space-y-6">
          <h2 className="text-2xl font-bold">إعلاناتي ({userListings.length})</h2>
          
          {loading ? (
            <div className="animate-pulse space-y-4">
              {[1,2,3].map(i => <div key={i} className="h-24 bg-neutral-200 rounded-2xl"></div>)}
            </div>
          ) : userListings.length === 0 ? (
            <div className="bg-white p-12 rounded-3xl card-shadow text-center space-y-4">
              <p className="text-neutral-500">ليس لديك إعلانات بعد</p>
              <Link to="/create" className="text-accent font-bold hover:underline">انشر أول إعلان لك الآن</Link>
            </div>
          ) : (
            <div className="space-y-4">
              {userListings.map((l: any) => (
                <div key={l._id} className="bg-white p-4 rounded-2xl card-shadow flex gap-4 items-center">
                  <img src={l.images[0]} className="w-20 h-20 object-cover rounded-xl" />
                  <div className="flex-grow">
                    <h3 className="font-bold">{l.title}</h3>
                    <div className="text-accent font-bold">{l.price} د.ت</div>
                  </div>
                  <div className="flex gap-2">
                    <Link to={`/listing/${l._id}`} className="p-2 text-neutral-400 hover:text-accent transition-smooth">
                      <ExternalLink className="w-5 h-5" />
                    </Link>
                    <button 
                      onClick={() => handleDelete(l._id)}
                      className="p-2 text-neutral-400 hover:text-red-500 transition-smooth"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
