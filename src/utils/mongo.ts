import mongoose from 'mongoose';

const MONGO_URI = process.env.DATABASE_URL || 'mongodb://localhost:27017/easterninsight';

if (!MONGO_URI) {
  throw new Error('Please define the DATABASE_URL in .env');
}

// Define a type for the cached mongoose object
interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// Use a type assertion for the global object
declare global {
  var mongoose: MongooseCache | undefined;
}

const cached: MongooseCache = global.mongoose || { conn: null, promise: null };

if (!global.mongoose) {
  global.mongoose = cached;
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