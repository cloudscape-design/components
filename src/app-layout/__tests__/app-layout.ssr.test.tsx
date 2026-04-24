/**
 * @jest-environment node
 */
// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

import { clearVisualRefreshState } from '@cloudscape-design/component-toolkit/internal/testing';

import AppLayout from '../../../lib/components/app-layout';
import AppLayoutToolbar from '../../../lib/components/app-layout-toolbar';

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
test('should render refresh-toolbar app layout with the widget flag', () => {
  globalWithFlags[Symbol.for('awsui-visual-refresh-flag')] = () => true;
  globalWithFlags[Symbol.for('awsui-global-flags')] = { appLayoutWidget: true };
  const content = renderToStaticMarkup(<AppLayout />);
  expect(content).toContain(refreshToolbarStyles.root);
});
test('should render refresh-toolbar app layout with the toolbar flag', () => {
  globalWithFlags[Symbol.for('awsui-visual-refresh-flag')] = () => true;
  globalWithFlags[Symbol.for('awsui-global-flags')] = { appLayoutToolbar: true };
  const content = renderToStaticMarkup(<AppLayout />);
  expect(content).toContain(refreshToolbarStyles.root);
});
test('AppLayout should not render content during SSR', () => {
  globalWithFlags[Symbol.for('awsui-visual-refresh-flag')] = () => true;
  globalWithFlags[Symbol.for('awsui-global-flags')] = { appLayoutToolbar: true };
  const content = renderToStaticMarkup(
    <AppLayout content="SSR content region" breadcrumbs="SSR breadcrumbs" navigation="SSR navigation" />
  );
  expect(content).not.toContain('SSR content region');
  expect(content).toContain('SSR breadcrumbs');
  expect(content).toContain('SSR navigation');
});
test('AppLayoutToolbar should render content, breadcrumbs, and navigation during SSR', () => {
  globalWithFlags[Symbol.for('awsui-visual-refresh-flag')] = () => true;
  const content = renderToStaticMarkup(
    <AppLayoutToolbar content="SSR content region" breadcrumbs="SSR breadcrumbs" navigation="SSR navigation" />
  );
  expect(content).toContain('SSR content region');
  expect(content).toContain('SSR breadcrumbs');
  expect(content).toContain('SSR navigation');
});
