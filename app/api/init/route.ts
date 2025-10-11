import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Category from '@/lib/models/Category';
import User from '@/lib/models/User';
import bcrypt from 'bcryptjs';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    const results: any = {
      categories: null,
      adminUser: null,
    };

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
      results.categories = 'Created successfully';
    } else {
      results.categories = 'Already exist';
    }

    // Check if admin user exists
    const adminExists = await User.findOne({ role: 'admin' });
    
    if (!adminExists) {
      // Create default admin user
      const hashedPassword = await bcrypt.hash('admin123', 10);
      
      const adminUser = await User.create({
        name: 'Admin User',
        email: 'admin@easterninsight.net',
        password: hashedPassword,
        role: 'admin',
      });
      
      results.adminUser = {
        message: 'Admin user created successfully',
        email: 'admin@easterninsight.net',
        password: 'admin123',
        warning: '⚠️ IMPORTANT: Change this password immediately after first login!',
      };
    } else {
      results.adminUser = {
        message: 'Admin user already exists',
        email: adminExists.email,
      };
    }
    
    return NextResponse.json({
      success: true,
      results,
      nextSteps: [
        '1. Login at /auth/signin',
        '2. Change the default password immediately',
        '3. Start creating content',
      ],
    });
  } catch (error) {
    console.error('Error during initialization:', error);
    return NextResponse.json(
      { 
        error: 'Failed to initialize',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}