/**
 * @jest-environment node
 */
/* eslint-disable header/header */
// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

import { getRequiredPropsForComponent } from './required-props-for-components';
import { getAllComponents, requireComponent } from './utils';

const skipComponents = [
  'modal', // it uses portal API which does not work on server
];
const allComponents = getAllComponents().filter(component => !skipComponents.includes(component));

test('ensure is it not DOM', () => {
  expect(typeof window).toBe('undefined');
});

for (const componentName of allComponents) {
  test(`renders ${componentName} without crashing`, () => {
    const { default: Component } = requireComponent(componentName);
    const props = getRequiredPropsForComponent(componentName);
    const content = renderToStaticMarkup(React.createElement(Component, props, 'test content'));
    expect(content.length).toBeGreaterThan(0);
  });
}
