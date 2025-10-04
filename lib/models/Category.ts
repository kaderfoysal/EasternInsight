import mongoose, { Schema, type Document } from 'mongoose';

export interface ICategory extends Document {
  name: string;
  slug: string;
  description?: string;
  serial: number;   // <-- Added
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
  serial: {
    type: Number,
    required: true,
    min: 1,
    unique: true, // optional, ensures no duplicate serials
  },
}, {
  timestamps: true,
});

// Slug generator (same as before)
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
