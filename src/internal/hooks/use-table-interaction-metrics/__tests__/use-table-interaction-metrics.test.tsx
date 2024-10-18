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
import {
  useTableInteractionMetrics,
  UseTableInteractionMetricsProps,
} from '../../../../../lib/components/internal/hooks/use-table-interaction-metrics';
import { renderHook } from '../../../../__tests__/render-hook';
import { mockPerformanceMetrics } from '../../../analytics/__tests__/mocks';

type RenderProps = Partial<UseTableInteractionMetricsProps>;

const defaultProps = {
  getComponentConfiguration: () => '',
  getComponentIdentifier: () => 'My resources',
  itemCount: 10,
  loading: undefined,
  instanceIdentifier: undefined,
  interactionMetadata: () => '',
} satisfies RenderProps;

function renderUseTableInteractionMetricsHook(props: RenderProps) {
  const elementRef = createRef<HTMLElement>();

  const { result, rerender, unmount } = renderHook(useTableInteractionMetrics, {
    initialProps: { elementRef, ...defaultProps, ...props },
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

beforeEach(() => {
  jest.resetAllMocks();
  mockPerformanceMetrics();
});
jest.useFakeTimers();

describe('useTableInteractionMetrics', () => {
  let componentMounted: jest.Mock;

  beforeEach(() => {
    componentMounted = jest.fn();

    setComponentMetrics({
      componentMounted,
      componentUpdated: jest.fn(),
    });
  });

  test('should emit componentMount event on mount', () => {
    render(<TestComponent />);

    expect(componentMounted).toHaveBeenCalledTimes(1);
    expect(componentMounted).toHaveBeenCalledWith({
      taskInteractionId: expect.any(String),
      componentName: 'table',
      componentConfiguration: '',
    });
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
    let componentUpdated: jest.Mock;

    beforeEach(() => {
      componentUpdated = jest.fn();

      setComponentMetrics({
        componentMounted: jest.fn(),
        componentUpdated,
      });
    });

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
        componentConfiguration: '',
      });
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
      const componentConfigurationValue = '{filterText = test}';
      setLastUserAction('filter');
      rerender({ loading: true });
      rerender({
        loading: false,
        getComponentConfiguration: () => componentConfigurationValue,
      });

      expect(ComponentMetrics.componentUpdated).toHaveBeenCalledTimes(1);
      expect(ComponentMetrics.componentUpdated).toHaveBeenCalledWith(
        expect.objectContaining({
          actionType: 'filter',
          componentConfiguration: componentConfigurationValue,
        })
      );
    });
  });
});
