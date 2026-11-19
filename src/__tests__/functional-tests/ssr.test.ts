/**
 * @jest-environment node
 */
// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

import { clearVisualRefreshState } from '@cloudscape-design/component-toolkit/internal/testing';

import { getRequiredPropsForComponent } from '../required-props-for-components';
import { getAllComponents, requireComponent } from '../utils';

const globalWithFlags = globalThis as any;

beforeEach(() => {
  globalWithFlags[Symbol.for('awsui-visual-refresh-flag')] = () => true;
});

afterEach(() => {
  delete globalWithFlags[Symbol.for('awsui-visual-refresh-flag')];
  clearVisualRefreshState();
});

const vrOnlyComponents = ['app-layout-toolbar'];

// Components whose entire tree is rendered through a portal. The server renderer has no
// container to portal into, so none of their content reaches the server markup. Portal
// itself renders a hidden placeholder element in its place, so that the markup matches
// the first client render and hydration succeeds; the client replaces it on the first
// commit. Older component-toolkit versions emit nothing at all, hence the optional match.
const portaledComponents = ['modal', 'tooltip'];
const emptyOrHiddenPlaceholder = /^(<span style="display:none"><\/span>)?$/;

test('ensure is it not DOM', () => {
  expect(typeof window).toBe('undefined');
  expect(typeof CSS).toBe('undefined');
});

for (const componentName of getAllComponents().filter(component => vrOnlyComponents.indexOf(component) === -1)) {
  test(`renders ${componentName} without crashing`, () => {
    const { default: Component } = requireComponent(componentName);
    const props = getRequiredPropsForComponent(componentName);
    const content = renderToStaticMarkup(React.createElement(Component, props, 'test content'));
    if (portaledComponents.indexOf(componentName) !== -1) {
      expect(content).not.toContain('test content');
      expect(content).toMatch(emptyOrHiddenPlaceholder);
    } else {
      expect(content.length).toBeGreaterThan(0);
    }
  });
}

describe.each(vrOnlyComponents)('VR only component %s', componentName => {
  beforeEach(() => {
    globalWithFlags[Symbol.for('awsui-visual-refresh-flag')] = () => false;
  });

  test('should throw an error in classic', () => {
    const { default: Component } = requireComponent(componentName);
    const props = getRequiredPropsForComponent(componentName);
    expect(() => renderToStaticMarkup(React.createElement(Component, props, 'test content'))).toThrow();
  });
});
