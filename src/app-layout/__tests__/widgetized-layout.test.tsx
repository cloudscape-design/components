// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';
import { describeWithAppLayoutFeatureFlagEnabled } from '../../internal/widgets/__tests__/utils';
import { createWidgetizedAppLayout } from '../../../lib/components/app-layout/implementation';
import { AppLayoutProps, AppLayoutPropsWithDefaults } from '../../../lib/components/app-layout/interfaces';
import { useVisualRefresh } from '../../../lib/components/internal/hooks/use-visual-mode';
import createWrapper from '../../../lib/components/test-utils/dom';

const LoaderSkeleton = React.forwardRef<AppLayoutProps.Ref, AppLayoutPropsWithDefaults>(() => {
  return <div data-testid="loader">Loading...</div>;
});

const defaultProps: AppLayoutPropsWithDefaults = {
  contentType: 'default',
  navigationWidth: 0,
  toolsWidth: 0,
  minContentWidth: 0,
  placement: {
    insetInlineStart: 0,
    insetBlockStart: 0,
    insetBlockEnd: 0,
    insetInlineEnd: 0,
    inlineSize: Number.POSITIVE_INFINITY,
  },
  navigationOpen: true,
  onNavigationChange: () => {},
};

function findLoader(container: HTMLElement) {
  return container.querySelector('[data-testid="loader"]');
}

function renderComponent(jsx: React.ReactElement) {
  const { container } = render(jsx);
  const wrapper = createWrapper(container).findAppLayout();

  return { wrapper, container };
}

const WidgetizedLayout = createWidgetizedAppLayout(LoaderSkeleton);

jest.mock('../../../lib/components/internal/hooks/use-visual-mode', () => ({
  useVisualRefresh: jest.fn().mockReturnValue(false),
}));

describe('Classic layout', () => {
  beforeEach(() => {
    jest.mocked(useVisualRefresh).mockReturnValue(false);
  });

  test('should render normal layout by default', () => {
    const { wrapper, container } = renderComponent(<WidgetizedLayout {...defaultProps} />);
    expect(wrapper).toBeTruthy();
    expect(findLoader(container)).toBeFalsy();
  });

  describeWithAppLayoutFeatureFlagEnabled(() => {
    test('should render normal layout', () => {
      const { wrapper, container } = renderComponent(<WidgetizedLayout {...defaultProps} />);
      expect(wrapper).toBeTruthy();
      expect(findLoader(container)).toBeFalsy();
    });
  });
});

describe('Refresh layout', () => {
  beforeEach(() => {
    jest.mocked(useVisualRefresh).mockReturnValue(true);
  });

  test('should render normal layout by default', () => {
    const { wrapper, container } = renderComponent(<WidgetizedLayout {...defaultProps} />);
    expect(wrapper).toBeTruthy();
    expect(findLoader(container)).toBeFalsy();
  });

  describeWithAppLayoutFeatureFlagEnabled(() => {
    test('should render loader', () => {
      const { wrapper, container } = renderComponent(<WidgetizedLayout {...defaultProps} />);
      expect(wrapper).toBeFalsy();
      expect(findLoader(container)).toBeTruthy();
    });
  });
});
