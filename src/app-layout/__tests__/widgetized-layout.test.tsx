// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';
import { createWidgetizedAppLayout } from '../../../lib/components/app-layout/widget';
import { AppLayoutProps, AppLayoutPropsWithDefaults } from '../../../lib/components/app-layout/interfaces';
import { FlagsHolder, awsuiGlobalFlagsSymbol } from '../../../lib/components/internal/utils/global-flags';
import { useVisualRefresh } from '../../../lib/components/internal/hooks/use-visual-mode';
import createWrapper from '../../../lib/components/test-utils/dom';

declare const window: Window & FlagsHolder;

const LoaderSkeleton = React.forwardRef<AppLayoutProps.Ref, AppLayoutPropsWithDefaults>(() => {
  return <div data-testid="loader">Loading...</div>;
});

const defaultProps: AppLayoutPropsWithDefaults = {
  headerSelector: '#h',
  footerSelector: '#f',
  contentType: 'default',
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

function describeWithFeatureFlag(tests: () => void) {
  describe('when feature flag is active', () => {
    beforeEach(() => {
      window[awsuiGlobalFlagsSymbol] = { appLayoutWidget: true };
    });

    afterEach(() => {
      delete window[awsuiGlobalFlagsSymbol];
    });

    tests();
  });
}

describe('Classic layout', () => {
  beforeEach(() => {
    jest.mocked(useVisualRefresh).mockReturnValue(false);
  });

  test('should render normal layout by default', () => {
    const { wrapper, container } = renderComponent(<WidgetizedLayout {...defaultProps} />);
    expect(wrapper).toBeTruthy();
    expect(findLoader(container)).toBeFalsy();
  });

  describeWithFeatureFlag(() => {
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

  describeWithFeatureFlag(() => {
    test('should render loader', () => {
      const { wrapper, container } = renderComponent(<WidgetizedLayout {...defaultProps} />);
      expect(wrapper).toBeFalsy();
      expect(findLoader(container)).toBeTruthy();
    });
  });
});
