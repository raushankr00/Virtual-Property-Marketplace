import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Building2, DollarSign, Home as HomeIcon, Building } from 'lucide-react';

// Array of hero section images
const heroImages = [
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80', // Luxury modern house
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80', // Beautiful single family
  'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=80', // Contemporary design
  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80'  // Modern architecture
];

// Featured properties data with unique images and IDs
const featuredProperties = [
  {
    id: '123e4567-e89b-12d3-a456-426614174000',
    title: 'Modern Villa',
    location: '123 Example Street, City',
    price: 450000,
    image: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&q=80&w=800' // Luxurious modern villa
  },
  {
    id: '123e4567-e89b-12d3-a456-426614174001',
    title: 'Urban Penthouse',
    location: '456 Downtown Ave, City',
    price: 750000,
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800' // Modern penthouse
  },
  {
    id: '123e4567-e89b-12d3-a456-426614174002',
    title: 'Seaside Retreat',
    location: '789 Coastal Road, City',
    price: 925000,
    image: 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&q=80&w=800' // Waterfront property
  }
];

export default function Home() {
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = React.useState(0);

  // Change background image every 5 seconds
  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleCategoryClick = (type, category) => {
    const searchParams = new URLSearchParams();
    if (type === 'sale' || type === 'rent') {
      searchParams.set('type', type);
    }
    if (category) {
      searchParams.set('category', category);
    }
    navigate(`/properties?${searchParams.toString()}`);
  };

  const handleViewDetails = (propertyId) => {
    navigate(`/properties/${propertyId}`);
  };

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section 
        className="relative h-[600px] bg-cover bg-center transition-all duration-1000"
        style={{
          backgroundImage: `url("${heroImages[currentImageIndex]}")`
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-black/50" />
        <div className="relative max-w-7xl mx-auto px-4 h-full flex flex-col items-center justify-center text-white">
          <h1 className="text-4xl md:text-6xl font-bold text-center mb-6 text-white drop-shadow-lg">
            Find Your Dream Property
          </h1>
          <p className="text-xl md:text-2xl text-center mb-8 text-white drop-shadow-lg font-medium">
            Discover the perfect place to call home
          </p>
          
          {/* Search Bar */}
          <div className="w-full max-w-3xl bg-white/95 backdrop-blur-sm rounded-lg shadow-lg p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <MapPin className="absolute left-3 top-3 text-black" />
                <input
                  type="text"
                  placeholder="Location"
                  className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex-1 relative">
                <Building2 className="absolute left-3 top-3 text-black" />
                <select className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option className="text-black" value="">Property Type</option>
                  <option className="text-black" value="house">House</option>
                  <option className="text-black" value="apartment">Apartment</option>
                  <option className="text-black" value="commercial">Commercial</option>
                </select>
              </div>
              <div className="flex-1 relative">
                <DollarSign className="absolute left-3 top-3 text-black" />
                <select className="w-full pl-4 pr-2 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option className="text-black" value="">Price Range</option>
                  <option className="text-black" value="0-100000">$0 - $100,000</option>
                  <option className="text-black" value="100000-300000">$100,000 - $300,000</option>
                  <option className="text-black" value="300000-500000">$300,000 - $500,000</option>
                  <option className="text-black" value="500000+">$500,000+</option>
                </select>
              </div>
              <button className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 flex items-center justify-center">
                <Search className="mr-2" />
                Search
              </button>
            </div>
          </div>

          {/* Image Navigation Dots */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {heroImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  currentImageIndex === index ? 'bg-blue-600 w-6' : 'bg-white'
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Properties Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Featured Properties</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProperties.map((property) => (
              <div key={property.id} className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105">
                <img
                  src={property.image}
                  alt={property.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{property.title}</h3>
                  <p className="text-gray-600 mb-4">{property.location}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-blue-600">${property.price.toLocaleString()}</span>
                    <button 
                      onClick={() => handleViewDetails(property.id)}
                      className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Browse by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { name: 'For Sale', icon: DollarSign, type: 'sale' },
              { name: 'For Rent', icon: Building2, type: 'rent' },
              { name: 'Commercial', icon: Building, type: 'sale', category: 'commercial' },
              { name: 'Residential', icon: HomeIcon, type: 'sale', category: 'residential' }
            ].map((category, i) => (
              <button
                key={i}
                onClick={() => handleCategoryClick(category.type, category.category)}
                className="bg-white rounded-lg shadow-md p-6 text-center cursor-pointer hover:bg-blue-50 transition-colors group"
              >
                <category.icon className="w-12 h-12 mx-auto mb-4 text-blue-600 group-hover:scale-110 transition-transform" />
                <h3 className="text-lg font-semibold group-hover:text-blue-600 transition-colors">{category.name}</h3>
              </button>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}