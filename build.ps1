rm backend/target -Recurse -Force
rm backend/static -Recurse -Force
rm frontend/dist -Recurse -Force
rm frontend/node_modules -Recurse -Force
docker build . -t domino-rs