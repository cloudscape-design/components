// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { act, render } from '@testing-library/react';

import {
  FunnelContext,
  FunnelContextValue,
  FunnelSubStepContext,
} from '../../../../../lib/components/internal/analytics/context/analytics-context';
import { useFunnelSubStep } from '../../../../../lib/components/internal/analytics/hooks/use-funnel';
import { FunnelMetrics } from '../../../../../lib/components/internal/analytics';
import { DATA_ATTR_FUNNEL_SUBSTEP } from '../../../../../lib/components/internal/analytics/selectors';

import { mockFunnelMetrics } from '../mocks';

describe('useFunnelSubStep hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    mockFunnelMetrics();
  });

  test('assigns correct attributes to given ref container', () => {
    const ChildComponent = () => {
      const { subStepRef, funnelSubStepProps } = useFunnelSubStep();
      return <div data-testid="container" ref={subStepRef} {...funnelSubStepProps} />;
    };

    const funnelInteractionId = '123';
    const subStepId = '456';
    const subStepSelector = 'subStep1';
    const subStepNameSelector = 'subStepName1';

    const ref = { current: null };

    const { getByTestId } = render(
      <FunnelContext.Provider
        value={
          {
            funnelInteractionId,
            funnelState: { current: 'default' },
            latestFocusCleanupFunction: { current: undefined },
          } as Partial<FunnelContextValue> as any
        }
      >
        <FunnelSubStepContext.Provider
          value={{
            subStepId,
            subStepSelector,
            subStepNameSelector,
            subStepRef: ref,
            isNestedSubStep: false,
            isFocusedSubStep: { current: false },
            focusCleanupFunction: { current: undefined },
            mousePressed: { current: false },
          }}
        >
          <div ref={ref}>
            <ChildComponent />
          </div>
        </FunnelSubStepContext.Provider>
      </FunnelContext.Provider>
    );

    const container = getByTestId('container');
    expect(container).toHaveAttribute(DATA_ATTR_FUNNEL_SUBSTEP);
  });

  test('calls funnelSubStepStart when the substep is focused in the default phase', async () => {
    const ChildComponent = () => {
      const { subStepRef, funnelSubStepProps } = useFunnelSubStep();
      return (
        <div ref={subStepRef} {...funnelSubStepProps}>
          <input data-testid="input" />
        </div>
      );
    };

    const funnelInteractionId = '123';
    const subStepId = '456';
    const subStepSelector = 'subStep1';
    const subStepNameSelector = 'subStepName1';

    const ref = { current: null };

    const { getByTestId } = render(
      <FunnelContext.Provider
        value={
          {
            funnelInteractionId,
            funnelState: { current: 'default' },
            latestFocusCleanupFunction: { current: undefined },
          } as Partial<FunnelContextValue> as any
        }
      >
        <FunnelSubStepContext.Provider
          value={{
            subStepId,
            subStepSelector,
            subStepNameSelector,
            subStepRef: ref,
            isNestedSubStep: false,
            isFocusedSubStep: { current: false },
            focusCleanupFunction: { current: undefined },
            mousePressed: { current: false },
          }}
        >
          <div ref={ref}>
            <ChildComponent />
          </div>
        </FunnelSubStepContext.Provider>
      </FunnelContext.Provider>
    );

    act(() => getByTestId('input').focus());

    await runPendingPromises();

    expect(FunnelMetrics.funnelSubStepStart).toHaveBeenCalledWith(
      expect.objectContaining({
        subStepSelector,
        subStepNameSelector,
        subStepAllSelector: expect.any(String),
      })
    );
  });

  test('calls funnelSubStepStart when the substep is focused in the validation phase', async () => {
    const ChildComponent = () => {
      const { subStepRef, funnelSubStepProps } = useFunnelSubStep();
      return (
        <div ref={subStepRef} {...funnelSubStepProps}>
          <input data-testid="input" />
        </div>
      );
    };

    const funnelInteractionId = '123';
    const subStepId = '456';
    const subStepSelector = 'subStep1';
    const subStepNameSelector = 'subStepName1';

    const { getByTestId, rerender } = render(
      <FunnelContext.Provider
        value={
          {
            funnelInteractionId,
            funnelState: { current: 'default' },
            latestFocusCleanupFunction: { current: undefined },
          } as Partial<FunnelContextValue> as any
        }
      >
        <FunnelSubStepContext.Provider
          value={{
            subStepRef: { current: null },
            isNestedSubStep: false,
            subStepId,
            subStepSelector,
            subStepNameSelector,
            isFocusedSubStep: { current: false },
            focusCleanupFunction: { current: undefined },
            mousePressed: { current: false },
          }}
        >
          <ChildComponent />
        </FunnelSubStepContext.Provider>
      </FunnelContext.Provider>
    );

    rerender(
      <FunnelContext.Provider
        value={
          {
            funnelInteractionId,
            funnelState: { current: 'validating' },
            latestFocusCleanupFunction: { current: undefined },
          } as Partial<FunnelContextValue> as any
        }
      >
        <FunnelSubStepContext.Provider
          value={{
            subStepRef: { current: null },
            isNestedSubStep: false,
            subStepId,
            subStepSelector,
            subStepNameSelector,
            isFocusedSubStep: { current: false },
            focusCleanupFunction: { current: undefined },
            mousePressed: { current: false },
          }}
        >
          <ChildComponent />
        </FunnelSubStepContext.Provider>
      </FunnelContext.Provider>
    );

    act(() => getByTestId('input').focus());

    await runPendingPromises();

    expect(FunnelMetrics.funnelSubStepStart).toHaveBeenCalledWith(
      expect.objectContaining({
        subStepSelector,
        subStepNameSelector,
        subStepAllSelector: expect.any(String),
      })
    );
  });

  test('calls funnelSubStepComplete when the substep is blurred', async () => {
    const ChildComponent = () => {
      const { subStepRef, funnelSubStepProps } = useFunnelSubStep();
      return (
        <div ref={subStepRef} {...funnelSubStepProps}>
          <input data-testid="input" />
        </div>
      );
    };
    const funnelInteractionId = '123';
    const subStepId = '456';
    const subStepSelector = 'subStep1';
    const subStepNameSelector = 'subStepName1';

    const ref = { current: null };

    const { getByTestId } = render(
      <FunnelContext.Provider
        value={
          {
            funnelInteractionId,
            funnelState: { current: 'default' },
            latestFocusCleanupFunction: { current: undefined },
          } as Partial<FunnelContextValue> as any
        }
      >
        <FunnelSubStepContext.Provider
          value={{
            subStepId,
            subStepSelector,
            subStepNameSelector,
            subStepRef: ref,
            isNestedSubStep: false,
            isFocusedSubStep: { current: false },
            focusCleanupFunction: { current: undefined },
            mousePressed: { current: false },
          }}
        >
          <div ref={ref}>
            <ChildComponent />
          </div>
        </FunnelSubStepContext.Provider>
      </FunnelContext.Provider>
    );

    const input = getByTestId('input');

    input.focus();
    await runPendingPromises();

    input.blur();
    jest.runAllTimers();

    expect(FunnelMetrics.funnelSubStepComplete).toHaveBeenCalledWith(
      expect.objectContaining({
        subStepSelector,
        subStepNameSelector,
        subStepAllSelector: expect.any(String),
      })
    );
  });
});

const runPendingPromises = async () => {
  jest.runAllTimers();
  await Promise.resolve();
};
