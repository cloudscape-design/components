// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';

import { RadioButtonProps } from '../../../lib/components/internal/components/radio-button/interfaces';
import RadioButton from '../../../lib/components/radio-button';
import createWrapper from '../../../lib/components/test-utils/dom';

function renderRadioButton(node: React.ReactNode) {
  const wrapper = createWrapper(render(<>{node}</>).container);
  return wrapper.findRadioButton()!;
}

describe('native attributes', () => {
  test('propagates the value of the `name` prop to the `name` attribute of the native element', () => {
    const radioButton = renderRadioButton(<RadioButton name="my-radio-group-name" checked={false} />);
    expect(radioButton.findNativeInput()!.getElement().getAttribute('name')).toBe('my-radio-group-name');
  });

  test('propagates the value of the `value` prop to the `value` attribute of the native element', () => {
    const radioButton = renderRadioButton(<RadioButton value="my-radio-button-value" name="name" checked={false} />);
    expect(radioButton.findNativeInput()!.getElement().getAttribute('value')).toBe('my-radio-button-value');
  });
});

describe('events', () => {
  test('fires a single onChange event on input click', () => {
    const onChange = jest.fn();
    const radioButton = renderRadioButton(<RadioButton name="name" checked={false} onChange={onChange} />);
    radioButton.findNativeInput()!.click();
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ detail: { checked: true } }));
  });

  test('fires a single onChange event on label click', () => {
    const onChange = jest.fn();
    const radioButton = renderRadioButton(
      <RadioButton name="name" checked={false} onChange={onChange}>
        My radio button label
      </RadioButton>
    );
    radioButton.findLabel()!.click();
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ detail: { checked: true } }));
  });

  test('fires a single onChange event on description click', () => {
    const onChange = jest.fn();
    const radioButton = renderRadioButton(
      <RadioButton name="name" checked={false} onChange={onChange} description="My radio button description" />
    );
    radioButton.findDescription()!.click();
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ detail: { checked: true } }));
  });

  test('does not trigger change handler if disabled', () => {
    const onChange = jest.fn();
    const radioButton = renderRadioButton(
      <RadioButton name="name" checked={false} disabled={true} onChange={onChange} />
    );

    radioButton.findLabel().click();

    expect(radioButton.findNativeInput().getElement()).not.toBeChecked();
    expect(onChange).not.toHaveBeenCalled();
  });

  test('does not trigger change handler if readOnly', () => {
    const onChange = jest.fn();
    const radioButton = renderRadioButton(
      <RadioButton name="name" checked={false} readOnly={true} onChange={onChange} />
    );

    radioButton.findLabel().click();

    expect(radioButton.findNativeInput().getElement()).not.toBeChecked();
    expect(onChange).not.toHaveBeenCalled();
  });

  test('can be focused via API', () => {
    let checkboxRef: RadioButtonProps.Ref | null = null;

    const radioButton = renderRadioButton(<RadioButton name="name" ref={ref => (checkboxRef = ref)} checked={false} />);
    expect(checkboxRef).toBeDefined();

    checkboxRef!.focus();
    expect(radioButton.findNativeInput().getElement()).toHaveFocus();
  });

  test('does not trigger any change events when value is changed through api', () => {
    const onChange = jest.fn();
    const { container, rerender } = render(<RadioButton name="name" checked={false} onChange={onChange} />);
    const radioButton = createWrapper(container).findRadioButton()!;
    expect(radioButton.findNativeInput().getElement()).not.toBeChecked();

    rerender(<RadioButton name="name" checked={true} onChange={onChange} />);
    expect(radioButton.findNativeInput().getElement()).toBeChecked();

    rerender(<RadioButton name="name" checked={false} onChange={onChange} />);
    expect(onChange).not.toHaveBeenCalled();
  });
});

describe('test utils', () => {
  test('findRadioButton', () => {
    const radioButton = renderRadioButton(<RadioButton name="name" checked={false} />);
    expect(radioButton).toBeTruthy();
  });

  test('findAllRadioButtons', () => {
    const wrapper = createWrapper(
      render(
        <div>
          <RadioButton name="name" checked={false} />
          <RadioButton name="name" checked={false} />
        </div>
      ).container
    );
    expect(wrapper.findAllRadioButtons()).toHaveLength(2);
  });

  test('findLabel', () => {
    const radioButton = renderRadioButton(
      <RadioButton name="name" checked={false}>
        My radio button label
      </RadioButton>
    );
    expect(radioButton.findLabel().getElement().textContent).toBe('My radio button label');
  });

  test('findDescription', () => {
    const radioButton = renderRadioButton(
      <RadioButton name="name" checked={false} description="My radio button description" />
    );
    expect(radioButton.findDescription()!.getElement().textContent).toBe('My radio button description');
  });

  test('findNativeInput', () => {
    const radioButton = renderRadioButton(<RadioButton name="name" checked={false} />);
    expect(radioButton.findNativeInput()!.getElement().tagName).toBe('INPUT');
  });
});
