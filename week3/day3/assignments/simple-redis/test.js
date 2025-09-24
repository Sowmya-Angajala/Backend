const axios = require('axios');

const BASE_URL = 'http://localhost:3000';

async function testCaching() {
  console.log('=== Redis Caching Demo ===\n');

  try {
    // Test 1: First GET (should cache miss)
    console.log('1. First GET /items (Cache Miss):');
    const response1 = await axios.get(`${BASE_URL}/items`);
    console.log(`   Source: ${response1.data.source}`);
    console.log(`   Items count: ${response1.data.data.length}\n`);

    // Wait a bit
    await new Promise(resolve => setTimeout(resolve, 500));

    // Test 2: Second GET (should cache hit)
    console.log('2. Second GET /items (Cache Hit):');
    const response2 = await axios.get(`${BASE_URL}/items`);
    console.log(`   Source: ${response2.data.source}\n`);

    // Test 3: POST new item (should invalidate cache)
    console.log('3. POST /items (Invalidate Cache):');
    const postResponse = await axios.post(`${BASE_URL}/items`, {
      name: 'New Item',
      description: 'Added via POST'
    });
    console.log(`   Response: ${postResponse.data.message}\n`);

    // Test 4: GET after POST (should cache miss)
    console.log('4. GET /items after POST (Cache Miss):');
    const response3 = await axios.get(`${BASE_URL}/items`);
    console.log(`   Source: ${response3.data.source}`);
    console.log(`   Items count: ${response3.data.data.length}\n`);

    // Test 5: GET again (should cache hit)
    console.log('5. GET /items again (Cache Hit):');
    const response4 = await axios.get(`${BASE_URL}/items`);
    console.log(`   Source: ${response4.data.source}\n`);

    // Test 6: PUT item (should invalidate cache)
    console.log('6. PUT /items/1 (Invalidate Cache):');
    const putResponse = await axios.put(`${BASE_URL}/items/1`, {
      name: 'Updated Item 1'
    });
    console.log(`   Response: ${putResponse.data.message}\n`);

    // Test 7: GET after PUT (should cache miss)
    console.log('7. GET /items after PUT (Cache Miss):');
    const response5 = await axios.get(`${BASE_URL}/items`);
    console.log(`   Source: ${response5.data.source}\n`);

    // Test 8: DELETE item (should invalidate cache)
    console.log('8. DELETE /items/2 (Invalidate Cache):');
    const deleteResponse = await axios.delete(`${BASE_URL}/items/2`);
    console.log(`   Response: ${deleteResponse.data.message}\n`);

    // Test 9: GET after DELETE (should cache miss)
    console.log('9. GET /items after DELETE (Cache Miss):');
    const response6 = await axios.get(`${BASE_URL}/items`);
    console.log(`   Source: ${response6.data.source}`);
    console.log(`   Items count: ${response6.data.data.length}\n`);

    // Test 10: Check cache info
    console.log('10. Cache Information:');
    const cacheInfo = await axios.get(`${BASE_URL}/cache-info`);
    console.log(`   Cache exists: ${cacheInfo.data.exists}`);
    console.log(`   TTL: ${cacheInfo.data.ttl} seconds\n`);

    console.log('=== All tests completed successfully! ===');

  } catch (error) {
    console.error('Error during testing:', error.message);
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  testCaching();
}

module.exports = testCaching;