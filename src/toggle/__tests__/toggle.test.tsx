// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import { act, render } from '@testing-library/react';

import '../../__a11y__/to-validate-a11y';
import FormField from '../../../lib/components/form-field';
import createWrapper, { ToggleWrapper } from '../../../lib/components/test-utils/dom';
import Toggle, { ToggleProps } from '../../../lib/components/toggle';
import { createCommonTests } from '../../checkbox/__tests__/common-tests';

import abstractSwitchStyles from '../../../lib/components/internal/components/abstract-switch/styles.css.js';
import styles from '../../../lib/components/toggle/styles.selectors.js';

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

test('fires a single onChange event on label click', () => {
  const onChange = jest.fn();
  const { wrapper } = renderToggle(<Toggle checked={false} onChange={onChange} />);
  wrapper.findLabel().click();
  expect(onChange).toHaveBeenCalledTimes(1);
  expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ detail: { checked: true } }));
});

test('fires a single onChange event on input click', () => {
  const onChange = jest.fn();
  const { wrapper } = renderToggle(<Toggle checked={false} onChange={onChange} />);
  wrapper.findNativeInput().click();
  expect(onChange).toHaveBeenCalledTimes(1);
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

  act(() => wrapper.findLabel().click());

  expect(wrapper.findNativeInput().getElement()).not.toBeChecked();
  expect(onChange).not.toHaveBeenCalled();
});

test('does not trigger change handler if readOnly', () => {
  const onChange = jest.fn();
  const { wrapper } = renderToggle(<Toggle checked={false} readOnly={true} onChange={onChange} />);

  act(() => wrapper.findLabel().click());

  expect(wrapper.findNativeInput().getElement()).not.toBeChecked();
  expect(onChange).not.toHaveBeenCalled();
});

test('can receive focus if readOnly', () => {
  let toggleRef: ToggleProps.Ref | null = null;

  const { wrapper } = renderToggle(<Toggle ref={ref => (toggleRef = ref)} checked={false} readOnly={true} />);
  expect(toggleRef).toBeDefined();

  toggleRef!.focus();
  expect(wrapper.findNativeInput().getElement()).toHaveFocus();
});

test('should set aria-disabled to native input for readOnly state', () => {
  const { wrapper } = renderToggle(<Toggle checked={false} readOnly={true} />);

  expect(wrapper.findNativeInput().getElement()).toHaveAttribute('aria-disabled', 'true');
});

test('should not set aria-disabled to native input when both readOnly and disabled are true', () => {
  const { wrapper } = renderToggle(<Toggle checked={false} readOnly={true} disabled={true} />);

  expect(wrapper.findNativeInput().getElement()).toHaveAttribute('disabled');
  expect(wrapper.findNativeInput().getElement()).not.toHaveAttribute('aria-disabled', 'true');
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

test('check a11y', async () => {
  const { wrapper } = renderToggle(
    <Toggle checked={false} onChange={() => {}}>
      Toggle label
    </Toggle>
  );
  await expect(wrapper.getElement()).toValidateA11y();
});

test('Should set aria-describedby and aria-labelledby from Formfield', () => {
  const { container } = render(
    <FormField description="This is a formfield description." label="Form field label">
      <Toggle checked={false} description="This is description">
        Toggle label
      </Toggle>
    </FormField>
  );
  const formFieldWrapper = createWrapper(container).findFormField();
  const toggleWrapper = createWrapper(container).findToggle()!;
  const toggleInputAriaDescribedby = toggleWrapper.findNativeInput().getElement().getAttribute('aria-describedby');
  const toggleInputAriaLabelledby = toggleWrapper.findNativeInput().getElement().getAttribute('aria-labelledby');

  const formFieldLabelId = formFieldWrapper?.findLabel()?.getElement().id;
  const formFieldDescriptionId = formFieldWrapper?.findDescription()?.getElement().id;
  const toggleLabelId = container?.querySelector(`.${abstractSwitchStyles.label}`)?.id;
  const toggleDescriptionId = container?.querySelector(`.${abstractSwitchStyles.description}`)?.id;

  expect(toggleInputAriaLabelledby).toBe(toggleLabelId + ' ' + formFieldLabelId);
  expect(toggleInputAriaDescribedby).toBe(formFieldDescriptionId + ' ' + toggleDescriptionId);
});

test('Should set aria-describedby and aria-labelledby from ariaLabelledby and ariaDescribedby', () => {
  const { container } = render(
    <FormField description="This is a description." label="Form field label">
      <div id="label-id">it is label</div>
      <div id="description-id">it is label</div>
      <Toggle
        checked={false}
        description="This is description"
        ariaLabelledby="label-id"
        ariaDescribedby="description-id"
      >
        Toggle label
      </Toggle>
    </FormField>
  );
  const toggleWrapper = createWrapper(container).findToggle()!;
  const toggleInputAriaDescribedby = toggleWrapper.findNativeInput().getElement().getAttribute('aria-describedby');
  const toggleInputAriaLabelledby = toggleWrapper.findNativeInput().getElement().getAttribute('aria-labelledby');

  const toggleLabelId = container?.querySelector(`.${abstractSwitchStyles.label}`)?.id;
  const toggleDescriptionId = container?.querySelector(`.${abstractSwitchStyles.description}`)?.id;

  expect(toggleInputAriaDescribedby).toBe('description-id' + ' ' + toggleDescriptionId);
  expect(toggleInputAriaLabelledby).toBe(toggleLabelId + ' ' + 'label-id');
});
