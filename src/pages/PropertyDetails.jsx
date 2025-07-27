import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  MapPin, Bed, Bath, Move, Heart, Share2, Star,
  Phone, Mail, Home, Building2, DollarSign
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

// Your propertyDetails map…


  // …rest of your component (gallery, details, etc.)…


// Property details mapping
const propertyDetails = {
  '123e4567-e89b-12d3-a456-426614174000': {
    title: "Modern Villa",
    location: "123 Example Street, Beverly Hills",
    price: 450000,
    bedrooms: 4,
    bathrooms: 3,
    size: 2500,
    description: "This stunning modern villa offers luxurious living spaces with high-end finishes throughout. The open-concept layout features a gourmet kitchen, spacious living areas, and large windows that flood the home with natural light. The primary suite includes a spa-like bathroom and walk-in closet.",
    features: [
      'Gourmet Kitchen',
      'Walk-in Closets',
      'Central Air',
      'Hardwood Floors',
      'Smart Home System',
      'Security System',
      'Double Garage',
      'Garden'
    ],
    images: [
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=1200'
    ],
    type: 'sale',
    status: 'Active',
    agent: {
      name: 'Property Agent',
      phone: '+1 (555) 123-4567',
      email: 'sarah.j@propertyhub.com'
    }
  },
  '123e4567-e89b-12d3-a456-426614174001': {
    title: "Luxury Penthouse",
    location: "456 Park Avenue, Manhattan",
    price: 750000,
    bedrooms: 3,
    bathrooms: 2.5,
    size: 1800,
    description: "Spectacular penthouse with breathtaking city views from every room. Features include floor-to-ceiling windows, private terrace, and designer finishes. The chef's kitchen boasts top-of-the-line appliances and marble countertops. Building amenities include 24/7 concierge and fitness center.",
    features: [
      'Private Terrace',
      'Floor-to-ceiling Windows',
      'Chef\'s Kitchen',
      'Wine Cellar',
      'Home Theater',
      'Concierge Service',
      'Fitness Center',
      'Valet Parking'
    ],
    images: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=80&w=1200'
    ],
    type: 'sale',
    status: 'Under Review',
    agent: {
      name: 'Property Agent',
      phone: '+1 (555) 987-6543',
      email: 'michael.c@propertyhub.com'
    }
  },
  '123e4567-e89b-12d3-a456-426614174002': {
    title: "Cozy Apartment",
    location: "789 Main Street, Downtown",
    price: 350000,
    bedrooms: 2,
    bathrooms: 1,
    size: 1200,
    description: "Charming apartment in the heart of downtown. Recently renovated with modern amenities while maintaining its historic character. Perfect for young professionals or small families. Features include exposed brick walls, updated kitchen, and in-unit laundry.",
    features: [
      'In-unit Laundry',
      'Exposed Brick',
      'Updated Kitchen',
      'High Ceilings',
      'Pet Friendly',
      'Bike Storage',
      'Rooftop Access',
      'Public Transit Nearby'
    ],
    images: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=1200'
    ],
    type: 'sale',
    status: 'Pending',
    agent: {
      name: 'Property Agent',
      phone: '+1 (555) 234-5678',
      email: 'mily.r@propertyhub.com'
    }
  }
};

export default function PropertyDetails() {
  const { id } = useParams();
  const [activeImage, setActiveImage] = useState(0);
  
  const property = id ? propertyDetails[id] : null;

  if (!property) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Property Not Found</h2>
          <p className="mt-2 text-gray-600">The property you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }
 

  // Prepare default message
  const defaultMessage = `Hi Agent, I'm interested in this property and would like to schedule a viewing.`;

  // Contact form state
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: defaultMessage,
  });
  const [contactSent, setContactSent] = useState(false);

  const getStatusColor = (status) => {
    const colors = {
      'Active': 'bg-green-500',
      'Under Review': 'bg-purple-500',
      'Pending': 'bg-yellow-500'
    };
    return colors[status] || 'bg-gray-500';
  };

  const getPriceDisplay = () => {
    if (property.type === 'rent') {
      return `$${property.price.toLocaleString()}/month`;
    }
    return `$${property.price.toLocaleString()}`;
  };

  const getPropertyIcon = () => {
    if (property.type === 'rent') {
      return Building2;
    }
    return Home;
  };

  const PropertyIcon = getPropertyIcon();

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Image Gallery */}
      <div className="mb-8">
        <div className="relative h-[500px] rounded-lg overflow-hidden">
          <img
            src={property.images[activeImage]}
            alt={`${property.title} view ${activeImage + 1}`}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-4 right-4 flex space-x-2">
            <span className={`${getStatusColor(property.status)} text-white px-4 py-2 rounded-full font-medium flex items-center`}>
              <Star className="h-4 w-4 mr-2" />
              {property.status}
            </span>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4 mt-4">
          {property.images.map((image, index) => (
            <button
              key={index}
              onClick={() => setActiveImage(index)}
              className={`relative rounded-lg overflow-hidden ${
                activeImage === index ? 'ring-2 ring-blue-600' : ''
              }`}
            >
              <img
                src={image}
                alt={`${property.title} view ${index + 1}`}
                className="w-full h-24 object-cover"
              />
            </button>
          ))}
        </div>
      </div>

      {/* Property Info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="flex justify-between items-start mb-6">
            <div>
              <div className="flex items-center mb-2">
                <PropertyIcon className="h-6 w-6 text-blue-600 mr-2" />
                <h1 className="text-3xl font-bold">{property.title}</h1>
              </div>
              <p className="text-gray-600 flex items-center">
                <MapPin className="h-5 w-5 mr-2" />
                {property.location}
              </p>
            </div>
            <div className="flex space-x-4">
              <button className="p-2 rounded-full hover:bg-gray-100">
                <Heart className="h-6 w-6" />
              </button>
              <button className="p-2 rounded-full hover:bg-gray-100">
                <Share2 className="h-6 w-6" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="flex items-center space-x-2 text-gray-600">
              <Bed className="h-5 w-5" />
              <span>{property.bedrooms} Bedrooms</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-600">
              <Bath className="h-5 w-5" />
              <span>{property.bathrooms} Bathrooms</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-600">
              <Move className="h-5 w-5" />
              <span>{property.size.toLocaleString()} sqft</span>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Description</h2>
            <p className="text-gray-600 leading-relaxed">
              {property.description}
            </p>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Features</h2>
            <ul className="grid grid-cols-2 gap-4">
              {property.features.map((feature, index) => (
                <li key={index} className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-blue-600 rounded-full" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
            <div className="text-center mb-6">
              <span className="text-3xl font-bold text-blue-600">{getPriceDisplay()}</span>
              <p className="text-gray-500 capitalize">{property.type === 'rent' ? 'For Rent' : 'For Sale'}</p>
            </div>

            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold mb-2">Listed by:</h3>
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-bold">{property.agent.name[0]}</span>
                </div>
                <div>
                  <p className="font-medium">{property.agent.name}</p>
                  <p className="text-gray-600 text-sm">Professional Agent</p>
                </div>
              </div>
            </div>
            
            <div className="relative">
  {contactSent && (
    <div className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center rounded-md">
      <div className="bg-green-100 border border-green-200 text-green-800 px-4 py-2 rounded">
        Your message has been sent!
      </div>
    </div>
  )}

  <form
    className="space-y-4"
    onSubmit={e => {
      e.preventDefault();
      // TODO: call your API to send contactForm
      setContactSent(true);
      setTimeout(() => setContactSent(false), 3000);
    }}
  >
    {['name','email','phone'].map(field => (
      <div key={field}>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {field === 'name' ? 'Your Name' : field.charAt(0).toUpperCase() + field.slice(1)}
        </label>
        <input
          name={field}
          type={field === 'email' ? 'email' : 'text'}
          value={contactForm[field]}
          onChange={e => setContactForm(f => ({ ...f, [field]: e.target.value }))}
          required={field !== 'phone'}
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    ))}

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Message
      </label>
      <textarea
        name="message"
        rows={4}
        value={contactForm.message}
        onChange={e => setContactForm(f => ({ ...f, message: e.target.value }))}
        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>

    <button
      type="submit"
      className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
    >
      Contact Agent
    </button>
  </form>
</div>


            <div className="mt-6 pt-6 border-t">
              <h3 className="font-semibold mb-4">Quick Contact</h3>
              <div className="space-y-3">
                <a
                  href={`tel:${property.agent.phone}`}
                  className="flex items-center space-x-2 text-gray-600 hover:text-blue-600"
                >
                  <Phone className="h-5 w-5" />
                  <span>{property.agent.phone}</span>
                </a>
                <a
                  href={`mailto:${property.agent.email}`}
                  className="flex items-center space-x-2 text-gray-600 hover:text-blue-600"
                >
                  <Mail className="h-5 w-5" />
                  <span>{property.agent.email}</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}