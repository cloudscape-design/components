// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';

import RadioGroup, { RadioGroupProps } from '../../../lib/components/radio-group';
import createWrapper from '../../../lib/components/test-utils/dom';

const items: RadioGroupProps.RadioButtonDefinition[] = [
  { value: 'free', label: 'Free plan' },
  { value: 'pro', label: 'Pro plan' },
  { value: 'enterprise', label: 'Enterprise plan', disabled: true },
];

function renderRadioGroup(styleClassNames: Record<string, unknown>) {
  const { container } = render(<RadioGroup ariaLabel="Plan" value="pro" items={items} {...{ styleClassNames }} />);
  return { container, wrapper: createWrapper(container).findRadioGroup()! };
}

describe('RadioGroup Style API v2', () => {
  test('forwards the radio button classes to every radio', () => {
    const { container, wrapper } = renderRadioGroup({ radioButton: { control: 'a', unknown: 'b' }, unknown: 'c' });
    const buttons = wrapper.findButtons();
    expect(buttons).toHaveLength(3);
    for (const button of buttons) {
      expect(button.findNativeInput().getElement().parentElement).toHaveClass('a');
    }
    expect(container.querySelector('.b, .c')).toBeNull();
  });

  test('does not leak the styleClassNames prop to the DOM', () => {
    const { container } = renderRadioGroup({ radioButton: { control: 'a' } });
    expect(container.querySelector('[styleClassNames]')).toBeNull();
  });
});
