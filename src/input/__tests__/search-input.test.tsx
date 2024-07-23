// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';

import Input, { InputProps } from '../../../lib/components/input';
import createWrapper, { InputWrapper } from '../../../lib/components/test-utils/dom';

function renderInput(
  props: Omit<InputProps, 'value'> & { value?: string } & React.RefAttributes<HTMLInputElement> = {}
) {
  const { container } = render(<Input value="" onChange={() => {}} {...props} />);
  return createWrapper(container).findInput()!;
}

function getNativeInput(wrapper: InputWrapper) {
  return wrapper.findNativeInput()!.getElement();
}

function getClearButton(wrapper: InputWrapper) {
  return wrapper.findClearButton()!.getElement();
}

describe('Clear field', () => {
  const baseProps: Omit<InputProps, 'value'> = {
    type: 'search',
  };

  test('does not display clear icon when value not set', () => {
    const wrapper = renderInput(baseProps);
    expect(wrapper.findClearButton()).toBeNull();
  });

  test('does not display clear icon when value is set but field is disabled', () => {
    const wrapper = renderInput({ ...baseProps, value: 'whatever', disabled: true });
    expect(wrapper.findClearButton()).toBeNull();
  });

  test('does not display clear icon when value is not set and field is disabled', () => {
    const wrapper = renderInput({ ...baseProps, disabled: true });
    expect(wrapper.findClearButton()).toBeNull();
  });

  test('does not display clear icon when value is set but field is readOnly', () => {
    const wrapper = renderInput({ ...baseProps, value: 'whatever', readOnly: true });
    expect(wrapper.findClearButton()).toBeNull();
  });

  test('does not display clear icon when value is not set and field is readOnly', () => {
    const wrapper = renderInput({ ...baseProps, readOnly: true });
    expect(wrapper.findClearButton()).toBeNull();
  });

  test('displays clear icon when value set', () => {
    const wrapper = renderInput({ ...baseProps, value: 'whatever' });
    expect(wrapper.findClearButton()).not.toBeNull();
  });

  describe('when cleared', () => {
    test('does not modify the field directly', () => {
      const wrapper = renderInput({ ...baseProps, value: 'whatever' });
      getClearButton(wrapper).click();

      expect(getNativeInput(wrapper)).toHaveValue('whatever');
    });

    test('focuses field and triggers focus event', () => {
      const spy = jest.fn();
      const wrapper = renderInput({ ...baseProps, value: 'whatever', onFocus: spy });
      expect(getNativeInput(wrapper)).not.toBe(document.activeElement);

      getClearButton(wrapper).click();
      expect(getNativeInput(wrapper)).toBe(document.activeElement);
      expect(spy).toHaveBeenCalled();
    });

    test('does not trigger the focus event when focused', () => {
      const spy = jest.fn();
      const wrapper = renderInput({ ...baseProps, value: 'whatever', onFocus: spy });

      getNativeInput(wrapper).focus();
      expect(getNativeInput(wrapper)).toBe(document.activeElement);

      spy.mockReset();
      getClearButton(wrapper).click();
      expect(spy).not.toHaveBeenCalled();
    });

    test('triggers onChange handler with a correct event detail', () => {
      const spy = jest.fn();
      const wrapper = renderInput({ ...baseProps, value: 'whatever', onChange: spy });

      getClearButton(wrapper).click();
      expect(spy).toHaveBeenCalledWith(expect.objectContaining({ detail: { value: '' } }));
    });

    test('does not trigger the blur event when focused', () => {
      const spy = jest.fn();
      const wrapper = renderInput({ ...baseProps, value: 'whatever', onBlur: spy });

      getNativeInput(wrapper).focus();
      expect(getNativeInput(wrapper)).toBe(document.activeElement);

      getClearButton(wrapper).click();
      expect(spy).not.toHaveBeenCalled();
    });

    test('does not trigger the blur event when not focused', () => {
      const spy = jest.fn();
      const wrapper = renderInput({ ...baseProps, value: 'whatever', onBlur: spy });
      expect(getNativeInput(wrapper)).not.toBe(document.activeElement);

      getClearButton(wrapper).click();
      expect(spy).not.toHaveBeenCalled();
    });
  });
});
