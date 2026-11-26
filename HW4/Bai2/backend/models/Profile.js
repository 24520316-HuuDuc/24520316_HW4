import mongoose from 'mongoose';

const profileSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  age: { type: Number, required: true, min: 18 },
  bio: { type: String, default: '' },
  photo: { type: String, default: '' },
});

export default mongoose.model('Profile', profileSchema);
