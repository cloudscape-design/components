// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import { render } from '@testing-library/react';
import createWrapper, { CheckboxWrapper } from '../../../lib/components/test-utils/dom';
import Checkbox, { CheckboxProps } from '../../../lib/components/checkbox';
import styles from '../../../lib/components/internal/components/checkbox-icon/styles.selectors.js';
import { createCommonTests } from './common-tests';

function renderCheckbox(jsx: React.ReactElement) {
  const { container, rerender } = render(jsx);
  const wrapper = createWrapper(container).findCheckbox()!;
  return { wrapper, rerender };
}

function findStyledElement(wrapper: CheckboxWrapper) {
  return wrapper.findByClassName(styles['styled-line'])?.getElement();
}

createCommonTests(Checkbox);

test('hides the decorative icon from assistive technology', () => {
  const { wrapper } = renderCheckbox(<Checkbox checked={false} />);
  const svg = wrapper.find('svg')!.getElement();
  expect(svg).toHaveAttribute('focusable', 'false');
  expect(svg).toHaveAttribute('aria-hidden', 'true');
});

test('renders an input element', () => {
  const { wrapper } = renderCheckbox(<Checkbox checked={false} />);
  const nativeInput = wrapper.findNativeInput().getElement();
  expect(nativeInput.type).toBe('checkbox');
});

describe('native and styled control synchronization', () => {
  test('unchecked state', () => {
    const { wrapper } = renderCheckbox(<Checkbox checked={false} indeterminate={false} />);

    const nativeInput = wrapper.findNativeInput().getElement();
    expect(nativeInput.checked).toEqual(false);
    expect(nativeInput.indeterminate).toEqual(false);
    expect(findStyledElement(wrapper)).toBeUndefined();
  });

  test('indeterminate state takes precedence over the checked state', () => {
    const { wrapper, rerender } = renderCheckbox(<Checkbox checked={false} indeterminate={true} />);

    let nativeInput = wrapper.findNativeInput().getElement();
    expect(nativeInput.checked).toEqual(false);
    expect(nativeInput.indeterminate).toEqual(true);
    expect(findStyledElement(wrapper)).not.toBeUndefined();
    const checkedStatePoints = findStyledElement(wrapper)!.getAttribute('points');

    rerender(<Checkbox checked={true} indeterminate={true} />);
    nativeInput = wrapper.findNativeInput().getElement();
    expect(nativeInput.checked).toEqual(true);
    expect(nativeInput.indeterminate).toEqual(true);
    expect(findStyledElement(wrapper)).not.toBeUndefined();
    expect(findStyledElement(wrapper)!.getAttribute('points')).toEqual(checkedStatePoints);
  });

  test('clicking on unchecked+indeterminate checkbox produces checked state', () => {
    const onChange = jest.fn();
    const { wrapper } = renderCheckbox(<Checkbox checked={false} indeterminate={true} onChange={onChange} />);
    wrapper.findLabel().click();
    expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ detail: { checked: true, indeterminate: false } }));
  });

  test('clicking on checked+indeterminate checkbox produces checked state', () => {
    const onChange = jest.fn();
    const { wrapper } = renderCheckbox(<Checkbox checked={true} indeterminate={true} onChange={onChange} />);
    wrapper.findLabel().click();
    expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ detail: { checked: true, indeterminate: false } }));
  });

  test('checked state is displayed', () => {
    const { wrapper, rerender } = renderCheckbox(<Checkbox checked={false} indeterminate={true} />);
    const indeterminateState = findStyledElement(wrapper)!.getAttribute('points');

    rerender(<Checkbox checked={true} />);
    let nativeInput = wrapper.findNativeInput().getElement();
    expect(nativeInput.checked).toEqual(true);
    expect(nativeInput.indeterminate).toEqual(false);
    expect(findStyledElement(wrapper)).not.toBeUndefined();
    expect(findStyledElement(wrapper)!.getAttribute('points')).not.toEqual(indeterminateState);

    rerender(<Checkbox checked={false} />);
    nativeInput = wrapper.findNativeInput().getElement();
    expect(nativeInput.checked).toEqual(false);
    expect(nativeInput.indeterminate).toEqual(false);
    expect(findStyledElement(wrapper)).toBeUndefined();
  });
});

test('fires a single onChange event on label click', () => {
  const onChange = jest.fn();
  const { wrapper } = renderCheckbox(<Checkbox checked={false} onChange={onChange} />);
  wrapper.findLabel().click();
  expect(onChange).toHaveBeenCalledTimes(1);
  expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ detail: { checked: true, indeterminate: false } }));
});

test('fires a single onChange event on input click', () => {
  const onChange = jest.fn();
  const { wrapper } = renderCheckbox(<Checkbox checked={false} onChange={onChange} />);
  wrapper.findNativeInput().click();
  expect(onChange).toHaveBeenCalledTimes(1);
  expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ detail: { checked: true, indeterminate: false } }));
});

test('unsets indeterminate value on click', () => {
  const onChange = jest.fn();
  const { wrapper } = renderCheckbox(<Checkbox checked={false} indeterminate={true} onChange={onChange} />);
  wrapper.findLabel().click();
  expect(wrapper.findNativeInput().getElement()).not.toBeChecked();
  expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ detail: { checked: true, indeterminate: false } }));
});

test('works in controlled component pattern', () => {
  function StateWrapper() {
    const [checked, setChecked] = useState(false);
    return <Checkbox checked={checked} onChange={event => setChecked(event.detail.checked)} />;
  }
  const { wrapper } = renderCheckbox(<StateWrapper />);
  expect(wrapper.findNativeInput().getElement()).not.toBeChecked();

  wrapper.findLabel().click();
  expect(wrapper.findNativeInput().getElement()).toBeChecked();

  wrapper.findLabel().click();
  expect(wrapper.findNativeInput().getElement()).not.toBeChecked();
});

test('does not trigger change handler if disabled', () => {
  const onChange = jest.fn();
  const { wrapper } = renderCheckbox(<Checkbox checked={false} disabled={true} onChange={onChange} />);

  wrapper.findLabel().click();

  expect(wrapper.findNativeInput().getElement()).not.toBeChecked();
  expect(onChange).not.toHaveBeenCalled();
});

test('can be focused via API', () => {
  const onFocus = jest.fn();
  let checkboxRef: CheckboxProps.Ref | null = null;

  const { wrapper } = renderCheckbox(<Checkbox ref={ref => (checkboxRef = ref)} checked={false} onFocus={onFocus} />);
  expect(checkboxRef).toBeDefined();

  checkboxRef!.focus();
  expect(onFocus).toHaveBeenCalled();
  expect(wrapper.findNativeInput().getElement()).toHaveFocus();
});

test('does not trigger any change events when value is changed through api', () => {
  const onChange = jest.fn();
  const { wrapper, rerender } = renderCheckbox(<Checkbox checked={false} onChange={onChange} />);
  expect(wrapper.findNativeInput().getElement()).not.toBeChecked();

  rerender(<Checkbox checked={true} onChange={onChange} />);
  expect(wrapper.findNativeInput().getElement()).toBeChecked();

  rerender(<Checkbox checked={false} onChange={onChange} />);
  expect(onChange).not.toHaveBeenCalled();
});
