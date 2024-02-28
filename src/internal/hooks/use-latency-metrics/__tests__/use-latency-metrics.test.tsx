// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useRef } from 'react';
import { render } from '@testing-library/react';
import { useLatencyMetrics } from '..';

jest.useFakeTimers();
const panorama = jest.fn();
(window as any).panorama = panorama;

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

const expectDetailInCall = (callNumber: number) =>
  expect(JSON.parse(panorama.mock.calls[callNumber - 1][1].eventDetail));

describe('useLatencyMetrics', () => {
  describe("'mounted' event", () => {
    it('emits a metric when rendered', () => {
      elementIsInViewport = true;

      render(<TestComponent componentName="MyComponent" />);
      jest.runAllTimers();

      expect(panorama).toHaveBeenCalledTimes(1);

      expectDetailInCall(1).toEqual(
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

      render(<TestComponent componentName="MyComponent" />);
      jest.runAllTimers();

      expect(panorama).toHaveBeenCalledTimes(1);
      expectDetailInCall(1).toEqual(
        expect.objectContaining({
          inViewport: false,
        })
      );

      elementIsInViewport = true;

      render(<TestComponent componentName="MyComponent" />);
      jest.runAllTimers();

      expect(panorama).toHaveBeenCalledTimes(2);
      expectDetailInCall(2).toEqual(
        expect.objectContaining({
          inViewport: true,
        })
      );
    });

    it('includes the loading state of the element', () => {
      elementIsInViewport = true;

      render(<TestComponent componentName="MyComponent" loading={true} />);
      jest.runAllTimers();

      expectDetailInCall(1).toEqual(
        expect.objectContaining({
          loading: true,
        })
      );
    });
  });

  describe('Loading state', () => {
    it("emits a 'loading-started' metric when the component enters a loading state", () => {
      elementIsInViewport = true;

      const { rerender } = render(<TestComponent componentName="MyComponent" />);
      jest.runAllTimers();

      rerender(<TestComponent componentName="MyComponent" loading={true} />);
      jest.runAllTimers();

      expect(panorama).toHaveBeenCalledTimes(2);

      expectDetailInCall(2).toEqual(
        expect.objectContaining({
          type: 'loading-started',
        })
      );
    });

    it("does not emit a 'loading-started' metric if the component already mounted in a loading state", () => {
      elementIsInViewport = true;

      const { rerender } = render(<TestComponent componentName="MyComponent" loading={true} />);
      jest.runAllTimers();

      rerender(<TestComponent componentName="MyComponent" loading={true} />);
      jest.runAllTimers();

      expect(panorama).toHaveBeenCalledTimes(1);
    });

    it("emits a 'loading-finished' metric when the component exits the loading state", () => {
      elementIsInViewport = true;

      const { rerender } = render(<TestComponent componentName="MyComponent" loading={true} />);
      jest.runAllTimers();

      rerender(<TestComponent componentName="MyComponent" loading={false} />);
      jest.runAllTimers();

      expect(panorama).toHaveBeenCalledTimes(2);
      expectDetailInCall(2).toEqual(
        expect.objectContaining({
          type: 'loading-finished',
        })
      );
    });

    it("includes the duration of the loading state in the 'loading-finished' metric", () => {
      elementIsInViewport = true;

      const { rerender } = render(<TestComponent componentName="MyComponent" loading={true} />);
      jest.advanceTimersByTime(3456);

      rerender(<TestComponent componentName="MyComponent" loading={false} />);
      jest.runAllTimers();

      expect(panorama).toHaveBeenCalledTimes(2);
      expectDetailInCall(2).toEqual(
        expect.objectContaining({
          type: 'loading-finished',
          loadingDuration: 3456,
        })
      );
    });

    it("emits a 'loading-cancelled' metric if the component is unmounted while in a loading state", () => {
      elementIsInViewport = true;
      const { unmount } = render(<TestComponent componentName="MyComponent" loading={true} />);

      jest.runAllTimers();
      expect(panorama).toHaveBeenCalledTimes(1);

      unmount();
      jest.runAllTimers();

      expect(panorama).toHaveBeenCalledTimes(2);

      expectDetailInCall(2).toEqual(
        expect.objectContaining({
          type: 'loading-cancelled',
        })
      );
    });
  });

  describe('Spinner component', () => {
    it('is always considered to be in loading state', () => {
      elementIsInViewport = true;

      render(<TestComponent componentName="MyComponent" componentType="spinner" />);
      jest.runAllTimers();

      expect(panorama).toHaveBeenCalledTimes(1);

      expectDetailInCall(1).toEqual(
        expect.objectContaining({
          type: 'mounted',
          loading: true,
        })
      );
    });

    it("does not emit an additional 'loading-started' metric when the 'loading' prop is set", () => {
      elementIsInViewport = true;

      const { rerender } = render(<TestComponent componentName="MyComponent" componentType="spinner" />);
      jest.runAllTimers();

      expect(panorama).toHaveBeenCalledTimes(1);

      rerender(<TestComponent componentName="MyComponent" componentType="spinner" loading={true} />);
      jest.runAllTimers();

      expect(panorama).toHaveBeenCalledTimes(1);
    });

    it("emits a 'loading-finished' metric when the component unmounts", () => {
      elementIsInViewport = true;

      const { unmount } = render(<TestComponent componentName="MyComponent" componentType="spinner" />);
      jest.runAllTimers();

      expect(panorama).toHaveBeenCalledTimes(1);

      unmount();
      jest.runAllTimers();

      expect(panorama).toHaveBeenCalledTimes(2);

      expectDetailInCall(2).toEqual(
        expect.objectContaining({
          type: 'loading-finished',
        })
      );
    });
  });
});

function TestComponent(props: {
  componentName: string;
  instanceId?: string | undefined;
  loading?: boolean | undefined;
  componentType?: 'spinner' | undefined;
}) {
  const elementRef = useRef(null);
  useLatencyMetrics({ instanceId: undefined, loading: undefined, ...props, elementRef });
  return <div ref={elementRef} />;
}
