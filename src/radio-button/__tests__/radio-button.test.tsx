// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';

import { RadioButtonProps } from '../../../lib/components/internal/components/radio-button/interfaces';
import RadioButton from '../../../lib/components/radio-button';
import createWrapper from '../../../lib/components/test-utils/dom';
import customCssProps from '../../internal/generated/custom-css-properties';

import abstractSwitchStyles from '../../../lib/components/internal/components/abstract-switch/styles.css.js';
import styles from '../../../lib/components/internal/components/radio-button/styles.selectors.js';

function renderRadioButton(node: React.ReactNode) {
  const wrapper = createWrapper(render(<>{node}</>).container);
  return wrapper.findRadioButton()!;
}

describe('native attributes from props', () => {
  test('sets the `checked` attribute of the native element to true when `checked` is true', () => {
    const radioButton = renderRadioButton(<RadioButton name="my-radio-group-name" checked={true} />);
    expect(radioButton.findNativeInput()!.getElement().checked).toBe(true);
  });

  test('sets the `checked` attribute of the native element to false when `checked` is false', () => {
    const radioButton = renderRadioButton(<RadioButton name="my-radio-group-name" checked={false} />);
    expect(radioButton.findNativeInput()!.getElement().checked).toBe(false);
  });

  test('propagates the value of the `name` prop to the `name` attribute of the native element', () => {
    const radioButton = renderRadioButton(<RadioButton name="my-radio-group-name" checked={false} />);
    expect(radioButton.findNativeInput()!.getElement().getAttribute('name')).toBe('my-radio-group-name');
  });

  test('propagates the value of the `value` prop to the `value` attribute of the native element', () => {
    const radioButton = renderRadioButton(<RadioButton value="my-radio-button-value" name="group" checked={false} />);
    expect(radioButton.findNativeInput()!.getElement().getAttribute('value')).toBe('my-radio-button-value');
  });
});

describe('native attributes API', () => {
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

describe('events', () => {
  test('fires a single onSelect event on input click', () => {
    const onSelect = jest.fn();
    const radioButton = renderRadioButton(<RadioButton name="group" checked={false} onSelect={onSelect} />);
    radioButton.findNativeInput()!.click();
    expect(onSelect).toHaveBeenCalledTimes(1);
  });

  test('fires a single onSelect event on label click', () => {
    const onSelect = jest.fn();
    const radioButton = renderRadioButton(
      <RadioButton name="group" checked={false} onSelect={onSelect}>
        My radio button label
      </RadioButton>
    );
    radioButton.findLabel()!.click();
    expect(onSelect).toHaveBeenCalledTimes(1);
  });

  test('fires a single onSelect event on description click', () => {
    const onSelect = jest.fn();
    const radioButton = renderRadioButton(
      <RadioButton name="group" checked={false} onSelect={onSelect} description="My radio button description" />
    );
    radioButton.findDescription()!.click();
    expect(onSelect).toHaveBeenCalledTimes(1);
  });

  test('does not trigger onSelect if disabled', () => {
    const onSelect = jest.fn();
    const radioButton = renderRadioButton(
      <RadioButton name="group" checked={false} disabled={true} onSelect={onSelect} />
    );

    radioButton.findLabel().click();

    expect(radioButton.findNativeInput().getElement()).not.toBeChecked();
    expect(onSelect).not.toHaveBeenCalled();
  });

  test('does not trigger onSelect if readOnly', () => {
    const onSelect = jest.fn();
    const radioButton = renderRadioButton(
      <RadioButton name="group" checked={false} readOnly={true} onSelect={onSelect} />
    );

    radioButton.findLabel().click();

    expect(radioButton.findNativeInput().getElement()).not.toBeChecked();
    expect(onSelect).not.toHaveBeenCalled();
  });

  test('can be focused via API', () => {
    let checkboxRef: RadioButtonProps.Ref | null = null;

    const radioButton = renderRadioButton(
      <RadioButton name="group" ref={ref => (checkboxRef = ref)} checked={false} />
    );
    expect(checkboxRef).toBeDefined();

    checkboxRef!.focus();
    expect(radioButton.findNativeInput().getElement()).toHaveFocus();
  });

  test('does not trigger any change events when value is changed through API', () => {
    const onSelect = jest.fn();
    const { container, rerender } = render(<RadioButton name="group" checked={false} onSelect={onSelect} />);
    const radioButton = createWrapper(container).findRadioButton()!;
    expect(radioButton.findNativeInput().getElement()).not.toBeChecked();

    rerender(<RadioButton name="group" checked={true} onSelect={onSelect} />);
    expect(radioButton.findNativeInput().getElement()).toBeChecked();

    rerender(<RadioButton name="group" checked={false} onSelect={onSelect} />);
    expect(onSelect).not.toHaveBeenCalled();
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

describe('test utils', () => {
  test('findRadioButton', () => {
    const radioButton = renderRadioButton(<RadioButton name="group" checked={false} />);
    expect(radioButton).toBeTruthy();
  });

  test('findAllRadioButtons', () => {
    const wrapper = createWrapper(
      render(
        <div>
          <RadioButton name="group" checked={false} />
          <RadioButton name="group" checked={false} />
        </div>
      ).container
    );
    expect(wrapper.findAllRadioButtons()).toHaveLength(2);
  });

  test('findLabel', () => {
    const radioButton = renderRadioButton(
      <RadioButton name="group" checked={false}>
        My radio button label
      </RadioButton>
    );
    expect(radioButton.findLabel().getElement().textContent).toBe('My radio button label');
  });

  test('findDescription', () => {
    const radioButton = renderRadioButton(
      <RadioButton name="group" checked={false} description="My radio button description" />
    );
    expect(radioButton.findDescription()!.getElement().textContent).toBe('My radio button description');
  });

  test('findNativeInput', () => {
    const radioButton = renderRadioButton(<RadioButton name="group" checked={false} />);
    expect(radioButton.findNativeInput()!.getElement().tagName).toBe('INPUT');
  });
});
