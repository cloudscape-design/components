// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { RefObject } from 'react';
import { UseLatencyMetricsProps, useLatencyMetrics } from '..';
import { renderHook } from '../../../../__tests__/render-hook';
import { expectDetailInPanoramaCall, panorama } from '../../../utils/__tests__/panorama';

jest.useFakeTimers();

jest.mock('../is-in-viewport', () => ({
  isInViewport(element: Element, callback: (inViewport: boolean) => void) {
    const handle = setTimeout(() => {
      if (elementIsInViewport !== undefined) {
        callback(elementIsInViewport);
      }
    }, 20);
    return () => clearTimeout(handle);
  },
}));

let elementIsInViewport: boolean | undefined = undefined;

beforeEach(() => {
  jest.resetAllMocks();
  elementIsInViewport = undefined;
});

type RenderProps = Omit<UseLatencyMetricsProps, 'elementRef' | 'instanceId'> & Partial<UseLatencyMetricsProps>;

function render(props: RenderProps) {
  const ref: RefObject<HTMLElement> = { current: document.createElement('div') };

  const { result, rerender, unmount } = renderHook(useLatencyMetrics, {
    initialProps: { elementRef: ref, instanceId: undefined, ...props },
  });

  return {
    setLastUserAction: (name: string) => result.current.setLastUserAction(name),
    rerender: (props: RenderProps) => rerender({ elementRef: ref, instanceId: undefined, ...props }),
    unmount,
  };
}

describe('useLatencyMetrics', () => {
  describe("'mounted' event", () => {
    it('emits a metric when rendered', () => {
      elementIsInViewport = true;

      render({ componentName: 'MyComponent' });
      jest.runAllTimers();

      expect(panorama).toHaveBeenCalledTimes(1);

      expectDetailInPanoramaCall(1).toEqual(
        expect.objectContaining({
          componentName: 'MyComponent',
          inViewport: true,
          lifecycleId: expect.any(String),
          loading: false,
          metadata: {},
          type: 'mounted',
        })
      );
    });

    it('includes the visibility of the element', () => {
      elementIsInViewport = false;

      render({ componentName: 'MyComponent' });
      jest.runAllTimers();

      expect(panorama).toHaveBeenCalledTimes(1);
      expectDetailInPanoramaCall(1).toEqual(
        expect.objectContaining({
          inViewport: false,
        })
      );

      elementIsInViewport = true;

      render({ componentName: 'MyComponent' });
      jest.runAllTimers();

      expect(panorama).toHaveBeenCalledTimes(2);
      expectDetailInPanoramaCall(2).toEqual(
        expect.objectContaining({
          inViewport: true,
        })
      );
    });

    it('includes the loading state of the element', () => {
      elementIsInViewport = true;

      render({ componentName: 'MyComponent', loading: true });
      jest.runAllTimers();

      expectDetailInPanoramaCall(1).toEqual(
        expect.objectContaining({
          loading: true,
        })
      );
    });
  });

  describe('Loading state', () => {
    it("emits a 'loading-started' metric when the component enters a loading state", () => {
      elementIsInViewport = true;

      const { rerender } = render({ componentName: 'MyComponent' });
      jest.runAllTimers();

      rerender({ componentName: 'MyComponent', loading: true });
      jest.runAllTimers();

      expect(panorama).toHaveBeenCalledTimes(2);

      expectDetailInPanoramaCall(2).toEqual(
        expect.objectContaining({
          type: 'loading-started',
        })
      );
    });

    it("does not emit a 'loading-started' metric if the component already mounted in a loading state", () => {
      elementIsInViewport = true;

      const { rerender } = render({ componentName: 'MyComponent', loading: true });
      jest.runAllTimers();

      rerender({ componentName: 'MyComponent', loading: true });
      jest.runAllTimers();

      expect(panorama).toHaveBeenCalledTimes(1);
    });

    it("emits a 'loading-finished' metric when the component exits the loading state", () => {
      elementIsInViewport = true;

      const { rerender } = render({ componentName: 'MyComponent', loading: true });
      jest.runAllTimers();

      rerender({ componentName: 'MyComponent', loading: false });
      jest.runAllTimers();

      expect(panorama).toHaveBeenCalledTimes(2);
      expectDetailInPanoramaCall(2).toEqual(
        expect.objectContaining({
          type: 'loading-finished',
        })
      );
    });

    it("includes the duration of the loading state in the 'loading-finished' metric", () => {
      elementIsInViewport = true;

      const { rerender } = render({ componentName: 'MyComponent', loading: true });
      jest.advanceTimersByTime(3456);

      rerender({ componentName: 'MyComponent', loading: false });
      jest.runAllTimers();

      expect(panorama).toHaveBeenCalledTimes(2);
      expectDetailInPanoramaCall(2).toEqual(
        expect.objectContaining({
          type: 'loading-finished',
          loadingDuration: 3456,
        })
      );
    });

    it("emits a 'loading-cancelled' metric if the component is unmounted while in a loading state", () => {
      elementIsInViewport = true;
      const { unmount } = render({ componentName: 'MyComponent', loading: true });

      jest.runAllTimers();
      expect(panorama).toHaveBeenCalledTimes(1);

      unmount();
      jest.runAllTimers();

      expect(panorama).toHaveBeenCalledTimes(2);

      expectDetailInPanoramaCall(2).toEqual(
        expect.objectContaining({
          type: 'loading-cancelled',
        })
      );
    });
  });

  describe('Spinner component', () => {
    it('is always considered to be in loading state', () => {
      elementIsInViewport = true;

      render({ componentName: 'MyComponent', componentType: 'spinner' });
      jest.runAllTimers();

      expect(panorama).toHaveBeenCalledTimes(1);

      expectDetailInPanoramaCall(1).toEqual(
        expect.objectContaining({
          type: 'mounted',
          loading: true,
        })
      );
    });

    it("does not emit an additional 'loading-started' metric when the 'loading' prop is set", () => {
      elementIsInViewport = true;

      const { rerender } = render({ componentName: 'MyComponent', componentType: 'spinner' });
      jest.runAllTimers();

      expect(panorama).toHaveBeenCalledTimes(1);

      rerender({ componentName: 'MyComponent', componentType: 'spinner', loading: true });
      jest.runAllTimers();

      expect(panorama).toHaveBeenCalledTimes(1);
    });

    it("emits a 'loading-finished' metric when the component unmounts", () => {
      elementIsInViewport = true;

      const { unmount } = render({ componentName: 'MyComponent', componentType: 'spinner' });
      jest.runAllTimers();

      expect(panorama).toHaveBeenCalledTimes(1);

      unmount();
      jest.runAllTimers();

      expect(panorama).toHaveBeenCalledTimes(2);

      expectDetailInPanoramaCall(2).toEqual(
        expect.objectContaining({
          type: 'loading-finished',
        })
      );
    });
  });

  describe('Interactions', () => {
    test('user actions should be recorded if they happened recently', () => {
      elementIsInViewport = true;

      const { setLastUserAction, rerender } = render({ componentName: 'MyComponent' });
      jest.runAllTimers();

      expect(panorama).toHaveBeenCalledTimes(1);
      expectDetailInPanoramaCall(1).toEqual(
        expect.not.objectContaining({
          userAction: expect.any(String),
        })
      );

      setLastUserAction('filter');
      rerender({ componentName: 'MyComponent', loading: true });
      jest.runAllTimers();

      expect(panorama).toHaveBeenCalledTimes(2);

      expectDetailInPanoramaCall(2).toEqual(
        expect.objectContaining({
          userAction: 'filter',
        })
      );
    });

    test('user actions should not be recorded if they happened a longer time ago', () => {
      elementIsInViewport = true;

      const { setLastUserAction, rerender } = render({ componentName: 'MyComponent' });
      jest.runAllTimers();

      setLastUserAction('filter');

      jest.advanceTimersByTime(5000);

      rerender({ componentName: 'MyComponent', loading: true });
      jest.runAllTimers();

      expect(panorama).toHaveBeenCalledTimes(2);

      expectDetailInPanoramaCall(2).toEqual(
        expect.not.objectContaining({
          userAction: expect.any(String),
        })
      );
    });

    test('the loading-finished metric should show the same user action as the loading-started metric', () => {
      elementIsInViewport = true;

      const { setLastUserAction, rerender } = render({ componentName: 'MyComponent' });
      jest.runAllTimers();

      setLastUserAction('filter');
      rerender({ componentName: 'MyComponent', loading: true });
      jest.runAllTimers();

      jest.advanceTimersByTime(5000);

      rerender({ componentName: 'MyComponent', loading: false });
      jest.runAllTimers();

      expect(panorama).toHaveBeenCalledTimes(3);

      expectDetailInPanoramaCall(3).toEqual(
        expect.objectContaining({
          userAction: 'filter',
        })
      );
    });

    test('the loading-cancelled metric should show the same user action as the loading-started metric', () => {
      elementIsInViewport = true;

      const { setLastUserAction, rerender, unmount } = render({ componentName: 'MyComponent' });
      jest.runAllTimers();

      setLastUserAction('filter');
      rerender({ componentName: 'MyComponent', loading: true });
      jest.runAllTimers();

      jest.advanceTimersByTime(5000);

      unmount();
      jest.runAllTimers();

      expect(panorama).toHaveBeenCalledTimes(3);

      expectDetailInPanoramaCall(3).toEqual(
        expect.objectContaining({
          userAction: 'filter',
        })
      );
    });
  });
});
