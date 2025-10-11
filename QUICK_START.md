# Quick Start Guide - Eastern Insight

## 🚀 Setup Your Admin Account (Choose One Method)

### Method 1: Automatic Setup (Easiest) ⭐

1. **Start your server:**
   ```bash
   npm run dev
   ```

2. **Visit the init endpoint:**
   ```
   http://localhost:3000/api/init
   ```

3. **You'll get:**
   - ✅ Categories created
   - ✅ Admin account created
   - 📧 Email: `admin@easterninsight.net`
   - 🔑 Password: `admin123`

4. **Login:**
   ```
   http://localhost:3000/auth/signin
   ```

5. **⚠️ IMPORTANT: Change password immediately!**

---

### Method 2: Custom Admin Account

Run the script:
```bash
node scripts/create-admin.js
```

Follow the prompts and copy the MongoDB command to insert your custom admin.

---

## 📝 Environment Variables

Make sure your `.env.local` has:

```env
MONGODB_URI=your_mongodb_connection_string
NEXTAUTH_SECRET=your_random_secret_key
NEXTAUTH_URL=http://localhost:3000
```

### Generate NEXTAUTH_SECRET:
```bash
# Windows PowerShell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))

# Or Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

---

## 🎯 After Setup

1. ✅ Login at `/auth/signin`
2. ✅ Access editor panel at `/editor`
3. ✅ Create news, videos, opinions
4. ✅ Manage categories
5. ✅ View analytics

---

## 🔐 Default Credentials (if using Method 1)

```
Email: admin@easterninsight.net
Password: admin123
```

**⚠️ Change this immediately after first login!**

---

## 🌐 Production Deployment

1. Set environment variables in your hosting platform
2. Use strong `NEXTAUTH_SECRET`
3. Set `NEXTAUTH_URL=https://www.easterninsight.net`
4. Run `/api/init` once in production
5. Delete or protect the init endpoint after use

---

## 🆘 Troubleshooting

### Can't connect to database?
- Check `MONGODB_URI` is correct
- Whitelist your IP in MongoDB Atlas
- Verify network connectivity

### Login not working?
- Verify user exists in database
- Check password is hashed with bcrypt
- Ensure `NEXTAUTH_SECRET` is set

### Need help?
Check `ACCOUNT_SETUP_GUIDE.md` for detailed instructions.

---

## 📚 Documentation Files

- `ACCOUNT_SETUP_GUIDE.md` - Detailed account setup
- `VIDEO_FIX_SUMMARY.md` - Video page production fix
- `QUICK_START.md` - This file

---

Happy publishing! 🎉
