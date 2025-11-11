// Simple test script to verify the setup
const http = require('http');

console.log('🧪 Testing AssetDrop Lite Setup...\n');

// Test backend health
const testBackend = () => {
  return new Promise((resolve) => {
    const req = http.get('http://localhost:3001/api/health', (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          if (response.status === 'OK') {
            console.log('✅ Backend server is running on port 3001');
            resolve(true);
          } else {
            console.log('❌ Backend health check failed');
            resolve(false);
          }
        } catch (e) {
          console.log('❌ Backend response parsing failed');
          resolve(false);
        }
      });
    });

    req.on('error', () => {
      console.log('❌ Backend server is not running on port 3001');
      console.log('   Please run: cd backend && npm run dev');
      resolve(false);
    });

    req.setTimeout(3000, () => {
      console.log('❌ Backend server connection timeout');
      resolve(false);
    });
  });
};

// Test frontend
const testFrontend = () => {
  return new Promise((resolve) => {
    const req = http.get('http://localhost:3000', (res) => {
      if (res.statusCode === 200) {
        console.log('✅ Frontend server is running on port 3000');
        resolve(true);
      } else {
        console.log('❌ Frontend server returned status:', res.statusCode);
        resolve(false);
      }
    });

    req.on('error', () => {
      console.log('❌ Frontend server is not running on port 3000');
      console.log('   Please run: cd frontend && npm start');
      resolve(false);
    });

    req.setTimeout(3000, () => {
      console.log('❌ Frontend server connection timeout');
      resolve(false);
    });
  });
};

// Run tests
const runTests = async () => {
  const backendOk = await testBackend();
  const frontendOk = await testFrontend();

  console.log('\n📋 Setup Summary:');
  console.log('================');
  
  if (backendOk && frontendOk) {
    console.log('🎉 All systems are running!');
    console.log('\n🌐 Access your application:');
    console.log('   Frontend: http://localhost:3000');
    console.log('   Backend API: http://localhost:3001');
    console.log('\n🔐 Demo Credentials:');
    console.log('   Admin: admin@heyalec.com / admin123');
    console.log('   User: any email / any password');
    console.log('\n✨ You can now test the full functionality!');
  } else {
    console.log('⚠️  Some services are not running. Please check the errors above.');
  }
};

runTests();
