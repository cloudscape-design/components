// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const ExampleCode = `
<Function>
  {() => {
    const [value, setValue] = useState("Hello Cloudscape!");
    return (
      <AppLayout
        navigation={
          <SideNavigation
            header={{ text: "Playroom" }}
            items={[{ type: "link", text: "Home", href: "#" }]}
          />
        }
        showTools={false}
        content={<Input value={value} onChange={event => setValue(event.detail.value)} />}
      />
    );
  }}
</Function>
`;

module.exports = {
  components: '../lib/components',
  outputPath: '../lib/static-default/playroom',

  // Optional:
  title: 'Cloudscape Playroom',
  themes: './app/themes.ts',
  scope: './app/scope.ts',
  widths: [1024, 768, 320],
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
