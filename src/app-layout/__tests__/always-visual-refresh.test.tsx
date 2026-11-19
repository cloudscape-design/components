// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { clearVisualRefreshState, setGlobalFlag } from '@cloudscape-design/component-toolkit/internal/testing';

import AppLayout from '../../../lib/components/app-layout';
import { renderComponent } from './utils';

import visualRefreshStyles from '../../../lib/components/app-layout/visual-refresh/styles.css.js';
import visualRefreshToolbarStyles from '../../../lib/components/app-layout/visual-refresh-toolbar/skeleton/styles.css.js';

// Mirrors the generated files of a build with ALWAYS_VISUAL_REFRESH=true
jest.mock('../../../lib/components/internal/environment', () => ({
  ALWAYS_VISUAL_REFRESH: true,
  PACKAGE_SOURCE: 'components',
  PACKAGE_VERSION: '3.0.0',
  THEME: 'default',
}));
jest.mock('../../../lib/components/app-layout/implementations', () => ({ ClassicAppLayout: null }));

const visualRefreshFlag = Symbol.for('awsui-visual-refresh-flag');

describe('AppLayout in a build without the classic implementation', () => {
  beforeEach(() => {
    // Runtime detection says classic; the build-time lock must win
    (globalThis as any)[visualRefreshFlag] = () => false;
  });
  afterEach(() => {
    delete (globalThis as any)[visualRefreshFlag];
    setGlobalFlag('appLayoutToolbar', undefined);
    clearVisualRefreshState();
  });

  test('renders the visual refresh layout', () => {
    const { wrapper } = renderComponent(<AppLayout content="Content" />);
    expect(wrapper.matches(`.${visualRefreshStyles.layout}`)).toBeTruthy();
    expect(wrapper.findContentRegion().getElement()).toHaveTextContent('Content');
  });

  test('renders the toolbar layout when the toolbar flag is set', () => {
    setGlobalFlag('appLayoutToolbar', true);
    const { wrapper } = renderComponent(<AppLayout content="Content" />);
    expect(wrapper.matches(`.${visualRefreshToolbarStyles.root}`)).toBeTruthy();
    expect(wrapper.findContentRegion().getElement()).toHaveTextContent('Content');
  });
});
