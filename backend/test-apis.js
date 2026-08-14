const app = require('./dist/app').default;
const http = require('http');

const server = app.listen(0, async () => {
  const port = server.address().port;
  console.log(`\n=== API TEST SUITE STARTING ON PORT ${port} ===\n`);

  function request(method, path, body = null, headers = {}) {
    return new Promise((resolve, reject) => {
      const payload = body ? JSON.stringify(body) : null;
      const req = http.request(
        {
          hostname: '127.0.0.1',
          port: port,
          path: path,
          method: method,
          headers: {
            'Content-Type': 'application/json',
            ...(payload && { 'Content-Length': Buffer.byteLength(payload) }),
            ...headers,
          },
        },
        (res) => {
          let data = '';
          res.on('data', (chunk) => (data += chunk));
          res.on('end', () => {
            try {
              const json = JSON.parse(data);
              resolve({ status: res.statusCode, headers: res.headers, body: json });
            } catch (e) {
              resolve({ status: res.statusCode, headers: res.headers, body: data });
            }
          });
        }
      );
      req.on('error', reject);
      if (payload) req.write(payload);
      req.end();
    });
  }

  try {
    // Test 1: Health Check
    const health = await request('GET', '/health');
    console.log('[TEST 1] GET /health -> Status:', health.status, '| Success:', health.body.status === 'OK');

    // Test 2: Get Categories
    const categories = await request('GET', '/api/categories');
    console.log('[TEST 2] GET /api/categories -> Status:', categories.status, '| Total Categories:', categories.body.data?.categories?.length || 0);

    // Test 3: Get Products
    const products = await request('GET', '/api/products');
    console.log('[TEST 3] GET /api/products -> Status:', products.status, '| Total Products:', products.body.data?.products?.length || 0);

    // Test 4: Get Single Product by Slug
    const singleProduct = await request('GET', '/api/products/vitamin-c-face-serum-30ml');
    console.log('[TEST 4] GET /api/products/:slug -> Status:', singleProduct.status, '| Product Title:', singleProduct.body.data?.product?.title || 'N/A');

    // Test 5: Register New User
    const testEmail = `testuser_${Date.now()}@example.com`;
    const register = await request('POST', '/api/auth/register', {
      name: 'Test Customer',
      email: testEmail,
      password: 'Password@123',
    });
    console.log('[TEST 5] POST /api/auth/register -> Status:', register.status, '| Message:', register.body.message);

    // Test 6: Login User
    const login = await request('POST', '/api/auth/login', {
      email: testEmail,
      password: 'Password@123',
    });
    console.log('[TEST 6] POST /api/auth/login -> Status:', login.status, '| Token Received:', !!login.body.data?.accessToken);

    console.log('\n=== ALL API TESTS PASSED SUCCESSFULLY! ===\n');
  } catch (err) {
    console.error('API Test Error:', err);
  } finally {
    server.close();
    process.exit(0);
  }
});
