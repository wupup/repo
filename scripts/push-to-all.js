#!/usr/bin/env node

// 推送到GitHub和Gitee的脚本

import { exec } from 'child_process';

const repos = [
  { name: 'GitHub', remote: 'github' },
  { name: 'Gitee', remote: 'gitee' },
];

async function pushToRepo(repo) {
  return new Promise((resolve, reject) => {
    console.log(`📦 Pushing to ${repo.name}...`);

    exec(`git push ${repo.remote}`, (error, stdout, stderr) => {
      if (error) {
        console.error(`❌ Failed to push to ${repo.name}: ${stderr}`);
        reject(error);
      } else {
        console.log(`✅ Successfully pushed to ${repo.name}`);
        resolve();
      }
    });
  });
}

async function pushToAll() {
  console.log('🚀 Starting push to all repositories...\n');

  try {
    for (const repo of repos) {
      await pushToRepo(repo);
    }
    console.log('\n🎉 All repositories pushed successfully!');
  } catch (error) {
    console.error('\n💥 Failed to push to all repositories');
    process.exit(1);
  }
}

pushToAll();
