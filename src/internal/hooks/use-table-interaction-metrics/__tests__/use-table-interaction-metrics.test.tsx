// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { mockPerformanceMetrics } from '../../../analytics/__tests__/mocks';
import {
  UseTableInteractionMetricsProps,
  useTableInteractionMetrics,
} from '../../../../../lib/components/internal/hooks/use-table-interaction-metrics';
import { renderHook } from '../../../../__tests__/render-hook';
import { PerformanceMetrics } from '../../../../../lib/components/internal/analytics';

beforeEach(() => {
  jest.resetAllMocks();
  mockPerformanceMetrics();
});
jest.useFakeTimers();

type RenderProps = Partial<UseTableInteractionMetricsProps>;

function render(props: RenderProps) {
  const defaultProps = {
    getComponentIdentifier: () => 'My resources',
    itemCount: 10,
    loading: undefined,
    instanceIdentifier: undefined,
  } satisfies RenderProps;

  const { result, rerender, unmount } = renderHook(useTableInteractionMetrics, {
    initialProps: { ...defaultProps, ...props },
  });

  return {
    setLastUserAction: (name: string) => result.current.setLastUserAction(name),
    rerender: (props: RenderProps) => rerender({ ...defaultProps, ...props }),
    unmount,
  };
}

describe('useTableInteractionMetrics', () => {
  describe('Interactions', () => {
    test('user actions should be recorded if they happened recently', () => {
      const { setLastUserAction, rerender } = render({});

      setLastUserAction('filter');
      rerender({ loading: true });

      jest.advanceTimersByTime(3456);

      expect(PerformanceMetrics.tableInteraction).toHaveBeenCalledTimes(0);

      rerender({ loading: false });

      expect(PerformanceMetrics.tableInteraction).toHaveBeenCalledTimes(1);
      expect(PerformanceMetrics.tableInteraction).toHaveBeenCalledWith(
        expect.objectContaining({
          userAction: 'filter',
          interactionTime: 3456,
        })
      );
    });

    test('user actions should not be recorded if they happened a longer time ago', () => {
      const { setLastUserAction, rerender } = render({});

      setLastUserAction('filter');

      jest.advanceTimersByTime(5000);

      rerender({ loading: true });
      rerender({ loading: false });

      expect(PerformanceMetrics.tableInteraction).toHaveBeenCalledTimes(1);
      expect(PerformanceMetrics.tableInteraction).toHaveBeenCalledWith(
        expect.objectContaining({
          userAction: '',
        })
      );
    });

    test('only the most recent user action should be used', () => {
      const { setLastUserAction, rerender } = render({});

      setLastUserAction('filter');
      setLastUserAction('pagination');

      rerender({ loading: true });
      rerender({ loading: false });

      expect(PerformanceMetrics.tableInteraction).toHaveBeenCalledTimes(1);
      expect(PerformanceMetrics.tableInteraction).toHaveBeenCalledWith(
        expect.objectContaining({
          userAction: 'pagination',
        })
      );
    });

    test('user actions during the loading state should be ignored', () => {
      const { setLastUserAction, rerender } = render({});
      jest.runAllTimers();

      setLastUserAction('filter');
      rerender({ loading: true });

      setLastUserAction('pagination');
      rerender({ loading: true });

      rerender({ loading: false });

      expect(PerformanceMetrics.tableInteraction).toHaveBeenCalledTimes(1);
      expect(PerformanceMetrics.tableInteraction).toHaveBeenCalledWith(
        expect.objectContaining({
          userAction: 'filter',
        })
      );
    });
  });
});
