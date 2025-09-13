// Simple script to test the articles API endpoint
const fetch = require('node-fetch');

async function testArticlesAPI() {
  try {
    // Test GET articles
    console.log('Testing GET /api/articles');
    const getResponse = await fetch('http://localhost:3000/api/articles');
    console.log('GET Status:', getResponse.status);
    console.log('GET Status Text:', getResponse.statusText);
    const getData = await getResponse.json();
    console.log('GET Response:', getData);

    // Test POST article
    console.log('\nTesting POST /api/articles');
    const postResponse = await fetch('http://localhost:3000/api/articles', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: 'Test Article',
        content: 'This is a test article content',
        categoryId: '68c4377b987d9e670d1b7c55', // You may need to update this ID
        summary: 'Test article summary',
        featuredImage: 'https://example.com/image.jpg',
        published: true
      })
    });

    console.log('POST Status:', postResponse.status);
    console.log('POST Status Text:', postResponse.statusText);
    const postData = await postResponse.text();
    console.log('POST Response:', postData.substring(0, 500)); // Show first 500 chars
  } catch (error) {
    console.error('Error testing API:', error);
  }
}

testArticlesAPI();