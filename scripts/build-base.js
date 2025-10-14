import fs from 'node:fs';
import path from 'node:path';
import URL from 'node:url';

import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

import vue from '@vitejs/plugin-vue';
import typescript from '@rollup/plugin-typescript';
import esbuild from 'rollup-plugin-esbuild';

import scss from 'rollup-plugin-scss';
import postcss from 'rollup-plugin-postcss';

const __filename = URL.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const packageNames = ['utils', 'components'];

function getPackagePath(packageName) {
  return path.resolve(__dirname, '../packages', packageName);
}

function getPackageRoots() {
  return packageNames.map(getPackagePath);
}

async function packageJson(root) {
  const pkgJsonPath = path.resolve(root, 'package.json');
  const content = await fs.promises.readFile(pkgJsonPath, 'utf-8');
  return JSON.parse(content);
}

async function getRollupConfig(pkgRoot) {
  const config = await packageJson(pkgRoot);
  const tsconfigPath = path.resolve(pkgRoot, 'tsconfig.json');
  const { name, formats } = config.buildOptions || {};
  const src = path.resolve(pkgRoot, 'src');
  const entry = path.resolve(pkgRoot, 'src/index.ts');
  const outputDir = path.resolve(pkgRoot, 'dist');

  const rollupOptions = {
    input: entry,
    sourceMap: true,
    // external: Object.keys(config.dependencies || {}).concat(Object.keys(config.peerDependencies || {})),
    external: ['vue'],
    plugins: [
      nodeResolve({
        extensions: ['.js', '.ts', '.vue', '.tsx', '.jsx'],
      }),
      vue({
        template: {
          compilerOptions: {
            nodeTransforms: [
              node => {
                if (node.type === 1 /* NodeTypes.ELEMENT */) {
                  node.props = node.props.filter(prop => {
                    if (prop.type === 6 /* NodeTypes.ATTRIBUTE */) {
                      return prop.name !== 'data-testid';
                    }
                    return true;
                  });
                }
              },
            ],
          },
        },
      }),
      typescript({
        declaration: true,
        declarationMap: true,
        emitDeclarationOnly: true,
        declarationDir: outputDir,
        rootDir: src,
        tsconfig: tsconfigPath,
        compilerOptions: {
          outDir: outputDir,
        },
      }),
      esbuild({
        target: 'es2020',
        tsconfig: tsconfigPath,
        loaders: {
          '.vue': 'ts',
        },
      }),
      commonjs(),
      scss(),
      postcss({
        extract: true,
        minimize: true,
        sourceMap: true,
      }),
    ],
    output: [],
  };

  const output = [];
  for (const format of formats) {
    const outputItem = {
      format,
      file: path.resolve(outputDir, `index.${format}.js`),
      sourcemap: true,
      globals: {
        vue: 'Vue',
      },
      assetFileNames: 'assets/[name]-[hash][extname]',
    };
    if (format === 'iife') {
      outputItem.name = name;
    }
    output.push(outputItem);
  }

  rollupOptions.output = rollupOptions.output.concat(output);

  rollupOptions.watch = {
    include: path.resolve(pkgRoot, 'src/**'),
    exclude: path.resolve(pkgRoot, 'node_modules/**'),
    clearScreen: false,
  };

  return rollupOptions;
}

export async function getRollupConfigs() {
  const roots = getPackageRoots();
  const configs = await Promise.all(roots.map(getRollupConfig));
  const result = {};
  for (let i = 0; i < packageNames.length; i++) {
    result[packageNames[i]] = configs[i];
  }
  return result;
}

export function clearDist(name) {
  console.log(`🧹 Cleaning dist for ${name}...`);
  const distPath = path.resolve(__dirname, '../packages', name, 'dist');
  if (fs.existsSync(distPath)) {
    fs.rmSync(distPath, { recursive: true, force: true });
  }
}
