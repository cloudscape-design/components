// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';

import Button from '../../../lib/components/button';
import createWrapper from '../../../lib/components/test-utils/dom';

describe('Button native attributes', () => {
  test('passes nativeAttributes to the button element', () => {
    const { container } = render(
      <Button
        nativeAttributes={{
          'data-testid': 'test-button',
          'aria-controls': 'controlled-element',
        }}
      >
        Button text
      </Button>
    );
    const wrapper = createWrapper(container).findButton()!;

    expect(wrapper.getElement()).toHaveAttribute('data-testid', 'test-button');
    expect(wrapper.getElement()).toHaveAttribute('aria-controls', 'controlled-element');
  });

  test('passes nativeAttributes to the anchor element when href is provided', () => {
    const { container } = render(
      <Button
        href="https://example.com"
        nativeAttributes={{
          'data-testid': 'test-link',
          'aria-controls': 'controlled-element',
        }}
      >
        Link text
      </Button>
    );
    const wrapper = createWrapper(container).findButton()!;

    expect(wrapper.getElement()).toHaveAttribute('data-testid', 'test-link');
    expect(wrapper.getElement()).toHaveAttribute('aria-controls', 'controlled-element');
    expect(wrapper.getElement().tagName).toBe('A');
  });

  test('overrides built-in attributes with nativeAttributes', () => {
    const { container } = render(
      <Button
        ariaLabel="Button label"
        nativeAttributes={{
          'aria-label': 'Override label',
        }}
      >
        Button text
      </Button>
    );
    const wrapper = createWrapper(container).findButton()!;

    expect(wrapper.getElement()).toHaveAccessibleName('Override label');
  });
});
