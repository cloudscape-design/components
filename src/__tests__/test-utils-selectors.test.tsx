// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import fs from 'fs';
import glob from 'glob';
import { transformSync, types, PluginObj, NodePath } from '@babel/core';
import { flatten, zip } from 'lodash';

const defaultPlugins = [
  require('@babel/plugin-syntax-typescript'),
  [require('@babel/plugin-syntax-decorators'), { legacy: true }],
] as const;

// The test extracts generated selectors from the compiled output and matches those against the snapshot.
test('test-utils selectors', () => {
  // Find referenced selector files and properties.
  const selectorsFilePathToUsedProperties = new Map<string, Set<string>>();
  for (const file of glob.sync('src/test-utils/selectors/**/*.ts')) {
    extractSelectorProperties(file, (filePath, propertyKey) => {
      const properties = selectorsFilePathToUsedProperties.get(filePath) ?? new Set();
      properties.add(propertyKey);
      selectorsFilePathToUsedProperties.set(filePath, properties);
    });
  }

  // Find referenced selector values.
  const componentToSelectors: Record<string, string[]> = {};
  for (const [filePath, properties] of selectorsFilePathToUsedProperties) {
    extractComponentSelectors(filePath, [...properties], selector => {
      const componentName = getComponentNameFromFilePath(filePath);
      componentToSelectors[componentName] = [...(componentToSelectors[componentName] ?? []), selector].sort();
    });
  }
  expect(componentToSelectors).toMatchSnapshot();
});

function extractSelectorProperties(file: string, onExtract: (filePath: string, propertyKey: string) => void) {
  function extractor(): PluginObj {
    const selectorVars = new Map<string, string>();
    return {
      visitor: {
        // Find import statements for selectors.
        ImportDeclaration(path: NodePath<types.ImportDeclaration>) {
          if (path.node.source.value.endsWith('selectors.js') && path.node.specifiers.length === 1) {
            const specifier = path.node.specifiers[0];
            if (specifier.type === 'ImportDefaultSpecifier') {
              selectorVars.set(specifier.local.name, resolveSelectorsPath(path.node.source.value));
            } else {
              throw new Error('Unsupported styles specifier format');
            }
          }
        },
        // Find selector references and extract used property names.
        MemberExpression(path: NodePath<types.MemberExpression>) {
          function getPropertyName() {
            if (path.node.property.type === 'Identifier') {
              return path.node.property.name;
            } else if (path.node.property.type === 'StringLiteral') {
              return path.node.property.value;
            } else if (path.node.property.type === 'TemplateLiteral') {
              return buildTemplateString(path.node.property);
            } else {
              throw new Error('Unhandled selectors access type.');
            }
          }
          if (path.node.object.type === 'Identifier' && selectorVars.has(path.node.object.name)) {
            const filePath = selectorVars.get(path.node.object.name)!;
            onExtract(filePath, getPropertyName());
          }
        },
      },
    } as PluginObj;
  }
  const source = fs.readFileSync(file, 'utf-8');
  transformSync(source, {
    babelrc: false,
    configFile: false,
    plugins: [...defaultPlugins, extractor],
  })?.code;
}

function extractComponentSelectors(file: string, usedProperties: string[], onExtract: (selector: string) => void) {
  function extractor(): PluginObj {
    return {
      visitor: {
        ObjectProperty(path: NodePath<types.ObjectProperty>) {
          if (path.node.key.type === 'StringLiteral' && matchProperties(usedProperties, path.node.key.value)) {
            if (path.node.value.type === 'StringLiteral') {
              onExtract(trimSelectorHash(path.node.value.value));
            } else {
              throw new Error('Unexpected selector value format');
            }
          }
        },
      },
    } as PluginObj;
  }
  const source = fs.readFileSync(file, 'utf-8');
  transformSync(source, {
    babelrc: false,
    configFile: false,
    plugins: [...defaultPlugins, extractor],
  })?.code;
}

function trimSelectorHash(selector: string) {
  const splitSelector = selector.replace('.', '').split('_');
  if (splitSelector.length >= 5) {
    splitSelector.splice(splitSelector.length - 2, splitSelector.length);
    return splitSelector.join('_');
  }
  return selector;
}

function resolveSelectorsPath(importPath: string) {
  return 'lib/components/' + importPath.replace(/\.\.\//g, '');
}

function getComponentNameFromFilePath(filePath: string) {
  return filePath.match(/lib\/components\/([\w-]+)/)![1];
}

// Build string literal from template string replacing arguments with wildcards ("*").
function buildTemplateString(node: types.TemplateLiteral) {
  let literal = '';
  for (const element of flatten(zip(node.quasis, node.expressions))) {
    if (!element) {
      continue;
    } else if (element.type === 'TemplateElement') {
      literal += element.value.raw;
    } else if (element.type === 'Identifier') {
      literal += '*';
    } else if (element.type === 'NumericLiteral') {
      literal += element.value;
    } else {
      throw new Error('Unhandled template literal structure.');
    }
  }
  return literal;
}

// Match property against the used properties supporting the wildcards ("*").
function matchProperties(usedProperties: string[], property: string) {
  for (const testProperty of usedProperties) {
    if (testProperty === property) {
      return true;
    }
    if (testProperty.includes('*') && new RegExp(testProperty.replace(/\*/g, '.*')).test(property)) {
      return true;
    }
  }
  return false;
}
