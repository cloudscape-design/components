// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';

import createWrapper from '../../../lib/components/test-utils/dom';
import Token from '../../../lib/components/token';

const slots = { root: 'a', dismissButton: 'b', unknown: 'c' };

function renderToken(element: React.ReactElement) {
  const { container } = render(element);
  return { container, wrapper: createWrapper(container).findToken()! };
}

describe('Token Style API v2 (implicit styleClassNames)', () => {
  test('applies styleClassNames to the root and dismissButton slots', () => {
    const { container, wrapper } = renderToken(
      <Token label="Token" dismissLabel="Remove" onDismiss={() => {}} {...({ styleClassNames: slots } as any)} />
    );

    const dismissButton = wrapper.findDismiss()!.getElement();
    expect(dismissButton).toHaveClass('b');
    // the root slot lands on the token box, the element that carries the token's own styling
    expect(dismissButton.parentElement).toHaveClass('a');
    expect(container.querySelector('.c')).toBeNull();
  });

  test('applies the slots to the inline variant', () => {
    const { wrapper } = renderToken(
      <Token
        label="Token"
        variant="inline"
        dismissLabel="Remove"
        onDismiss={() => {}}
        {...({ styleClassNames: slots } as any)}
      />
    );
    const dismissButton = wrapper.findDismiss()!.getElement();
    expect(dismissButton).toHaveClass('b');
    expect(dismissButton.parentElement).toHaveClass('a');
  });

  test('does not leak the styleClassNames prop to the DOM', () => {
    const { container } = renderToken(
      <Token label="Token" dismissLabel="Remove" onDismiss={() => {}} {...({ styleClassNames: slots } as any)} />
    );
    expect(container.querySelector('[styleClassNames]')).toBeNull();
  });
});
