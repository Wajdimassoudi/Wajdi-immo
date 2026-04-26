import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import { Building2, Car, Upload, X } from 'lucide-react';

export default function CreateListing() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [governorates, setGovernorates] = useState<any[]>([]);
  const [delegations, setDelegations] = useState<string[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  
  const [formData, setFormData] = useState<any>({
    category: '',
    title: '',
    description: '',
    price: '',
    phone: user?.phone || '',
    governorate: '',
    delegation: '',
    // Real Estate
    listingType: 'Sale',
    propertyType: 'Apartment',
    area: '',
    rooms: '',
    floors: '',
    bathrooms: '',
    furnished: false,
    condition: 'Good',
    // Cars
    brand: '',
    model: '',
    year: new Date().getFullYear(),
    mileage: '',
    fuelType: 'Gasoline',
    transmission: 'Manual',
    images: []
  });

  useEffect(() => {
    if (!user) navigate('/login');
    fetchLocations();
  }, [user]);

  const fetchLocations = async () => {
    const res = await api.get('/locations');
    setGovernorates(res.data);
  };

  const handleGovChange = (govName: string) => {
    const gov = governorates.find(g => g.name_ar === govName);
    setFormData({ ...formData, governorate: govName, delegation: '' });
    setDelegations(gov ? gov.delegations : []);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setFormData({ ...formData, images: [...formData.images, ...files] });
      
      const newPreviews = files.map(file => URL.createObjectURL(file as File));
      setPreviews([...previews, ...newPreviews]);
    }
  };

  const removeImage = (index: number) => {
    const newImages = [...formData.images];
    newImages.splice(index, 1);
    const newPreviews = [...previews];
    newPreviews.splice(index, 1);
    setFormData({ ...formData, images: newImages });
    setPreviews(newPreviews);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.price || !formData.phone) {
      return toast.error('السعر ورقم الهاتف مطلوبان');
    }

    const data = new FormData();
    Object.keys(formData).forEach(key => {
      if (key === 'images') {
        formData.images.forEach((img: any) => data.append('images', img));
      } else {
        data.append(key, formData[key]);
      }
    });

    toast.loading('جاري نشر الإعلان...', { id: 'loading' });
    try {
      await api.post('/listings', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.success('تم نشر الإعلان بنجاح', { id: 'loading' });
      navigate('/');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'خطأ في النشر', { id: 'loading' });
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Post an Ad / أضف إعلانك</h1>
        <p className="text-gray-400">Fill in the details to publish on the Wajdi Immo marketplace.</p>
      </div>

      {step === 1 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <button 
            onClick={() => { setFormData({...formData, category: 'Real Estate'}); setStep(2); }}
            className="group bg-white p-12 rounded-2xl geometric-shadow border border-gray-100 hover:border-accent transition-geometric flex flex-col items-center gap-6"
          >
            <div className="bg-gray-50 p-6 rounded-2xl group-hover:bg-accent transition-geometric">
              <Building2 className="w-16 h-16 text-primary group-hover:text-white transition-geometric" />
            </div>
            <span className="text-2xl font-bold">Real Estate / عقارات</span>
          </button>
          
          <button 
            onClick={() => { setFormData({...formData, category: 'Cars'}); setStep(2); }}
            className="group bg-white p-12 rounded-2xl geometric-shadow border border-gray-100 hover:border-accent transition-geometric flex flex-col items-center gap-6"
          >
            <div className="bg-gray-50 p-6 rounded-2xl group-hover:bg-accent transition-geometric">
              <Car className="w-16 h-16 text-primary group-hover:text-white transition-geometric" />
            </div>
            <span className="text-2xl font-bold">Cars / سيارات</span>
          </button>
        </div>
      )}

      {step === 2 && (
        <form onSubmit={handleSubmit} className="bg-white p-8 md:p-12 rounded-2xl geometric-shadow border border-gray-100 space-y-12">
          {/* Header */}
          <div className="flex justify-between items-center border-b border-gray-50 pb-8">
            <h2 className="text-2xl font-bold flex items-center gap-3">
              {formData.category === 'Real Estate' ? <Building2 className="text-accent" /> : <Car className="text-accent" />}
              Ad Details / تفاصيل الإعلان
            </h2>
            <button type="button" onClick={() => setStep(1)} className="text-sm font-bold text-accent hover:text-accent-hover transition-geometric uppercase tracking-wider">Change Category</button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10">
            {/* Title & Description */}
            <div className="md:col-span-2 space-y-4">
              <div className="space-y-2">
                <label className="block text-xs uppercase font-bold text-gray-400">Ad Title / العنوان</label>
                <input 
                  type="text" required
                  className="w-full p-4 border border-gray-100 rounded-xl bg-gray-50 focus:bg-white transition-geometric outline-none focus:ring-1 focus:ring-accent"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="e.g. Modern Villa in La Marsa"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-xs uppercase font-bold text-gray-400">Description / الوصف</label>
                <textarea 
                  rows={4} required
                  className="w-full p-4 border border-gray-100 rounded-xl bg-gray-50 focus:bg-white transition-geometric outline-none focus:ring-1 focus:ring-accent"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Tell us more about it..."
                />
              </div>
            </div>

            {/* Location */}
            <div className="space-y-2">
              <label className="block text-xs uppercase font-bold text-gray-400">Governorate / الولاية</label>
              <select 
                required
                className="w-full p-4 border border-gray-100 rounded-xl bg-gray-50 focus:bg-white outline-none cursor-pointer"
                value={formData.governorate}
                onChange={(e) => handleGovChange(e.target.value)}
              >
                <option value="">Select State</option>
                {governorates.map(gov => <option key={gov.name_fr} value={gov.name_ar}>{gov.name_ar}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="block text-xs uppercase font-bold text-gray-400">Delegation / المعتمدية</label>
              <select 
                required
                className="w-full p-4 border border-gray-100 rounded-xl bg-gray-50 focus:bg-white outline-none cursor-pointer"
                value={formData.delegation}
                onChange={(e) => setFormData({...formData, delegation: e.target.value})}
                disabled={!formData.governorate}
              >
                <option value="">Select Region</option>
                {delegations.map(del => <option key={del} value={del}>{del}</option>)}
              </select>
            </div>

            {/* Common Fields */}
            <div className="space-y-2">
              <label className="block text-xs uppercase font-bold text-gray-400">Price (TND) / السعر</label>
              <input 
                type="number" required
                className="w-full p-4 border border-gray-100 rounded-xl bg-gray-50 focus:bg-white outline-none"
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="block text-xs uppercase font-bold text-gray-400">Phone Number / الهاتف</label>
              <input 
                type="tel" required
                className="w-full p-4 border border-gray-100 rounded-xl bg-gray-50 focus:bg-white outline-none"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
              />
            </div>

            {/* Real Estate Specific */}
            {formData.category === 'Real Estate' && (
              <>
                <div className="space-y-2">
                  <label className="block text-xs uppercase font-bold text-gray-400">Listing Type</label>
                  <select 
                    className="w-full p-4 border border-gray-100 rounded-xl bg-gray-50 outline-none"
                    value={formData.listingType}
                    onChange={(e) => setFormData({...formData, listingType: e.target.value})}
                  >
                    <option value="Sale">Sale / للبيع</option>
                    <option value="Rent">Rent / للكراء</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="block text-xs uppercase font-bold text-gray-400">Property Type</label>
                  <select 
                    className="w-full p-4 border border-gray-100 rounded-xl bg-gray-50 outline-none"
                    value={formData.propertyType}
                    onChange={(e) => setFormData({...formData, propertyType: e.target.value})}
                  >
                    <option value="Apartment">Apartment</option>
                    <option value="House">House</option>
                    <option value="Villa">Villa</option>
                    <option value="Land">Land</option>
                    <option value="Commercial">Commercial</option>
                  </select>
                </div>
              </>
            )}

            {/* Images */}
            <div className="md:col-span-2 space-y-4 pt-4">
              <label className="block text-xs uppercase font-bold text-gray-400">Photos (Max 10)</label>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {previews.map((url, index) => (
                  <div key={index} className="relative aspect-square rounded-xl overflow-hidden border border-gray-100 shadow-sm">
                    <img src={url} className="w-full h-full object-cover" />
                    <button 
                      type="button" 
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 bg-white/90 text-red-500 p-1.5 rounded-full hover:bg-red-500 hover:text-white transition-geometric"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
                
                {formData.images.length < 10 && (
                  <label className="flex flex-col items-center justify-center aspect-square rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 hover:bg-white hover:border-accent cursor-pointer transition-geometric group">
                    <Upload className="w-6 h-6 text-gray-400 group-hover:text-accent transition-geometric" />
                    <span className="text-[10px] mt-2 font-bold text-gray-400">ADD PHOTOS</span>
                    <input type="file" multiple className="hidden" accept="image/*" onChange={handleImageChange} />
                  </label>
                )}
              </div>
            </div>
          </div>

          <button 
            type="submit" 
            className="w-full bg-accent text-white py-5 rounded-full text-lg font-bold hover:bg-accent-hover blue-glow transition-geometric"
          >
            Post My Ad / انشر إعلاني
          </button>
        </form>
      )}
    </div>
  );
}
