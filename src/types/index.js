// Property interface
export const createProperty = (data) => ({
  id: data.id,
  title: data.title,
  description: data.description,
  price: data.price,
  location: data.location,
  type: data.type, // 'rent' | 'sale'
  category: data.category, // 'residential' | 'commercial'
  bedrooms: data.bedrooms,
  bathrooms: data.bathrooms,
  size: data.size,
  images: data.images || [],
  features: data.features || [],
  createdAt: data.createdAt,
  userId: data.userId
});

// User interface
export const createUser = (data) => ({
  id: data.id,
  email: data.email,
  name: data.name,
  phone: data.phone,
  role: data.role, // 'buyer' | 'seller' | 'agent'
  createdAt: data.createdAt
});