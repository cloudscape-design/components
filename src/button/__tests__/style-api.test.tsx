// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';

import Button from '../../../lib/components/button';
import createWrapper from '../../../lib/components/test-utils/dom';

function renderButton(element: React.ReactElement) {
  const { container } = render(element);
  return createWrapper(container).findButton()!.getElement();
}

describe('Button Style API v2 (implicit styleClassNames)', () => {
  test('applies styleClassNames', () => {
    const link = renderButton(<Button href="#" {...({ styleClassNames: { root: 'a', unknown: 'c' } } as any)} />);
    expect(link).toHaveClass('a');
    expect(link).not.toHaveClass('unknown');

    const button = renderButton(<Button {...({ styleClassNames: { root: 'b', unknown: 'c' } } as any)} />);
    expect(button).toHaveClass('b');
    expect(button).not.toHaveClass('unknown');
  });

  test('does not leak the styleClassNames prop to the DOM', () => {
    const link = renderButton(<Button href="#" {...({ styleClassNames: { root: 'a' } } as any)} />);
    expect(link).not.toHaveAttribute('styleClassNames');

    const button = renderButton(<Button {...({ styleClassNames: { root: 'b' } } as any)} />);
    expect(button).not.toHaveAttribute('styleClassNames');
  });
});
