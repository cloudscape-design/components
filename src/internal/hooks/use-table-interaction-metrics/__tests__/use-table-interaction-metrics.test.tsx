// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { createRef, useRef } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { render } from '@testing-library/react';

import {
  ComponentMetrics,
  PerformanceMetrics,
  setComponentMetrics,
} from '../../../../../lib/components/internal/analytics';
import { AnalyticsFunnel } from '../../../../../lib/components/internal/analytics/components/analytics-funnel';
import {
  useTableInteractionMetrics,
  UseTableInteractionMetricsProps,
} from '../../../../../lib/components/internal/hooks/use-table-interaction-metrics';
import { renderHook, RenderHookOptions } from '../../../../__tests__/render-hook';
import { mockFunnelMetrics, mockPerformanceMetrics } from '../../../analytics/__tests__/mocks';

type RenderProps = Partial<UseTableInteractionMetricsProps>;

const defaultProps = {
  getComponentConfiguration: () => ({}),
  getComponentIdentifier: () => 'My resources',
  itemCount: 10,
  loading: undefined,
  instanceIdentifier: undefined,
  interactionMetadata: () => '',
} satisfies RenderProps;

function renderUseTableInteractionMetricsHook(props: RenderProps, wrapper?: RenderHookOptions<RenderProps>['wrapper']) {
  const elementRef = createRef<HTMLElement>();

  const { result, rerender, unmount } = renderHook(useTableInteractionMetrics, {
    initialProps: { elementRef, ...defaultProps, ...props },
    wrapper,
  });

  return {
    tableInteractionAttributes: result.current.tableInteractionAttributes,
    setLastUserAction: (name: string) => result.current.setLastUserAction(name),
    rerender: (props: RenderProps) => rerender({ elementRef, ...defaultProps, ...props }),
    unmount,
  };
}

function TestComponent(props: RenderProps) {
  const elementRef = useRef<HTMLDivElement>(null);
  const { tableInteractionAttributes } = useTableInteractionMetrics({ elementRef, ...defaultProps, ...props });
  return <div {...tableInteractionAttributes} ref={elementRef} data-testid="element" />;
}

function FunnelWrapper({ children }: { children: React.ReactNode }) {
  return (
    <AnalyticsFunnel funnelType="single-page" optionalStepNumbers={[]} totalFunnelSteps={1}>
      {children}
    </AnalyticsFunnel>
  );
}

const componentMounted = jest.fn();
const componentUpdated = jest.fn();

setComponentMetrics({
  componentMounted,
  componentUpdated,
});

beforeEach(() => {
  jest.resetAllMocks();
  mockPerformanceMetrics();
  mockFunnelMetrics();
});

jest.useFakeTimers();

describe('useTableInteractionMetrics', () => {
  test('should emit componentMount event on mount', () => {
    render(<TestComponent />);

    expect(componentMounted).toHaveBeenCalledTimes(1);
    expect(componentMounted).toHaveBeenCalledWith({
      taskInteractionId: expect.any(String),
      componentName: 'table',
      componentConfiguration: {},
    });
  });

  test('should not emit componentMount event when inside a funnel', () => {
    render(
      <FunnelWrapper>
        <TestComponent />
      </FunnelWrapper>
    );
    jest.runAllTimers();

    expect(componentMounted).toHaveBeenCalledTimes(0);
  });

  test('data attribute should be present after the first render', () => {
    const { getByTestId } = render(<TestComponent />);
    jest.runAllTimers();

    expect(getByTestId('element')).toHaveAttribute('data-analytics-task-interaction-id');
  });

  test('data attribute should be present after re-rendering', () => {
    const { getByTestId, rerender } = render(<TestComponent />);
    const attributeValueBefore = getByTestId('element').getAttribute('data-analytics-task-interaction-id');
    rerender(<TestComponent />);

    expect(getByTestId('element')).toHaveAttribute('data-analytics-task-interaction-id');

    const attributeValueAfter = getByTestId('element').getAttribute('data-analytics-task-interaction-id');
    expect(attributeValueAfter).toBe(attributeValueBefore);
  });

  test('should not render the attribute during server-side rendering', () => {
    const markup = renderToStaticMarkup(<TestComponent />);

    expect(markup).toBe('<div data-testid="element"></div>');
  });

  describe('Interactions', () => {
    test('user actions should be recorded if they happened recently', () => {
      const { setLastUserAction, rerender } = renderUseTableInteractionMetricsHook({});

      setLastUserAction('filter');
      rerender({ loading: true });

      jest.advanceTimersByTime(3456);

      expect(PerformanceMetrics.tableInteraction).toHaveBeenCalledTimes(0);
      expect(ComponentMetrics.componentUpdated).toHaveBeenCalledTimes(0);
      rerender({ loading: false });

      expect(PerformanceMetrics.tableInteraction).toHaveBeenCalledTimes(1);
      expect(PerformanceMetrics.tableInteraction).toHaveBeenCalledWith(
        expect.objectContaining({
          userAction: 'filter',
          interactionTime: 3456,
        })
      );

      expect(ComponentMetrics.componentUpdated).toHaveBeenCalledTimes(1);
      expect(ComponentMetrics.componentUpdated).toHaveBeenCalledWith({
        taskInteractionId: expect.any(String),
        componentName: 'table',
        actionType: 'filter',
        componentConfiguration: {},
      });
    });

    test('componentUpdated should not be called when in a funnel', () => {
      const { setLastUserAction, rerender } = renderUseTableInteractionMetricsHook({}, FunnelWrapper);

      setLastUserAction('filter');
      rerender({ loading: true });

      jest.advanceTimersByTime(3456);
      rerender({ loading: false });
      expect(ComponentMetrics.componentUpdated).toHaveBeenCalledTimes(0);
    });

    test('user actions should not be recorded if they happened a longer time ago', () => {
      const { setLastUserAction, rerender } = renderUseTableInteractionMetricsHook({});

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
      const { setLastUserAction, rerender } = renderUseTableInteractionMetricsHook({});

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
      const { setLastUserAction, rerender } = renderUseTableInteractionMetricsHook({});
      jest.runAllTimers();

      setLastUserAction('filter');
      rerender({ loading: true });

      setLastUserAction('pagination');
      rerender({ loading: true });

      rerender({ loading: false });

      expect(ComponentMetrics.componentUpdated).toHaveBeenCalledTimes(1);
      expect(ComponentMetrics.componentUpdated).toHaveBeenCalledWith(
        expect.objectContaining({
          actionType: 'filter',
        })
      );

      expect(PerformanceMetrics.tableInteraction).toHaveBeenCalledTimes(1);
      expect(PerformanceMetrics.tableInteraction).toHaveBeenCalledWith(
        expect.objectContaining({
          userAction: 'filter',
        })
      );
    });

    test('interactionMetadata is added to the performance metrics', () => {
      const { setLastUserAction, rerender } = renderUseTableInteractionMetricsHook({});
      const interactionMetadataValue = '{filterText = test}';
      setLastUserAction('filter');
      rerender({ loading: true });
      rerender({
        loading: false,
        interactionMetadata: () => {
          return interactionMetadataValue;
        },
      });

      expect(PerformanceMetrics.tableInteraction).toHaveBeenCalledTimes(1);
      expect(PerformanceMetrics.tableInteraction).toHaveBeenCalledWith(
        expect.objectContaining({
          userAction: 'filter',
          interactionMetadata: interactionMetadataValue,
        })
      );
    });

    test('componentConfiguration is added to the component updated metrics', () => {
      const { setLastUserAction, rerender } = renderUseTableInteractionMetricsHook({});
      const componentConfiguration = { filterText: 'test' };
      setLastUserAction('filter');
      rerender({ loading: true });
      rerender({
        loading: false,
        getComponentConfiguration: () => componentConfiguration,
      });

      expect(ComponentMetrics.componentUpdated).toHaveBeenCalledTimes(1);
      expect(ComponentMetrics.componentUpdated).toHaveBeenCalledWith(
        expect.objectContaining({
          actionType: 'filter',
          componentConfiguration,
        })
      );
    });
  });
});
