# Account Setup Guide

## Initial Admin Account Setup

Your application uses NextAuth with credentials-based authentication. To access the admin panel and create content, you need to set up an initial admin account.

## Prerequisites

1. **MongoDB Connection** - Ensure your MongoDB is connected
2. **Environment Variables** - Make sure `.env.local` has:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   NEXTAUTH_SECRET=your_secret_key_here
   NEXTAUTH_URL=http://localhost:3000  # or your production URL
   ```

## Method 1: Using the Initialization API (Recommended)

### Step 1: Start your development server
```bash
npm run dev
```

### Step 2: Visit the initialization endpoint
Open your browser and go to:
```
http://localhost:3000/api/init
```

This will create a default admin account with:
- **Email:** admin@easterninsight.net
- **Password:** admin123
- **Role:** admin

### Step 3: Change the password immediately
1. Login at: `http://localhost:3000/auth/signin`
2. Go to your profile/settings
3. Change the default password

## Method 2: Using MongoDB Directly

If you prefer to create an account manually:

### Step 1: Generate a hashed password
Run this script to generate a bcrypt hash:

```javascript
// Create a file: scripts/hash-password.js
const bcrypt = require('bcryptjs');

const password = 'your_secure_password';
const hash = bcrypt.hashSync(password, 10);
console.log('Hashed password:', hash);
```

Run it:
```bash
node scripts/hash-password.js
```

### Step 2: Insert into MongoDB
Use MongoDB Compass or mongosh:

```javascript
db.users.insertOne({
  name: "Admin User",
  email: "admin@easterninsight.net",
  password: "YOUR_HASHED_PASSWORD_HERE",
  role: "admin",
  createdAt: new Date(),
  updatedAt: new Date()
})
```

## Method 3: Using the Setup Script (Easiest)

I'll create a setup script for you that you can run once.

## User Roles

Your system has three roles:

1. **admin** - Full access to everything
2. **editor** - Can create/edit content
3. **viewer** - Read-only access

## Environment Variables Needed

Create/update your `.env.local` file:

```env
# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database_name

# NextAuth
NEXTAUTH_SECRET=generate_a_random_secret_key_here
NEXTAUTH_URL=http://localhost:3000

# Production
# NEXTAUTH_URL=https://www.easterninsight.net
```

### Generate NEXTAUTH_SECRET

Run this command to generate a secure secret:

```bash
# On Windows PowerShell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))

# Or use Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

## Troubleshooting

### "Cannot connect to database"
- Check your `MONGODB_URI` is correct
- Ensure your IP is whitelisted in MongoDB Atlas
- Verify network connectivity

### "Invalid credentials"
- Make sure the password is hashed with bcrypt
- Check the email matches exactly
- Verify the user exists in the database

### "Unauthorized" after login
- Check that the user has the correct role
- Verify JWT token is being generated
- Check `NEXTAUTH_SECRET` is set

## Security Best Practices

1. ✅ **Change default passwords immediately**
2. ✅ **Use strong passwords** (minimum 12 characters)
3. ✅ **Keep NEXTAUTH_SECRET secure** and never commit it
4. ✅ **Use different credentials** for production
5. ✅ **Enable 2FA** if implementing in the future
6. ✅ **Regularly rotate secrets**

## Next Steps After Setup

1. Login to the admin panel: `/auth/signin`
2. Create categories for your news
3. Start creating news articles
4. Add videos
5. Manage opinions/editorials

## Production Setup

For production (easterninsight.net):

1. Set environment variables in your hosting platform (Vercel/Netlify)
2. Use a strong, unique `NEXTAUTH_SECRET`
3. Set `NEXTAUTH_URL=https://www.easterninsight.net`
4. Create admin account using the init API or manual method
5. Immediately change default passwords
6. Remove or protect the `/api/init` endpoint after first use
