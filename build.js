const fs = require('fs');
const { execSync } = require('child_process');

try {
  fs.rmSync("./backend/target/", { recursive: true, force: true });
  fs.rmSync("./backend/static/", { recursive: true, force: true });
  fs.rmSync("./frontend/node_modules/", { recursive: true, force: true });
  fs.rmSync("./frontend/dist/", { recursive: true, force: true });
  execSync('docker buildx build . --platform linux/amd64,linux/arm64 -t nuvidchiu/domino-rs --no-cache', { stdio: 'ignore', stdout: 'pipe' });
} catch (error) {
  console.error('Error building the docker image:', error);
  process.exit(1);
}