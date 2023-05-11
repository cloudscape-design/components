// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const ExampleCode = `
<AppLayout
  navigation={
    <SideNavigation
      header={{text: "Playroom"}}
      items={[{ type: "link", text: "Home", href: "#" }]}
    />
  }
  content={
    <>
      <Alert type="info">This is an alert!</Alert>
    </>
  }
/>
`;

module.exports = {
  components: '../lib/components',
  outputPath: '../lib/static-default/playroom',

  // Optional:
  title: 'Cloudscape Playroom',
  themes: './app/themes.ts',
  //   scope: './playroom/useScope.js',
  widths: [320, 768, 1024],
  port: 9000,
  openBrowser: true,
  paramType: 'search',
  exampleCode: ExampleCode,
  snippets: './app/snippets.tsx',
  frameComponent: './app/frame.tsx',
  typeScriptFiles: ['../src/**/*.{ts,tsx}', '!**/node_modules'],
  webpackConfig: () => ({
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          loader: 'ts-loader',
          include: path.resolve(__dirname, 'app'),
        },
        {
          test: /\.css$/,
          exclude: /node_modules\/(?!@cloudscape-design)/,
          use: [MiniCssExtractPlugin.loader, 'css-loader'],
        },
      ],
    },
    plugins: [new MiniCssExtractPlugin()],
  }),
};
