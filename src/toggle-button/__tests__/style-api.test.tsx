// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';

import createWrapper from '../../../lib/components/test-utils/dom';
import ToggleButton from '../../../lib/components/toggle-button';

function renderToggleButton(element: React.ReactElement) {
  const { container } = render(element);
  return createWrapper(container).findToggleButton()!.getElement();
}

describe('ToggleButton Style API v2 (implicit styleClassNames)', () => {
  test('applies styleClassNames', () => {
    const button = renderToggleButton(
      <ToggleButton pressed={false} {...({ styleClassNames: { root: 'a', unknown: 'b' } } as any)} />
    );
    expect(button).toHaveClass('a');
    expect(button).not.toHaveClass('unknown');
  });

  test('does not leak the styleClassNames prop to the DOM', () => {
    const button = renderToggleButton(
      <ToggleButton pressed={false} {...({ styleClassNames: { root: 'a' } } as any)} />
    );
    expect(button).not.toHaveAttribute('styleClassNames');
  });
});
