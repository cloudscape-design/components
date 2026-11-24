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

// Dev pages that need a second React version in the same page (e.g. a React 19 child frame inside a page that runs
// React 16 or 18) load this entry in an iframe. It sits in its own layer so the `react19` aliases below apply to it and
// to everything it imports without affecting the main page bundle.
const react19ChildEntry = 'react19-child';
const react19Layer = 'react19';
const replaceModule = (from, to) =>
  new NormalModuleReplacementPlugin(from, resource => (resource.request = resource.request.replace(from, to)));

module.exports = ({
  outputPath = 'pages/lib/static/',
  componentsPath,
  designTokensPath,
  globalStylesPath,
  globalStylesIndex = 'index',
  moduleReplacements,
  react18,
  contentHash = isProd,
} = {}) => {
  const mode = process.env.NODE_ENV;
  // The React 19 child entry stays self-contained: sharing vendor chunks with the main entry would mix both React versions.
  const isMainChunk = chunk => chunk.name !== react19ChildEntry;
  return {
    stats: isProd ? 'none' : 'minimal',
    context: path.resolve(__dirname),
    entry: {
      main: './app/index.tsx',
      [react19ChildEntry]: { import: './app/react19-child/index.tsx', layer: react19Layer },
    },
    experiments: { layers: true },
    mode,
    output: {
      path: path.resolve(outputPath),
      publicPath: './',
      filename: contentHash ? '[name].[contenthash].js' : '[name].js',
      chunkFilename: contentHash ? 'chunks/[name].[contenthash].js' : 'chunks/[name].js',
    },
    resolve: {
      extensions: ['.ts', '.tsx', '.js'],
      alias: {
        // rewrite components and design tokens in SASS
        // The NormalModuleReplacementPlugin does not work there
        // https://github.com/webpack-contrib/sass-loader/issues/489
        '~components': componentsPath,
        '~design-tokens': designTokensPath,
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
          include: path.resolve(__dirname),
          exclude: /__tests__/,
          options: {
            compilerOptions: {
              baseUrl: '.',
              paths: {
                '~components': [componentsPath],
                '~components/*': [`${componentsPath}/*`],
                '~design-tokens': [designTokensPath],
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
        {
          issuerLayer: react19Layer,
          resolve: { alias: { react: 'react19', 'react-dom': 'react-dom19' } },
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
            chunks: isMainChunk,
          },
          defaultVendors: {
            test: /\/node_modules\/(?!ace-builds)/,
            name: 'vendor',
            chunks: isMainChunk,
          },
        },
      },
    },
    plugins: [
      new MiniCssExtractPlugin({
        ignoreOrder: true,
        filename: contentHash ? '[name].[contenthash].css' : '[name].css',
        chunkFilename: contentHash ? 'chunks/[id].[contenthash].css' : 'chunks/[id].css',
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
        chunks: ['main'],
      }),
      new HtmlWebpackPlugin({
        template: path.join(__dirname, './app/react19-child/index.html'),
        filename: 'react19-child.html',
        chunks: [react19ChildEntry],
      }),
      replaceModule(/~components/, componentsPath),
      replaceModule(/~design-tokens/, designTokensPath),
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
