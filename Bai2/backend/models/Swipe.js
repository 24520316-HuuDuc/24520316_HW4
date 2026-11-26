import mongoose from 'mongoose';

const swipeSchema = new mongoose.Schema(
  {
    profileId: { type: mongoose.Schema.Types.ObjectId, ref: 'Profile', required: true },
    type: { type: String, enum: ['LIKE', 'NOPE', 'SUPERLIKE'], required: true },
    direction: { type: String, enum: ['left', 'right', 'up'] },
  },
  { timestamps: true }
);

export default mongoose.model('Swipe', swipeSchema);
