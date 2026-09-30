// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';

import InternalControlGroup from '../../../../../lib/components/internal/components/control-group';
import {
  ResetGroupedControlContext,
  useGroupedControlContext,
} from '../../../../../lib/components/internal/context/control-group-context';

function PositionProbe() {
  const { position } = useGroupedControlContext();
  return <div data-testid="probe">{position ?? 'none'}</div>;
}

describe('Control group', () => {
  test('keeps focus on a control when the children are reordered', () => {
    const alpha = <input key="alpha" data-testid="alpha" />;
    const beta = <input key="beta" data-testid="beta" />;

    const { getByTestId, rerender } = render(<InternalControlGroup>{[alpha, beta]}</InternalControlGroup>);

    const alphaInput = getByTestId('alpha');
    alphaInput.focus();
    expect(document.activeElement).toBe(alphaInput);

    // Move the focused control from first to last position.
    rerender(<InternalControlGroup>{[beta, alpha]}</InternalControlGroup>);

    // The same DOM node is still focused; it was moved, not remounted.
    expect(getByTestId('alpha')).toBe(alphaInput);
    expect(document.activeElement).toBe(alphaInput);
  });

  test('exposes a grouped position to a direct child control', () => {
    const { getByTestId } = render(
      <InternalControlGroup>
        <PositionProbe />
      </InternalControlGroup>
    );

    expect(getByTestId('probe')).toHaveTextContent('only');
  });

  test('resets the grouped position for content wrapped in ResetGroupedControlContext', () => {
    // Mirrors a nested control rendered inside a control's custom slot (e.g.
    // Autosuggest `empty`): it must not inherit the surrounding group position.
    const { getByTestId } = render(
      <InternalControlGroup>
        <ResetGroupedControlContext>
          <PositionProbe />
        </ResetGroupedControlContext>
      </InternalControlGroup>
    );

    expect(getByTestId('probe')).toHaveTextContent('none');
  });
});
