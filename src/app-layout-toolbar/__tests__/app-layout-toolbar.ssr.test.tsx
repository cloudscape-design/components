/**
 * @jest-environment node
 */
// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

import { clearVisualRefreshState } from '@cloudscape-design/component-toolkit/internal/testing';

import AppLayoutToolbar from '../../../lib/components/app-layout-toolbar';

const globalWithFlags = globalThis as any;

afterEach(() => {
  delete globalWithFlags[Symbol.for('awsui-visual-refresh-flag')];
  clearVisualRefreshState();
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
