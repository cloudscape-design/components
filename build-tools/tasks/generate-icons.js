// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const Svgo = require('svgo');
const { src, dest, parallel } = require('gulp');
const themes = require('../utils/themes');
const { through, task } = require('../utils/gulp-utils');

// only the shape attributes are allowed, all styling should be external
const safeAttributes = [
  'xmlns',
  'viewBox',
  'class',
  'd',
  'cx',
  'cy',
  'r',
  'rx',
  'ry',
  'x',
  'y',
  'x1',
  'x2',
  'y1',
  'y2',
  'width',
  'height',
];

function getIcon(iconName, content) {
  const { data } = Svgo.optimize(content, {
    plugins: [
      'preset-default',
      {
        name: 'awsuiValidateAttributes',
        type: 'visitor',
        fn: () => ({
          element: {
            enter: node => {
              for (const attribute of Object.keys(node.attributes)) {
                if (!safeAttributes.includes(attribute)) {
                  throw new Error(`Unexpected attribute ${attribute} in ${iconName}`);
                }
              }
            },
          },
        }),
      },
      {
        name: 'addAttributesToSVGElement',
        params: {
          attributes: [{ focusable: 'false' }, { 'aria-hidden': 'true' }],
        },
      },
      {
        name: 'awsuiClassToClassName',
        description: 'Replace SVG class attribute with className for JSX',
        type: 'visitor',
        fn: () => ({
          element: {
            enter: node => {
              if (node.attributes.class) {
                node.attributes.className = node.attributes.class;
                delete node.attributes.class;
              }
            },
          },
        }),
      },
    ],
  });
  return data;
}

function getModuleContent(icons) {
  return `import React from 'react';
  const icons = {
  ${icons.map(({ name, content }) => `${JSON.stringify(name)}: ${content}`).join(',\n')}
  };
  export default icons;`;
}

function generateIconsTask(theme) {
  const srcPath = 'src/icon/icons/*.svg';
  const destPath = 'src/icon/generated';
  const icons = [];
  return task(`generateIcons:${theme.name}`, () =>
    src(srcPath)
      .pipe(
        through(
          file => {
            const iconName = file.stem;
            const icon = getIcon(iconName, file.contents.toString());
            icons.push({ content: icon, name: iconName });
          },
          push => {
            push({
              path: 'icons.tsx',
              contents: Buffer.from(getModuleContent(icons), 'utf8'),
            });
          }
        )
      )
      .pipe(dest(destPath))
  );
}

module.exports = parallel(themes.map(theme => generateIconsTask(theme)));
