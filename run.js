const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

try {
  execSync('cd frontend && npm install && npm run build', { stdio: 'inherit' });
} catch (error) {
  console.error('Error building the frontend:', error);
  process.exit(1);
}
fs.renameSync(path.join(__dirname, 'frontend', 'dist'), path.join(__dirname, 'backend', 'static'));
try {
  // Change directory to backend and run cargo build --release
  execSync('cd backend && cargo build --release', { stdio: 'inherit' });
  console.log('Cargo build completed successfully.');
} catch (error) {
  console.error('Error building the backend:', error);
  process.exit(1); // Exit with an error code
}