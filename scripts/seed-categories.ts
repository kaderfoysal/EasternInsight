/**
 * Seed script: Clears all categories and inserts from data/categories.json
 * Run: npx ts-node --transpile-only scripts/seed-categories.ts
 */
import mongoose from 'mongoose';
import * as fs from 'fs';
import * as path from 'path';

// Read and apply Category model
const CategorySchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, lowercase: true },
  description: { type: String, trim: true },
  serial: { type: Number, required: true, min: 1 },
  parentSlug: { type: String, default: null },
  isDropdown: { type: Boolean, default: false },
}, { timestamps: true });

const Category = (mongoose.models.Category as any) || mongoose.model('Category', CategorySchema);

async function seed() {
  const MONGODB_URI = process.env.MONGODB_URI;
  if (!MONGODB_URI) {
    console.error('❌ MONGODB_URI not set in environment');
    process.exit(1);
  }

  await mongoose.connect(MONGODB_URI);
  console.log('✅ Connected to MongoDB');

  // Delete ALL existing categories
  const deleted = await Category.deleteMany({});
  console.log(`🗑️  Deleted ${deleted.deletedCount} existing categories`);

  // Load JSON
  const dataPath = path.join(__dirname, '../data/categories.json');
  const raw = fs.readFileSync(dataPath, 'utf-8');
  const categories = JSON.parse(raw);

  // Insert new categories
  const result = await Category.insertMany(categories);
  console.log(`✅ Inserted ${result.length} categories`);

  // Print summary
  const parents = categories.filter((c: any) => !c.parentSlug);
  const children = categories.filter((c: any) => c.parentSlug);
  console.log(`   📂 ${parents.length} top-level categories`);
  console.log(`   📁 ${children.length} subcategories`);

  await mongoose.disconnect();
  console.log('✅ Done');
}

seed().catch(err => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
