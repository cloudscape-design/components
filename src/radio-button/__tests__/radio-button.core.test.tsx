// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';

import RadioButton from '../../../lib/components/radio-button';
import createWrapper from '../../../lib/components/test-utils/dom';
import customCssProps from '../../internal/generated/custom-css-properties';

import abstractSwitchStyles from '../../../lib/components/internal/components/abstract-switch/styles.css.js';
import styles from '../../../lib/components/internal/components/radio-button/styles.selectors.js';

describe('Radio Button native attributes API', () => {
  it('adds native attributes', () => {
    const { container } = render(
      <RadioButton name="group" checked={true} nativeInputAttributes={{ 'data-testid': 'my-test-id' }} />
    );
    expect(container.querySelector('[data-testid="my-test-id"]')).not.toBeNull();
  });
  it('concatenates class names', () => {
    const { container } = render(
      <RadioButton name="group" checked={true} nativeInputAttributes={{ className: 'additional-class' }} />
    );
    const input = container.querySelector('input');
    expect(input).toHaveClass(abstractSwitchStyles['native-input']);
    expect(input).toHaveClass('additional-class');
  });
});

test('style API', () => {
  const wrapper = createWrapper(
    render(
      <RadioButton
        name="group"
        checked={false}
        style={{
          input: {
            stroke: {
              default: 'green',
            },
            fill: {
              default: 'blue',
            },
            focusRing: {
              borderColor: 'orange',
              borderRadius: '2px',
              borderWidth: '1px',
            },
          },
          label: {
            color: {
              default: 'brown',
            },
          },
          description: {
            color: {
              default: 'yellow',
            },
          },
        }}
      >
        Label
      </RadioButton>
    ).container
  );

  const control = wrapper.findByClassName(abstractSwitchStyles.control)!.getElement();
  const label = wrapper.findByClassName(abstractSwitchStyles.label)!.getElement();
  const outerCircle = wrapper.findByClassName(styles['styled-circle-border'])!.getElement();
  const innerCircle = wrapper.findByClassName(styles['styled-circle-fill'])!.getElement();

  expect(getComputedStyle(outerCircle).getPropertyValue('fill')).toBe('blue');
  expect(getComputedStyle(outerCircle).getPropertyValue('stroke')).toBe('green');
  expect(getComputedStyle(innerCircle).getPropertyValue('stroke')).toBe('blue');
  expect(getComputedStyle(control).getPropertyValue(customCssProps.styleFocusRingBorderColor)).toBe('orange');
  expect(getComputedStyle(control).getPropertyValue(customCssProps.styleFocusRingBorderRadius)).toBe('2px');
  expect(getComputedStyle(control).getPropertyValue(customCssProps.styleFocusRingBorderWidth)).toBe('1px');
  expect(getComputedStyle(label).getPropertyValue('color')).toBe('brown');
});
