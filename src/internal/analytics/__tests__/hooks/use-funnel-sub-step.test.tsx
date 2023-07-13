// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';

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
        value={{ funnelInteractionId, funnelState: { current: 'default' } } as Partial<FunnelContextValue> as any}
      >
        <FunnelSubStepContext.Provider
          value={{
            subStepId,
            subStepSelector,
            subStepNameSelector,
            subStepRef: ref,
            isNestedSubStep: false,
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

  test('calls funnelSubStepStart when the substep is focused', () => {
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
        value={{ funnelInteractionId, funnelState: { current: 'default' } } as Partial<FunnelContextValue> as any}
      >
        <FunnelSubStepContext.Provider
          value={{
            subStepId,
            subStepSelector,
            subStepNameSelector,
            subStepRef: ref,
            isNestedSubStep: false,
          }}
        >
          <div ref={ref}>
            <ChildComponent />
          </div>
        </FunnelSubStepContext.Provider>
      </FunnelContext.Provider>
    );

    getByTestId('input').focus();

    expect(FunnelMetrics.funnelSubStepStart).toHaveBeenCalledWith(
      expect.objectContaining({
        subStepSelector,
        subStepNameSelector,
        subStepAllSelector: expect.any(String),
      })
    );
  });

  test('calls funnelSubStepComplete when the substep is blurred', () => {
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
        value={{ funnelInteractionId, funnelState: { current: 'default' } } as Partial<FunnelContextValue> as any}
      >
        <FunnelSubStepContext.Provider
          value={{
            subStepId,
            subStepSelector,
            subStepNameSelector,
            subStepRef: ref,
            isNestedSubStep: false,
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
    input.blur();

    expect(FunnelMetrics.funnelSubStepComplete).toHaveBeenCalledWith(
      expect.objectContaining({
        subStepSelector,
        subStepNameSelector,
        subStepAllSelector: expect.any(String),
      })
    );
  });
});
