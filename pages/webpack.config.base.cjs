// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const path = require('path');
const { NormalModuleReplacementPlugin } = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const { getReactVersion } = require('./webpack.react-versions.cjs');

const isProd = process.env.NODE_ENV === 'production';
const isLocal = !process.env.CI;

const noop = () => ({ apply: () => {} });

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
  reactVersion = react18 ? '18' : undefined,
  contentHash = isProd,
} = {}) => {
  const mode = process.env.NODE_ENV;
  const react = getReactVersion(reactVersion);
  const mountPath = `./app/mount/${react.mount}`;
  return {
    stats: isProd ? 'none' : 'minimal',
    context: path.resolve(__dirname),
    entry: './app/index.tsx',
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
        '~mount': path.resolve(__dirname, mountPath),
        ...(react.packages
          ? {
              react: react.packages.react,
              'react-dom': react.packages.reactDom,
              'react-dom/client': `${react.packages.reactDom}/client`,
            }
          : {}),
      },
    },
    devtool: 'source-map',
    cache: isLocal ? { type: 'filesystem', name: `${mode}:react${react.version}` } : false,
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
                '~mount': [mountPath],
                ...(react.types
                  ? {
                      react: [`node_modules/${react.types.react}`],
                      'react-dom': [`node_modules/${react.types.reactDom}`],
                      'react/jsx-runtime': [`node_modules/${react.types.react}/jsx-runtime`],
                      'react/jsx-dev-runtime': [`node_modules/${react.types.react}/jsx-dev-runtime`],
                    }
                  : {}),
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
