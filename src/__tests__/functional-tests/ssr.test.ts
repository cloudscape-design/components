/**
 * @jest-environment node
 */
/* eslint-disable header/header */
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

test('ensure is it not DOM', () => {
  expect(typeof window).toBe('undefined');
  expect(typeof CSS).toBe('undefined');
});

for (const componentName of getAllComponents().filter(component => vrOnlyComponents.indexOf(component) === -1)) {
  test(`renders ${componentName} without crashing`, () => {
    const { default: Component } = requireComponent(componentName);
    const props = getRequiredPropsForComponent(componentName);
    const content = renderToStaticMarkup(React.createElement(Component, props, 'test content'));
    if (componentName === 'modal') {
      // modal uses portal API which does not work on server and returns an empty content
      expect(content.length).toEqual(0);
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
