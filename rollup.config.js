import { resolve } from 'path';
import commonjsPlugin from 'rollup-plugin-commonjs';
import includePathsPlugin from 'rollup-plugin-includepaths';
// import multiInputPlugin from 'rollup-plugin-multi-input';
import peerDepsExternalPlugin from 'rollup-plugin-peer-deps-external';
import resolvePlugin from 'rollup-plugin-node-resolve';
import typescriptPlugin from 'rollup-plugin-typescript2';

export default {
  input: 'src/index.ts',
  output: {
    dir: 'dist',
    format: 'cjs',
    exports: 'named',
    interop: false,
    sourcemap: true,
  },
  plugins: [
    includePathsPlugin({
      include: {},
      paths: ['src/'],
      external: [],
      extensions: ['.js', '.json', '.ts'],
    }),
    peerDepsExternalPlugin({
      packageJsonPath: resolve(__dirname, 'package.json'),
    }),
    // multiInput(),
    resolvePlugin(),
    typescriptPlugin({
      rollupCommonJSResolveHack: true,
      clean: true,
    }),
    commonjsPlugin(),
  ],
};
