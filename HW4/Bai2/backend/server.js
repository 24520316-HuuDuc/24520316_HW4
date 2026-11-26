/**
 * BÀI 2 (Backend) — server.js
 * Modern Express + Mongoose 8 Server
 *  - process.env.MONGODB_URI security
 *  - Không dùng các flag đã bị bỏ: useNewUrlParser / useUnifiedTopology
 *  - async/await GET/POST endpoints
 */
import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import Profile from './models/Profile.js';
import Swipe from './models/Swipe.js';

// 1. Environment Variable Security Guard
//    Không hard-code chuỗi kết nối trong source code
if (!process.env.MONGODB_URI) throw new Error('MONGODB_URI missing');

// 2. Modern Connection Syntax (Zero Deprecated Flags in Mongoose 8)
await mongoose.connect(process.env.MONGODB_URI);
console.log('MongoDB connected');

// Seed dữ liệu mẫu nếu collection còn trống
if ((await Profile.countDocuments()) === 0) {
  await Profile.insertMany([
    { name: 'Lan', age: 22, bio: 'Thích cà phê, ghét drama', photo: 'https://picsum.photos/id/64/400/400' },
    { name: 'Minh', age: 25, bio: 'Code dạo, nấu ăn dở', photo: 'https://picsum.photos/id/91/400/400' },
    { name: 'Hà', age: 23, bio: 'Đi phượt cuối tuần', photo: 'https://picsum.photos/id/177/400/400' },
    { name: 'Tú', age: 27, bio: 'Chỉ hẹn hò, không yêu', photo: 'https://picsum.photos/id/338/400/400' },
    { name: 'Vy', age: 24, bio: 'Mèo là chân ái', photo: 'https://picsum.photos/id/433/400/400' },
  ]);
  console.log('Seeded profiles');
}

const app = express();
app.use(cors());
app.use(express.json());

// 3. Async/Await GET Endpoint (Optimized read via .lean())
app.get('/api/profiles', async (req, res) => {
  try {
    const profiles = await Profile.find().lean();
    res.json(profiles);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 4. Async/Await POST Endpoint with Try/Catch Block
app.post('/api/swipe', async (req, res) => {
  try {
    const record = await Swipe.create(req.body);
    res.status(201).json(record);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server: http://localhost:${PORT}`));
