// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';

import { FunnelContext } from '../../../../../lib/components/internal/analytics/context/analytics-context';
import { useFunnel } from '../../../../../lib/components/internal/analytics/hooks/use-funnel';
import { DATA_ATTR_FUNNEL_INTERACTION_ID } from '../../../../../lib/components/internal/analytics/selectors';

describe('useFunnel hook', () => {
  test('adds the correct data attributes', () => {
    const ChildComponent = () => {
      const { funnelProps } = useFunnel();
      return (
        <div data-testid="content" {...funnelProps}>
          Content
        </div>
      );
    };

    const { getByTestId } = render(
      <FunnelContext.Provider
        value={{
          funnelInteractionId: 'funnel-id',
          setFunnelInteractionId: () => {},
          funnelType: 'single-page',
          optionalStepNumbers: [],
          totalFunnelSteps: 0,
          funnelSubmit: () => {},
          funnelCancel: () => {},
        }}
      >
        <ChildComponent />
      </FunnelContext.Provider>
    );

    const content = getByTestId('content');
    expect(content).toHaveAttribute(DATA_ATTR_FUNNEL_INTERACTION_ID);
  });

  test('calls funnelSubmit, funnelCancel and setFunnelInteractionId methods', () => {
    const funnelSubmit = jest.fn();
    const funnelCancel = jest.fn();
    const setFunnelInteractionId = jest.fn();

    const ChildComponent = () => {
      const { funnelProps, funnelSubmit, funnelCancel, setFunnelInteractionId } = useFunnel();
      return (
        <div {...funnelProps}>
          <button onClick={funnelSubmit}>Submit</button>
          <button onClick={funnelCancel}>Cancel</button>
          <button onClick={() => setFunnelInteractionId('funnel-id-test')}>Set Funnel Id</button>
        </div>
      );
    };

    const { getByText } = render(
      <FunnelContext.Provider
        value={{
          funnelInteractionId: 'funnel-id',
          funnelType: 'single-page',
          optionalStepNumbers: [],
          totalFunnelSteps: 0,
          setFunnelInteractionId,
          funnelSubmit,
          funnelCancel,
        }}
      >
        <ChildComponent />
      </FunnelContext.Provider>
    );

    getByText('Submit').click();
    expect(funnelSubmit).toHaveBeenCalledTimes(1);

    getByText('Cancel').click();
    expect(funnelCancel).toHaveBeenCalledTimes(1);

    getByText('Set Funnel Id').click();
    expect(setFunnelInteractionId).toHaveBeenCalledTimes(1);
  });
});
