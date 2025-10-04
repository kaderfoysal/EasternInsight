import mongoose, { Document, Schema } from 'mongoose';

export interface INews extends Document {
  title: string;
  subtitle?: string;
  content: string;
  image?: string;
  imageCaption?: string;
  category: mongoose.Types.ObjectId;
  author: mongoose.Types.ObjectId;
  slug: string;
  excerpt?: string;
  published: boolean;
  featured: boolean;
  views: number;
  priority?: number;
  createdAt: Date;
  updatedAt: Date;
}

// Helper function to generate slug
function generateSlug(title: string): string {
  let slug = title
    .toString()
    .trim()
    .toLowerCase();
  
  // Replace Bengali spaces with hyphens
  slug = slug.replace(/[\s\u0964\u0965]+/g, '-');
  
  // Remove special characters except hyphens, Bengali characters, and alphanumeric
  slug = slug.replace(/[^a-z0-9\u0980-\u09FF-]/g, '');
  
  // Replace multiple hyphens with a single hyphen
  slug = slug.replace(/-+/g, '-');
  
  // Remove leading and trailing hyphens
  slug = slug.replace(/^-|-$/g, '');
  
  // Fallback if slug is empty after processing
  if (!slug) {
    slug = `news-${Date.now()}`;
  }
  
  return slug;
}

const NewsSchema: Schema = new Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
  },
  subtitle: {
    type: String,
    trim: true,
  },
  content: {
    type: String,
    required: [true, 'Content is required'],
  },
  image: {
    type: String,
  },
  imageCaption: {
    type: String,
    trim: true,
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Category is required'],
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Author is required'],
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  excerpt: {
    type: String,
    maxlength: 1000,
  },
  published: {
    type: Boolean,
    default: true,
  },
  featured: {
    type: Boolean,
    default: false,
  },
  views: {
    type: Number,
    default: 0,
  },
  priority: {
    type: Number,
    min: 1,
    default: 9999, // lower number = higher priority; default sinks to bottom
  },
}, {
  timestamps: true,
});

// Create slug from title before validation
NewsSchema.pre('validate', function(next) {
  const news = this as any;
  
  // Only generate slug if it's not already set
  if (!news.slug) {
    news.slug = generateSlug(news.title || '');
  }
  
  // Create excerpt from content if not provided
  if (!news.excerpt && news.content) {
    try {
      const plainText = news.content.replace(/<[^>]*>/g, ''); // Remove HTML tags
      const maxLength = 1000;
      
      // If the text is longer than maxLength, we need to truncate it and add ellipsis
      if (plainText.length > maxLength) {
        // Reserve 3 characters for the ellipsis
        news.excerpt = plainText.substring(0, maxLength - 3) + '...';
      } else {
        news.excerpt = plainText;
      }
    } catch (error) {
      console.error('Error generating excerpt:', error);
    }
  }
  next();
});

// Index for better performance
NewsSchema.index({ category: 1, priority: 1, createdAt: -1 });
NewsSchema.index({ published: 1, featured: 1, priority: 1, createdAt: -1 });

export default mongoose.models.News || mongoose.model<INews>('News', NewsSchema);