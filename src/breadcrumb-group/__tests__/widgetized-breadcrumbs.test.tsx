// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';

import { createWidgetizedBreadcrumbGroup } from '../../../lib/components/breadcrumb-group/implementation.js';
import { BreadcrumbGroupProps } from '../../../lib/components/breadcrumb-group/index.js';
import { InternalBreadcrumbGroupProps } from '../../../lib/components/breadcrumb-group/interfaces.js';
import { BreadcrumbGroupSkeleton } from '../../../lib/components/breadcrumb-group/skeleton.js';
import { useVisualRefresh } from '../../../lib/components/internal/hooks/use-visual-mode/index.js';
import { FunctionComponent } from '../../../lib/components/internal/widgets/index.js';
import createWrapper from '../../../lib/components/test-utils/dom/index.js';
import { describeWithAppLayoutFeatureFlagEnabled } from '../../internal/widgets/__tests__/utils.js';

import {
  DATA_ATTR_RESOURCE_TYPE,
  getFunnelNameSelector,
} from '../../../lib/components/internal/analytics/selectors.js';

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
