import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import ListingCard from '../components/ListingCard';
import { Search, Filter, MapPin } from 'lucide-react';

const GOVERNORATES = [
  { name_fr: 'Tunis', name_ar: 'تونس' },
  { name_fr: 'Ariana', name_ar: 'أريانة' },
  { name_fr: 'Ben Arous', name_ar: 'بن عروس' },
  { name_fr: 'Manouba', name_ar: 'منوبة' },
  { name_fr: 'Sousse', name_ar: 'سوسة' },
  { name_fr: 'Monastir', name_ar: 'المنستير' },
  { name_fr: 'Mahdia', name_ar: 'المهدية' },
  { name_fr: 'Sfax', name_ar: 'صفاقس' },
  { name_fr: 'Nabeul', name_ar: 'نابل' },
  { name_fr: 'Bizerte', name_ar: 'بنزرت' },
  { name_fr: 'Béja', name_ar: 'باجة' },
  { name_fr: 'Jendouba', name_ar: 'جندوبة' },
  { name_fr: 'Kef', name_ar: 'الكاف' },
  { name_fr: 'Siliana', name_ar: 'سليانة' },
  { name_fr: 'Kairouan', name_ar: 'القيروان' },
  { name_fr: 'Kassérine', name_ar: 'القصرين' },
  { name_fr: 'Sidi Bouzid', name_ar: 'سيدي بوزيد' },
  { name_fr: 'Gabès', name_ar: 'قابس' },
  { name_fr: 'Medenine', name_ar: 'مدنين' },
  { name_fr: 'Tataouine', name_ar: 'تطاوين' },
  { name_fr: 'Gafsa', name_ar: 'قفصة' },
  { name_fr: 'Tozeur', name_ar: 'توزر' },
  { name_fr: 'Kebili', name_ar: 'قبلي' },
  { name_fr: 'Zaghouan', name_ar: 'زغوان' },
];

export default function Home() {
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: '',
    governorate: '',
    q: ''
  });

  useEffect(() => {
    fetchListings();
  }, [filters.category, filters.governorate]);

  const fetchListings = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('listings')
        .select(`
          *,
          owner:profiles(id, name)
        `);

      if (filters.category) {
        query = query.eq('category', filters.category);
      }
      if (filters.governorate) {
        query = query.eq('governorate', filters.governorate);
      }
      if (filters.q) {
        query = query.ilike('title', `%${filters.q}%`);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;
      setListings(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchListings();
  };

  return (
    <div className="space-y-12">
      {/* Hero Search Section */}
      <header className="bg-primary pt-16 pb-20 px-8 relative overflow-hidden rounded-3xl -mt-4">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-blue-900/50 opacity-20 pointer-events-none"></div>
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h1 className="text-3xl md:text-5xl font-bold text-white tracking-tight leading-tight">
            Find your next dream home or car in Tunisia
          </h1>
          
          <form onSubmit={handleSearch} className="bg-white p-2 rounded-2xl shadow-2xl grid grid-cols-12 gap-2 text-primary text-right">
            <div className="col-span-12 md:col-span-4 flex flex-col items-start px-4 py-2 border-b md:border-b-0 md:border-l border-gray-100">
              <span className="text-[10px] uppercase font-bold text-gray-400 mb-1">Governorate / ولاية</span>
              <select 
                className="w-full text-sm font-semibold bg-transparent focus:outline-none appearance-none cursor-pointer"
                value={filters.governorate}
                onChange={(e) => setFilters({...filters, governorate: e.target.value})}
              >
                <option value="">كل الولايات</option>
                {GOVERNORATES.map(gov => (
                  <option key={gov.name_fr} value={gov.name_ar}>{gov.name_ar}</option>
                ))}
              </select>
            </div>
            
            <div className="col-span-6 md:col-span-3 flex flex-col items-start px-4 py-2 border-l border-gray-100">
              <span className="text-[10px] uppercase font-bold text-gray-400 mb-1">Category</span>
              <select 
                className="w-full text-sm font-semibold bg-transparent focus:outline-none appearance-none cursor-pointer"
                value={filters.category}
                onChange={(e) => setFilters({...filters, category: e.target.value})}
              >
                <option value="">كل الأصناف</option>
                <option value="Real Estate">عقارات</option>
                <option value="Cars">سيارات</option>
              </select>
            </div>

            <div className="col-span-6 md:col-span-3 flex flex-col items-start px-4 py-2">
              <span className="text-[10px] uppercase font-bold text-gray-400 mb-1">Search / بحث</span>
              <input 
                type="text" 
                placeholder="ما الذي تبحث عنه؟" 
                className="w-full text-sm font-semibold bg-transparent focus:outline-none"
                value={filters.q}
                onChange={(e) => setFilters({...filters, q: e.target.value})}
              />
            </div>

            <button className="col-span-12 md:col-span-2 bg-accent hover:bg-accent-hover text-white rounded-xl flex items-center justify-center transition-geometric h-12 md:h-auto">
              <Search className="w-5 h-5" />
            </button>
          </form>
        </div>
      </header>

      {/* Main Content Grid Area */}
      <main className="flex-1 flex flex-col space-y-8">
        {/* Filters & Categories Row */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex space-x-3 rtl:space-x-reverse">
            <button 
              onClick={() => setFilters({...filters, category: ''})}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-geometric ${!filters.category ? 'bg-primary text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-accent'}`}
            >
              All / الكل
            </button>
            <button 
              onClick={() => setFilters({...filters, category: 'Real Estate'})}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-geometric ${filters.category === 'Real Estate' ? 'bg-primary text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-accent'}`}
            >
              Real Estate / عقارات
            </button>
            <button 
              onClick={() => setFilters({...filters, category: 'Cars'})}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-geometric ${filters.category === 'Cars' ? 'bg-primary text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-accent'}`}
            >
              Cars / سيارات
            </button>
          </div>
          
          <div className="text-sm text-gray-500 font-medium">
            Showing <span className="text-primary font-bold">{listings.length}</span> listings across Tunisia
          </div>
        </div>

      {/* Listings Grid */}
      <section>
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">آخر الإعلانات</h2>
          <div className="text-neutral-500">{listings.length} إعلان موجود</div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[1,2,3,4,5,6,7,8].map(i => (
              <div key={i} className="h-80 bg-neutral-200 animate-pulse rounded-2xl"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {listings.map((listing: any) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        )}

        {!loading && listings.length === 0 && (
          <div className="text-center py-20 bg-white rounded-3xl card-shadow">
            <p className="text-xl text-neutral-500">لم يتم العثور على إعلانات تطابق بحثك</p>
          </div>
        )}
      </section>
      </main>
    </div>
  );
}
