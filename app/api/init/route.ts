import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Category from '@/lib/models/Category';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    // Check if categories exist
    const categoriesCount = await Category.countDocuments();
    
    if (categoriesCount === 0) {
      // Create initial categories
      const initialCategories = [
        { name: 'জাতীয় সংবাদ', slug: 'national', description: 'জাতীয় সংবাদ ও ঘটনাবলী' },
        { name: 'রাজনীতি', slug: 'politics', description: 'রাজনৈতিক খবর ও বিশ্লেষণ' },
        { name: 'ব্যবসা', slug: 'business', description: 'ব্যবসা ও অর্থনীতি সংক্রান্ত খবর' },
        { name: 'ক্রীড়া', slug: 'sports', description: 'খেলাধুলা ও ক্রীড়া জগতের খবর' },
        { name: 'বিনোদন', slug: 'entertainment', description: 'বিনোদন জগতের খবর ও গসিপ' },
        { name: 'প্রযুক্তি', slug: 'technology', description: 'প্রযুক্তি ও বিজ্ঞান সংক্রান্ত খবর' },
        { name: 'আন্তর্জাতিক', slug: 'international', description: 'আন্তর্জাতিক খবর ও ঘটনাবলী' },
        { name: 'স্বাস্থ্য', slug: 'health', description: 'স্বাস্থ্য ও চিকিৎসা সংক্রান্ত খবর' },
        { name: 'শিক্ষা', slug: 'education', description: 'শিক্ষা সংক্রান্ত খবর ও তথ্য' },
        { name: 'খাদ্য', slug: 'food', description: 'খাদ্য ও রন্ধনশৈলী সংক্রান্ত খবর' },
      ];
      
      await Category.insertMany(initialCategories);
      return NextResponse.json({ message: 'Categories initialized successfully' });
    }
    
    return NextResponse.json({ message: 'Categories already exist' });
  } catch (error) {
    console.error('Error initializing categories:', error);
    return NextResponse.json(
      { error: 'Failed to initialize categories' },
      { status: 500 }
    );
  }
}