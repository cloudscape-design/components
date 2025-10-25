// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';

import { AppLayoutInternals } from '../../../../../lib/components/app-layout/visual-refresh-toolbar/interfaces';
import { ToolbarSkeleton } from '../../../../../lib/components/app-layout/visual-refresh-toolbar/skeleton/skeleton-parts';
import { ToolbarProps } from '../../../../../lib/components/app-layout/visual-refresh-toolbar/toolbar';
import createWrapper from '../../../../../lib/components/test-utils/dom';

describe('ToolbarSkeleton', () => {
  test('renders with discoveredBreadcrumbs', () => {
    const { container } = render(
      <ToolbarSkeleton
        appLayoutInternals={
          {
            breadcrumbs: null,
            discoveredBreadcrumbs: {
              items: [
                { text: 'Home', href: '/home' },
                { text: 'Page', href: '/page' },
              ],
            },
          } as Partial<AppLayoutInternals> as AppLayoutInternals
        }
        toolbarProps={{} as ToolbarProps}
      />
    );

    const wrapper = createWrapper(container);
    const breadcrumbGroups = wrapper.findAllBreadcrumbGroups();

    expect(breadcrumbGroups).toHaveLength(1);

    const breadcrumbLinks = breadcrumbGroups[0].findBreadcrumbLinks();
    expect(breadcrumbLinks).toHaveLength(2);
    expect(breadcrumbLinks[0].getElement().textContent).toEqual('Home');
    expect(breadcrumbLinks[1].getElement().textContent).toEqual('Page');
  });

  test('renders with own breadcrumbs', () => {
    const { container } = render(
      <ToolbarSkeleton
        appLayoutInternals={
          {
            breadcrumbs: <div data-testid="custom-breadcrumbs">Custom Breadcrumbs</div>,
            discoveredBreadcrumbs: null,
          } as Partial<AppLayoutInternals> as AppLayoutInternals
        }
        toolbarProps={{} as ToolbarProps}
      />
    );

    expect(container.querySelector('[data-testid="custom-breadcrumbs"]')).toBeTruthy();
    expect(container.querySelector('[data-testid="custom-breadcrumbs"]')?.textContent).toEqual('Custom Breadcrumbs');
  });

  test('renders without breadcrumbs', () => {
    const { container } = render(
      <ToolbarSkeleton
        appLayoutInternals={
          {
            breadcrumbs: null,
            discoveredBreadcrumbs: null,
          } as Partial<AppLayoutInternals> as AppLayoutInternals
        }
        toolbarProps={{} as ToolbarProps}
      />
    );

    const wrapper = createWrapper(container);
    const breadcrumbGroups = wrapper.findAllBreadcrumbGroups();

    expect(breadcrumbGroups).toHaveLength(0);
  });
});
