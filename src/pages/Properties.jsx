import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MapPin, Eye, ArrowRight, Star, Heart, Info } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { favoriteAPI } from '../lib/api';

// Sample property data with valid UUIDs
const sampleProperties = [
  [
    {
      id: '123e4567-e89b-12d3-a456-426614174000',
      title: 'Luxury Villa in Jubilee Hills',
      location: 'Jubilee Hills, Hyderabad',
      beds: 4,
      baths: 3,
      sqft: 3200,
      type: 'sale',
      price: 45000000, // 4.5 Crore
      featured: true,
      status: 'New'
    },
    {
      id: '123e4567-e89b-12d3-a456-426614174001',
      title: 'Premium Apartment in Bandra',
      location: 'Bandra West, Mumbai',
      beds: 2,
      baths: 2,
      sqft: 1800,
      type: 'rent',
      price: 85000, // 85K per month
      featured: false,
      status: 'Available'
    },
    {
      id: '123e4567-e89b-12d3-a456-426614174002',
      title: 'Golf View Estate',
      location: 'DLF Golf Course, Gurugram',
      beds: 5,
      baths: 4,
      sqft: 4500,
      type: 'sale',
      price: 75000000, // 7.5 Crore
      featured: true,
      status: 'Featured'
    },
    {
      id: '123e4567-e89b-12d3-a456-426614174003',
      title: 'Seafacing Penthouse',
      location: 'Worli, Mumbai',
      beds: 6,
      baths: 5,
      sqft: 5200,
      type: 'sale',
      price: 120000000, // 12 Crore
      featured: true,
      status: 'Exclusive'
    },
    {
      id: '123e4567-e89b-12d3-a456-426614174004',
      title: 'Modern Apartment in Indiranagar',
      location: 'Indiranagar, Bangalore',
      beds: 3,
      baths: 3,
      sqft: 2400,
      type: 'sale',
      price: 25000000, // 2.5 Crore
      featured: false,
      status: 'Hot Deal'
    },
    {
      id: '123e4567-e89b-12d3-a456-426614174005',
      title: 'Garden View Villa',
      location: 'Koramangala, Bangalore',
      beds: 4,
      baths: 3,
      sqft: 2800,
      type: 'sale',
      price: 35000000, // 3.5 Crore
      featured: false,
      status: 'New Listing'
    }
  ],
  [
    {
      id: '123e4567-e89b-12d3-a456-426614174006',
      title: 'Beachside Apartment',
      location: 'Juhu, Mumbai',
      beds: 3,
      baths: 2,
      sqft: 2100,
      type: 'sale',
      price: 55000000, // 5.5 Crore
      featured: false,
      status: 'Hot Deal'
    },
    {
      id: '123e4567-e89b-12d3-a456-426614174007',
      title: 'Modern Studio Apartment',
      location: 'HSR Layout, Bangalore',
      beds: 1,
      baths: 1,
      sqft: 1200,
      type: 'rent',
      price: 35000, // 35K per month
      featured: false,
      status: 'Available'
    },
    {
      id: '123e4567-e89b-12d3-a456-426614174008',
      title: 'Luxury Villa in Vasant Vihar',
      location: 'Vasant Vihar, New Delhi',
      beds: 6,
      baths: 5,
      sqft: 5800,
      type: 'sale',
      price: 150000000, // 15 Crore
      featured: true,
      status: 'Exclusive'
    },
    {
      id: '123e4567-e89b-12d3-a456-426614174009',
      title: 'Premium Villa in Whitefield',
      location: 'Whitefield, Bangalore',
      beds: 4,
      baths: 4,
      sqft: 3600,
      type: 'sale',
      price: 42000000, // 4.2 Crore
      featured: true,
      status: 'Featured'
    },
    {
      id: '123e4567-e89b-12d3-a456-426614174010',
      title: 'Luxury Apartment in Aundh',
      location: 'Aundh, Pune',
      beds: 5,
      baths: 4,
      sqft: 4200,
      type: 'sale',
      price: 38000000, // 3.8 Crore
      featured: false,
      status: 'New'
    },
    {
      id: '123e4567-e89b-12d3-a456-426614174011',
      title: 'Heritage Haveli',
      location: 'Civil Lines, New Delhi',
      beds: 4,
      baths: 3,
      sqft: 3000,
      type: 'sale',
      price: 85000000, // 8.5 Crore
      featured: true,
      status: 'Must See'
    }
  ]
];

// Sample property images
const propertyImages = [
  [
    'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg',
    'https://images.pexels.com/photos/1918291/pexels-photo-1918291.jpeg',
    'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg',
    'https://images.pexels.com/photos/2980955/pexels-photo-2980955.jpeg',
    'https://images.pexels.com/photos/2724749/pexels-photo-2724749.jpeg',
    'https://images.pexels.com/photos/2581922/pexels-photo-2581922.jpeg'
  ],
  [
    'https://images.pexels.com/photos/1732414/pexels-photo-1732414.jpeg',
    'https://images.pexels.com/photos/1029599/pexels-photo-1029599.jpeg',
    'https://images.pexels.com/photos/2102587/pexels-photo-2102587.jpeg',
    'https://images.pexels.com/photos/2119713/pexels-photo-2119713.jpeg',
    'https://images.pexels.com/photos/1115804/pexels-photo-1115804.jpeg',
    'https://images.pexels.com/photos/1643384/pexels-photo-1643384.jpeg'
  ]
];

// Helper function to format price in Indian format
const formatIndianPrice = (price, type) => {
  if (type === 'rent') {
    return `₹${price.toLocaleString('en-IN')}/month`;
  }
  
  if (price >= 10000000) {
    const crores = (price / 10000000).toFixed(2);
    return `₹${crores} Cr`;
  } else if (price >= 100000) {
    const lakhs = (price / 100000).toFixed(2);
    return `₹${lakhs} L`;
  } else {
    return `₹${price.toLocaleString('en-IN')}`;
  }
};

const ViewDetailsButton = ({ property }) => {
  const getButtonStyle = () => {
    if (property.featured) {
      return {
        className: "mt-4 w-full flex items-center justify-center bg-gradient-to-r from-blue-600 to-blue-800 text-white px-4 py-2 rounded-md hover:from-blue-700 hover:to-blue-900 transition-all duration-300 group",
        icon: Star
      };
    }
    if (property.type === 'rent') {
      return {
        className: "mt-4 w-full flex items-center justify-center bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors",
        icon: Info
      };
    }
    return {
      className: "mt-4 w-full flex items-center justify-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors",
      icon: Eye
    };
  };

  const style = getButtonStyle();
  const Icon = style.icon;

  return (
    <Link to={`/properties/${property.id}`} className={style.className}>
      <Icon className="h-5 w-5 mr-2" />
      <span>View Details</span>
      {property.featured && (
        <ArrowRight className="h-5 w-5 ml-2 transform group-hover:translate-x-1 transition-transform" />
      )}
    </Link>
  );
};

export default function Properties() {
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const { user } = useAuth();
  const [favorites, setFavorites] = useState(new Set());
  const [loading, setLoading] = useState(false);
  const [loadingFavorites, setLoadingFavorites] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (user) {
      loadFavorites();
    } else {
      setLoadingFavorites(false);
    }
  }, [page, user]);

  const loadFavorites = async () => {
    if (!user) return;

    try {
      setLoadingFavorites(true);
      const favoritesData = await favoriteAPI.getFavorites();
      setFavorites(new Set(favoritesData?.map(f => f.propertyId.toString()) || []));
    } catch (err) {
      console.error('Error loading favorites:', err);
    } finally {
      setLoadingFavorites(false);
    }
  };

  const toggleFavorite = async (propertyId, e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      navigate('/auth');
      return;
    }

    if (loading) return;

    setLoading(true);
    try {
      if (favorites.has(propertyId)) {
        // Remove from favorites
        await favoriteAPI.removeFavorite(propertyId);

        setFavorites(prev => {
          const next = new Set(prev);
          next.delete(propertyId);
          return next;
        });
      } else {
        // Add to favorites
        await favoriteAPI.addFavorite(propertyId);

        setFavorites(prev => new Set([...prev, propertyId]));
      }
    } catch (err) {
      console.error('Error toggling favorite:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {sampleProperties[page].map((property, i) => (
          <div
            key={property.id}
            className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105"
          >
            <div className="relative">
              <img
                src={propertyImages[page][i]}
                alt={property.title}
                className="w-full h-48 object-cover"
              />
              {property.status && (
                <div className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                  {property.status}
                </div>
              )}
              {property.featured && (
                <div className="absolute top-4 left-4 bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center">
                  <Star className="h-4 w-4 mr-1" />
                  Featured
                </div>
              )}
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">{property.title}</h3>
              <p className="text-gray-600 flex items-center">
                <MapPin className="h-4 w-4 mr-1" /> {property.location}
              </p>
              <div className="flex justify-between items-center mb-4 text-gray-600">
                <span>{property.beds} beds</span>
                <span>{property.baths} baths</span>
                <span>{property.sqft.toLocaleString()} sqft</span>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-2xl font-bold text-blue-600">
                  {formatIndianPrice(property.price, property.type)}
                </p>
                <button
                  onClick={(e) => toggleFavorite(property.id, e)}
                  disabled={loading || loadingFavorites}
                  className={`p-2 rounded-full transition-colors ${
                    loading || loadingFavorites
                      ? 'opacity-50 cursor-not-allowed'
                      : favorites.has(property.id)
                      ? 'text-red-500 hover:bg-red-50'
                      : 'text-gray-400 hover:text-red-500 hover:bg-gray-50'
                  }`}
                >
                  <Heart
                    className={`h-6 w-6 ${
                      favorites.has(property.id) ? 'fill-current' : ''
                    }`}
                  />
                </button>
              </div>
              <ViewDetailsButton property={property} />
            </div>
          </div>
        ))}
      </div>
      <div className="mt-8 flex justify-center">
        <nav className="flex items-center space-x-2">
          <button
            onClick={() => setPage(0)}
            className={`px-3 py-1 border rounded-md ${
              page === 0
                ? 'bg-gray-100 cursor-not-allowed'
                : 'hover:bg-gray-50'
            }`}
            disabled={page === 0}
          >
            Previous
          </button>
          <span className="px-3 py-1 border rounded-md bg-blue-600 text-white">
            Page {page + 1}
          </span>
          <button
            onClick={() => setPage(1)}
            className={`px-3 py-1 border rounded-md ${
              page === 1
                ? 'bg-gray-100 cursor-not-allowed'
                : 'hover:bg-gray-50'
            }`}
            disabled={page === 1}
          >
            Next
          </button>
        </nav>
      </div>
    </div>
  );
}