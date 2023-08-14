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
  new NormalModuleReplacementPlugin(from, resource => (resource.request = resource.request.replace(from, to)));

module.exports = ({
  outputPath = 'lib/static/',
  componentsPath,
  designTokensPath,
  globalStylesPath,
  globalStylesIndex = 'index',
  moduleReplacements,
} = {}) => {
  return {
    stats: isProd ? 'none' : 'minimal',
    context: path.resolve(__dirname),
    entry: './app/index.tsx',
    mode: process.env.NODE_ENV,
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
      },
    },
    devtool: 'source-map',
    cache: isLocal ? { type: 'filesystem' } : false,
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          loader: 'ts-loader',
          include: path.resolve(__dirname),
          exclude: /__tests__/,
          options: {
            compilerOptions: {
              paths: {
                '~components': [componentsPath],
                '~components/*': [`${componentsPath}/*`],
                '~design-tokens': [designTokensPath],
                ...(globalStylesPath ? { '@cloudscape-design/global-styles': [globalStylesPath] } : {}),
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
      globalStylesPath
        ? replaceModule(/@cloudscape-design\/global-styles\/index\.css/, `${globalStylesPath}/${globalStylesIndex}.css`)
        : noop,
      globalStylesPath ? replaceModule(/@cloudscape-design\/global-styles/, globalStylesPath) : noop,
      ...(moduleReplacements || []).map(({ from, to }) => replaceModule(from, to)),
    ],
    devServer: {
      devMiddleware: {
        publicPath: '/',
      },
    },
  };
};
