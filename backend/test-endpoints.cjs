const http = require('http');

function request(method, path, data, cookie) {
  return new Promise((resolve, reject) => {
    const postData = data ? JSON.stringify(data) : '';
    const options = {
      hostname: 'localhost',
      port: 7002,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    if (cookie) {
      options.headers['Cookie'] = cookie;
    }

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        let setCookie = res.headers['set-cookie'] ? res.headers['set-cookie'][0] : null;
        resolve({
          statusCode: res.statusCode,
          body: JSON.parse(body || '{}'),
          cookie: setCookie ? setCookie.split(';')[0] : cookie
        });
      });
    });

    req.on('error', e => reject(e));
    if (data) req.write(postData);
    req.end();
  });
}

async function runTests() {
  console.log('Testing Endpoints...');
  let cookie = null;

  // 1. Register User
  console.log('\n--- 1. Register User ---');
  let res = await request('POST', '/rest/onboardings/register', { name: 'Admin User', email: 'admin@org.com', password: 'password123' });
  console.log(res.statusCode, res.body);
  if (res.cookie) cookie = res.cookie;

  // If already registered, let's login
  if (res.statusCode !== 201) {
      console.log('\n--- 2. Login User ---');
      res = await request('POST', '/rest/onboardings/login', { email: 'admin@org.com', password: 'password123' });
      console.log(res.statusCode, res.body);
      if (res.cookie) cookie = res.cookie;
  }

  // 3. Create Reimbursement
  console.log('\n--- 3. Create Reimbursement ---');
  res = await request('POST', '/rest/reimbursements', { title: 'Test Expense', amount: 150.5, description: 'Travel' }, cookie);
  console.log(res.statusCode, res.body);

  // 4. Get Reimbursements
  console.log('\n--- 4. Get Reimbursements ---');
  res = await request('GET', '/rest/reimbursements', null, cookie);
  console.log(res.statusCode, res.body);

  // 5. Logout
  console.log('\n--- 5. Logout ---');
  res = await request('POST', '/rest/onboardings/logout', null, cookie);
  console.log(res.statusCode, res.body);
  
  console.log('\nAll tests completed.');
}

runTests().catch(console.error);
