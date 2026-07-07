import mongoose, { Schema, type Document } from 'mongoose';

export interface ICategory extends Document {
  name: string;
  slug: string;
  description?: string;
  serial: number;
  parentSlug?: string;   // null = top-level, set = subcategory
  isDropdown?: boolean;  // true = parent with dropdown children
  createdAt: Date;
  updatedAt: Date;
}

const CategorySchema = new Schema({
  name: {
    type: String,
    required: [true, 'Category name is required'],
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
  serial: {
    type: Number,
    required: true,
    min: 1,
  },
  parentSlug: {
    type: String,
    default: null,
  },
  isDropdown: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

// Slug generator
CategorySchema.pre('save', function(this: any, next: (err?: any) => void) {
  if (this.isNew || this.isModified('name')) {
    const name: string = this.name || '';
    this.slug = name
      .toLowerCase()
      .replace(/[^\p{L}\p{N}\s-]/gu, '')
      .trim()
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
    if (!this.slug) {
      this.slug = `category-${Date.now()}`;
    }
  }
  next();
});

export default (mongoose.models.Category as any) || mongoose.model<ICategory>('Category', CategorySchema);
