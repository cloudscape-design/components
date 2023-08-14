// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';

import { FunnelStepContext } from '../../../../../lib/components/internal/analytics/context/analytics-context';
import { useFunnelStep } from '../../../../../lib/components/internal/analytics/hooks/use-funnel';

describe('useFunnelStep hook', () => {
  test('returns the correct initial context value', () => {
    const ChildComponent = () => {
      const { stepNumber, stepNameSelector } = useFunnelStep();
      return (
        <>
          <div data-testid="stepNumber">{stepNumber}</div>
          <div data-testid="stepNameSelector">{stepNameSelector}</div>
        </>
      );
    };

    const { getByTestId } = render(
      <FunnelStepContext.Provider
        value={{
          stepNameSelector: 'step_name_selector',
          stepNumber: 0,
          subStepCount: { current: 0 },
          isInStep: true,
          funnelInteractionId: 'a placeholder funnel interaction ID',
        }}
      >
        <ChildComponent />
      </FunnelStepContext.Provider>
    );

    expect(getByTestId('stepNumber')).toHaveTextContent('0');
    expect(getByTestId('stepNameSelector')).toHaveTextContent('step_name_selector');
  });
});
