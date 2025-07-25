// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useRef } from 'react';
import { fireEvent, render } from '@testing-library/react';

import { KeyCode } from '@cloudscape-design/test-utils-core/utils';

import DateInput, { DateInputProps } from '../../../lib/components/date-input';
import createWrapper from '../../../lib/components/test-utils/dom';

function renderDateInput(props: DateInputProps) {
  const onChangeSpy = jest.fn();
  const { container } = render(<DateInput onChange={onChangeSpy} {...props} />);
  const wrapper = createWrapper(container).findDateInput()!;
  const inputValue = wrapper.findNativeInput()!.getElement().value;
  return { wrapper, inputValue, onChangeSpy };
}

describe('Date Input component', () => {
  test('should disable browser autocorrect by default', () => {
    const { wrapper } = renderDateInput({ value: '' });

    const inputElement = wrapper.findNativeInput().getElement();
    expect(inputElement).toHaveAttribute('autoCorrect', 'off');
    expect(inputElement).toHaveAttribute('autoCapitalize', 'off');
  });

  test('should pass input props down to the native input', () => {
    const { wrapper } = renderDateInput({
      value: '',
      placeholder: 'YYYY/MM/DD',
      ariaLabel: 'ariaLabel',
      ariaDescribedby: 'ariaDescribedby',
      ariaLabelledby: 'ariaLabelledby',
      disabled: true,
      readOnly: true,
      controlId: 'custom-id',
    });

    const inputElement = wrapper.findNativeInput().getElement();
    expect(inputElement).toHaveAttribute('placeholder', 'YYYY/MM/DD');
    expect(inputElement).toHaveAttribute('aria-label', 'ariaLabel');
    expect(inputElement).toHaveAttribute('aria-describedby', 'ariaDescribedby');
    expect(inputElement).toHaveAttribute('aria-labelledby', 'ariaLabelledby');
    expect(inputElement).toHaveAttribute('autoComplete', 'off');
    expect(inputElement).toHaveAttribute('disabled');
    expect(inputElement).toHaveAttribute('readonly');
    expect(inputElement).toHaveAttribute('id', 'custom-id');
  });

  test('does accept values in ISO format', () => {
    const { wrapper } = renderDateInput({ value: '2018-01-02' });
    expect(wrapper.findNativeInput().getElement().value).toBe('2018/01/02');
  });

  test('should not limit pasted value by the current month', () => {
    const { wrapper, onChangeSpy } = renderDateInput({
      value: '2019/02/01',
    });

    wrapper.findNativeInput().getElement().setSelectionRange(0, 0);
    fireEvent.paste(wrapper.findNativeInput().getElement(), {
      clipboardData: { getData: () => '2019/03/30' },
    });

    expect(onChangeSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        detail: { value: '2019-03-30' },
      })
    );
  });

  test('should not paste value when readonly', () => {
    const { wrapper, onChangeSpy } = renderDateInput({
      value: '2019/02/01',
      readOnly: true,
    });

    fireEvent.paste(wrapper.findNativeInput().getElement(), {
      clipboardData: { getData: () => '2019/03/30' },
    });

    expect(onChangeSpy).not.toHaveBeenCalled();
  });

  test('should not paste value when disabled', () => {
    const { wrapper, onChangeSpy } = renderDateInput({
      value: '2019/02/01',
      disabled: true,
    });

    fireEvent.paste(wrapper.findNativeInput().getElement(), {
      clipboardData: { getData: () => '2019/03/30' },
    });

    expect(onChangeSpy).not.toHaveBeenCalled();
  });

  describe('autocomplete', () => {
    ['-', '/', '.', ' '].forEach(separatorKey => {
      test(`should autocomplete using [${separatorKey}] key`, () => {
        const { wrapper, onChangeSpy } = renderDateInput({
          value: '1',
        });

        wrapper.findNativeInput().keydown({ key: separatorKey });
        expect(onChangeSpy).toHaveBeenCalledWith(expect.objectContaining({ detail: { value: '2001-' } }));
      });
    });

    test('should autocomplete entry of "2018/02/3" to "2018/02/03"', () => {
      const { wrapper, onChangeSpy } = renderDateInput({
        value: '2018/02/',
      });

      wrapper.findNativeInput().keydown({ key: '3' });
      expect(onChangeSpy).toHaveBeenCalledWith(expect.objectContaining({ detail: { value: '2018-02-03' } }));
    });

    test('should correct "2" to "2002/01/01" on enter', () => {
      const { wrapper, onChangeSpy } = renderDateInput({
        value: '2',
      });

      wrapper.findNativeInput().keydown({ key: 'Enter', keyCode: KeyCode.enter });
      expect(onChangeSpy).toHaveBeenCalledWith(expect.objectContaining({ detail: { value: '2002-01-01' } }));
    });

    test('should correct "21" to "2021/01/01" on enter', () => {
      const { wrapper, onChangeSpy } = renderDateInput({
        value: '21',
      });

      wrapper.findNativeInput().keydown({ key: 'Enter', keyCode: KeyCode.enter });
      expect(onChangeSpy).toHaveBeenCalledWith(expect.objectContaining({ detail: { value: '2021-01-01' } }));
    });
  });

  describe('limiting range', () => {
    test('should correct "1/" to "2001/"', () => {
      const { wrapper, onChangeSpy } = renderDateInput({
        value: '1',
      });

      wrapper.findNativeInput().keydown({ key: '/' });
      expect(onChangeSpy).toHaveBeenCalledWith(expect.objectContaining({ detail: { value: '2001-' } }));
    });

    test('should correct "2018/1/" to "2018/01/"', () => {
      const { wrapper, onChangeSpy } = renderDateInput({
        value: '2018/1',
      });

      wrapper.findNativeInput().keydown({ key: '/' });
      expect(onChangeSpy).toHaveBeenCalledWith(expect.objectContaining({ detail: { value: '2018-01-' } }));
    });

    test('should correct "2018/0/" to "2018/01/"', () => {
      const { wrapper, onChangeSpy } = renderDateInput({
        value: '2018/0',
      });

      wrapper.findNativeInput().keydown({ key: '/' });
      expect(onChangeSpy).toHaveBeenCalledWith(expect.objectContaining({ detail: { value: '2018-01-' } }));
    });

    test('should correct "2018/1/2" to "2018/01/02"', () => {
      const { wrapper, onChangeSpy } = renderDateInput({
        value: '2018/01/2',
      });

      wrapper.findNativeInput().keydown({ key: '/' });
      expect(onChangeSpy).toHaveBeenCalledWith(expect.objectContaining({ detail: { value: '2018-01-02' } }));
    });

    test('should allow entry of day 31 in January', () => {
      const { wrapper, onChangeSpy } = renderDateInput({
        value: '2018/01/3',
      });

      wrapper.findNativeInput().keydown({ key: '1' });
      expect(onChangeSpy).toHaveBeenCalledWith(expect.objectContaining({ detail: { value: '2018-01-31' } }));
    });

    test('should allow entry of day 30 in March', () => {
      const { wrapper, onChangeSpy } = renderDateInput({
        value: '2018/03/3',
      });

      wrapper.findNativeInput().keydown({ key: '0' });
      expect(onChangeSpy).toHaveBeenCalledWith(expect.objectContaining({ detail: { value: '2018-03-30' } }));
    });

    test('should disallow entry of day 31 in April', () => {
      const { wrapper, onChangeSpy } = renderDateInput({
        value: '2018/04/3',
      });
      wrapper.findNativeInput().keydown({ key: '1' });
      expect(onChangeSpy).toHaveBeenCalledWith(expect.objectContaining({ detail: { value: '2018-04-30' } }));
    });

    test('should disallow entry of day 29 in february', () => {
      const { wrapper, onChangeSpy } = renderDateInput({
        value: '2018/02/2',
      });

      wrapper.findNativeInput().keydown({ key: '9' });
      expect(onChangeSpy).toHaveBeenCalledWith(expect.objectContaining({ detail: { value: '2018-02-28' } }));
    });

    test('should allow entry of day 29 in february, in a leap year', () => {
      const { wrapper, onChangeSpy } = renderDateInput({
        value: '2020/02/2',
      });

      wrapper.findNativeInput().keydown({ key: '9' });
      expect(onChangeSpy).toHaveBeenCalledWith(expect.objectContaining({ detail: { value: '2020-02-29' } }));
    });
  }); // End limiting range

  describe('appending separator', () => {
    test('should automatically append separator after 4 digits entered', () => {
      const { wrapper, onChangeSpy } = renderDateInput({
        value: '201',
      });

      wrapper.findNativeInput().keydown({ key: '8' });
      expect(onChangeSpy).toHaveBeenCalledWith(expect.objectContaining({ detail: { value: '2018-' } }));
    });

    test('should automatically append colon after 6 digits entered', () => {
      const { wrapper, onChangeSpy } = renderDateInput({
        value: '2018/1',
      });

      wrapper.findNativeInput().keydown({ key: '1' });
      expect(onChangeSpy).toHaveBeenCalledWith(expect.objectContaining({ detail: { value: '2018-11-' } }));
    });
  }); // End appending separator

  describe('entering value in middle of input', () => {
    test('should allow a value to be changed', () => {
      const { wrapper, onChangeSpy } = renderDateInput({
        value: '2018/01/02',
      });

      wrapper.findNativeInput().getElement().setSelectionRange(3, 3);
      wrapper.findNativeInput().keydown({ key: '9' });
      expect(onChangeSpy).toHaveBeenCalledWith(expect.objectContaining({ detail: { value: '2019-01-02' } }));
    });

    test('should autocorrect if value is over limit', () => {
      const { wrapper, onChangeSpy } = renderDateInput({
        value: '2018/11/02',
      });

      wrapper.findNativeInput().getElement().setSelectionRange(5, 5);
      wrapper.findNativeInput().keydown({ key: '5' });
      expect(onChangeSpy).toHaveBeenCalledWith(expect.objectContaining({ detail: { value: '2018-12-02' } }));
    });

    test('should swallow keys at separator - /', () => {
      const { wrapper, onChangeSpy } = renderDateInput({
        value: '2018/11/02',
      });

      wrapper.findNativeInput().getElement().setSelectionRange(7, 7);
      wrapper.findNativeInput().keydown({ key: '/' });

      // Value does not change as key is swallowed
      expect(onChangeSpy).not.toHaveBeenCalled();
    });

    test('should swallow keys at separator - not /', () => {
      const { wrapper, onChangeSpy } = renderDateInput({
        value: '2018/11/02',
      });

      wrapper.findNativeInput().getElement().setSelectionRange(7, 7);
      wrapper.findNativeInput().keydown({ key: '3' });

      // Value does not change as key is swallowed
      expect(onChangeSpy).not.toHaveBeenCalled();
    });

    test('should ignore selection end', () => {
      const { wrapper, onChangeSpy } = renderDateInput({
        value: '2018/01/02',
      });

      wrapper.findNativeInput().getElement().setSelectionRange(3, 7);
      wrapper.findNativeInput().keydown({ key: '9' });

      expect(onChangeSpy).toHaveBeenCalledWith(expect.objectContaining({ detail: { value: '2019-01-02' } }));
    });

    test('should autocorrect day if month is changed to one with fewer days - 30', () => {
      const { wrapper, onChangeSpy } = renderDateInput({
        value: '2019/01/31',
      });

      wrapper.findNativeInput().getElement().setSelectionRange(6, 6);
      wrapper.findNativeInput().keydown({ key: '4' });

      expect(onChangeSpy).toHaveBeenCalledWith(expect.objectContaining({ detail: { value: '2019-04-30' } }));
    });

    test('should autocorrect day if month is changed to one with fewer days - 28', () => {
      const { wrapper, onChangeSpy } = renderDateInput({
        value: '2019/01/31',
      });
      wrapper.findNativeInput().getElement().setSelectionRange(6, 6);
      wrapper.findNativeInput().keydown({ key: '2' });

      expect(onChangeSpy).toHaveBeenCalledWith(expect.objectContaining({ detail: { value: '2019-02-28' } }));
    });
  }); // end entering value in middle of input

  test('uses setInputValue test utils method', () => {
    const { wrapper, onChangeSpy } = renderDateInput({ value: '' });
    wrapper.setInputValue('2019/01/31');
    expect(onChangeSpy).toHaveBeenCalledWith(expect.objectContaining({ detail: { value: '2019-01-31' } }));
  });

  test.each([{ inputFormat: undefined }, { inputFormat: 'iso' }, { inputFormat: 'slashed' }] as const)(
    'accepts value in slashed format, inputFormat=$inputFormat',
    ({ inputFormat }) => {
      expect(renderDateInput({ value: '2001/02/03', inputFormat }).inputValue).toBe('2001/02/03');
    }
  );

  test.each([{ inputFormat: undefined }, { inputFormat: 'iso' }, { inputFormat: 'slashed' }] as const)(
    'accepts value in iso format, inputFormat=$inputFormat',
    ({ inputFormat }) => {
      expect(renderDateInput({ value: '2001-02-03', inputFormat }).inputValue).toBe('2001/02/03');
    }
  );

  test('displays value in slashed format', () => {
    expect(renderDateInput({ value: '2001-02-03', format: 'slashed' }).inputValue).toBe('2001/02/03');
  });

  test('displays value in iso format', () => {
    expect(renderDateInput({ value: '2001-02-03', format: 'iso' }).inputValue).toBe('2001-02-03');
  });

  test('displays value in long-localized format', () => {
    expect(renderDateInput({ value: '2001-02-03', format: 'long-localized', locale: 'en-GB' }).inputValue).toBe(
      '3 February 2001'
    );
  });

  test.each([{ inputFormat: 'iso' }, { inputFormat: 'slashed' }] as const)(
    'displays value in input format instead of long-localized when focused, inputFormat=$inputFormat',
    ({ inputFormat }) => {
      const { wrapper } = renderDateInput({
        value: '2001-02-03',
        inputFormat,
        format: 'long-localized',
        locale: 'en-GB',
      });
      expect(wrapper.findNativeInput().getElement().value).toBe('3 February 2001');

      wrapper.focus();
      expect(wrapper.findNativeInput().getElement().value).toBe(inputFormat === 'iso' ? '2001-02-03' : '2001/02/03');

      wrapper.blur();
      expect(wrapper.findNativeInput().getElement().value).toBe('3 February 2001');
    }
  );

  test('keeps displaying value in long-localized format when focused but readonly', () => {
    const { wrapper } = renderDateInput({
      value: '2001-02-03',
      format: 'long-localized',
      locale: 'en-GB',
      readOnly: true,
    });
    expect(wrapper.findNativeInput().getElement().value).toBe('3 February 2001');

    wrapper.focus();
    expect(wrapper.findNativeInput().getElement().value).toBe('3 February 2001');
  });

  test('does not call onChange on focus/blur events when format is long-localized', () => {
    const { wrapper, onChangeSpy } = renderDateInput({
      value: '2001-02-03',
      format: 'long-localized',
      locale: 'en-GB',
    });
    wrapper.focus();
    wrapper.blur();
    expect(onChangeSpy).not.toHaveBeenCalled();
  });

  test('focuses input programmatically', () => {
    function TestComponent() {
      const inputRef = useRef<DateInputProps.Ref>(null);
      return (
        <div>
          <button onClick={() => inputRef.current!.focus()}>Focus input</button>
          <DateInput ref={inputRef} value="2020-01-01" onChange={() => {}} />
        </div>
      );
    }
    const { container } = render(<TestComponent />);

    container.querySelector('button')!.click();
    expect(createWrapper().findDateInput()!.findNativeInput().getElement()).toHaveFocus();
  });
});
