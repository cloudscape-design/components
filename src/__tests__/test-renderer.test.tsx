/**
 * @jest-environment node
 */
/* eslint-disable header/header */
// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { create } from 'react-test-renderer';
import { getAllComponents, requireComponent } from './utils';
import { getRequiredPropsForComponent } from './required-props-for-components';

test('ensure there is no DOM', () => {
  expect(typeof window).toBe('undefined');
});

for (const componentName of getAllComponents()) {
  test(`renders ${componentName} without crashing`, () => {
    const { default: Component } = requireComponent(componentName);
    const props = getRequiredPropsForComponent(componentName);
    const rendered = create(React.createElement(Component, props, 'test content'));
    expect(rendered.toJSON()).not.toBeNull();
  });
}
