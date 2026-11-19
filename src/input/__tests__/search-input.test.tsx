// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';

import { warnOnce } from '@cloudscape-design/component-toolkit/internal';

import Input, { InputProps } from '../../../lib/components/input';
import createWrapper, { InputWrapper } from '../../../lib/components/test-utils/dom';

jest.mock('@cloudscape-design/component-toolkit/internal', () => ({
  ...jest.requireActual('@cloudscape-design/component-toolkit/internal'),
  warnOnce: jest.fn(),
}));

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

describe('Development warnings for prefix/suffix on search type', () => {
  afterEach(() => {
    (warnOnce as jest.Mock).mockReset();
  });

  test('warns when prefix is supplied with type search', () => {
    renderInput({ type: 'search', prefix: '$' });
    expect(warnOnce).toHaveBeenCalledWith('Input', 'prefix and suffix are ignored when type is search.');
  });

  test('warns when suffix is supplied with type search', () => {
    renderInput({ type: 'search', suffix: '%' });
    expect(warnOnce).toHaveBeenCalledWith('Input', 'prefix and suffix are ignored when type is search.');
  });

  test('warns when both prefix and suffix are supplied with type search', () => {
    renderInput({ type: 'search', prefix: '$', suffix: '%' });
    expect(warnOnce).toHaveBeenCalledWith('Input', 'prefix and suffix are ignored when type is search.');
  });

  test('does not warn when neither prefix nor suffix is supplied with type search', () => {
    renderInput({ type: 'search' });
    expect(warnOnce).not.toHaveBeenCalled();
  });

  test('does not warn when prefix/suffix are supplied with non-search type', () => {
    renderInput({ type: 'text', prefix: '$', suffix: '%' });
    expect(warnOnce).not.toHaveBeenCalled();
  });
});

describe('Prefix/suffix suppression for search type', () => {
  test('does not render prefix when type is search', () => {
    const wrapper = renderInput({ type: 'search', prefix: '$' });
    expect(wrapper.findPrefix()).toBeNull();
  });

  test('does not render suffix when type is search', () => {
    const wrapper = renderInput({ type: 'search', suffix: '%' });
    expect(wrapper.findSuffix()).toBeNull();
  });

  test('does not render prefix and suffix together when type is search', () => {
    const wrapper = renderInput({ type: 'search', prefix: 'https://', suffix: '.com' });
    expect(wrapper.findPrefix()).toBeNull();
    expect(wrapper.findSuffix()).toBeNull();
  });

  test('still renders clear button for populated search input with prefix/suffix props', () => {
    const wrapper = renderInput({ type: 'search', value: 'query', prefix: '$', suffix: '%' });
    expect(wrapper.findClearButton()).not.toBeNull();
    expect(wrapper.findPrefix()).toBeNull();
    expect(wrapper.findSuffix()).toBeNull();
  });

  test('renders prefix for non-search type', () => {
    const wrapper = renderInput({ type: 'text', prefix: '$' });
    expect(wrapper.findPrefix()).not.toBeNull();
    expect(wrapper.findPrefix()!.getElement().textContent).toBe('$');
  });

  test('renders suffix for non-search type', () => {
    const wrapper = renderInput({ type: 'text', suffix: '%' });
    expect(wrapper.findSuffix()).not.toBeNull();
    expect(wrapper.findSuffix()!.getElement().textContent).toBe('%');
  });
});

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
