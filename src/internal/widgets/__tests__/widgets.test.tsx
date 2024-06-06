// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';
import { FlagsHolder, awsuiGlobalFlagsSymbol } from '../../../../lib/components/internal/utils/global-flags';
import { useVisualRefresh } from '../../../../lib/components/internal/hooks/use-visual-mode';
import { createWidgetizedComponent, createWidgetizedForwardRef } from '../../../../lib/components/internal/widgets';

declare const window: Window & FlagsHolder;

const LoaderSkeleton = () => <div data-testid="loader">Loading...</div>;
const RealComponent = () => <div data-testid="content">Real content</div>;
const WidgetizedComponent = createWidgetizedComponent(RealComponent)(LoaderSkeleton);

const LoaderWithRef = React.forwardRef<HTMLDivElement>((props, ref) => (
  <div ref={ref} data-testid="loader">
    Loading...
  </div>
));
const RealComponentWithRef = React.forwardRef<HTMLDivElement>((props, ref) => (
  <div ref={ref} data-testid="content">
    Real content
  </div>
));
const WidgetizedComponentWithRef = createWidgetizedForwardRef<
  { children?: React.ReactNode },
  HTMLDivElement,
  typeof RealComponentWithRef
>(RealComponentWithRef)(LoaderWithRef);

function findLoader(container: HTMLElement) {
  return container.querySelector('[data-testid="loader"]');
}
function findContent(container: HTMLElement) {
  return container.querySelector('[data-testid="content"]');
}

jest.mock('../../../../lib/components/internal/hooks/use-visual-mode', () => ({
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

describe('Classic design', () => {
  beforeEach(() => {
    jest.mocked(useVisualRefresh).mockReturnValue(false);
  });

  test('should render normal panel by default', () => {
    const { container } = render(<WidgetizedComponent />);
    expect(findContent(container)).toBeTruthy();
    expect(findLoader(container)).toBeFalsy();
  });

  describeWithFeatureFlag(() => {
    test('should render normal layout', () => {
      const { container } = render(<WidgetizedComponent />);
      expect(findContent(container)).toBeTruthy();
      expect(findLoader(container)).toBeFalsy();
    });
  });
});

describe('Refresh design', () => {
  beforeEach(() => {
    jest.mocked(useVisualRefresh).mockReturnValue(true);
  });

  test('should render normal layout by default', () => {
    const { container } = render(<WidgetizedComponent />);
    expect(findContent(container)).toBeTruthy();
    expect(findLoader(container)).toBeFalsy();
  });

  describeWithFeatureFlag(() => {
    test('should render loader', () => {
      const { container } = render(<WidgetizedComponent />);
      expect(findContent(container)).toBeFalsy();
      expect(findLoader(container)).toBeTruthy();
    });
  });
});

describe('Ref handling', () => {
  test('should forward ref to content', () => {
    const ref = React.createRef<HTMLDivElement>();
    const { container } = render(<WidgetizedComponentWithRef ref={ref} />);
    expect(findContent(container)).toBeTruthy();
    expect(findLoader(container)).toBeFalsy();
    expect(ref.current).toHaveTextContent('Real content');
  });

  describeWithFeatureFlag(() => {
    test('should forward ref to loader', () => {
      const ref = React.createRef<HTMLDivElement>();
      const { container } = render(<WidgetizedComponentWithRef ref={ref} />);
      expect(findContent(container)).toBeFalsy();
      expect(findLoader(container)).toBeTruthy();
      expect(ref.current).toHaveTextContent('Loading...');
    });
  });
});
