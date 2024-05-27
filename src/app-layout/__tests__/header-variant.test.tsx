// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import AppLayout from '../../../lib/components/app-layout';
import { useVisualRefresh } from '../../../lib/components/internal/hooks/use-visual-mode';
import { useMobile } from '../../../lib/components/internal/hooks/use-mobile';
import { renderComponent } from './utils';
import { highContrastHeaderClassName } from '../../../lib/components/internal/utils/content-header-utils';
import visualRefreshStyles from '../../../lib/components/app-layout/visual-refresh/styles.css.js';

jest.mock('../../../lib/components/internal/hooks/use-visual-mode', () => ({
  useVisualRefresh: jest.fn().mockReturnValue(false),
}));

jest.mock('../../../lib/components/internal/hooks/use-mobile', () => ({
  useMobile: jest.fn().mockReturnValue(false),
}));

jest.mock('@cloudscape-design/component-toolkit/internal', () => ({
  ...jest.requireActual('@cloudscape-design/component-toolkit/internal'),
  isMotionDisabled: jest.fn().mockReturnValue(true),
  useDensityMode: jest.fn().mockReturnValue('comfortable'),
  useReducedMotion: jest.fn().mockReturnValue(true),
}));

beforeEach(() => {
  (useVisualRefresh as jest.Mock).mockReturnValue(true);
});
afterEach(() => {
  (useVisualRefresh as jest.Mock).mockReset();
});
describe('headerVariant - desktop', () => {
  test('default', () => {
    const { wrapper } = renderComponent(<AppLayout notifications="Notifications" breadcrumbs="Breadcrumbs" />);
    expect(wrapper.findNotifications()!.getElement()).not.toHaveClass(highContrastHeaderClassName);
    expect(wrapper.findBreadcrumbs()!.getElement()).not.toHaveClass(highContrastHeaderClassName);
    expect(wrapper.findByClassName(visualRefreshStyles.background)!.getElement()).not.toHaveClass(
      highContrastHeaderClassName
    );
  });

  test('high-contrast', () => {
    const { wrapper } = renderComponent(
      <AppLayout notifications="Notifications" breadcrumbs="Breadcrumbs" headerVariant="high-contrast" />
    );
    expect(wrapper.findNotifications()!.getElement()).toHaveClass(highContrastHeaderClassName);
    expect(wrapper.findBreadcrumbs()!.getElement()).toHaveClass(highContrastHeaderClassName);
    expect(wrapper.findByClassName(visualRefreshStyles.background)!.getElement()).toHaveClass(
      highContrastHeaderClassName
    );
  });
});

describe('headerVariant - mobile', () => {
  beforeEach(() => {
    (useMobile as jest.Mock).mockReturnValue(true);
  });
  afterEach(() => {
    (useMobile as jest.Mock).mockReset();
  });
  test('default', () => {
    const { wrapper } = renderComponent(
      <AppLayout notifications="Notifications" breadcrumbs="Breadcrumbs" content="aaa" />
    );
    expect(wrapper.findByClassName(visualRefreshStyles['mobile-toolbar'])!.getElement()).not.toHaveClass(
      highContrastHeaderClassName
    );
  });

  test('high-contrast', () => {
    const { wrapper } = renderComponent(
      <AppLayout notifications="Notifications" breadcrumbs="Breadcrumbs" headerVariant="high-contrast" />
    );
    expect(wrapper.findByClassName(visualRefreshStyles['mobile-toolbar'])!.getElement()).toHaveClass(
      highContrastHeaderClassName
    );
  });
});
