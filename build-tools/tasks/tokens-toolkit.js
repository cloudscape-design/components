// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

const fs = require('fs');
const path = require('path');
const glob = require('glob');
const postcss = require('postcss');
const selectorParser = require('postcss-selector-parser');
const lodash = require('lodash');
const { task } = require('../utils/gulp-utils');
const { writeFile } = require('../utils/files');
const workspace = require('../utils/workspace');
const themeClassic = require('../../lib/style-dictionary/classic/metadata.js');
const themeVR = require('../../lib/style-dictionary/visual-refresh/metadata/index.js');

module.exports = task('build-tokens-toolkit', () => build());

async function build() {
  buildTokenDescriptionsClassic();
  buildTokenDescriptionsVR();
  await extractMappings();
}

function buildTokenDescriptionsClassic() {
  createTokenDescriptions(themeClassic, path.join(workspace.tokensToolkitPath, 'tokens-descriptions-classic.json'));
}

function buildTokenDescriptionsVR() {
  createTokenDescriptions(themeVR, path.join(workspace.tokensToolkitPath, 'tokens-descriptions-visual-refresh.json'));
}

function createTokenDescriptions(source, targetPath) {
  const entries = Object.values(source).flatMap(tokens => Object.entries(tokens));
  const publicTokens = Object.fromEntries(
    entries
      .filter(([, metadata]) => metadata.public)
      .map(([key, metadata]) => [
        key,
        {
          description: metadata.description,
          themeable: !!metadata.themeable,
        },
      ])
  );
  writeFile(targetPath, JSON.stringify(publicTokens, null, 2));
}

async function extractMappings() {
  const dict = {};
  const files = glob.sync('lib/**/*.css');
  for (const file of files) {
    await extract(file, dict);
  }
  writeFile(path.join(workspace.tokensToolkitPath, 'tokens-mapping.json'), JSON.stringify(dict, null, 2));
}

async function extract(file, dict) {
  const content = fs.readFileSync(file, 'utf-8');
  await postcss([
    tokenExtractor((selector, tokens) => {
      if (!dict[selector]) {
        dict[selector] = { ...tokens };
      } else {
        mergeTokens(dict[selector], tokens);
      }
    }),
  ]).process(content, { from: file }).css; // trigger the getter
}

function tokenExtractor(onTokenFound) {
  return {
    postcssPlugin: 'tokens-collector',
    Rule(node) {
      if (node.parent.type === 'atrule' && node.parent.name === 'keyframes') {
        return;
      }
      const tokens = node.nodes
        .map(decl => {
          return decl.type !== 'comment' && decl.value.match(/var\((.*?)(,.*)*\)/);
        })
        .filter(match => !!match)
        .map(match => match[1])
        .map(token => ({
          name: lodash.camelCase(token.replace(/^--/, '').replace(/-[\w\d]+$/, '')),
          cssName: token,
        }));
      if (tokens.length === 0) {
        return;
      }
      const selector = node.selector.replaceAll(':not(#\\9)', '');
      const pseudos = new Set();
      let processed = selectorParser(tree =>
        tree.walk(item => {
          if (item.type === 'class') {
            item.replaceWith(
              selectorParser.attribute({
                attribute: 'class',
                operator: '*=',
                value: getUnscopedClassName(item.value),
                quoteMark: '"',
              })
            );
            return;
          }
          if (item.type === 'attribute' && item.attribute === 'data-awsui-focus-visible') {
            pseudos.add('focus');
            item.remove();
            return;
          }
          if (item.type === 'pseudo') {
            let name = item.value.replace(/^:+/, '');
            if (name === 'focus-within') {
              name = 'focus';
            }
            if (['active', 'hover', 'focus', 'disabled', 'placeholder'].includes(name)) {
              pseudos.add(name);
              item.remove();
            } else if (
              ['before', 'after', 'last-child', 'first-child', 'empty', 'first-of-type'].includes(name) ||
              name.startsWith('-moz-') ||
              name.startsWith('-ms-') ||
              name.startsWith('-webkit-')
            ) {
              item.remove();
            } else if (name === 'not') {
              // skip, because it will be walked recursively anyway
            } else {
              console.log(item);
            }
          } else if (['selector', 'combinator', 'tag', 'universal'].includes(item.type)) {
            // skip
          } else {
            console.log('unknown type', item);
          }
        })
      ).processSync(selector);
      processed = selectorParser(tree => {
        tree.walkPseudos(item => {
          item.each(subItem => {
            if (subItem.length === 0) {
              subItem.remove();
            }
          });
          if (item.length === 0) {
            item.remove();
          }
        });
        tree.each(item => {
          if (item.last.type === 'combinator') {
            item.append(selectorParser.universal());
          }
        });
      }).processSync(processed);
      const modifier = pseudos.size > 0 ? [...pseudos].sort().join(',') : undefined;
      onTokenFound(processed, { [modifier ?? 'default']: tokens });
    },
  };
}

function getUnscopedClassName(selector) {
  // this regexp resembles the logic of this code in the theming-core package:
  // see src/build/tasks/postcss/generate-scoped-name.ts
  return selector.replace(/awsui_[a-zA-Z0-9_-]+/g, match => {
    return trimContentHash(match);
  });
}

function trimContentHash(className) {
  const splitSelector = className.replace('.', '').split('_');
  if (splitSelector.length >= 5) {
    splitSelector.splice(splitSelector.length - 2, splitSelector.length);
    return splitSelector.join('_');
  }
  return className;
}

function mergeTokens(entry, tokens) {
  for (const [key, value] of Object.entries(tokens)) {
    if (entry[key]) {
      entry[key] = [...entry[key], ...value];
    } else {
      entry[key] = value;
    }
  }
}
