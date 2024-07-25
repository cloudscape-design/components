/**
 * @jest-environment node
 */
/* eslint-disable header/header */
// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

import { clearVisualRefreshState } from '@cloudscape-design/component-toolkit/internal/testing';

import AppLayout from '../../../lib/components/app-layout';

import classicStyles from '../../../lib/components/app-layout/styles.selectors.js';
import refreshStyles from '../../../lib/components/app-layout/visual-refresh/styles.selectors.js';
import refreshToolbarStyles from '../../../lib/components/app-layout/visual-refresh-toolbar/skeleton/styles.selectors.js';

const globalWithFlags = globalThis as any;

afterEach(() => {
  delete globalWithFlags[Symbol.for('awsui-visual-refresh-flag')];
  delete globalWithFlags[Symbol.for('awsui-global-flags')];
  clearVisualRefreshState();
});

test('should render classic app layout', () => {
  const content = renderToStaticMarkup(<AppLayout />);
  expect(content).toContain(classicStyles.root);
});
test('should render refresh app layout', () => {
  globalWithFlags[Symbol.for('awsui-visual-refresh-flag')] = () => true;
  const content = renderToStaticMarkup(<AppLayout />);
  expect(content).toContain(refreshStyles.layout);
});
test('should render refresh-toolbar app layout', () => {
  globalWithFlags[Symbol.for('awsui-visual-refresh-flag')] = () => true;
  globalWithFlags[Symbol.for('awsui-global-flags')] = { appLayoutWidget: true };
  const content = renderToStaticMarkup(<AppLayout />);
  expect(content).toContain(refreshToolbarStyles.root);
});
