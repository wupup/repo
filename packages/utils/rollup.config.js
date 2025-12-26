import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'rollup';
import nodeResolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import json from '@rollup/plugin-json';
import terser from '@rollup/plugin-terser';
import alias from '@rollup/plugin-alias';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const dist = path.resolve(__dirname, 'dist');
const src = path.resolve(__dirname, 'src');

export default defineConfig({
  input: './src/app.ts',
  output: [
    {
      file: path.resolve(dist, 'index.cjs.js'),
      format: 'cjs',
      sourcemap: true,
    },
    {
      file: path.resolve(dist, 'index.esm.js'),
      format: 'esm',
      sourcemap: true,
    },
  ],
  plugins: [
    alias({
      entries: [{ find: '@', replacement: src }],
    }),
    nodeResolve({
      preferBuiltins: true,
      extensions: ['.ts', '.js', '.json'],
    }),
    commonjs(),
    json(),
    typescript({
      tsconfig: './tsconfig.json',
      sourceMap: true,
      declaration: true,
      outDir: dist,
    }),
    // eslint-disable-next-line no-undef
    process.env.NODE_ENV === 'production' ? terser() : null,
  ],
  external: ['express', 'axios'],
});
