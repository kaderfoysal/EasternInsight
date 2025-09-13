import mongoose from 'mongoose';

const MONGO_URI = process.env.DATABASE_URL || 'mongodb://localhost:27017/easterninsight';

if (!MONGO_URI) {
  throw new Error('Please define the DATABASE_URL in .env');
}

let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGO_URI).then((mongoose) => mongoose);
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export default dbConnect;
