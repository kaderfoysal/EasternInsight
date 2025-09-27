// import { NextRequest, NextResponse } from 'next/server';
// import { getServerSession } from 'next-auth';
// import { authOptions } from '@/lib/auth';
// import { mkdir, writeFile } from 'fs/promises';
// import { join } from 'path';
// import { v4 as uuidv4 } from 'uuid';

// export async function POST(request: NextRequest) {
//   try {
//     const session = await getServerSession(authOptions);

//     if (!session || !['admin', 'editor'].includes(session.user.role)) {
//       return NextResponse.json(
//         { error: 'Unauthorized' },
//         { status: 401 }
//       );
//     }

//     const data = await request.formData();
//     const file: File | null = data.get('file') as unknown as File;

//     if (!file) {
//       return NextResponse.json(
//         { error: 'No file uploaded' },
//         { status: 400 }
//       );
//     }

//     // Validate file type
//     const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
//     if (!allowedTypes.includes(file.type)) {
//       return NextResponse.json(
//         { error: 'Invalid file type. Only JPEG, PNG, and WebP are allowed.' },
//         { status: 400 }
//       );
//     }

//     // Validate file size (5MB limit)
//     const maxSize = 5 * 1024 * 1024; // 5MB
//     if (file.size > maxSize) {
//       return NextResponse.json(
//         { error: 'File size too large. Maximum size is 5MB.' },
//         { status: 400 }
//       );
//     }

//     const bytes = await file.arrayBuffer();
//     const buffer = Buffer.from(bytes);

//     // Generate unique filename
//     const fileExtension = file.name.split('.').pop();
//     const fileName = `${uuidv4()}.${fileExtension}`;

//     // Save file to public/uploads directory
//     const path = join(process.cwd(), 'public', 'uploads', fileName);
    
//     // Create uploads directory if it doesn't exist
//     const uploadsDir = join(process.cwd(), 'public', 'uploads');
//     await mkdir(uploadsDir, { recursive: true });
//     await writeFile(path, buffer);

//     const fileUrl = `/uploads/${fileName}`;

//     return NextResponse.json({
//       success: true,
//       fileName,
//       fileUrl,
//     });
//   } catch (error) {
//     console.error('Error uploading file:', error);
//     return NextResponse.json(
//       { error: 'Failed to upload file' },
//       { status: 500 }
//     );
//   }
// }


import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';
import { v4 as uuidv4 } from 'uuid';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !['admin', 'editor'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.formData();
    const file = data.get('file') as unknown as File;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Invalid file type. Only JPEG, PNG, and WebP are allowed.' }, { status: 400 });
    }

    // Validate file size (5MB limit)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json({ error: 'File size too large. Maximum size is 5MB.' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Generate unique filename
    const fileExtension = file.name.split('.').pop();
    const fileName = `${uuidv4()}.${fileExtension}`;

    // Upload to Cloudinary
    const result = await new Promise<{ secure_url: string }>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: 'uploads', public_id: fileName.replace(`.${fileExtension}`, '') },
        (error, result) => {
          if (error) reject(error);
          else resolve(result as any);
        }
      );
      Readable.from(buffer).pipe(uploadStream);
    });

    return NextResponse.json({
      success: true,
      fileName,
      fileUrl: result.secure_url,
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 });
  }
}

