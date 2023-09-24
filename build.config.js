import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import terser from '@rollup/plugin-terser';

export default {
  input: 'index.js',
  output: {
    file: 'hexo-dashboard.min.js',
    format: 'cjs',
  },
  plugins: [commonjs(), json()]
};