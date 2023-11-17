// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

const fs = require('fs');
const path = require('path');
const glob = require('glob');
const postcss = require('postcss');
const selectorParser = require('postcss-selector-parser');
const lodash = require('lodash');
const { series } = require('gulp');
const { task } = require('../utils/gulp-utils');
const { writeFile } = require('../utils/files');
const babel = require('@babel/core');
const SCSS = require('postcss-scss');
const workspace = require('../utils/workspace');

module.exports = series(task('build-components-devtools:prepare-mappings', () => build()));

const tokenNameToFiles = {};

async function build() {
  const themeClassic = require('../../lib/style-dictionary/classic/metadata.js');
  const themeVR = require('../../lib/style-dictionary/visual-refresh/metadata/index.js');

  const tokenDescriptionsClassic = createTokenDescriptions(themeClassic);
  const tokenDescriptionsVR = createTokenDescriptions(themeVR);
  const allTokens = [...Object.keys(tokenDescriptionsClassic), ...Object.keys(tokenDescriptionsVR)];
  const allDescriptions = {};
  for (const token of allTokens) {
    const description = tokenDescriptionsClassic[token]?.description;
    const themeable = tokenDescriptionsClassic[token]?.themeable;
    const vrDescription = tokenDescriptionsVR[token]?.description;
    const vrThemeable = tokenDescriptionsVR[token]?.themeable;
    const entry = {
      description,
      themeable,
      vr: {
        description: description !== vrDescription ? vrDescription : undefined,
        themeable: themeable !== vrThemeable ? vrThemeable : undefined,
      },
    };
    if (entry.vr.description === undefined && entry.vr.themeable === undefined) {
      delete entry.vr;
    }
    allDescriptions[token] = entry;
  }

  writeFile(
    path.join(workspace.componentsDevtoolsPath, 'tokens-descriptions.json'),
    JSON.stringify(allDescriptions, null, 2)
  );

  const selectorsMapping = await createSelectorsMapping();
  writeFile(
    path.join(workspace.componentsDevtoolsPath, 'selectors-mapping.json'),
    JSON.stringify(selectorsMapping, null, 2)
  );

  const componentsMapping = createComponentsMapping();
  writeFile(
    path.join(workspace.componentsDevtoolsPath, 'components-mapping.json'),
    JSON.stringify(componentsMapping, null, 2)
  );
}

function createTokenDescriptions(source) {
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
  return publicTokens;
}

async function createSelectorsMapping() {
  const dict = {};
  const files = glob.sync('lib/components/**/*.css');
  for (const file of files) {
    await extract(file, dict);
  }
  return dict;
}

function createComponentsMapping() {
  const stylesToComponents = getStylesToComponentsMapping();

  const result = Object.entries(tokenNameToFiles)
    .flatMap(([token, files]) => [...files].map(file => ({ token, file })))
    .reduce((acc, { token, file }) => {
      if (!acc[token]) {
        acc[token] = new Set();
      }
      if (stylesToComponents[file]) {
        for (const component of stylesToComponents[file]) {
          acc[token].add(component);
        }
      }

      return acc;
    }, {});

  return lodash.mapValues(result, values => [...values]);
}

async function extract(file, dict) {
  const content = fs.readFileSync(file, 'utf-8');
  await postcss([
    tokenExtractor(file, (selector, tokens) => {
      if (!dict[selector]) {
        dict[selector] = { ...tokens };
      } else {
        mergeTokens(dict[selector], tokens);
      }
    }),
  ]).process(content, { from: file }).css; // trigger the getter
}

function tokenExtractor(file, onTokenFound) {
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
        .map(token => {
          const tokenName = lodash.camelCase(token.replace(/^--/, '').replace(/-[\w\d]+$/, ''));

          if (!tokenNameToFiles[tokenName]) {
            tokenNameToFiles[tokenName] = new Set();
          }
          tokenNameToFiles[tokenName].add(file);

          return {
            file,
            name: tokenName,
            cssName: token,
          };
        });
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

function getStylesToComponentsMapping() {
  const files = glob.sync('lib/components/*/index.js');
  const result = {};

  for (const file of files) {
    const component = file.match(/lib\/components\/(.*?)\//)?.[1];
    if (component === 'internal' || component === 'theming') {
      continue;
    }

    const visited = new Set();
    walkJS(file, visited);

    const imports = [...visited.values()]
      .filter(dep => dep.endsWith('.css.js') || dep.endsWith('.scoped.css'))
      .map(dep => path.relative('.', dep).replace('styles.css.js', 'styles.scoped.css'));

    for (const styleImport of imports) {
      if (!result[styleImport]) {
        result[styleImport] = new Set();
      }
      result[styleImport].add(component);
    }
  }

  return lodash.mapValues(result, value => [...value]);
}

function jsVisitor() {
  return {
    visitor: {
      ImportDeclaration(node, state) {
        const { onImportFound } = state.opts;
        const value = node.get('source').node.value;

        if (!value.startsWith('.')) {
          return;
        }
        let resolved = path.resolve(path.dirname(state.file.opts.filename), value);
        if (path.extname(resolved) !== '.js') {
          resolved += '.js';
        }
        if (resolved.endsWith('.css.js')) {
          resolved = resolved.replace(/\.css\.js$/, '.scoped.css');
        }
        onImportFound(resolved);
      },
    },
  };
}

function walkJS(filePath, visited) {
  const deps = [];
  const onImportFound = filePath => {
    if (path.extname(filePath) === '.js') {
      const suffixes = ['.js', '/index.js'];
      const resolved = suffixes
        .map(suffix => filePath.replace(/\.js$/, suffix))
        .find(fileName => fs.existsSync(fileName));
      if (!resolved) {
        return;
      }
      filePath = resolved;
    }
    if (!visited.has(filePath)) {
      visited.add(filePath);
      deps.push(filePath);
    }
  };

  babel.transformFileSync(filePath, {
    babelrc: false,
    configFile: false,
    plugins: [[jsVisitor, { onImportFound }]],
  });
  const subDeps = [];
  for (const dep of deps) {
    const ext = path.extname(dep);
    if (ext === '.css') {
      subDeps.push(...walkSass(dep, visited));
    } else {
      subDeps.push(...walkJS(dep, visited));
    }
  }
  return [...deps, ...subDeps];
}

function sassVisitor(onImportFound) {
  return {
    postcssPlugin: 'imports-collector',
    AtRule(node) {
      if (node.name === 'import' || node.name === 'use') {
        const importPath = node.params
          .replace(/as [\w-]+$/, '')
          .trim()
          .replace(/^(['"])/, '')
          .replace(/(['"])$/, '');
        if (importPath.startsWith('awsui:') || importPath.startsWith('sass:')) {
          return;
        }
        onImportFound(importPath);
      }
    },
  };
}

function walkSass(filePath, visited) {
  const deps = [];
  const onImportFound = importPath => {
    const resolved = path.resolve(path.dirname(filePath), importPath);
    const suffixes = [s => s + '.css', s => path.join(s, 'index.css'), s => s + ''];
    const fileName = suffixes.map(convert => convert(resolved)).find(fileName => fs.existsSync(fileName));
    if (!fileName) {
      throw new Error('what:' + resolved + ', ' + importPath);
    }
    if (!visited.has(fileName)) {
      visited.add(fileName);
      deps.push(fileName);
    }
  };
  const content = fs.readFileSync(filePath);
  postcss([sassVisitor(onImportFound)]).process(content, {
    from: filePath,
    syntax: SCSS,
  }).css; // trigger getter
  const result = [...deps];
  for (const dep of deps) {
    result.push(...walkSass(dep, visited));
  }
  return result;
}
