// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';

import RadioButton from '../../../lib/components/radio-button';
import createWrapper from '../../../lib/components/test-utils/dom';

function renderRadioButton(element: React.ReactElement) {
  const { container } = render(element);
  return { container, wrapper: createWrapper(container).findRadioButton()! };
}

describe('RadioButton Style API v2', () => {
  test('applies styleClassNames to the control, label, and description slots', () => {
    const { container, wrapper } = renderRadioButton(
      <RadioButton
        name="plan"
        value="pro"
        checked={false}
        description="Description"
        {...({ styleClassNames: { control: 'a', label: 'b', description: 'c', unknown: 'd' } } as any)}
      >
        Label
      </RadioButton>
    );
    expect(wrapper.findNativeInput().getElement().parentElement).toHaveClass('a');
    expect(container.querySelector('.b')).toHaveTextContent('Label');
    expect(wrapper.findDescription()!.getElement()).toHaveClass('c');
    expect(container.querySelector('.d')).toBeNull();
  });

  test('does not leak the styleClassNames prop to the DOM', () => {
    const { container } = renderRadioButton(
      <RadioButton
        name="plan"
        value="pro"
        checked={false}
        {...({ styleClassNames: { control: 'a', label: 'b' } } as any)}
      >
        Label
      </RadioButton>
    );
    expect(container.querySelector('[styleClassNames]')).toBeNull();
  });
});
