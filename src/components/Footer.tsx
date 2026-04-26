import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-white text-primary py-12 mt-20 border-t border-gray-200">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">W</span>
              </div>
              <span className="text-xl font-extrabold tracking-tight">Wajdi Immo</span>
            </Link>
            <p className="text-gray-500 text-sm leading-relaxed">
              Leading real estate and car marketplace in Tunisia. We provide the best offers with geometric precision and security.
            </p>
          </div>

          <div>
            <h4 className="font-bold mb-6 text-xs uppercase tracking-widest text-gray-400">Quick Links</h4>
            <ul className="space-y-3 text-gray-500 text-sm">
              <li><Link to="/" className="hover:text-accent transition-geometric">الرئيسية</Link></li>
              <li><Link to="/about" className="hover:text-accent transition-geometric">عن المنصة</Link></li>
              <li><Link to="/contact" className="hover:text-accent transition-geometric">اتصل بنا</Link></li>
              <li><Link to="/privacy" className="hover:text-accent transition-geometric">سياسة الخصوصية</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-6 text-xs uppercase tracking-widest text-gray-400">Categories</h4>
            <ul className="space-y-3 text-gray-500 text-sm">
              <li><Link to="/?category=Real Estate" className="hover:text-accent transition-geometric">Real Estate / عقارات</Link></li>
              <li><Link to="/?category=Cars" className="hover:text-accent transition-geometric">Cars / سيارات</Link></li>
              <li><Link to="/?listingType=Rent" className="hover:text-accent transition-geometric">For Rent / للكراء</Link></li>
              <li><Link to="/?listingType=Sale" className="hover:text-accent transition-geometric">For Sale / للبيع</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-6 text-xs uppercase tracking-widest text-gray-400">Newsletter</h4>
            <p className="text-gray-500 text-sm mb-4">Geometric updates delivered to your inbox.</p>
            <div className="flex gap-2">
              <input 
                type="email" 
                placeholder="Email Address" 
                className="bg-gray-50 border border-gray-100 p-3 rounded-xl flex-grow outline-none focus:border-accent transition-geometric text-sm"
              />
              <button className="bg-accent px-4 py-2 rounded-xl font-bold text-white hover:bg-accent-hover transition-geometric text-sm blue-glow">
                Join
              </button>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-100 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center text-gray-400 text-xs gap-4">
          <div>© {new Date().getFullYear()} Wajdi Immo. Tous droits réservés. All Governorates supported.</div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-accent transition-geometric">Terms</a>
            <a href="#" className="hover:text-accent transition-geometric">Cookies</a>
            <a href="#" className="hover:text-accent transition-geometric">FR | AR</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
