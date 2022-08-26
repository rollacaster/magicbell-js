/* global require */
/* global process */
import commonjs from '@rollup/plugin-commonjs';
import nodeResolve from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import alias from 'rollup-plugin-alias';
import copy from 'rollup-plugin-copy';
import license from 'rollup-plugin-license';
import serve from 'rollup-plugin-serve';
import { terser } from 'rollup-plugin-terser';
import typescript from 'rollup-plugin-typescript2';
import pkg from './package.json';
import { execSync } from 'child_process';

const isProduction = process.env.NODE_ENV === 'production';

const revision = execSync(`git rev-parse HEAD`).toString('utf-8');

export default [
  {
    input: 'src/index.tsx',
    context: 'this',
    plugins: [
      alias({
        entries: [
          { find: 'react', replacement: require.resolve('preact/compat') },
          { find: 'react-dom', replacement: require.resolve('preact/compat') },
          { find: 'axios', replacement: require.resolve('redaxios') },
        ],
      }),
      nodeResolve({ browser: true }),
      typescript({
        rollupCommonJSResolveHack: true,
        useTsconfigDeclarationDir: true,
        clean: true,
      }),
      commonjs({
        // use a regex to make sure to include eventual hoisted packages
        include: /\/node_modules\//,
      }),
      replace({
        // eslint-disable-next-line no-undef
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
        __CODE_VERSION__: JSON.stringify(revision),
        preventAssignment: true,
      }),
      !isProduction &&
        serve({
          contentBase: ['public', 'dist'],
          headers: {
            'Access-Control-Allow-Origin': '*',
          },
        }),
      isProduction &&
        terser({
          ecma: 2015,
        }),
      isProduction &&
        license({
          banner: `MagicBell JavaScript Library <%= pkg.version %>\nhttps://magicbell.io\nCopyright <%= new Date().getFullYear() %>, MagicBell Inc.`,
        }),
      copy({
        targets: [
          { src: 'public/index.html', dest: 'dist' },
          { src: 'public/images/**/*', dest: 'dist/images' },
          { src: 'public/fonts/**/*', dest: 'dist/fonts' },
        ],
      }),
    ],
    output: [
      {
        name: 'MagicBell',
        file: 'dist/magicbell.min.js',
        format: 'umd',
        sourcemap: true,
      },
      {
        name: 'MagicBell',
        file: 'dist/magicbell.esm.js',
        format: 'esm',
        sourcemap: true,
      },
    ],
  },
  {
    input: 'src/web_push_notifications/service-worker.ts',
    plugins: [
      alias({
        entries: [{ find: 'axios', replacement: require.resolve('redaxios') }],
      }),
      nodeResolve({ browser: true }),
      typescript({
        rollupCommonJSResolveHack: true,
        useTsconfigDeclarationDir: true,
        clean: true,
      }),
      commonjs({
        // use a regex to make sure to include eventual hoisted packages
        include: /\/node_modules\//,
      }),
      terser({
        ecma: 2015,
      }),
      license({
        banner: `MagicBell JavaScript Library <%= pkg.version %>\nhttps://magicbell.io\nCopyright <%= new Date().getFullYear() %>, MagicBell Inc.`,
      }),
    ],
    output: [
      {
        file: 'dist/web-push-notifications/sw.js',
        format: 'cjs',
        sourcemap: true,
      },
    ],
  },
];
