// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import { KeyCode } from '@cloudscape-design/test-utils-core/dist/utils';

import MaskedInput, { MaskedInputProps } from '../../../../../lib/components/internal/components/masked-input';
import createWrapper, { InputWrapper } from '../../../../../lib/components/test-utils/dom';

const defaultProps: MaskedInputProps = {
  mask: {
    separator: ':',
    segments: [
      { min: 0, max: 23, length: 2 },
      { min: 0, max: 59, length: 2 },
      { min: 0, max: 59, length: 2 },
    ],
  },
  value: '',
};

function renderMaskedInput(props = defaultProps, autoFocus = true) {
  const onChangeSpy = jest.fn();
  const onBlurSpy = jest.fn();
  const onFocusSpy = jest.fn();
  const onKeyUpSpy = jest.fn();
  const onKeyDownSpy = jest.fn();

  const { container } = render(
    <MaskedInput
      className="testing-masked-input"
      onChange={onChangeSpy}
      onBlur={onBlurSpy}
      onFocus={onFocusSpy}
      onKeyUp={onKeyUpSpy}
      onKeyDown={onKeyDownSpy}
      {...props}
    />
  );

  const wrapper = createWrapper(container).findComponent('.testing-masked-input', InputWrapper)!;

  if (autoFocus) {
    wrapper.focus();
    wrapper.findNativeInput().getElement().setSelectionRange(props.value.length, props.value.length);
  }

  return {
    wrapper,
    onChangeSpy,
    onBlurSpy,
    onFocusSpy,
    onKeyUpSpy,
    onKeyDownSpy,
  };
}

describe('Masked Input component', () => {
  test('should proxy required input events', () => {
    const { wrapper, onBlurSpy, onFocusSpy, onKeyUpSpy, onKeyDownSpy } = renderMaskedInput();

    wrapper.focus();
    wrapper.findNativeInput().keydown({ key: '1' });
    wrapper.findNativeInput().keyup(49);
    wrapper.blur();

    expect(onFocusSpy).toHaveBeenCalledTimes(1);
    expect(onBlurSpy).toHaveBeenCalledTimes(1);
    expect(onKeyUpSpy).toHaveBeenCalledTimes(1);
    expect(onKeyDownSpy).toHaveBeenCalledTimes(1);
  });

  test('should proxy required input events for enter key', () => {
    const { wrapper, onKeyDownSpy } = renderMaskedInput();
    wrapper.findNativeInput().keydown(KeyCode.enter);
    expect(onKeyDownSpy).toHaveBeenCalledTimes(1);
  });

  test('should handle invalid input', () => {
    const { wrapper, onChangeSpy } = renderMaskedInput({ ...defaultProps, value: '011' });
    expect(wrapper.findNativeInput().getElement().value).toBe('01:');
    wrapper.findNativeInput().keydown({ key: '1' });

    expect(onChangeSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        detail: { value: '01:1' },
      })
    );
  });

  test('should autoformat text pasted from clipboard', () => {
    const { wrapper, onChangeSpy } = renderMaskedInput({ ...defaultProps, value: '' });
    fireEvent.paste(wrapper.findNativeInput().getElement(), {
      clipboardData: { getData: () => '111111' },
    });

    expect(onChangeSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        detail: { value: '11:11:11' },
      })
    );
  });

  describe('Change event', () => {
    test('should fire onChange when a valid letter is typed', () => {
      const { wrapper, onChangeSpy } = renderMaskedInput();
      wrapper.findNativeInput().keydown({ key: '1' });

      expect(onChangeSpy).toHaveBeenCalledTimes(1);
      expect(onChangeSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          detail: { value: '1' },
        })
      );
    });

    test('should fire on value change via backspace', () => {
      const { wrapper, onChangeSpy } = renderMaskedInput({
        ...defaultProps,
        value: '04:20:00',
      });

      wrapper.findNativeInput().getElement().setSelectionRange(2, 2);
      wrapper.findNativeInput().keydown(KeyCode.backspace);

      expect(onChangeSpy).toHaveBeenCalledTimes(1);
      expect(onChangeSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          detail: { value: '00:20:00' },
        })
      );
    });

    test('should not fire onChange when an invalid letter is typed', () => {
      const { wrapper, onChangeSpy } = renderMaskedInput();

      wrapper.findNativeInput().keydown({ key: 'a' });
      wrapper.findNativeInput().keydown({ key: ' ' });
      wrapper.findNativeInput().keydown({ key: ';' });

      expect(onChangeSpy).not.toHaveBeenCalled();
    });

    test('should not fire on first blur if value has not changed', () => {
      const { wrapper, onChangeSpy } = renderMaskedInput({ ...defaultProps, value: '11:11:11' });
      wrapper.blur();

      expect(onChangeSpy).not.toHaveBeenCalled();
    });
  });

  describe('Autocomplete', () => {
    test('should autocorrect from invalid input', () => {
      const { wrapper, onChangeSpy } = renderMaskedInput({ ...defaultProps, value: '011' });
      expect(wrapper.findNativeInput().getElement().value).toBe('01:');
      wrapper.blur();

      expect(onChangeSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          detail: { value: '01:00:00' },
        })
      );
    });

    test('should not autocorrect empty input', () => {
      const { wrapper, onChangeSpy } = renderMaskedInput({ ...defaultProps, value: '' });
      expect(wrapper.findNativeInput().getElement().value).toBe('');
      wrapper.blur();

      expect(onChangeSpy).not.toHaveBeenCalled();
    });

    test('should correct "1:" to "01:" and set cursor position correctly', () => {
      const { wrapper, onChangeSpy } = renderMaskedInput({
        ...defaultProps,
        value: '1',
      });
      wrapper.findNativeInput().keydown({ key: ':', shiftKey: true });

      expect(onChangeSpy).toHaveBeenCalledTimes(1);
      expect(onChangeSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          detail: {
            value: '01:',
          },
        })
      );
    });

    test('should correct "01:2" to "01:02', () => {
      const { wrapper, onChangeSpy } = renderMaskedInput({
        ...defaultProps,
        value: '01:2',
      });
      wrapper.blur();

      expect(onChangeSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          detail: {
            value: '01:02:00',
          },
        })
      );
    });

    test('should correct "01:23:4" to "01:23:04', () => {
      const { wrapper, onChangeSpy } = renderMaskedInput({
        ...defaultProps,
        value: '01:23:4',
      });
      wrapper.blur();

      expect(onChangeSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          detail: {
            value: '01:23:04',
          },
        })
      );
    });
  });

  test('should correctly format if given value aa:bb:cc and format aa:bb', () => {
    const { wrapper } = renderMaskedInput({
      mask: {
        separator: ':',
        segments: [
          { min: 1, max: 23, length: 2 },
          { min: 0, max: 59, length: 2 },
        ],
      },
      value: '12:34:56',
    });

    expect(wrapper.findNativeInput().getElement().value).toBe('12:34');
  });

  test('should autocomplete when pressing Enter', () => {
    const { wrapper, onChangeSpy } = renderMaskedInput({ ...defaultProps, value: '01' });
    expect(wrapper.findNativeInput().getElement()).toHaveValue('01:');

    wrapper.findNativeInput().keydown(KeyCode.enter);
    expect(onChangeSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        detail: {
          value: '01:00:00',
        },
      })
    );
  });

  test('should not autocomplete when pressing Enter if input is empty', () => {
    const { wrapper, onChangeSpy } = renderMaskedInput();
    expect(wrapper.findNativeInput().getElement()).toHaveValue('');

    wrapper.findNativeInput().keydown(KeyCode.enter);
    expect(onChangeSpy).not.toHaveBeenCalled();
  });

  describe('Limiting range', () => {
    test('should handle upper limits', () => {
      const { wrapper, onChangeSpy } = renderMaskedInput();
      wrapper.findNativeInput().keydown({ key: '5' });

      expect(onChangeSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          detail: {
            value: '05:',
          },
        })
      );
    });

    test('should handle lower limits', () => {
      const { wrapper, onChangeSpy } = renderMaskedInput({
        mask: {
          separator: ':',
          segments: [
            { min: 1, max: 23, length: 2 },
            { min: 0, max: 59, length: 2 },
            { min: 0, max: 59, length: 2 },
          ],
        },
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

    describe('appending colons', () => {
      test('should automatically append colon after 2 digits entered', () => {
        const { wrapper, onChangeSpy } = renderMaskedInput({ ...defaultProps, value: '0' });

        wrapper.findNativeInput().keydown({ key: '3' });

        expect(onChangeSpy).toHaveBeenCalledWith(
          expect.objectContaining({
            detail: {
              value: '03:',
            },
          })
        );
      });

      test('should automatically append colon after 4 digits entered', () => {
        const { wrapper, onChangeSpy } = renderMaskedInput({ ...defaultProps, value: '03:2' });

        wrapper.findNativeInput().keydown({ key: '9' });

        expect(onChangeSpy).toHaveBeenCalledWith(
          expect.objectContaining({
            detail: {
              value: '03:29:',
            },
          })
        );
      });
    });

    describe('entering value in middle of input', () => {
      test('should allow a value to be changed', () => {
        const { wrapper, onChangeSpy } = renderMaskedInput({ ...defaultProps, value: '12:34:56' });

        wrapper.findNativeInput().getElement().setSelectionRange(1, 1);
        wrapper.findNativeInput().keydown({ key: '0' });

        expect(onChangeSpy).toHaveBeenCalledWith(
          expect.objectContaining({
            detail: {
              value: '10:34:56',
            },
          })
        );
      });

      test('should change value in same position after a backspace', () => {
        const { wrapper, onChangeSpy } = renderMaskedInput({ ...defaultProps, value: '12:34:56' });

        wrapper.findNativeInput().getElement().setSelectionRange(1, 1);
        wrapper.findNativeInput().keydown(KeyCode.backspace);
        wrapper.findNativeInput().keydown({ key: '2' });

        expect(onChangeSpy).toHaveBeenCalledWith(
          expect.objectContaining({
            detail: {
              value: '22:34:56',
            },
          })
        );
      });

      test('should autocorrect if value is over limit', () => {
        const { wrapper, onChangeSpy } = renderMaskedInput({ ...defaultProps, value: '22:34:56' });

        wrapper.findNativeInput().getElement().setSelectionRange(1, 1);
        wrapper.findNativeInput().keydown({ key: '5' });

        expect(onChangeSpy).toHaveBeenCalledWith(
          expect.objectContaining({
            detail: {
              value: '23:34:56',
            },
          })
        );
      });

      test('should swallow keys at separator - :', () => {
        const { wrapper, onChangeSpy } = renderMaskedInput({ ...defaultProps, value: '22:34:56' });

        wrapper.findNativeInput().getElement().setSelectionRange(3, 3);
        wrapper.findNativeInput().keydown({ key: '5' });

        expect(onChangeSpy).toHaveBeenCalledWith(
          expect.objectContaining({
            detail: {
              value: '22:54:56',
            },
          })
        );
      });

      test('should swallow keys at separator - not :', () => {
        const { wrapper, onChangeSpy } = renderMaskedInput({ ...defaultProps, value: '22:34:56' });
        wrapper.findNativeInput().getElement().setSelectionRange(2, 2);
        wrapper.findNativeInput().keydown({ key: '5' });

        // Value does not change and so onChange should not be called
        expect(onChangeSpy).not.toHaveBeenCalled();
      });

      test('should ignore selection end if it is an incomplete selection (not to end of input)', () => {
        const { wrapper, onChangeSpy } = renderMaskedInput({ ...defaultProps, value: '12:34:56' });

        wrapper.findNativeInput().getElement().setSelectionRange(1, 5);
        wrapper.findNativeInput().keydown({ key: '0' });

        expect(onChangeSpy).toHaveBeenCalledWith(
          expect.objectContaining({
            detail: {
              value: '10:34:56',
            },
          })
        );
      });

      test('should remove selected value if selected to the end of the input', () => {
        const { wrapper, onChangeSpy } = renderMaskedInput({ ...defaultProps, value: '12:34:56' });

        wrapper.findNativeInput().getElement().setSelectionRange(3, 8);
        wrapper.findNativeInput().keydown({ key: '1' });

        expect(onChangeSpy).toHaveBeenCalledWith(
          expect.objectContaining({
            detail: {
              value: '12:1',
            },
          })
        );
      });

      test('should remove selected value if selected to the end of the input (with autocomplete)', () => {
        const { wrapper, onChangeSpy } = renderMaskedInput({ ...defaultProps, value: '12:34:56' });

        wrapper.findNativeInput().getElement().setSelectionRange(3, 8);
        wrapper.findNativeInput().keydown({ key: '6' });

        expect(onChangeSpy).toHaveBeenCalledWith(
          expect.objectContaining({
            detail: {
              value: '12:06:',
            },
          })
        );
      });

      test('should remove selected value, ignoring selectors', () => {
        const { wrapper, onChangeSpy } = renderMaskedInput({ ...defaultProps, value: '12:34:56' });

        wrapper.findNativeInput().getElement().setSelectionRange(5, 8);
        wrapper.findNativeInput().keydown({ key: '1' });

        expect(onChangeSpy).toHaveBeenCalledWith(
          expect.objectContaining({
            detail: {
              value: '12:34:',
            },
          })
        );
      });
    });
  });
});
