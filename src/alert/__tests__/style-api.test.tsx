// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';

import Alert from '../../../lib/components/alert';

describe('Alert Style API v2', () => {
  test('applies styleClassNames', () => {
    const { container } = render(
      <Alert dismissible={true} {...({ styleClassNames: { root: 'a', dismissButton: 'b', unknown: 'c' } } as any)} />
    );
    expect(container.querySelector('.a')).toBeTruthy();
    expect(container.querySelector('.b')).toBeTruthy();
    expect(container.querySelector('.c')).toBeFalsy();
  });

  test('does not leak the styleClassNames prop to the DOM', () => {
    const { container } = render(<Alert {...({ styleClassNames: { root: 'a', dismissButton: 'b' } } as any)} />);
    expect(container.querySelector('[styleClassNames]')).toBeNull();
  });
});
