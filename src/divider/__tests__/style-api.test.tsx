// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';

import Divider from '../../../lib/components/divider';
import createWrapper from '../../../lib/components/test-utils/dom';

describe('Divider Style API v2', () => {
  test('applies the root slot with and without a label', () => {
    const { container } = render(
      <>
        <Divider {...({ styleClassNames: { root: 'a', unknown: 'b' } } as any)} />
        <Divider {...({ styleClassNames: { root: 'c' } } as any)}>Label</Divider>
      </>
    );
    const [plain, labelled] = createWrapper(container).findAllDividers();
    expect(plain.getElement()).toHaveClass('a');
    expect(labelled.getElement()).toHaveClass('c');
    expect(container.querySelector('.b')).toBeNull();
  });

  test('does not leak the styleClassNames prop to the DOM', () => {
    const { container } = render(<Divider {...({ styleClassNames: { root: 'a' } } as any)} />);
    expect(container.querySelector('[styleClassNames]')).toBeNull();
  });
});
