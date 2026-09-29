// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';

import Link from '../../../lib/components/link';
import createWrapper from '../../../lib/components/test-utils/dom';

function renderLink(element: React.ReactElement) {
  const { container } = render(element);
  return createWrapper(container).findLink()!.getElement();
}

describe('Link Style API v2 (implicit styleClassNames)', () => {
  test('applies styleClassNames', () => {
    const link = renderLink(<Link href="#" {...({ styleClassNames: { root: 'a', unknown: 'c' } } as any)} />);
    expect(link).toHaveClass('a');
    expect(link).not.toHaveClass('c');

    const button = renderLink(<Link {...({ styleClassNames: { root: 'b', unknown: 'c' } } as any)} />);
    expect(button).toHaveAttribute('role', 'button');
    expect(button).toHaveClass('b');
    expect(button).not.toHaveClass('c');

    const inverted = renderLink(
      <Link href="#" color="inverted" {...({ styleClassNames: { root: 'inverted' } } as any)} />
    );
    expect(inverted).toHaveClass('inverted');
  });

  test('does not leak the styleClassNames prop to the DOM', () => {
    const link = renderLink(<Link href="#" {...({ styleClassNames: { root: 'a' } } as any)} />);
    expect(link).not.toHaveAttribute('styleClassNames');
    expect(link).not.toHaveAttribute('styleclassnames');

    const button = renderLink(<Link {...({ styleClassNames: { root: 'b' } } as any)} />);
    expect(button).not.toHaveAttribute('styleClassNames');
    expect(button).not.toHaveAttribute('styleclassnames');
  });
});
