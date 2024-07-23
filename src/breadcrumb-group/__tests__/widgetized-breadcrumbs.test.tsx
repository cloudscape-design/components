// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';

import { BreadcrumbGroupProps } from '../../../lib/components/breadcrumb-group';
import { createWidgetizedBreadcrumbGroup } from '../../../lib/components/breadcrumb-group/implementation';
import { BreadcrumbGroupSkeleton } from '../../../lib/components/breadcrumb-group/skeleton';
import { getFunnelNameSelector } from '../../../lib/components/internal/analytics/selectors';
import { useVisualRefresh } from '../../../lib/components/internal/hooks/use-visual-mode';
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
    { href: '#', text: 'Page name' },
  ],
};

const WidgetizedBreadcrumbs = createWidgetizedBreadcrumbGroup(BreadcrumbGroupSkeleton);

function getFunnelNameElement(container: HTMLElement) {
  return container.querySelector(getFunnelNameSelector());
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
    expect(getFunnelNameElement(container)).toHaveTextContent('Page name');
  });
});

describe('Refresh design', () => {
  beforeEach(() => {
    jest.mocked(useVisualRefresh).mockReturnValue(true);
  });

  test('should render normal layout by default', () => {
    const { wrapper, container } = renderComponent(<WidgetizedBreadcrumbs {...defaultProps} />);
    expect(wrapper).toBeTruthy();
    expect(getFunnelNameElement(container)).toHaveTextContent('Page name');
  });

  describeWithAppLayoutFeatureFlagEnabled(() => {
    test('should render funnel name using loader', () => {
      const { wrapper, container } = renderComponent(<WidgetizedBreadcrumbs {...defaultProps} />);
      expect(wrapper).toBeFalsy();
      expect(getFunnelNameElement(container)).toHaveTextContent('Page name');
    });

    test('should not render funnel name if breadcrumbs list is empty', () => {
      const { wrapper, container } = renderComponent(<WidgetizedBreadcrumbs items={[]} />);
      expect(wrapper).toBeFalsy();
      expect(getFunnelNameElement(container)).toEqual(null);
    });
  });
});
