import mongoose from 'mongoose';

const favoriteSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  propertyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property',
    required: true,
  },
}, {
  timestamps: true,
});

// Ensure unique combination of userId and propertyId
favoriteSchema.index({ userId: 1, propertyId: 1 }, { unique: true });

export default mongoose.models.Favorite || mongoose.model('Favorite', favoriteSchema);