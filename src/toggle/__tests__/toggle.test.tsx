// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import { render } from '@testing-library/react';
import createWrapper, { ToggleWrapper } from '../../../lib/components/test-utils/dom';
import Toggle, { ToggleProps } from '../../../lib/components/toggle';
import styles from '../../../lib/components/toggle/styles.selectors.js';
import { createCommonTests } from '../../checkbox/__tests__/common-tests';
import "html-validate/jest";

function renderToggle(jsx: React.ReactElement) {
  const { container, rerender } = render(jsx);
  const wrapper = createWrapper(container).findToggle()!;
  return { wrapper, rerender };
}

function findStyledElement(wrapper: ToggleWrapper) {
  return wrapper.findByClassName(styles['toggle-handle'])!.getElement();
}

createCommonTests(Toggle);

test('renders an input element', () => {
  const { wrapper } = renderToggle(<Toggle checked={false} />);
  const nativeInput = wrapper.findNativeInput().getElement();
  expect(nativeInput.type).toEqual('checkbox');
});

test('synchronizes native and styled controls', () => {
  const { wrapper, rerender } = renderToggle(<Toggle checked={false} />);
  const nativeInput = wrapper.findNativeInput().getElement();
  expect(nativeInput.checked).toEqual(false);
  expect(findStyledElement(wrapper)).not.toHaveClass(styles['toggle-handle-checked']);
  rerender(<Toggle checked={true} />);
  expect(nativeInput.checked).toEqual(true);
  expect(findStyledElement(wrapper)).toHaveClass(styles['toggle-handle-checked']);
});

test('fires onChange event on label click', () => {
  const onChange = jest.fn();
  const { wrapper } = renderToggle(<Toggle checked={false} onChange={onChange} />);
  wrapper.findLabel().click();
  expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ detail: { checked: true } }));
});

test('works in controlled component pattern', () => {
  function StateWrapper() {
    const [checked, setChecked] = useState(false);
    return <Toggle checked={checked} onChange={event => setChecked(event.detail.checked)} />;
  }
  const { wrapper } = renderToggle(<StateWrapper />);
  expect(wrapper.findNativeInput().getElement()).not.toBeChecked();

  wrapper.findLabel().click();
  expect(wrapper.findNativeInput().getElement()).toBeChecked();

  wrapper.findLabel().click();
  expect(wrapper.findNativeInput().getElement()).not.toBeChecked();
});

test('does not trigger change handler if disabled', () => {
  const onChange = jest.fn();
  const { wrapper } = renderToggle(<Toggle checked={false} disabled={true} onChange={onChange} />);

  wrapper.findLabel().click();

  expect(wrapper.findNativeInput().getElement()).not.toBeChecked();
  expect(onChange).not.toHaveBeenCalled();
});

test('can be focused via API', () => {
  const onFocus = jest.fn();
  let toggleRef: ToggleProps.Ref | null = null;

  const { wrapper } = renderToggle(<Toggle ref={ref => (toggleRef = ref)} checked={false} onFocus={onFocus} />);
  expect(toggleRef).toBeDefined();

  toggleRef!.focus();
  expect(onFocus).toHaveBeenCalled();
  expect(wrapper.findNativeInput().getElement()).toHaveFocus();
});

test('does not trigger any change events when value is changed through api', () => {
  const onChange = jest.fn();
  const { wrapper, rerender } = renderToggle(<Toggle checked={false} onChange={onChange} />);
  expect(wrapper.findNativeInput().getElement()).not.toBeChecked();

  rerender(<Toggle checked={true} onChange={onChange} />);
  expect(wrapper.findNativeInput().getElement()).toBeChecked();

  rerender(<Toggle checked={false} onChange={onChange} />);
  expect(onChange).not.toHaveBeenCalled();
});

test('html validate', ()=>{
  const { wrapper } = renderToggle(<Toggle checked={false} onChange={()=>{}} >Toggle label</Toggle>);
  expect(wrapper.getElement()).toHTMLValidate();
})