import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './mongodb.js';
import User from './models/User.js';
import Property from './models/Property.js';
import Favorite from './models/Favorite.js';
import { hashPassword, comparePassword, generateToken, verifyToken } from './auth.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Root route
app.get('/', (req, res) => {
  res.json({ 
    message: 'PropertyHub API Server',
    status: 'running',
    endpoints: {
      auth: '/api/auth',
      properties: '/api/properties',
      favorites: '/api/favorites'
    }
  });
});

// Auth middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(403).json({ error: 'Invalid token' });
  }

  req.userId = decoded.userId;
  next();
};

// Auth routes
app.post('/api/auth/signup', async (req, res) => {
  try {
    await connectDB();
    
    const { email, password, name, phone, role } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password and create user
    const hashedPassword = await hashPassword(password);
    const newUser = new User({
      email,
      password: hashedPassword,
      name,
      phone,
      role,
    });

    await newUser.save();
    
    // Generate token
    const token = generateToken(newUser._id);
    const userResponse = {
      id: newUser._id,
      email: newUser.email,
      name: newUser.name,
      phone: newUser.phone,
      role: newUser.role,
    };
    
    res.json({ user: userResponse, token });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/auth/signin', async (req, res) => {
  try {
    await connectDB();
    
    const { email, password } = req.body;
    
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }
    
    // Check password
    const isValidPassword = await comparePassword(password, user.password);
    if (!isValidPassword) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }
    
    // Generate token
    const token = generateToken(user._id);
    const userResponse = {
      id: user._id,
      email: user.email,
      name: user.name,
      phone: user.phone,
      role: user.role,
    };
    
    res.json({ user: userResponse, token });
  } catch (error) {
    console.error('Signin error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Property routes
app.get('/api/properties', authenticateToken, async (req, res) => {
  try {
    await connectDB();
    const properties = await Property.find({ userId: req.userId })
      .sort({ createdAt: -1 });
    res.json(properties);
  } catch (error) {
    console.error('Get properties error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/properties', authenticateToken, async (req, res) => {
  try {
    await connectDB();
    const propertyData = { ...req.body, userId: req.userId };
    const newProperty = new Property(propertyData);
    await newProperty.save();
    res.json(newProperty);
  } catch (error) {
    console.error('Create property error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Favorite routes
app.get('/api/favorites', authenticateToken, async (req, res) => {
  try {
    await connectDB();
    const favorites = await Favorite.find({ userId: req.userId })
      .populate('propertyId');
    
    const validFavorites = favorites.filter(fav => fav.propertyId).map(fav => ({
      id: fav._id,
      property_id: fav.propertyId._id,
      property: fav.propertyId
    }));
    
    res.json(validFavorites);
  } catch (error) {
    console.error('Get favorites error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/favorites', authenticateToken, async (req, res) => {
  try {
    await connectDB();
    const { propertyId } = req.body;
    
    // Check if favorite already exists
    const existingFavorite = await Favorite.findOne({
      userId: req.userId,
      propertyId: propertyId
    });
    
    if (existingFavorite) {
      return res.status(400).json({ error: 'Property already in favorites' });
    }
    
    const newFavorite = new Favorite({
      userId: req.userId,
      propertyId: propertyId
    });
    
    await newFavorite.save();
    res.json(newFavorite);
  } catch (error) {
    console.error('Add favorite error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/favorites/:id', authenticateToken, async (req, res) => {
  try {
    await connectDB();
    await Favorite.findByIdAndDelete(req.params.id);
    res.json({ message: 'Favorite removed' });
  } catch (error) {
    console.error('Remove favorite error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});