// Simple script to test the API endpoint
const fetch = require('node-fetch');

async function testUserCreation() {
  try {
    const response = await fetch('http://localhost:3000/api/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Admin User',
        email: 'admin@example.com',
        password: 'password123',
        role: 'ADMIN'
      })
    });

    console.log('Status:', response.status);
    console.log('Status Text:', response.statusText);
    
    // Get the raw text response instead of trying to parse JSON
    const text = await response.text();
    console.log('Response Text:', text.substring(0, 500)); // Show first 500 chars
  } catch (error) {
    console.error('Error testing API:', error);
  }
}

testUserCreation();