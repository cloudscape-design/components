// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { cleanup, render, waitFor } from '@testing-library/react';

import AppLayout from '../../../lib/components/app-layout';
import { isAppLayoutHideToolbar } from '../../../lib/components/app-layout/utils/feature-flags';
import BreadcrumbGroup, { BreadcrumbGroupProps } from '../../../lib/components/breadcrumb-group';
import { clearInitialMessages } from '../../../lib/components/internal/plugins/widget/core';
import * as widgetPlugins from '../../../lib/components/plugins';
import { describeEachAppLayout, renderComponent, setPendingGlobalFlag } from './utils';

import toolbarStyles from '../../../lib/components/app-layout/visual-refresh-toolbar/toolbar/styles.css.js';

const breadcrumbItems: BreadcrumbGroupProps['items'] = [
  { text: 'Home', href: '/home' },
  { text: 'Resource', href: '/resource' },
];

function isToolbarHidden(toolbar: HTMLElement) {
  return toolbar.classList.contains(toolbarStyles['toolbar-hidden']);
}

afterEach(() => setPendingGlobalFlag('appLayoutHideToolbar', undefined));

describe('isAppLayoutHideToolbar', () => {
  test('returns false when the flag is not set', () => {
    expect(isAppLayoutHideToolbar()).toBe(false);
  });

  test('returns false when the flag is false', () => {
    setPendingGlobalFlag('appLayoutHideToolbar', false);
    expect(isAppLayoutHideToolbar()).toBe(false);
  });

  test('returns true when the flag is true', () => {
    setPendingGlobalFlag('appLayoutHideToolbar', true);
    expect(isAppLayoutHideToolbar()).toBe(true);
  });
});

describeEachAppLayout({ themes: ['refresh-toolbar'] }, () => {
  test('renders a visible toolbar when the flag is not set', () => {
    const { wrapper } = renderComponent(<AppLayout navigation="nav" />);
    expect(wrapper.findToolbar()).toBeTruthy();
    expect(isToolbarHidden(wrapper.findToolbar()!.getElement())).toBe(false);
  });

  test('keeps the toolbar mounted but hidden when the flag is set', () => {
    setPendingGlobalFlag('appLayoutHideToolbar', true);
    const { wrapper } = renderComponent(<AppLayout navigation="nav" tools="tools" />);
    expect(wrapper.findToolbar()).toBeTruthy();
    expect(isToolbarHidden(wrapper.findToolbar()!.getElement())).toBe(true);
    // toggles are rendered inside the hidden toolbar
    expect(wrapper.findToolbar()!.getElement()).toContainElement(wrapper.findNavigationToggle()!.getElement());
    expect(wrapper.findToolbar()!.getElement()).toContainElement(wrapper.findToolsToggle()!.getElement());
  });

  test('keeps rendering breadcrumbs inside the hidden toolbar', () => {
    setPendingGlobalFlag('appLayoutHideToolbar', true);
    const { wrapper } = renderComponent(<AppLayout breadcrumbs={<BreadcrumbGroup items={breadcrumbItems} />} />);
    const breadcrumbs = wrapper.findBreadcrumbs()!.findBreadcrumbGroup()!;
    expect(breadcrumbs.findBreadcrumbLinks().map(link => link.getElement().textContent)).toEqual(['Home', 'Resource']);
    expect(wrapper.findToolbar()!.getElement()).toContainElement(breadcrumbs.getElement());
  });

  test('keeps rendering the content and open navigation when the flag is set', () => {
    setPendingGlobalFlag('appLayoutHideToolbar', true);
    const { wrapper } = renderComponent(
      <AppLayout navigation="nav" navigationOpen={true} onNavigationChange={() => {}} content="main content" />
    );
    expect(isToolbarHidden(wrapper.findToolbar()!.getElement())).toBe(true);
    expect(wrapper.findContentRegion().getElement()).toHaveTextContent('main content');
    expect(wrapper.findNavigation().getElement()).toHaveTextContent('nav');
  });

  test('keeps rendering an open tools drawer when the flag is set', () => {
    setPendingGlobalFlag('appLayoutHideToolbar', true);
    const { wrapper } = renderComponent(<AppLayout tools="tools content" toolsOpen={true} onToolsChange={() => {}} />);
    expect(isToolbarHidden(wrapper.findToolbar()!.getElement())).toBe(true);
    expect(wrapper.findTools().getElement()).toHaveTextContent('tools content');
  });
});

describeEachAppLayout({ themes: ['refresh-toolbar'], sizes: ['desktop'] }, () => {
  beforeEach(() => clearInitialMessages());
  afterEach(() => {
    cleanup();
    clearInitialMessages();
  });

  test('reports breadcrumbs to registerBreadcrumbsConsumer when the flag is set', async () => {
    setPendingGlobalFlag('appLayoutHideToolbar', true);
    const onBreadcrumbsChange = jest.fn();
    const registration = widgetPlugins.registerBreadcrumbsConsumer({ onBreadcrumbsChange });
    const onFollow = jest.fn();

    render(<AppLayout breadcrumbs={<BreadcrumbGroup items={breadcrumbItems} onFollow={onFollow} />} />);

    await waitFor(() =>
      expect(onBreadcrumbsChange).toHaveBeenLastCalledWith(
        expect.objectContaining({ items: breadcrumbItems, onFollow })
      )
    );
    registration.unregister();
  });

  test('reports breadcrumb updates to registerBreadcrumbsConsumer when the flag is set', async () => {
    setPendingGlobalFlag('appLayoutHideToolbar', true);
    const onBreadcrumbsChange = jest.fn();
    const registration = widgetPlugins.registerBreadcrumbsConsumer({ onBreadcrumbsChange });

    const { rerender } = render(<AppLayout breadcrumbs={<BreadcrumbGroup items={breadcrumbItems} />} />);
    await waitFor(() =>
      expect(onBreadcrumbsChange).toHaveBeenLastCalledWith(expect.objectContaining({ items: breadcrumbItems }))
    );

    const updatedItems = [...breadcrumbItems, { text: 'Details', href: '/details' }];
    rerender(<AppLayout breadcrumbs={<BreadcrumbGroup items={updatedItems} />} />);
    await waitFor(() =>
      expect(onBreadcrumbsChange).toHaveBeenLastCalledWith(expect.objectContaining({ items: updatedItems }))
    );
    registration.unregister();
  });
});

describeEachAppLayout({ themes: ['classic', 'refresh'] }, () => {
  test('does not affect non-toolbar designs', () => {
    setPendingGlobalFlag('appLayoutHideToolbar', true);
    const { wrapper } = renderComponent(<AppLayout navigation="nav" content="main content" />);
    expect(wrapper.findNavigation().getElement()).toHaveTextContent('nav');
    expect(wrapper.findContentRegion().getElement()).toHaveTextContent('main content');
  });
});
