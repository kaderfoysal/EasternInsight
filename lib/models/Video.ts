import mongoose, { Document, Schema } from 'mongoose';

export interface IVideo extends Document {
  title: string;
  description?: string;
  youtubeUrl?: string;
  youtubeVideoId?: string;
  thumbnailUrl?: string;
  image?: string;
  category?: string;
  slug: string;
  published: boolean;
  views: number;
  author: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

// Helper function to extract YouTube video ID from URL
function extractYouTubeId(url: string): string {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /^([a-zA-Z0-9_-]{11})$/
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }
  
  return '';
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
    slug = `video-${Date.now()}`;
  }
  
  return slug;
}

const VideoSchema: Schema = new Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  youtubeUrl: {
    type: String,
  },
  youtubeVideoId: {
    type: String,
  },
  thumbnailUrl: {
    type: String,
  },
  image: {
    type: String,
  },
  category: {
    type: String,
    trim: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
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

// Create slug and extract YouTube ID before validation
VideoSchema.pre('validate', function(next) {
  const video = this as any;
  
  // Only generate slug if it's not already set
  if (!video.slug) {
    video.slug = generateSlug(video.title || '');
  }
  
  // Validate that at least one of youtubeUrl or image is provided
  if (!video.youtubeUrl && !video.image) {
    const error = new Error('Either YouTube URL or image is required');
    return next(error);
  }
  
  // Extract YouTube video ID only if YouTube URL is provided
  if (video.youtubeUrl) {
    if (!video.youtubeVideoId) {
      video.youtubeVideoId = extractYouTubeId(video.youtubeUrl);
      
      if (!video.youtubeVideoId) {
        const error = new Error('Invalid YouTube URL');
        return next(error);
      }
    }
    
    // Generate thumbnail URL from YouTube if not provided
    if (video.youtubeVideoId && !video.thumbnailUrl) {
      video.thumbnailUrl = `https://img.youtube.com/vi/${video.youtubeVideoId}/maxresdefault.jpg`;
    }
  }
  
  next();
});

// Index for better performance
VideoSchema.index({ published: 1, createdAt: -1 });
VideoSchema.index({ category: 1, published: 1 });

export default mongoose.models.Video || mongoose.model<IVideo>('Video', VideoSchema);
