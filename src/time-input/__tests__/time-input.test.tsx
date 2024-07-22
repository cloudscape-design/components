// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';

import { KeyCode } from '@cloudscape-design/test-utils-core/dist/utils';

import createWrapper from '../../../lib/components/test-utils/dom';
import TimeInput, { TimeInputProps } from '../../../lib/components/time-input';

const defaultProps: TimeInputProps = { value: '' };

function renderTimeInput(props = defaultProps, autoFocus = true) {
  const onChangeSpy = jest.fn();
  const onBlurSpy = jest.fn();
  const onFocusSpy = jest.fn();

  const { container } = render(<TimeInput onChange={onChangeSpy} onBlur={onBlurSpy} onFocus={onFocusSpy} {...props} />);

  const wrapper = createWrapper(container).findTimeInput()!;

  if (autoFocus) {
    wrapper.focus();
    wrapper.findNativeInput().getElement().setSelectionRange(props.value.length, props.value.length);
  }

  return {
    wrapper,
    onChangeSpy,
    onBlurSpy,
    onFocusSpy,
  };
}

describe('Time Input component', () => {
  test('delegates properties to the internal native input', () => {
    const { wrapper } = renderTimeInput({
      value: '11:11:11',
      placeholder: 'hh:mm:ss',
      disabled: true,
      controlId: 'derpId',
      readOnly: true,
      name: 'derpName',
    });

    const nativeInput = wrapper.findNativeInput().getElement();
    expect(nativeInput).toHaveAttribute('disabled');
    expect(nativeInput).toHaveAttribute('readonly');
    expect(nativeInput).toHaveAttribute('id', 'derpId');
    expect(nativeInput).toHaveAttribute('name', 'derpName');
    expect(nativeInput).toHaveAttribute('placeholder', 'hh:mm:ss');
    expect(nativeInput).toHaveValue('11:11:11');
  });

  test('enables autocomplete by default', () => {
    const { wrapper } = renderTimeInput();
    expect(wrapper.findNativeInput().getElement()).toHaveAttribute('autocomplete', 'on');
  });

  test('has auto-correction features turned off', () => {
    const { wrapper } = renderTimeInput();
    const nativeInput = wrapper.findNativeInput().getElement();
    expect(nativeInput).toHaveAttribute('autocorrect', 'off');
    expect(nativeInput).toHaveAttribute('autocapitalize', 'off');
  });

  test('does not decorate native input with attributes by default', () => {
    const { wrapper } = renderTimeInput();
    const nativeInput = wrapper.findNativeInput().getElement();
    expect(nativeInput).not.toHaveAttribute('disabled');
    expect(nativeInput).not.toHaveAttribute('readonly');
    expect(nativeInput).not.toHaveAttribute('placeholder');
    expect(nativeInput).not.toHaveAttribute('name');
  });

  test('is valid by default', () => {
    const { wrapper } = renderTimeInput();
    const nativeInput = wrapper.findNativeInput().getElement();
    expect(nativeInput).not.toHaveClass('awsui-input-valid');
    expect(nativeInput).not.toHaveClass('awsui-input-invalid');
    expect(nativeInput).not.toHaveAttribute('aria-invalid');
  });

  test('controlId can be customized', () => {
    const { wrapper } = renderTimeInput({ ...defaultProps, controlId: 'customControlId' });
    expect(wrapper.findNativeInput().getElement()).toHaveAttribute('id', 'customControlId');
  });

  test('should not accept invalid value attribute passed into component', () => {
    const { wrapper } = renderTimeInput({ value: 'asdf' });
    expect(wrapper.findNativeInput().getElement()).toHaveValue('');
  });

  describe('aria', () => {
    test('aria attributes are not added by default', () => {
      const { wrapper } = renderTimeInput();
      const nativeInput = wrapper.findNativeInput().getElement();
      expect(nativeInput).not.toHaveAttribute('aria-label');
      expect(nativeInput).not.toHaveAttribute('aria-describedby');
      expect(nativeInput).not.toHaveAttribute('aria-labelledby');
      expect(nativeInput).not.toHaveAttribute('aria-required');
    });

    test('aria-label can be set to custom value', () => {
      const { wrapper } = renderTimeInput({ ...defaultProps, ariaLabel: 'custom-label' });
      expect(wrapper.findNativeInput().getElement()).toHaveAttribute('aria-label', 'custom-label');
    });

    test('aria-describedby can be set to custom value', () => {
      const { wrapper } = renderTimeInput({ ...defaultProps, ariaDescribedby: 'my-custom-id' });
      expect(wrapper.findNativeInput().getElement()).toHaveAttribute('aria-describedby', 'my-custom-id');
    });

    test('aria-labelledby can be set to custom value', () => {
      const { wrapper } = renderTimeInput({ ...defaultProps, ariaLabelledby: 'my-custom-id' });
      expect(wrapper.findNativeInput().getElement()).toHaveAttribute('aria-labelledby', 'my-custom-id');
    });

    describe('aria-required', () => {
      test('is added to native input if ariaRequired is passed', () => {
        const { wrapper } = renderTimeInput({ ...defaultProps, ariaRequired: true });
        expect(wrapper.findNativeInput().getElement()).toHaveAttribute('aria-required', 'true');
      });

      test('is not added to native input if ariaRequired is falsy', () => {
        const { wrapper } = renderTimeInput({ ...defaultProps, ariaRequired: false });
        expect(wrapper.findNativeInput().getElement()).not.toHaveAttribute('aria-required');
      });
    });
  });

  describe('Limiting', () => {
    test('should limit hours to 12: "5" to "05" (hh format)', () => {
      const { wrapper, onChangeSpy } = renderTimeInput({
        ...defaultProps,
        format: 'hh',
      });
      wrapper.findNativeInput().keydown({ key: '5' });

      expect(onChangeSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          detail: {
            value: '05',
          },
        })
      );
    });

    test('should allow 12:xx in 12-hour mode', () => {
      const { wrapper, onChangeSpy } = renderTimeInput({
        ...defaultProps,
        use24Hour: false,
        value: '12:5',
      });
      wrapper.findNativeInput().keydown({ key: '5' });

      expect(onChangeSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          detail: {
            value: '12:55:',
          },
        })
      );
    });

    test('should limit hours to 12: "15" to "12" (hh format)', () => {
      const { wrapper, onChangeSpy } = renderTimeInput({
        ...defaultProps,
        use24Hour: false,
        value: '1',
        format: 'hh',
      });
      wrapper.findNativeInput().keydown({ key: '5' });

      expect(onChangeSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          detail: {
            value: '12',
          },
        })
      );
    });

    test('should low-limit hours to 01: "00" to "01"', () => {
      const { wrapper, onChangeSpy } = renderTimeInput({
        ...defaultProps,
        use24Hour: false,
        value: '0',
      });
      wrapper.findNativeInput().keydown({ key: '0' });

      expect(onChangeSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          detail: {
            value: '01:',
          },
        })
      );
    });

    test('should allow 00: in 24-hour mode', () => {
      const { wrapper, onChangeSpy } = renderTimeInput({
        ...defaultProps,
        value: '0',
      });
      wrapper.findNativeInput().keydown({ key: '0' });

      expect(onChangeSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          detail: {
            value: '00:',
          },
        })
      );
    });

    test('should allow "15" hours (24 hours)', () => {
      const { wrapper, onChangeSpy } = renderTimeInput({
        ...defaultProps,
        value: '1',
      });
      wrapper.findNativeInput().keydown({ key: '5' });

      expect(onChangeSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          detail: {
            value: '15:',
          },
        })
      );
    });

    test('should limit hours to 23: "25" to "23" (24 hours)', () => {
      const { wrapper, onChangeSpy } = renderTimeInput({
        ...defaultProps,
        value: '2',
      });
      wrapper.findNativeInput().keydown({ key: '5' });

      expect(onChangeSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          detail: {
            value: '23:',
          },
        })
      );
    });

    test('should limit hours to 12: "5" to "05" (24 hours)', () => {
      const { wrapper, onChangeSpy } = renderTimeInput();

      wrapper.findNativeInput().keydown({ key: '5' });
      expect(onChangeSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          detail: {
            value: '05:',
          },
        })
      );
    });

    test('should limit minutes to 59: "01:6" to "01:06"', () => {
      const { wrapper, onChangeSpy } = renderTimeInput({
        ...defaultProps,
        value: '01:',
      });
      wrapper.findNativeInput().keydown({ key: '6' });

      expect(onChangeSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          detail: {
            value: '01:06:',
          },
        })
      );
    });

    test('should limit minutes to 59: "01:6" to "01:06" (hh:mm format)', () => {
      const { wrapper, onChangeSpy } = renderTimeInput({
        ...defaultProps,
        value: '01:',
        format: 'hh:mm',
      });
      wrapper.findNativeInput().keydown({ key: '6' });

      expect(onChangeSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          detail: {
            value: '01:06',
          },
        })
      );
    });

    test('should limit seconds to 59: "01:23:6" to "01:23:06"', () => {
      const { wrapper, onChangeSpy } = renderTimeInput({
        ...defaultProps,
        value: '01:23:',
      });
      wrapper.findNativeInput().keydown({ key: '6' });

      expect(onChangeSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          detail: {
            value: '01:23:06',
          },
        })
      );
    });
  });

  describe('autocomplete', () => {
    test('should autocomplete on blur', () => {
      const { wrapper, onChangeSpy } = renderTimeInput({
        ...defaultProps,
        value: '1',
      });

      wrapper.blur();

      expect(onChangeSpy).toHaveBeenCalledTimes(1);
      expect(onChangeSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          detail: {
            value: '01:00:00',
          },
        })
      );
    });

    test('should autocomplete on enter', () => {
      const { wrapper, onChangeSpy } = renderTimeInput({
        ...defaultProps,
        value: '1',
      });

      wrapper.findNativeInput().keydown({ key: 'Enter', keyCode: KeyCode.enter });

      expect(onChangeSpy).toHaveBeenCalledTimes(1);
      expect(onChangeSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          detail: {
            value: '01:00:00',
          },
        })
      );
    });
  });

  describe('edge cases', () => {
    test('should fire correct onChange event when given an invalid initial value', () => {
      const { wrapper, onChangeSpy } = renderTimeInput({
        ...defaultProps,
        value: '011',
      });

      expect(wrapper.findNativeInput().getElement().value).toBe('01:');

      wrapper.blur();

      expect(onChangeSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          detail: {
            value: '01:00:00',
          },
        })
      );
    });
  });
});
