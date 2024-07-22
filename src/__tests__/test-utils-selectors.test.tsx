// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { NodePath, PluginObj, transformSync, types } from '@babel/core';
import fs from 'fs';
import glob from 'glob';
import { flatten, zip } from 'lodash';
import path from 'path';

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
    return {
      visitor: {
        // Find selector references and extract used property names.
        MemberExpression(path: NodePath<types.MemberExpression>) {
          if (path.node.object.type === 'Identifier') {
            const binding = path.scope.getBinding(path.node.object.name);
            if (
              binding &&
              binding.kind === 'module' &&
              binding.path.parent.type === 'ImportDeclaration' &&
              binding.path.parent.source.value.endsWith('selectors.js')
            ) {
              onExtract(resolveSelectorsPath(binding.path.parent.source.value), getPropertyName(path));
            }
          }
        },
      },
    } as PluginObj;
  }
  const source = fs.readFileSync(file, 'utf-8');
  transformSync(source, { babelrc: false, configFile: false, plugins: [...defaultPlugins, extractor] })?.code;
}

function extractComponentSelectors(file: string, usedProperties: string[], onExtract: (selector: string) => void) {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const source = require(file);
  if (typeof source.default !== 'object') {
    throw new Error(`Unexpected selectors file format at ${file}.`);
  }
  for (const [property, value] of Object.entries(source.default)) {
    if (typeof value !== 'string') {
      throw new Error(`Unexpected selectors file format at ${file}, "${property}".`);
    }
    if (matchProperties(usedProperties, property)) {
      onExtract(trimSelectorHash(value as string));
    }
  }
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
  let selectorsFile = importPath;
  // Path to selectors file from 'lib/components'.
  selectorsFile = path.resolve(path.relative('lib/components/test-utils', importPath));
  // Absolute path to selectors file.
  selectorsFile = path.resolve(path.join('lib/components', selectorsFile));
  return selectorsFile;
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
    if (matchWildcard(testProperty, property)) {
      return true;
    }
  }
  return false;
}

function matchWildcard(testProperty: string, propertyToMatch: string) {
  if (testProperty.includes('*')) {
    testProperty = testProperty.replace(/\*/g, '.*');
    return new RegExp('^' + testProperty + '$').test(propertyToMatch);
  }
  return false;
}
