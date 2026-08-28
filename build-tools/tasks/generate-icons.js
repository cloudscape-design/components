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
  // attributes that define their resting shape and can't be stripped away.
  const usesDashMotion = content.includes('pathLength');
  // Shape elements carrying a part class are motion targets whose element type
  // matters (e.g. the calendar corner animates the rect-only `rx` property), so
  // they must not be rewritten into paths.
  const hasAnimatedShape = /<(rect|circle|ellipse|line)[^>]*class="[^"]*awsui-icon-/.test(content);
  const overrides = {};
  if (usesDashMotion) {
    overrides.removeUselessStrokeAndFill = false;
    overrides.mergePaths = false;
  }
  if (hasAnimatedShape) {
    overrides.convertShapeToPath = false;
  }
  const { data } = Svgo.optimize(content, {
    plugins: [
      Object.keys(overrides).length > 0
        ? {
            name: 'preset-default',
            params: { overrides },
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
        name: 'awsuiRenameAttributesForJsx',
        description: 'Rename SVG attributes to their JSX property names',
        type: 'visitor',
        fn: () => ({
          element: {
            enter: node => {
              const jsxNames = {
                class: 'className',
                'stroke-dasharray': 'strokeDasharray',
                'stroke-dashoffset': 'strokeDashoffset',
              };
              for (const [attribute, jsxName] of Object.entries(jsxNames)) {
                if (node.attributes[attribute] !== undefined) {
                  node.attributes[jsxName] = node.attributes[attribute];
                  delete node.attributes[attribute];
                }
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
