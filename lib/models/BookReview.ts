import mongoose, { Document, Schema } from 'mongoose';

export interface IBookReview extends Document {
  title: string;
  authorName?: string;
  reviewer?: mongoose.Types.ObjectId;
  content: string;
  image?: string;
  slug: string;
  excerpt?: string;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}

function generateSlug(title: string): string {
  let slug = title
    .toString()
    .trim()
    .toLowerCase();

  slug = slug.replace(/[\s\u0964\u0965]+/g, '-');
  slug = slug.replace(/[^a-z0-9\u0980-\u09FF-]/g, '');
  slug = slug.replace(/-+/g, '-');
  slug = slug.replace(/^-|-$/g, '');

  return slug || `book-review-${Date.now()}`;
}

function generateExcerpt(content: string, maxLength = 240): string {
  try {
    const plainText = content.replace(/<[^>]*>/g, '');
    return plainText.length > maxLength
      ? `${plainText.substring(0, maxLength - 3)}...`
      : plainText;
  } catch {
    return '';
  }
}

const BookReviewSchema: Schema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    authorName: { type: String, trim: true },
    reviewer: { type: Schema.Types.ObjectId, ref: 'User' },
    content: { type: String, required: true },
    image: { type: String },
    slug: { type: String, required: true, unique: true, lowercase: true },
    excerpt: { type: String, maxlength: 500 },
    published: { type: Boolean, default: true },
  },
  { timestamps: true }
);

BookReviewSchema.pre('validate', function (next) {
  const doc = this as any;
  if (!doc.slug) {
    doc.slug = generateSlug(doc.title || '');
  }
  if (!doc.excerpt && doc.content) {
    doc.excerpt = generateExcerpt(doc.content);
  }
  next();
});

BookReviewSchema.index({ published: 1, createdAt: -1 });

export default mongoose.models.BookReview ||
  mongoose.model<IBookReview>('BookReview', BookReviewSchema);
