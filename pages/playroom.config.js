// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
module.exports = {
  components: '../lib/components/components',
  outputPath: './dist/playroom',

  // Optional:
  title: 'My Awesome Library',
  //   themes: './src/themes',
  //   scope: './playroom/useScope.js',
  widths: [320, 768, 1024],
  port: 9000,
  openBrowser: true,
  paramType: 'search', // default is 'hash'
  exampleCode: '',
  snippets: './playroom/snippets.tsx',
  webpackConfig: () => ({
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          loader: 'ts-loader',
          exclude: /node_modules/,
        },
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader', 'sass-loader'],
          exclude: /node_modules/,
        },
      ],
    },
    resolve: {
      extensions: ['.js', '.ts', '.tsx'],
    },
  }),
};
