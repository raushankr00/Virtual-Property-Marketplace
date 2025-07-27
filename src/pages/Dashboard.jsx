import React, { useState, useEffect } from 'react';
import {
  Building2, Heart, MessageSquare, Settings, Plus, Edit2, Trash2, LogIn,
  ChevronRight, Bell, Calendar, TrendingUp, Users, Home, Filter, Search,
  Mail, Phone, User, MapPin, DollarSign, Image as ImageIcon, X, AlertCircle,
  HeartOff, ChevronDown, MoreVertical, ArrowUpRight, Briefcase, Clock, Eye
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { propertyAPI, favoriteAPI } from '../lib/api';

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

const DashboardCard = ({ 
  icon: Icon, 
  title, 
  value, 
  trend, 
  color = 'blue',
  subtitle
}) => (
  <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
    <div className="flex items-center justify-between mb-4">
      <div className={`p-3 rounded-lg bg-${color}-100`}>
        <Icon className={`h-6 w-6 text-${color}-600`} />
      </div>
      {trend !== undefined && (
        <span className={`flex items-center text-sm font-medium ${trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
          {trend >= 0 ? <ArrowUpRight className="h-4 w-4 mr-1" /> : <ChevronDown className="h-4 w-4 mr-1" />}
          {Math.abs(trend)}%
        </span>
      )}
    </div>
    <h3 className="text-lg font-semibold text-gray-700">{title}</h3>
    <p className="text-2xl font-bold mt-2">{value}</p>
    {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
  </div>
);

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [properties, setProperties] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [profile, setProfile] = useState(null);
  const [showSellForm, setShowSellForm] = useState(false);
  const [formError, setFormError] = useState(null);
  const [propertyFormData, setPropertyFormData] = useState({
    title: '',
    description: '',
    price: '',
    location: '',
    type: 'sale',
    category: 'residential',
    bedrooms: '',
    bathrooms: '',
    size: '',
    features: [],
    images: []
  });

  const loadProperties = async () => {
    if (!user) return;
    
    try {
      const properties = await propertyAPI.getProperties();
      setProperties(properties || []);
    } catch (err) {
      console.error('Error loading properties:', err);
    }
  };

  const loadFavorites = async () => {
    if (!user) return;
    
    try {
      const favorites = await favoriteAPI.getFavorites();
      setFavorites(favorites || []);
    } catch (err) {
      console.error('Error loading favorites:', err);
    }
  };

  useEffect(() => {
    async function loadProfile() {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        setProfile({
          name: user.name || user.email?.split('@')[0] || 'User',
          role: user.role || 'buyer',
          email: user.email || '',
          phone: user.phone || ''
        });

        await Promise.all([loadProperties(), loadFavorites()]);
      } catch (err) {
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, [user]);

  const handlePropertyClick = (propertyId) => {
    navigate(`/properties/${propertyId}`);
  };

  const handleRemoveFavorite = async (favoriteId) => {
    try {
      await favoriteAPI.removeFavorite(favoriteId);
      await loadFavorites();
    } catch (err) {
      console.error('Error removing favorite:', err);
    }
  };

  const handleSellProperty = async (e) => {
    e.preventDefault();
    setLoading(true);
    setFormError(null);

    try {
      if (!propertyFormData.title || !propertyFormData.description || !propertyFormData.price) {
        throw new Error('Please fill in all required fields');
      }

      const propertyData = {
        title: propertyFormData.title,
        description: propertyFormData.description,
        price: parseFloat(propertyFormData.price),
        location: propertyFormData.location,
        type: propertyFormData.type,
        category: propertyFormData.category,
        bedrooms: parseInt(propertyFormData.bedrooms),
        bathrooms: parseInt(propertyFormData.bathrooms),
        size: parseFloat(propertyFormData.size),
        features: propertyFormData.features,
        images: propertyFormData.images,
      };
      
      await propertyAPI.createProperty(propertyData);

      setShowSellForm(false);
      setPropertyFormData({
        title: '',
        description: '',
        price: '',
        location: '',
        type: 'sale',
        category: 'residential',
        bedrooms: '',
        bathrooms: '',
        size: '',
        features: [],
        images: []
      });

      await loadProperties();
    } catch (error) {
      console.error('Error creating property:', error);
      setFormError(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md px-4">
          <LogIn className="w-16 h-16 text-blue-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Sign in Required</h2>
          <p className="mt-2 text-gray-600">Please sign in to access your dashboard and manage your properties.</p>
          <Link
            to="/auth"
            className="mt-6 inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            Sign In
            <ChevronRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Dashboard Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Welcome back, {profile?.name}!</h1>
              <p className="text-gray-600 mt-1">Here's what's happening with your properties today.</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <button className="p-2 text-gray-600 hover:text-blue-600">
                  <Bell className="h-6 w-6" />
                  <span className="absolute top-0 right-0 h-3 w-3 bg-red-500 rounded-full border-2 border-white"></span>
                </button>
              </div>
              <button 
                onClick={() => setShowSellForm(true)}
                className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="h-5 w-5" />
                <span>List Property</span>
              </button>
            </div>
          </div>
        </div>

        {/* User Profile Card */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="flex-shrink-0">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                <span className="text-3xl font-bold text-white">{profile?.name[0].toUpperCase()}</span>
              </div>
            </div>
            <div className="flex-grow">
              <div className="flex items-center gap-4 mb-2">
                <h2 className="text-2xl font-bold text-gray-900">{profile?.name}</h2>
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                  {profile?.role === 'agent' ? 'Professional Agent' : 'Property Owner'}
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center text-gray-600">
                  <Mail className="h-5 w-5 mr-2" />
                  <span>{profile?.email}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Phone className="h-5 w-5 mr-2" />
                  <span>{profile?.phone || 'Add phone number'}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Briefcase className="h-5 w-5 mr-2" />
                  <span>{properties.length} Properties Listed</span>
                </div>
              </div>
            </div>
            <div className="flex-shrink-0">
              <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <Settings className="h-5 w-5" />
                <span>Edit Profile</span>
              </button>
            </div>
          </div>
        </div>

        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <DashboardCard
            icon={Building2}
            title="Total Properties"
            value={properties.length}
            trend={8}
            subtitle="Active listings"
            color="blue"
          />
          <DashboardCard
            icon={Heart}
            title="Saved Properties"
            value={favorites.length}
            trend={5}
            subtitle="In your wishlist"
            color="red"
          />
          <DashboardCard
            icon={TrendingUp}
            title="Total Views"
            value="2,845"
            trend={12}
            subtitle="Last 30 days"
            color="green"
          />
          <DashboardCard
            icon={MessageSquare}
            title="New Messages"
            value="24"
            subtitle="Unread inquiries"
            color="purple"
          />
        </div>

        {/* Tabs Navigation */}
        <div className="bg-white rounded-xl shadow-sm mb-8">
          <div className="border-b">
            <nav className="flex space-x-8 px-6" aria-label="Tabs">
              {[
                { id: 'overview', label: 'Overview', icon: Home },
                { id: 'properties', label: 'My Properties', icon: Building2 },
                { id: 'favorites', label: 'Favorites', icon: Heart },
                { id: 'messages', label: 'Messages', icon: MessageSquare }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 inline-flex items-center border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <tab.icon className="h-5 w-5 mr-2" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Recent Activity */}
                  <div className="bg-white rounded-lg border p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold">Recent Activity</h3>
                      <button className="text-blue-600 text-sm hover:underline">View All</button>
                    </div>
                    <div className="space-y-4">
                      {[
                        { icon: Heart, text: 'New favorite added', time: '2 hours ago' },
                        { icon: MessageSquare, text: 'New inquiry received', time: '4 hours ago' },
                        { icon: Eye, text: 'Property viewed', time: '6 hours ago' }
                      ].map((activity, i) => (
                        <div key={i} className="flex items-center gap-4">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <activity.icon className="h-4 w-4 text-blue-600" />
                          </div>
                          <div className="flex-grow">
                            <p className="text-gray-700">{activity.text}</p>
                            <p className="text-sm text-gray-500">{activity.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Quick Stats */}
                  <div className="bg-white rounded-lg border p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold">Quick Stats</h3>
                      <button className="text-blue-600 text-sm hover:underline">
                        <Calendar className="h-4 w-4 inline mr-1" />
                        This Month
                      </button>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Total Revenue</span>
                        <span className="text-lg font-semibold">₹45,000</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Active Listings</span>
                        <span className="text-lg font-semibold">{properties.length}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Pending Inquiries</span>
                        <span className="text-lg font-semibold">12</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'properties' && (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-4 px-4 font-semibold text-gray-600">Property</th>
                      <th className="text-left py-4 px-4 font-semibold text-gray-600">Type</th>
                      <th className="text-left py-4 px-4 font-semibold text-gray-600">Price</th>
                      <th className="text-left py-4 px-4 font-semibold text-gray-600">Category</th>
                      <th className="text-left py-4 px-4 font-semibold text-gray-600">Status</th>
                      <th className="text-right py-4 px-4 font-semibold text-gray-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {properties.map((property) => (
                      <tr 
                        key={property.id} 
                        className="border-b last:border-b-0 hover:bg-gray-50 cursor-pointer"
                        onClick={() => handlePropertyClick(property.id)}
                      >
                        <td className="py-4 px-4">
                          <div className="flex items-center space-x-3">
                            <img
                              src={property.images[0] || 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg'}
                              alt={property.title}
                              className="w-12 h-12 rounded-lg object-cover"
                            />
                            <div>
                              <h3 className="font-medium text-gray-900">{property.title}</h3>
                              <p className="text-sm text-gray-500">{property.location}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium
                            ${property.type === 'sale' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                            {property.type === 'sale' ? 'For Sale' : 'For Rent'}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-gray-600">
                          {formatIndianPrice(property.price, property.type)}
                        </td>
                        <td className="py-4 px-4 text-gray-600 capitalize">{property.category}</td>
                        <td className="py-4 px-4">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                            Active
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center justify-end space-x-2" onClick={(e) => e.stopPropagation()}>
                            <button className="p-2 text-gray-600 hover:text-blue-600 rounded-full hover:bg-blue-50">
                              <Edit2 className="h-5 w-5" />
                            </button>
                            <button className="p-2 text-gray-600 hover:text-red-600 rounded-full hover:bg-red-50">
                              <Trash2 className="h-5 w-5" />
                            </button>
                            <button className="p-2 text-gray-600 hover:text-gray-900 rounded-full hover:bg-gray-100">
                              <MoreVertical className="h-5 w-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {properties.length === 0 && (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-gray-500">
                          <div className="flex flex-col items-center">
                            <Building2 className="h-12 w-12 text-gray-400 mb-2" />
                            <p>No properties listed yet.</p>
                            <button
                              onClick={() => setShowSellForm(true)}
                              className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
                            >
                              + Add Your First Property
                            </button>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'favorites' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {favorites.map((favorite) => (
                  favorite.property && (
                    <div
                      key={favorite.id}
                      className="bg-white rounded-lg shadow-sm overflow-hidden border hover:shadow-md transition-shadow"
                    >
                      <img
                        src={favorite.property.images[0] || 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg'}
                        alt={favorite.property.title}
                        className="w-full h-48 object-cover"
                      />
                      <div className="p-4">
                        <h3 className="text-lg font-semibold mb-2">{favorite.property.title}</h3>
                        <p className="text-gray-600 flex items-center mb-2">
                          <MapPin className="h-4 w-4 mr-1" />
                          {favorite.property.location}
                        </p>
                        <div className="flex justify-between items-center">
                          <span className="text-xl font-bold text-blue-600">
                            {formatIndianPrice(favorite.property.price, favorite.property.type)}
                          </span>
                          <button
                            onClick={() => handleRemoveFavorite(favorite.id)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                          >
                            <HeartOff className="h-5 w-5" />
                          </button>
                        </div>
                        <button
                          onClick={() => handlePropertyClick(favorite.property.id)}
                          className="mt-4 w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors"
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  )
                ))}
                {favorites.length === 0 && (
                  <div className="col-span-full text-center py-8">
                    <Heart className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500">No favorite properties yet.</p>
                    <Link
                      to="/properties"
                      className="mt-4 text-blue-600 hover:text-blue-700 font-medium inline-block"
                    >
                      Browse Properties
                    </Link>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'messages' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-4">
                    <h3 className="text-lg font-semibold">Recent Messages</h3>
                    <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                      24 Unread
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="p-2 hover:bg-gray-100 rounded-full">
                      <Filter className="h-5 w-5 text-gray-600" />
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-full">
                      <Search className="h-5 w-5 text-gray-600" />
                    </button>
                  </div>
                </div>
                
                {/* Sample Messages */}
                {[1, 2, 3].map((_, i) => (
                  <div key={i} className="bg-white p-4 rounded-lg border hover:shadow-sm transition-shadow">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <User className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-medium">John Doe</h4>
                          <p className="text-sm text-gray-500">Regarding: Modern Villa</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-500">
                          <Clock className="h-4 w-4 inline mr-1" />
                          2h ago
                        </span>
                        {i === 0 && (
                          <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                        )}
                      </div>
                    </div>
                    <p className="text-gray-600 line-clamp-2">
                      Hi, I'm interested in the property and would like to schedule a viewing...
                    </p>
                    <div className="mt-4 flex justify-end space-x-2">
                      <button className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md">
                        Mark as Read
                      </button>
                      <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                        Reply
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Property Modal */}
      {showSellForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">List Your Property</h2>
              <button 
                onClick={() => setShowSellForm(false)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {formError && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md flex items-center text-red-600">
                <AlertCircle className="h-5 w-5 mr-2" />
                {formError}
              </div>
            )}

            <form onSubmit={handleSellProperty} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Property Title
                </label>
                <input
                  type="text"
                  required
                  value={propertyFormData.title}
                  onChange={(e) => setPropertyFormData({...propertyFormData, title: e.target.value})}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Modern Villa with Ocean View"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  required
                  value={propertyFormData.description}
                  onChange={(e) => setPropertyFormData({...propertyFormData, description: e.target.value})}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={4}
                  placeholder="Describe your property..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="number"
                      required
                      value={propertyFormData.price}
                      onChange={(e) => setPropertyFormData({...propertyFormData, price: e.target.value})}
                      className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter price"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      required
                      value={propertyFormData.location}
                      onChange={(e) => setPropertyFormData({...propertyFormData, location: e.target.value})}
                      className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter location"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Type
                  </label>
                  <select
                    value={propertyFormData.type}
                    onChange={(e) => setPropertyFormData({...propertyFormData, type: e.target.value})}
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="sale">For Sale</option>
                    <option value="rent">For Rent</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    value={propertyFormData.category}
                    onChange={(e) => setPropertyFormData({...propertyFormData, category: e.target.value})}
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="residential">Residential</option>
                    <option value="commercial">Commercial</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bedrooms
                  </label>
                  <input
                    type="number"
                    required
                    value={propertyFormData.bedrooms}
                    onChange={(e) => setPropertyFormData({...propertyFormData, bedrooms: e.target.value})}
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Number of bedrooms"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bathrooms
                  </label>
                  <input
                    type="number"
                    required
                    value={propertyFormData.bathrooms}
                    onChange={(e) => setPropertyFormData({...propertyFormData, bathrooms: e.target.value})}
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Number of bathrooms"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Size (sq ft)
                  </label>
                  <input
                    type="number"
                    required
                    value={propertyFormData.size}
                    onChange={(e) => setPropertyFormData({...propertyFormData, size: e.target.value})}
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Property size in square feet"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Features (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={propertyFormData.features.join(', ')}
                    onChange={(e) => setPropertyFormData({...propertyFormData, features: e.target.value.split(',').map(f => f.trim())})}
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Pool, Garden, Garage"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Image URLs (comma-separated)
                </label>
                <input
                  type="text"
                  value={propertyFormData.images.join(', ')}
                  onChange={(e) => setPropertyFormData({...propertyFormData, images: e.target.value.split(',').map(url => url.trim())})}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter image URLs"
                />
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setShowSellForm(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  disabled={loading}
                >
                  {loading ? 'Listing...' : 'List Property'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}