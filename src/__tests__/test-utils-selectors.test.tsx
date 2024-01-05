// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import fs from 'fs';
import postcss, { Rule, AtRule, ChildNode } from 'postcss';
import glob from 'glob';

// The test extracts generated selectors from the compiled output and matches those against the snapshot.
// Only selectors having "used in test-utils" comment or placed under {component}/test-classes/styles.scss are extracted.
// A difference to existing selectors means there is going to be a mismatch between the new version of the components
// and the old version of the test-utils which matters when different version of the packages are used for the runtime and the testing infrastructure.
test('selectors', () => {
  const allComponentSelectors = createSelectorsMapping();
  expect(allComponentSelectors).toMatchSnapshot();
});

function createSelectorsMapping() {
  const allComponentSelectors = new Map<string, Set<string>>();
  for (const file of glob.sync('lib/components/**/*.css')) {
    const content = fs.readFileSync(file, 'utf-8');
    postcss([
      tokenExtractor(file, (component: string, selectors: string[]) => {
        const componentSelectors = allComponentSelectors.get(component) ?? new Set();
        selectors.forEach(selector => componentSelectors.add(selector));
        allComponentSelectors.set(component, componentSelectors);
      }),
    ]).process(content, { from: file }).css; // trigger the getter
  }
  return [...allComponentSelectors.entries()].map(([component, selectors]) => [component, [...selectors].sort()]);
}

function tokenExtractor(file: string, onSelectorsMatched: (component: string, selectors: string[]) => void) {
  return {
    postcssPlugin: 'tokens-collector',
    Rule(rule: Rule) {
      if (rule.parent && rule.parent instanceof AtRule && rule.parent.name === 'keyframes') {
        return;
      }
      if (file.includes('test-classes') || rule.nodes.some(isTestUtilsComment)) {
        onSelectorsMatched(getComponentNameFromFile(file), getFormattedSelectors(rule.selector));
      }
    },
  };
}

function isTestUtilsComment(node: ChildNode) {
  return node.type === 'comment' && node.text.match(/used in test-utils/);
}

function getFormattedSelectors(selector: string) {
  return selector.split(',').map(formatSelector);
}

function formatSelector(selector: string) {
  return trimHash(selector.replace(/:not\(#\\9\)/g, '').replace(/\n/g, ''));
}

function trimHash(selector: string) {
  const splitSelector = selector.replace('.', '').split('_');
  if (splitSelector.length >= 5) {
    splitSelector.splice(splitSelector.length - 2, splitSelector.length);
    return splitSelector.join('_');
  }
  return selector;
}

function getComponentNameFromFile(file: string) {
  return file.split('/')[2];
}
