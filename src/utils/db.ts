import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcrypt';

// --- Interfaces ---
export interface IUser {
  _id: string;  // Make sure this is _id, not id
  name: string;
  email: string;
  password: string;
  role: 'USER' | 'WRITER' | 'EDITOR' | 'ADMIN';
  image?: string;
  bio?: string;
  createdAt: Date;
  updatedAt: Date;
}


export interface IArticle {
  _id: string;
  title: string;
  content: string;
  excerpt?: string;
  summary?: string;
  slug: string;
  featuredImage?: string;
  published: boolean;
  featured: boolean;        // New field
  latest: boolean;          // New field
  latestFeatured: boolean;  // New field
  comments: Comment[];     // New field
  authorId: string;
  categoryId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Comment {
  _id?: string;
  authorId: string;
  content: string;
  createdAt: Date;
}


export interface ICategory {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IBanner {
  _id: string;
  title: string;
  subtitle?: string;
  description?: string;
  imageUrl: string;
  linkUrl?: string;
  linkText?: string;
  isActive: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

// --- MongoDB Connection ---
const MONGO_URI = process.env.DATABASE_URL || 'mongodb://localhost:27017/easterninsight';
if (!MONGO_URI) throw new Error('Please define DATABASE_URL in .env');

let cached = (global as any).mongoose;
if (!cached) cached = (global as any).mongoose = { conn: null, promise: null };

async function dbConnect() {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    })
      .then((mongoose) => {
        console.log('MongoDB connected successfully');
        return mongoose;
      })
      .catch((err) => {
        console.error('MongoDB connection error:', err);
        cached.promise = null; // Reset the promise so we can retry
        throw err; // Re-throw to handle in the calling function
      });
  }

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (error) {
    console.error('Failed to establish MongoDB connection:', error);
    // Return a minimal connection object to prevent crashes
    // The actual operations will fail but with more specific errors
    return { connection: { readyState: 0 } };
  }
}

// --- Schemas ---

const userSchema = new mongoose.Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['USER', 'WRITER', 'EDITOR', 'ADMIN'], default: 'USER' },
    image: { type: String },
    bio: { type: String },
  },
  { timestamps: true }
);

const articleSchema = new Schema<IArticle>(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    excerpt: { type: String },
    summary: { type: String },
    slug: { type: String, required: true, unique: true },
    featuredImage: { type: String },
    published: { type: Boolean, default: false },
    featured: { type: Boolean, default: false },
    latest: { type: Boolean, default: false },
    latestFeatured: { type: Boolean, default: false },
    comments: [{
      authorId: { type: String, required: true },
      content: { type: String, required: true },
      createdAt: { type: Date, default: Date.now }
    }],
    authorId: {
      type: String,
      required: true,
      validate: {
        validator: function (v: string) {
          return mongoose.Types.ObjectId.isValid(v);
        },
        message: 'Invalid ObjectId format for authorId'
      }
    },
    categoryId: {
      type: String,
      required: false,
      validate: {
        validator: function (v: string) {
          return !v || mongoose.Types.ObjectId.isValid(v);
        },
        message: 'Invalid ObjectId format for categoryId'
      }
    },
  },
  { timestamps: true }
);

const categorySchema = new mongoose.Schema<ICategory>(
  {
    name: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String },
    image: { type: String },
  },
  { timestamps: true }
);

const bannerSchema = new mongoose.Schema<IBanner>(
  {
    title: { type: String, required: true },
    subtitle: { type: String },
    description: { type: String },
    imageUrl: { type: String, required: true },
    linkUrl: { type: String },
    linkText: { type: String },
    isActive: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// --- Models ---
const User = mongoose.models.User || mongoose.model<IUser>('User', userSchema);
const Article = mongoose.models.Article || mongoose.model<IArticle>('Article', articleSchema);
const Category = mongoose.models.Category || mongoose.model<ICategory>('Category', categorySchema);
const Banner = mongoose.models.Banner || mongoose.model<IBanner>('Banner', bannerSchema);

// --- DB Operations ---
const db = {
  connect: dbConnect,

  // --- Users ---
  // --- Users ---
  async createUser(data: Partial<IUser>) {
    await dbConnect();
    // Hash the password before saving
    if (data.password) {
      const saltRounds = 10;
      data.password = await bcrypt.hash(data.password, saltRounds);
    }
    const user = await User.create(data);
    return user.toObject();
  },

  async findUserByEmail(email: string): Promise<IUser | null> {
    await dbConnect();
    return User.findOne({ email }).lean<IUser | null>();
  },

  async findUserById(id: string): Promise<IUser | null> {
    await dbConnect();
    return User.findById(id).lean<IUser | null>();
  },

  async getAllUsers(): Promise<IUser[]> {
    await dbConnect();
    return User.find().lean<IUser[]>();
  },

  async updateUser(id: string, data: Partial<IUser>) {
    await dbConnect();
    return User.findByIdAndUpdate(id, data, { new: true }).lean<IUser | null>();
  },

  async deleteUser(id: string) {
    await dbConnect();
    const res = await User.findByIdAndDelete(id);
    return !!res;
  },

  // --- Articles ---
  async createArticle(data: Partial<IArticle>): Promise<IArticle> {
    await dbConnect();
    const article = new Article(data);
    return article.save();
  },

  async getArticles(filter: Partial<IArticle> = {}, limit?: number, skip?: number): Promise<IArticle[]> {
    await dbConnect();
    let query = Article.find(filter).sort({ createdAt: -1 });

    if (limit) query = query.limit(limit);
    if (skip) query = query.skip(skip);

    return query.lean<IArticle[]>();
  },

  async countArticles(filter: Partial<IArticle> = {}): Promise<number> {
    await dbConnect();
    return Article.countDocuments(filter);
  },

  async getArticleById(id: string): Promise<IArticle | null> {
    await dbConnect();
    return Article.findById(id).lean<IArticle | null>();
  },

  async getArticleBySlug(slug: string): Promise<IArticle | null> {
    await dbConnect();
    return Article.findOne({ slug }).lean<IArticle | null>();
  },

  async updateArticle(id: string, data: Partial<IArticle>) {
    await dbConnect();
    return Article.findByIdAndUpdate(id, data, { new: true }).lean<IArticle | null>();
  },

  async deleteArticle(id: string) {
    await dbConnect();
    const res = await Article.findByIdAndDelete(id);
    return !!res;
  },

  // New function to add comments
  async addComment(articleId: string, comment: { authorId: string, content: string }): Promise<IArticle | null> {
    await dbConnect();
    return Article.findByIdAndUpdate(
      articleId,
      { $push: { comments: comment } },
      { new: true }
    ).lean<IArticle | null>();
  },
  // --- Categories ---
  async createCategory(data: Partial<ICategory>) {
    await dbConnect();
    const category = await Category.create(data);
    return category.toObject();
  },

  async getCategories(): Promise<ICategory[]> {
    await dbConnect();
    return Category.find().lean<ICategory[]>();
  },

  async getCategoryById(id: string): Promise<ICategory | null> {
    await dbConnect();
    return Category.findById(id).lean<ICategory | null>();
  },

  async getCategoryBySlug(slug: string): Promise<ICategory | null> {
    await dbConnect();
    return Category.findOne({ slug }).lean<ICategory | null>();
  },

  async findCategoryByName(name: string): Promise<ICategory | null> {
    await dbConnect();
    return Category?.findOne({ name }).lean<ICategory | null>();
  },

  async updateCategory(id: string, data: Partial<ICategory>) {
    await dbConnect();
    return Category.findByIdAndUpdate(id, data, { new: true }).lean<ICategory | null>();
  },

  async deleteCategory(id: string) {
    await dbConnect();
    const res = await Category.findByIdAndDelete(id);
    return !!res;
  },

  // --- Banners ---
  async createBanner(data: Partial<IBanner>) {
    await dbConnect();
    const banner = await Banner.create(data);
    return banner.toObject();
  },

  async getBanners(filter: Partial<IBanner> = {}): Promise<IBanner[]> {
    await dbConnect();
    return Banner?.find(filter).sort({ order: 1 }).lean<IBanner[]>();
  },

  async getBannerById(id: string): Promise<IBanner | null> {
    await dbConnect();
    return Banner?.findById(id).lean<IBanner | null>();
  },

  async updateBanner(id: string, data: Partial<IBanner>) {
    await dbConnect();
    return Banner?.findByIdAndUpdate(id, data, { new: true }).lean<IBanner | null>();
  },

  async deleteBanner(id: string) {
    await dbConnect();
    const res = await Banner?.findByIdAndDelete(id);
    return !!res;
  },
};

export default db;