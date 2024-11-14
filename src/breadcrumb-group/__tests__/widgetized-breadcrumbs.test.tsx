// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';

import { BreadcrumbGroupProps } from '../../../lib/components/breadcrumb-group';
import { createWidgetizedBreadcrumbGroup } from '../../../lib/components/breadcrumb-group/implementation';
import { InternalBreadcrumbGroupProps } from '../../../lib/components/breadcrumb-group/interfaces';
import { BreadcrumbGroupSkeleton } from '../../../lib/components/breadcrumb-group/skeleton';
import { DATA_ATTR_RESOURCE_TYPE, getFunnelNameSelector } from '../../../lib/components/internal/analytics/selectors';
import { useVisualRefresh } from '../../../lib/components/internal/hooks/use-visual-mode';
import { FunctionComponent } from '../../../lib/components/internal/widgets';
import createWrapper from '../../../lib/components/test-utils/dom';
import { describeWithAppLayoutFeatureFlagEnabled } from '../../internal/widgets/__tests__/utils';

function renderComponent(jsx: React.ReactElement) {
  const { container } = render(jsx);
  const wrapper = createWrapper(container).findBreadcrumbGroup();

  return { wrapper, container };
}

const defaultProps: BreadcrumbGroupProps = {
  items: [
    { href: '#', text: 'Root' },
    { href: '#', text: 'Resource' },
    { href: '#', text: 'Page name' },
  ],
};

const WidgetizedBreadcrumbs = createWidgetizedBreadcrumbGroup(
  BreadcrumbGroupSkeleton as FunctionComponent<InternalBreadcrumbGroupProps<any>>
);

function getElementsText(elements: NodeListOf<Element>) {
  return Array.from(elements).map(element => element.textContent);
}

function getFunnelNameElements(container: HTMLElement) {
  return container.querySelectorAll(getFunnelNameSelector());
}

function getResourceTypeElements(container: HTMLElement) {
  return container.querySelectorAll(`[${DATA_ATTR_RESOURCE_TYPE}]`);
}

jest.mock('../../../lib/components/internal/hooks/use-visual-mode', () => ({
  useVisualRefresh: jest.fn().mockReturnValue(false),
}));

describe('Classic design', () => {
  beforeEach(() => {
    jest.mocked(useVisualRefresh).mockReturnValue(false);
  });

  test('should render normal layout by default', () => {
    const { wrapper, container } = renderComponent(<WidgetizedBreadcrumbs {...defaultProps} />);
    expect(wrapper).toBeTruthy();
    expect(getElementsText(getResourceTypeElements(container))).toEqual(['Resource']);
    expect(getElementsText(getFunnelNameElements(container))).toEqual(['Page name']);
  });
});

describe('Refresh design', () => {
  beforeEach(() => {
    jest.mocked(useVisualRefresh).mockReturnValue(true);
  });

  test('should render normal layout by default', () => {
    const { wrapper, container } = renderComponent(<WidgetizedBreadcrumbs {...defaultProps} />);
    expect(wrapper).toBeTruthy();
    expect(getElementsText(getResourceTypeElements(container))).toEqual(['Resource']);
    expect(getElementsText(getFunnelNameElements(container))).toEqual(['Page name']);
  });

  describeWithAppLayoutFeatureFlagEnabled(() => {
    test('should render funnel markers using loader', () => {
      const { wrapper, container } = renderComponent(<WidgetizedBreadcrumbs {...defaultProps} />);
      expect(wrapper).toBeFalsy();
      expect(getElementsText(getResourceTypeElements(container))).toEqual(['Resource']);
      expect(getElementsText(getFunnelNameElements(container))).toEqual(['Page name']);
    });

    test('should not render funnel markers if breadcrumbs list is empty', () => {
      const { wrapper, container } = renderComponent(<WidgetizedBreadcrumbs items={[]} />);
      expect(wrapper).toBeFalsy();
      expect(getElementsText(getResourceTypeElements(container))).toEqual([]);
      expect(getElementsText(getFunnelNameElements(container))).toEqual([]);
    });
  });
});
