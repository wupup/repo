import { rollup } from 'rollup';
import terser from '@rollup/plugin-terser';

import { getRollupConfigs, clearDist } from './build-base.js';

async function build() {
  const configs = await getRollupConfigs();

  for (const name in configs) {
    const config = configs[name];
    clearDist(name);
    console.log(`📦 Building ${name}...`);

    const bundle = await rollup({
      input: config.input,
      plugins: [...config.plugins, terser()],
      external: config.external || [],
    });

    const tasks = [];

    for (const output of config.output) {
      tasks.push(bundle.write(output));
    }

    await Promise.all(tasks);
    console.log(`✅ Finished building ${name}.`);
  }
}

build();
