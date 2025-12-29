// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const path = require('path');
const { NormalModuleReplacementPlugin } = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

const isProd = process.env.NODE_ENV === 'production';
const isLocal = !process.env.CI;

const noop = () => ({ apply: () => {} });

const replaceModule = (from, to) =>
  new NormalModuleReplacementPlugin(from, resource => {
    console.log(`Replacing module: ${resource.request} -> ${resource.request.replace(from, to)}`);
    resource.request = resource.request.replace(from, to);
  });

module.exports = ({
  outputPath = 'pages/lib/static/',
  componentsPath,
  designTokensPath,
  globalStylesPath,
  globalStylesIndex = 'index',
  moduleReplacements,
  react18,
} = {}) => {
  const mode = process.env.NODE_ENV;
  return {
    stats: isProd ? 'none' : 'minimal',
    context: path.resolve(__dirname),
    entry: './app/index.tsx',
    mode,
    output: {
      path: path.resolve(outputPath),
      publicPath: './',
      chunkFilename: 'chunks/[name].js',
    },
    resolve: {
      extensions: ['.ts', '.tsx', '.js'],
      alias: {
        // rewrite design tokens in SASS
        // The NormalModuleReplacementPlugin does not work there
        // https://github.com/webpack-contrib/sass-loader/issues/489
        '~design-tokens': designTokensPath,
        // '@cloudscape-design/build-tools/src/test-pages-util': (() => {
        //   const resolved = path.resolve(__dirname, 'lib/dev-pages/pages/shared-utils');
        //   console.log(`Alias resolved: @cloudscape-design/build-tools/src/test-pages-util -> ${resolved}`);
        //   return resolved;
        // })(),
        ...(react18
          ? {
              '~mount': path.resolve(__dirname, './app/mount/react18.ts'),
              react: 'react18',
              'react-dom': 'react-dom18',
              'react-dom/client': 'react-dom18/client',
            }
          : {
              '~mount': path.resolve(__dirname, './app/mount/react16.ts'),
            }),
      },
    },
    devtool: 'source-map',
    cache: isLocal ? { type: 'filesystem', name: react18 ? `${mode}:react18` : `${mode}:react16` } : false,
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          loader: 'ts-loader',
          include: [
            path.resolve(__dirname),
            path.resolve(__dirname, '../', 'lib', 'dev-pages', 'pages', 'shared-utils'),
          ],
          exclude: /__tests__/,
          options: {
            compilerOptions: {
              rootDir: path.resolve(__dirname, '../'),
              baseUrl: '.',
              paths: {
                '~components': [componentsPath],
                '~components/*': [`${componentsPath}/*`],
                '~design-tokens': [designTokensPath],
                '@cloudscape-design/build-tools/src/test-pages-util': ['lib/dev-pages/pages/shared-utils'],
                ...(globalStylesPath ? { '@cloudscape-design/global-styles': [globalStylesPath] } : {}),
                ...(react18
                  ? {
                      '~mount': ['./app/mount/react18.ts'],
                      react: ['node_modules/types-react18'],
                      'react-dom': ['node_modules/types-react-dom18'],
                      'react/jsx-runtime': ['node_modules/types-react18/jsx-runtime'],
                      'react/jsx-dev-runtime': ['node_modules/types-react18/jsx-dev-runtime'],
                    }
                  : {
                      '~mount': ['./app/mount/react16.ts'],
                    }),
              },
            },
          },
        },
        { test: /\.css$/, use: [MiniCssExtractPlugin.loader, 'css-loader'] },
        {
          test: /\.scss$/,
          use: [
            MiniCssExtractPlugin.loader,
            {
              loader: 'css-loader',
              options: { modules: true, esModule: true },
            },
            'sass-loader',
          ],
        },
        {
          test: /\.(png|svg)$/i,
          type: 'asset/resource',
          include: path.resolve(__dirname),
        },
        {
          type: 'asset/source',
          include: path.resolve(__dirname, 'code-editor', 'samples'),
        },
      ],
    },
    optimization: {
      // Use csso instead of cssnano because cssnano can mess up the casing of our CSS Custom property names, see https://github.com/cssnano/cssnano/issues/675
      minimizer: [
        `...`,
        new CssMinimizerPlugin({ minify: CssMinimizerPlugin.cssoMinify, minimizerOptions: { restructure: false } }),
      ],
      splitChunks: {
        cacheGroups: {
          awsui: {
            test: module =>
              module.resource &&
              (module.resource.includes(componentsPath) || module.resource.includes(designTokensPath)) &&
              !module.resource.includes(path.resolve(componentsPath, 'i18n/messages')),
            name: 'awsui',
            chunks: 'all',
          },
          defaultVendors: {
            test: /\/node_modules\/(?!ace-builds)/,
            name: 'vendor',
            chunks: 'all',
          },
        },
      },
    },
    plugins: [
      new MiniCssExtractPlugin({
        ignoreOrder: true,
        filename: '[name].css',
        chunkFilename: 'chunks/[id].css',
      }),
      new CopyWebpackPlugin({
        patterns: [
          {
            from: '**/*',
            to: path.resolve(outputPath, 'ace'),
            context: path.dirname(require.resolve('ace-builds/src-min-noconflict/ace')),
          },
        ],
      }),
      new HtmlWebpackPlugin({
        template: path.join(__dirname, './app/index.html'),
      }),
      replaceModule(/~components/, componentsPath),
      replaceModule(/~design-tokens/, designTokensPath),
      replaceModule(
        /@cloudscape-design\/build-tools\/src\/test-pages-util/,
        (() => {
          const resolved = path.resolve(__dirname, '../lib/dev-pages/pages/shared-utils');
          console.log(`\n=== MODULE REPLACEMENT ===`);
          console.log(`Pattern: @cloudscape-design/build-tools/src/test-pages-util`);
          console.log(`Resolved to: ${resolved}`);
          console.log(`Directory exists: ${require('fs').existsSync(resolved)}`);
          console.log(`=========================\n`);
          return resolved;
        })()
      ),
      globalStylesPath
        ? replaceModule(/@cloudscape-design\/global-styles\/index\.css/, `${globalStylesPath}/${globalStylesIndex}.css`)
        : noop,
      globalStylesPath ? replaceModule(/@cloudscape-design\/global-styles/, globalStylesPath) : noop,
      ...(moduleReplacements || []).map(({ from, to }) => replaceModule(from, to)),
    ],
    devServer: {
      client: {
        overlay: {
          errors: true,
          warnings: true,
          runtimeErrors: false,
        },
      },
      devMiddleware: {
        publicPath: '/',
      },
    },
  };
};
