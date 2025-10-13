import { watch } from 'rollup';

import { getRollupConfigs } from './build-base.js';

async function dev() {
  const configs = await getRollupConfigs();
  const watchers = [];

  for (const name in configs) {
    const config = configs[name];
    console.log(`👀 Watching ${name}...`);
    const watcher = watch(
      config.output.map(o => ({
        input: config.input,
        plugins: config.plugins,
        external: config.external || [],
        output: o,
        watch: config.watch || {},
      })),
    );

    watchers.push(watcher);
    watcher.on('event', event => {
      if (event.code === 'START') {
        console.log(`👀 Starting watch for ${name}...`);
      } else if (event.code === 'ERROR') {
        console.error(`❌ Error building ${name}:`, event.error);
      } else if (event.code === 'BUNDLE_START') {
        console.log(`🔄 Start building ${name} in ${event.duration}ms.`);
      } else if (event.code === 'BUNDLE_END') {
        console.log(`✅ Finished building ${name} in ${event.duration}ms.`);
      } else if (event.code === 'END') {
        console.log(`🎉 All builds for ${name} completed.`);
      }
    });
  }

  process.on('SIGINT', () => {
    console.log('🛑 Stopping watchers...');
    for (const watcher of watchers) {
      watcher.close();
    }
    process.exit();
  });
}

dev();
