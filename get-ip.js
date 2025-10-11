import os from 'os';

function getLocalIP() {
  const interfaces = os.networkInterfaces();
  
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      // Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
      if (iface.family === 'IPv4' && !iface.internal) {
        console.log(`\n🌐 Your computer's IP address: ${iface.address}`);
        console.log(`📱 Update your .env file with: VITE_API_URL=http://${iface.address}:5000/api`);
        console.log(`🔧 Then restart your frontend development server`);
        return iface.address;
      }
    }
  }
  
  console.log('❌ Could not find network IP address');
  return null;
}

console.log('🔍 Finding your computer\'s IP address for mobile access...');
getLocalIP();
