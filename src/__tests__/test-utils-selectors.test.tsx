// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import fs from 'fs';
import Path from 'path';
import glob from 'glob';
import { transformSync, types, PluginObj, NodePath } from '@babel/core';
import { flatten, zip } from 'lodash';

// TODO: move selectors extraction to @cloudscape-design/test-utils

// The test extracts generated selectors from the compiled output and matches those against the snapshot.
test('test-utils selectors', () => {
  // Find referenced selector files and properties.
  const selectorsFilePathToUsedProperties = new Map<string, Set<string>>();
  for (const file of glob.sync('lib/components/test-utils/selectors/**/*.js')) {
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
      componentToSelectors[componentName] = [...(componentToSelectors[componentName] ?? []), selector];
    });
  }
  expect(componentToSelectors).toMatchSnapshot();
});

function extractSelectorProperties(file: string, onExtract: (filePath: string, propertyKey: string) => void) {
  function extractor(): PluginObj {
    const selectorVars = new Map<string, string>();
    return {
      visitor: {
        // Find require statements that import selectors.
        CallExpression(path: NodePath<types.CallExpression>) {
          if (path.node.callee.type === 'Identifier' && path.node.callee.name === 'require') {
            const argument = path.node.arguments[0];
            if (argument.type === 'StringLiteral' && argument.value.endsWith('selectors.js')) {
              if (path.parent.type === 'VariableDeclarator' && path.parent.id.type === 'Identifier') {
                selectorVars.set(path.parent.id.name, Path.resolve(file, '..', argument.value));
              }
            }
          }
        },
        // Find selector references and extract used property names.
        MemberExpression(path: NodePath<types.MemberExpression>) {
          function parseNested(expression: types.MemberExpression, propertyName: string) {
            if (expression.object.type === 'Identifier' && selectorVars.has(expression.object.name)) {
              const filePath = selectorVars.get(expression.object.name)!;
              if (expression.property.type === 'Identifier' && expression.property.name === 'default') {
                onExtract(filePath, propertyName);
              }
            }
          }
          if (path.node.object.type === 'MemberExpression') {
            if (path.node.property.type === 'Identifier') {
              parseNested(path.node.object, path.node.property.name);
            } else if (path.node.property.type === 'StringLiteral') {
              parseNested(path.node.object, path.node.property.value);
            } else if (path.node.property.type === 'TemplateLiteral') {
              parseNested(path.node.object, buildTemplateString(path.node.property));
            } else {
              throw new Error('Unhandled selectors access type.');
            }
          }
        },
      },
    } as PluginObj;
  }
  const source = fs.readFileSync(file, 'utf-8');
  transformSync(source, { babelrc: false, configFile: false, plugins: [extractor] })?.code;
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
  transformSync(source, { babelrc: false, configFile: false, plugins: [extractor] })?.code;
}

function trimSelectorHash(selector: string) {
  const splitSelector = selector.replace('.', '').split('_');
  if (splitSelector.length >= 5) {
    splitSelector.splice(splitSelector.length - 2, splitSelector.length);
    return splitSelector.join('_');
  }
  return selector;
}

function getComponentNameFromFilePath(filePath: string) {
  return filePath.match(/lib\/components\/([\w-]+)/)![1];
}

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
