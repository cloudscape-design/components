// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import { render } from '@testing-library/react';

import { KeyCode } from '@cloudscape-design/test-utils-core/utils';

import Autosuggest, { AutosuggestProps } from '../../../lib/components/autosuggest';
import createWrapper from '../../../lib/components/test-utils/dom';

const defaultOptions: AutosuggestProps.Options = [
  { value: '1', label: 'One' },
  { value: '2', label: 'Two' },
];

const defaultProps: AutosuggestProps = {
  enteredTextLabel: () => 'Use value',
  value: '',
  onChange: () => {},
  options: defaultOptions,
};

function StatefulAutosuggest(props: AutosuggestProps) {
  const [value, setValue] = useState(props.value);
  return (
    <Autosuggest
      {...props}
      value={value}
      onChange={event => {
        props.onChange?.(event);
        setValue(event.detail.value);
      }}
    />
  );
}

function renderAutosuggest(jsx: React.ReactElement) {
  const { container } = render(jsx);
  const wrapper = createWrapper(container).findAutosuggest()!;
  return { container, wrapper };
}

describe('openOnFocus', () => {
  test('dropdown opens on focus by default (openOnFocus=true)', () => {
    const { wrapper } = renderAutosuggest(<Autosuggest {...defaultProps} />);
    wrapper.focus();
    expect(wrapper.findDropdown().findOpenDropdown()).not.toBe(null);
  });

  test('dropdown does not open on focus when openOnFocus=false', () => {
    const { wrapper } = renderAutosuggest(<Autosuggest {...defaultProps} openOnFocus={false} />);
    wrapper.focus();
    expect(wrapper.findDropdown().findOpenDropdown()).toBe(null);
  });

  test('onFocus event fires even when openOnFocus=false', () => {
    const onFocus = jest.fn();
    const { wrapper } = renderAutosuggest(<Autosuggest {...defaultProps} openOnFocus={false} onFocus={onFocus} />);
    wrapper.focus();
    expect(onFocus).toHaveBeenCalledTimes(1);
  });

  test('dropdown opens on arrow-down key when openOnFocus=false', () => {
    const { wrapper } = renderAutosuggest(<Autosuggest {...defaultProps} openOnFocus={false} />);
    wrapper.focus();
    expect(wrapper.findDropdown().findOpenDropdown()).toBe(null);

    wrapper.findNativeInput().keydown(KeyCode.down);
    expect(wrapper.findDropdown().findOpenDropdown()).not.toBe(null);
  });

  test('dropdown opens on arrow-up key when openOnFocus=false', () => {
    const { wrapper } = renderAutosuggest(<Autosuggest {...defaultProps} openOnFocus={false} />);
    wrapper.focus();
    expect(wrapper.findDropdown().findOpenDropdown()).toBe(null);

    wrapper.findNativeInput().keydown(KeyCode.up);
    expect(wrapper.findDropdown().findOpenDropdown()).not.toBe(null);
  });

  test('dropdown opens on user input when openOnFocus=false', () => {
    const { wrapper } = renderAutosuggest(<StatefulAutosuggest {...defaultProps} openOnFocus={false} />);
    wrapper.focus();
    expect(wrapper.findDropdown().findOpenDropdown()).toBe(null);

    wrapper.setInputValue('O');
    expect(wrapper.findDropdown().findOpenDropdown()).not.toBe(null);
  });

  test('dropdown opens on click when openOnFocus=false', () => {
    const { wrapper } = renderAutosuggest(<Autosuggest {...defaultProps} openOnFocus={false} />);
    // Click on the native input triggers openDropdown via onClick handler
    wrapper.findNativeInput().click();
    expect(wrapper.findDropdown().findOpenDropdown()).not.toBe(null);
  });

  test('options are visible after opening with arrow-down when openOnFocus=false', () => {
    const { wrapper } = renderAutosuggest(<Autosuggest {...defaultProps} openOnFocus={false} />);
    wrapper.focus();
    wrapper.findNativeInput().keydown(KeyCode.down);
    expect(wrapper.findDropdown().findOptionByValue('1')!.getElement()).toHaveTextContent('One');
    expect(wrapper.findDropdown().findOptionByValue('2')!.getElement()).toHaveTextContent('Two');
  });

  test('option can be selected after opening with arrow-down when openOnFocus=false', () => {
    const onChange = jest.fn();
    const { wrapper } = renderAutosuggest(<Autosuggest {...defaultProps} openOnFocus={false} onChange={onChange} />);
    wrapper.focus();
    wrapper.findNativeInput().keydown(KeyCode.down);
    wrapper.findNativeInput().keydown(KeyCode.enter);
    expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ detail: { value: '1' } }));
  });

  test('re-focusing does not open dropdown when openOnFocus=false', () => {
    const { wrapper } = renderAutosuggest(<Autosuggest {...defaultProps} openOnFocus={false} />);
    // First focus — should stay closed
    wrapper.focus();
    expect(wrapper.findDropdown().findOpenDropdown()).toBe(null);

    // Open via arrow key, then close
    wrapper.findNativeInput().keydown(KeyCode.down);
    expect(wrapper.findDropdown().findOpenDropdown()).not.toBe(null);
    wrapper.findNativeInput().keydown(KeyCode.escape);
    expect(wrapper.findDropdown().findOpenDropdown()).toBe(null);

    // Blur and re-focus — should stay closed
    document.body.focus();
    wrapper.focus();
    expect(wrapper.findDropdown().findOpenDropdown()).toBe(null);
  });
});
