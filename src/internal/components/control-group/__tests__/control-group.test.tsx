// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';

import InternalControlGroup from '../../../../../lib/components/internal/components/control-group';

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
});
