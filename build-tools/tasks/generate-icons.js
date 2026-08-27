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
  'overflow',
  'pathLength',
  'stroke-dasharray',
  'stroke-dashoffset',
];

function getIcon(iconName, content) {
  // Dash-animated icons (see hover-motion.scss) carry pathLength/stroke-dash*
  // attributes that define their resting shape. Two preset-default
  // optimizations corrupt them: mergePaths fuses same-attribute paths, breaking
  // per-path pathLength normalization, and removeUselessStrokeAndFill strips
  // the dash attributes because the stroke arrives via CSS classes SVGO cannot
  // see. Only these icons opt out, so every other icon keeps its exact previous
  // output.
  const usesDashMotion = content.includes('pathLength');
  const { data } = Svgo.optimize(content, {
    plugins: [
      usesDashMotion
        ? {
            name: 'preset-default',
            params: {
              overrides: {
                removeUselessStrokeAndFill: false,
                mergePaths: false,
              },
            },
          }
        : 'preset-default',
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
          attributes: [{ focusable: 'false' }, { 'aria-hidden': 'true' }, { 'data-awsui-icon-animated': 'true' }],
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
