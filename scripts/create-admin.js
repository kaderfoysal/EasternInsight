// Quick script to create an admin user
// Run with: node scripts/create-admin.js

const bcrypt = require('bcryptjs');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function createAdmin() {
  console.log('\n=== Create Admin User ===\n');
  
  rl.question('Enter admin name: ', (name) => {
    rl.question('Enter admin email: ', (email) => {
      rl.question('Enter admin password: ', async (password) => {
        
        if (!name || !email || !password) {
          console.error('\n❌ All fields are required!');
          rl.close();
          return;
        }
        
        if (password.length < 6) {
          console.error('\n❌ Password must be at least 6 characters!');
          rl.close();
          return;
        }
        
        const hashedPassword = await bcrypt.hash(password, 10);
        
        console.log('\n✅ Admin user details generated!');
        console.log('\n📋 Copy this MongoDB command:\n');
        console.log('db.users.insertOne({');
        console.log(`  name: "${name}",`);
        console.log(`  email: "${email}",`);
        console.log(`  password: "${hashedPassword}",`);
        console.log('  role: "admin",');
        console.log('  createdAt: new Date(),');
        console.log('  updatedAt: new Date()');
        console.log('})');
        console.log('\n💡 Or use the /api/init endpoint instead!\n');
        
        rl.close();
      });
    });
  });
}

createAdmin();
