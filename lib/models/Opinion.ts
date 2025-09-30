import mongoose, { Document, Schema } from 'mongoose';

export interface IOpinion extends Document {
  writerName: string;
  writerImage?: string;
  title: string;
  subtitle?: string;
  opinionImage?: string;
  description: string;
  slug: string;
  excerpt?: string;
  published: boolean;
  views: number;
  author: mongoose.Types.ObjectId;
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
    slug = `opinion-${Date.now()}`;
  }
  
  return slug;
}

const OpinionSchema: Schema = new Schema({
  writerName: {
    type: String,
    required: [true, 'Writer name is required'],
    trim: true,
  },
  writerImage: {
    type: String,
  },
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
  },
  subtitle: {
    type: String,
    trim: true,
  },
  opinionImage: {
    type: String,
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
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
  views: {
    type: Number,
    default: 0,
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Author is required'],
  },
}, {
  timestamps: true,
});

// Create slug from title before validation
OpinionSchema.pre('validate', function(next) {
  const opinion = this as any;
  
  // Only generate slug if it's not already set
  if (!opinion.slug) {
    opinion.slug = generateSlug(opinion.title || '');
  }
  
  // Create excerpt from description if not provided
  if (!opinion.excerpt && opinion.description) {
    try {
      const plainText = opinion.description.replace(/<[^>]*>/g, ''); // Remove HTML tags
      const maxLength = 300;
      
      // If the text is longer than maxLength, truncate it and add ellipsis
      if (plainText.length > maxLength) {
        opinion.excerpt = plainText.substring(0, maxLength - 3) + '...';
      } else {
        opinion.excerpt = plainText;
      }
    } catch (error) {
      console.error('Error generating excerpt:', error);
    }
  }
  
  next();
});

// Index for better performance
OpinionSchema.index({ published: 1, createdAt: -1 });

export default mongoose.models.Opinion || mongoose.model<IOpinion>('Opinion', OpinionSchema);
