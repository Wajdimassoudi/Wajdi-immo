import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Calendar, Gauge } from 'lucide-react';

interface ListingCardProps {
  listing: any;
}

const ListingCard: React.FC<ListingCardProps> = ({ listing }) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-TN', { style: 'currency', currency: 'TND' }).format(price);
  };

  return (
    <Link to={`/listing/${listing.id}`} className="group bg-white rounded-2xl overflow-hidden border border-gray-100 geometric-shadow transition-geometric hover:shadow-xl hover:-translate-y-1 h-full flex flex-col">
      <div className="relative aspect-[16/10] overflow-hidden bg-gray-200">
        <img 
          src={listing.images[0] || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800'} 
          alt={listing.title}
          className="w-full h-full object-cover transition-geometric group-hover:scale-105"
        />
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          <div className="bg-accent text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm">
            {listing.category === 'Real Estate' ? 'REAL ESTATE' : 'CAR'}
          </div>
          {listing.isFeatured && (
            <div className="bg-yellow-500 text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm">
              FEATURED
            </div>
          )}
        </div>
        {listing.listingType && (
          <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-md text-primary text-[10px] font-bold px-3 py-1 rounded-full shadow-sm">
            {listing.listingType === 'Rent' ? 'FOR RENT' : 'FOR SALE'}
          </div>
        )}
      </div>

      <div className="p-5 flex flex-col flex-1">
        <div className="flex justify-between items-start mb-2 gap-2">
          <h3 className="font-bold text-lg leading-tight group-hover:text-accent transition-geometric line-clamp-2">{listing.title}</h3>
          <div className="text-accent font-extrabold flex-shrink-0 text-right">
            {formatPrice(listing.price)}
          </div>
        </div>

        <p className="text-gray-400 text-[11px] mb-4 flex items-center gap-1">
          <MapPin className="w-3 h-3" />
          {listing.governorate}, {listing.delegation}
        </p>

        <div className="mt-auto flex items-center justify-between border-t border-gray-50 pt-4">
          <div className="flex gap-3 text-[11px] text-gray-500 font-medium">
            {listing.category === 'Cars' ? (
              <>
                <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {listing.year}</span>
                <span className="flex items-center gap-1"><Gauge className="w-3 h-3" /> {listing.mileage}km</span>
              </>
            ) : (
              <>
                <span className="flex items-center gap-1">🛏️ {listing.rooms || 0}</span>
                <span className="flex items-center gap-1">🚿 {listing.bathrooms || 0}</span>
                <span className="flex items-center gap-1">📐 {listing.area || 0}m²</span>
              </>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ListingCard;
