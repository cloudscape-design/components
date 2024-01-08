// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import fs from 'fs';
import glob from 'glob';
import { transformSync, types, PluginObj, NodePath } from '@babel/core';
import { flatten, zip } from 'lodash';

const defaultPlugins = [require('@babel/plugin-syntax-typescript')] as const;

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
  function getPropertyName(path: NodePath<types.MemberExpression>) {
    if (path.node.property.type === 'Identifier') {
      return path.node.property.name;
    } else if (path.node.property.type === 'StringLiteral') {
      return path.node.property.value;
    } else if (path.node.property.type === 'TemplateLiteral') {
      return buildTemplateString(path.node.property);
    } else {
      throw new Error(`Unhandled selector access type at ${file}:${path.node.loc?.start.line}.`);
    }
  }

  // Build string literal from template string replacing arguments with wildcards ("*").
  // For example, a template string `flash-type-${statusType}` becomes "flash-type-*".
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
        throw new Error(`Unhandled template literal type at ${file}:${node.loc?.start.line}.`);
      }
    }
    return literal;
  }

  function extractor(): PluginObj {
    const selectorToFilePath = new Map<string, string>();
    return {
      visitor: {
        // Find import statements for selectors.
        ImportDeclaration(path: NodePath<types.ImportDeclaration>) {
          if (path.node.source.value.endsWith('selectors.js') && path.node.specifiers.length === 1) {
            const specifier = path.node.specifiers[0];
            if (specifier.type === 'ImportDefaultSpecifier') {
              selectorToFilePath.set(specifier.local.name, resolveSelectorsPath(path.node.source.value));
            } else {
              throw new Error(`Unhandled styles import type at ${file}:${path.node.loc?.start.line}.`);
            }
          }
        },
        // Find selector references and extract used property names.
        MemberExpression(path: NodePath<types.MemberExpression>) {
          if (path.node.object.type === 'Identifier' && selectorToFilePath.has(path.node.object.name)) {
            onExtract(selectorToFilePath.get(path.node.object.name)!, getPropertyName(path));
          }
        },
      },
    } as PluginObj;
  }
  const source = fs.readFileSync(file, 'utf-8');
  transformSync(source, { babelrc: false, configFile: false, plugins: [...defaultPlugins, extractor] })?.code;
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
              throw new Error(`Unhandled selector value type at ${file}:${path.node.loc?.start.line}.`);
            }
          }
        },
      },
    } as PluginObj;
  }
  const source = fs.readFileSync(file, 'utf-8');
  transformSync(source, { babelrc: false, configFile: false, plugins: [...defaultPlugins, extractor] })?.code;
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

// Match property against the used properties supporting wildcards ("*").
// For example, property "flash-type-*" matches "flash-type-error", "flash-type-in-progress", and so on.
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
