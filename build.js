const fs = require('fs');
const { execSync } = require('child_process');

function removeDirectory(path) {
  try {
    fs.rmSync(path, { recursive: true, force: true });
    console.log(`Successfully removed directory: ${path}`);
  } catch (error) {
    console.error(`Error removing directory ${path}:`, error);
  }
}

try {
  // Remove backend directories
  removeDirectory("./backend/target/");
  removeDirectory("./backend/static/");

  // Remove frontend directories
  removeDirectory("./frontend/node_modules/");
  removeDirectory("./frontend/dist/");

  // Docker build command
  try {
    execSync('docker build . -t nuvidchiu/domino-rs --no-cache', { stdio: 'inherit' });
    console.log('Docker image build completed successfully.');
  } catch (error) {
    console.error('Error executing docker build:', error);
  }
} catch (error) {
  console.error('An unexpected error occurred:', error);
  process.exit(1);
}
