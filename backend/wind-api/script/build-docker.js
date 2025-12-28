#!/usr/bin/env node

// scripts/build-docker.js
import { execSync } from 'node:child_process';
import pkg from '../package.json' with { type: 'json' };

const appVersion = pkg.version;
const imageName = `wind-api-app:${appVersion}`;

console.log(`Building Docker image: ${imageName}`);

execSync(`docker build -t ${imageName} .`, { stdio: 'inherit' });
