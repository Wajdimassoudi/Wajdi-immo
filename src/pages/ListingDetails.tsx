import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import ListingCard from '../components/ListingCard';
import { Phone, User as UserIcon, MapPin, Calendar, Gauge, Building2, Ruler, MessageCircle, Car } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function ListingDetails() {
  const { id } = useParams();
  const [listing, setListing] = useState<any>(null);
  const [similar, setSimilar] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [showPhone, setShowPhone] = useState(false);

  useEffect(() => {
    fetchListing();
  }, [id]);

  const fetchListing = async () => {
    if (!id) return;
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('listings')
        .select(`
          *,
          owner:profiles(*)
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      setListing(data);
      
      // Fetch similar listings
      const { data: simData } = await supabase
        .from('listings')
        .select('*')
        .eq('category', data.category)
        .neq('id', id)
        .limit(4);
      
      setSimilar((simData as any) || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-TN', { style: 'currency', currency: 'TND' }).format(price);
  };

  if (loading) return <div className="h-96 flex items-center justify-center animate-pulse text-2xl text-neutral-400">جاري التحميل...</div>;
  if (!listing) return <div className="text-center py-20 text-2xl">الإعلان غير موجود</div>;

  return (
    <div className="space-y-12 pb-20">
      {/* Title and Price Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-gray-100 pb-10">
        <div className="space-y-3">
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-primary leading-tight">{listing.title}</h1>
          <div className="flex items-center gap-2 text-gray-400">
            <MapPin className="w-5 h-5 text-accent" />
            <span className="text-base font-semibold">{listing.governorate}, {listing.delegation}</span>
          </div>
        </div>
        <div className="bg-primary text-white p-8 rounded-2xl geometric-shadow flex flex-col items-end min-w-[240px]">
          <span className="text-[10px] uppercase font-bold text-gray-400 mb-2 tracking-widest leading-none">Asking Price / السعر</span>
          <span className="text-4xl font-extrabold text-accent">{formatPrice(listing.price)}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left column: Images, Specs, Description */}
        <div className="lg:col-span-2 space-y-12">
          {/* Gallery View */}
          <div className="space-y-4">
            <div className="relative aspect-video rounded-3xl overflow-hidden bg-neutral-100 border border-gray-100 geometric-shadow">
              <AnimatePresence mode="wait">
                <motion.img 
                  key={activeImage}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  src={listing.images[activeImage] || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200'} 
                  className="w-full h-full object-contain"
                />
              </AnimatePresence>
            </div>
            
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
              {listing.images.map((img: string, idx: number) => (
                <button 
                  key={idx}
                  onClick={() => setActiveImage(idx)}
                  className={`relative w-24 aspect-square rounded-xl overflow-hidden border-2 transition-geometric flex-shrink-0 ${activeImage === idx ? 'border-accent shadow-md' : 'border-transparent opacity-60 hover:opacity-100'}`}
                >
                  <img src={img} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Core Specifications */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {listing.category === 'Real Estate' ? (
              <>
                <div className="bg-white p-6 rounded-2xl border border-gray-100 geometric-shadow text-center space-y-2">
                  <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center mx-auto">
                    <Building2 className="w-5 h-5 text-accent" />
                  </div>
                  <div className="text-[10px] uppercase font-bold text-gray-400">Property</div>
                  <div className="text-sm font-bold text-primary">{listing.propertyType}</div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-gray-100 geometric-shadow text-center space-y-2">
                  <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center mx-auto">
                    <Ruler className="w-5 h-5 text-accent" />
                  </div>
                  <div className="text-[10px] uppercase font-bold text-gray-400">Area</div>
                  <div className="text-sm font-bold text-primary">{listing.area} m²</div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-gray-100 geometric-shadow text-center space-y-2">
                  <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center mx-auto">
                    <Building2 className="w-5 h-5 text-accent" />
                  </div>
                  <div className="text-[10px] uppercase font-bold text-gray-400">Rooms</div>
                  <div className="text-sm font-bold text-primary">{listing.rooms}</div>
                </div>
              </>
            ) : (
              <>
                <div className="bg-white p-6 rounded-2xl border border-gray-100 geometric-shadow text-center space-y-2">
                  <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center mx-auto">
                    <Car className="w-5 h-5 text-accent" />
                  </div>
                  <div className="text-[10px] uppercase font-bold text-gray-400">Brand</div>
                  <div className="text-sm font-bold text-primary">{listing.brand}</div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-gray-100 geometric-shadow text-center space-y-2">
                  <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center mx-auto">
                    <Calendar className="w-5 h-5 text-accent" />
                  </div>
                  <div className="text-[10px] uppercase font-bold text-gray-400">Year</div>
                  <div className="text-sm font-bold text-primary">{listing.year}</div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-gray-100 geometric-shadow text-center space-y-2">
                  <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center mx-auto">
                    <Gauge className="w-5 h-5 text-accent" />
                  </div>
                  <div className="text-[10px] uppercase font-bold text-gray-400">Mileage</div>
                  <div className="text-sm font-bold text-primary">{listing.mileage} km</div>
                </div>
              </>
            )}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 geometric-shadow text-center space-y-2">
              <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center mx-auto">
                <Calendar className="w-5 h-5 text-accent" />
              </div>
              <div className="text-[10px] uppercase font-bold text-gray-400">Posted</div>
              <div className="text-sm font-bold text-primary">{new Date(listing.created_at).toLocaleDateString()}</div>
            </div>
          </div>

          {/* Description Section */}
          <div className="bg-white p-10 rounded-2xl border border-gray-100 geometric-shadow space-y-8">
            <h3 className="text-2xl font-bold border-b border-gray-50 pb-6">Description / الوصف</h3>
            <p className="text-gray-500 leading-relaxed whitespace-pre-wrap text-lg">
              {listing.description}
            </p>
          </div>
        </div>

        {/* Right column: Sidebar Actions */}
        <div className="space-y-8">
          <div className="bg-white p-8 rounded-2xl border border-gray-100 geometric-shadow space-y-8 sticky top-24">
            <div className="flex items-center gap-4 border-b border-gray-50 pb-8">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center overflow-hidden border border-gray-100">
                <UserIcon className="w-8 h-8 text-gray-400" />
              </div>
              <div>
                <h4 className="font-bold text-xl leading-tight">{listing.owner?.name || 'Anonymous'}</h4>
                <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest mt-1">Verified Member</p>
              </div>
            </div>

            <div className="space-y-4">
              <button 
                onClick={() => setShowPhone(!showPhone)}
                className="w-full bg-primary text-white p-5 rounded-xl font-bold flex items-center justify-center gap-3 hover:bg-neutral-800 transition-geometric"
              >
                <Phone className="w-6 h-6" />
                <span className="text-lg">{showPhone ? listing.phone : 'Show Phone / إظهار الهاتف'}</span>
              </button>

              <a 
                href={`https://wa.me/216${listing.phone.replace(/ /g, '')}`}
                target="_blank"
                rel="noreferrer"
                className="w-full bg-accent text-white p-5 rounded-xl font-bold flex items-center justify-center gap-3 hover:bg-accent-hover blue-glow transition-geometric"
              >
                <MessageCircle className="w-6 h-6" />
                <span className="text-lg">Contact WhatsApp</span>
              </a>
            </div>

            <div className="pt-4 text-center">
              <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider leading-relaxed">
                Please mention Wajdi Immo when you call
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Similar Listings Section */}
      {similar.length > 0 && (
        <section className="space-y-10 pt-12 border-t border-gray-100">
          <div className="flex justify-between items-end">
            <h2 className="text-3xl font-bold tracking-tight">Similar Listings / إعلانات مشابهة</h2>
            <Link to="/" className="text-accent font-bold hover:underline">View all</Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {similar.map((item: any) => (
              <ListingCard key={item.id} listing={item} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function SpecItem({ icon, label, value }: { icon: any, label: string, value: any }) {
  if (!value) return null;
  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2 text-accent">
        {React.cloneElement(icon, { className: "w-5 h-5" })}
        <span className="text-xs text-neutral-500 font-normal">{label}</span>
      </div>
      <div className="font-bold">{value}</div>
    </div>
  );
}
