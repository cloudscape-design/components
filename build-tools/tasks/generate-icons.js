// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const Svgo = require('svgo');
const { src, dest, parallel } = require('gulp');
const themes = require('../utils/themes');
const { through, task } = require('../utils/gulp-utils');

// taken from webpack raw-loader: https://github.com/webpack-contrib/raw-loader/blob/master/src/index.js#L14
function escapeContent(source) {
  return JSON.stringify(source)
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029');
}

function getIcon(content) {
  const { data } = Svgo.optimize(content, {
    plugins: [
      'preset-default',
      {
        name: 'addAttributesToSVGElement',
        params: {
          attributes: [{ focusable: 'false' }, { 'aria-hidden': 'true' }],
        },
      },
    ],
  });
  return data;
}

function getModuleContent(icons) {
  return `export default {
  ${icons.map(({ name, content }) => `${escapeContent(name)}: ${escapeContent(content)}`)}
  }`;
}

function generateIconsTask(theme) {
  const srcPath = 'themes/icons/*.svg';
  const destPath = `${theme.outputPath}/icon`;
  const icons = [];
  return task(`generateIcons:${theme.name}`, () =>
    src(srcPath)
      .pipe(
        through(
          file => {
            const icon = getIcon(file.contents.toString());
            icons.push({ content: icon, name: file.stem });
          },
          push => {
            push({
              path: 'icons.d.ts',
              contents: Buffer.from('declare const icons: Record<string, string>;export default icons;', 'utf8'),
            });
            push({
              path: 'icons.js',
              contents: Buffer.from(getModuleContent(icons), 'utf8'),
            });
          }
        )
      )
      .pipe(dest(destPath))
  );
}

module.exports = parallel(themes.map(theme => generateIconsTask(theme)));
