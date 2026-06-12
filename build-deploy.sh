#!/bin/bash
echo "Building..."
npm install
npm run build

echo "Preparing deploy package..."
rm -rf deploy
mkdir deploy
cp -r dist deploy/

echo "Installing production dependencies..."
npm ci --omit=dev
cp -r node_modules deploy/

echo "Deploy package size:"
du -sh deploy/

echo "Restoring all dependencies..."
npm install
