import mongoose, { Schema, type Document } from 'mongoose';

export interface ICategory extends Document {
  name: string;
  slug: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

const CategorySchema = new Schema({
  name: {
    type: String,
    required: [true, 'Category name is required'],
    unique: true,
    trim: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  description: {
    type: String,
    trim: true,
  },
}, {
  timestamps: true,
});

// Improved slug generation
CategorySchema.pre('save', function(this: any, next: (err?: any) => void) {
  const self: any = this;
  
  // Generate slug for new documents or when name is modified
  if (self.isNew || self.isModified('name')) {
    const name: string = self.name || '';
    
    // Generate slug from name
    self.slug = name
      .toLowerCase()
      .replace(/[^\p{L}\p{N}\s-]/gu, '') // Keep letters, numbers, spaces, hyphens
      .trim()
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-'); // Remove consecutive hyphens
    
    // Fallback if slug is empty
    if (!self.slug) {
      self.slug = `category-${Date.now()}`;
    }
  }
  next();
});

export default (mongoose.models.Category as any) || mongoose.model<ICategory>('Category', CategorySchema);