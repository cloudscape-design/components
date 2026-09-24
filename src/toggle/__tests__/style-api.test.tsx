// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';

import createWrapper from '../../../lib/components/test-utils/dom';
import Toggle from '../../../lib/components/toggle';

function renderToggle(element: React.ReactElement) {
  const { container } = render(element);
  return { container, wrapper: createWrapper(container).findToggle()! };
}

describe('Toggle Style API v2', () => {
  test('applies styleClassNames to the control, label, and description slots', () => {
    const { container, wrapper } = renderToggle(
      <Toggle
        checked={false}
        description="Description"
        {...({ styleClassNames: { control: 'a', label: 'b', description: 'c', unknown: 'd' } } as any)}
      >
        Label
      </Toggle>
    );
    expect(wrapper.findNativeInput().getElement().parentElement).toHaveClass('a');
    expect(container.querySelector('.b')).toHaveTextContent('Label');
    expect(wrapper.findDescription()!.getElement()).toHaveClass('c');
    expect(container.querySelector('.d')).toBeNull();
  });

  test('does not leak the styleClassNames prop to the DOM', () => {
    const { container } = renderToggle(
      <Toggle checked={false} {...({ styleClassNames: { control: 'a', label: 'b' } } as any)}>
        Label
      </Toggle>
    );
    expect(container.querySelector('[styleClassNames]')).toBeNull();
  });
});
