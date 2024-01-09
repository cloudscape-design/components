// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import { render } from '@testing-library/react';
import createWrapper, { CheckboxWrapper } from '../../../lib/components/test-utils/dom';
import FormField from '../../../lib/components/form-field';
import Checkbox, { CheckboxProps } from '../../../lib/components/checkbox';
import InternalCheckbox from '../../../lib/components/checkbox/internal';
import styles from '../../../lib/components/internal/components/checkbox-icon/styles.selectors.js';
import abstractSwitchStyles from '../../../lib/components/internal/components/abstract-switch/styles.css.js';
import { createCommonTests } from './common-tests';
import { renderWithSingleTabStopNavigation } from '../../internal/context/__tests__/utils';

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

test('can be marked as required', () => {
  const { wrapper } = renderCheckbox(<Checkbox checked={false} ariaRequired={true} />);
  const nativeInput = wrapper.findNativeInput().getElement();
  expect(nativeInput.getAttribute('aria-required')).toBe('true');
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

test('Should set aria-describedby and aria-labelledby from Formfield', () => {
  const { container } = render(
    <FormField description="This is a formfield description." label="Form field label">
      <Checkbox checked={false} description="This is description">
        Checkbox label
      </Checkbox>
    </FormField>
  );
  const formFieldWrapper = createWrapper(container).findFormField();
  const checkboxWrapper = createWrapper(container).findCheckbox()!;
  const checkboxInputAriaDescribedby = checkboxWrapper.findNativeInput().getElement().getAttribute('aria-describedby');
  const checkboxInputAriaLabelledby = checkboxWrapper.findNativeInput().getElement().getAttribute('aria-labelledby');

  const formFieldLabelId = formFieldWrapper?.findLabel()?.getElement().id;
  const formFieldDescriptionId = formFieldWrapper?.findDescription()?.getElement().id;
  const checkboxLabelId = container?.querySelector(`.${abstractSwitchStyles.label}`)?.id;
  const checkboxDescriptionId = container?.querySelector(`.${abstractSwitchStyles.description}`)?.id;

  expect(checkboxInputAriaDescribedby).toBe(formFieldDescriptionId + ' ' + checkboxDescriptionId);
  expect(checkboxInputAriaLabelledby).toBe(checkboxLabelId + ' ' + formFieldLabelId);
});

test('Should set aria-describedby and aria-labelledby from ariaLabelledby and ariaDescribedby', () => {
  const { container } = render(
    <FormField description="This is a description." label="Form field label">
      <div id="label-id">it is label</div>
      <div id="description-id">it is label</div>
      <Checkbox
        checked={false}
        description="This is description"
        ariaLabelledby="label-id"
        ariaDescribedby="description-id"
      >
        Checkbox label
      </Checkbox>
    </FormField>
  );
  const checkboxWrapper = createWrapper(container).findCheckbox()!;
  const checkboxInputAriaDescribedby = checkboxWrapper.findNativeInput().getElement().getAttribute('aria-describedby');
  const checkboxInputAriaLabelledby = checkboxWrapper.findNativeInput().getElement().getAttribute('aria-labelledby');

  const toggleLabelId = container?.querySelector(`.${abstractSwitchStyles.label}`)?.id;
  const toggleDescriptionId = container?.querySelector(`.${abstractSwitchStyles.description}`)?.id;

  expect(checkboxInputAriaDescribedby).toBe('description-id' + ' ' + toggleDescriptionId);
  expect(checkboxInputAriaLabelledby).toBe(toggleLabelId + ' ' + 'label-id');
});

describe('table grid navigation support', () => {
  function getCheckboxInput(selector: string) {
    return createWrapper().findCheckbox(selector)!.findNativeInput().getElement();
  }

  test('does not override tab index when keyboard navigation is not active', () => {
    renderWithSingleTabStopNavigation(<Checkbox id="checkbox" checked={false} />);
    expect(getCheckboxInput('#checkbox')).not.toHaveAttribute('tabIndex');
  });

  test('overrides tab index when keyboard navigation is active', () => {
    const { setCurrentTarget } = renderWithSingleTabStopNavigation(
      <div>
        <Checkbox id="checkbox1" checked={false} />
        <Checkbox id="checkbox2" checked={false} />
      </div>
    );
    setCurrentTarget(getCheckboxInput('#checkbox1'));
    expect(getCheckboxInput('#checkbox1')).toHaveAttribute('tabIndex', '0');
    expect(getCheckboxInput('#checkbox2')).toHaveAttribute('tabIndex', '-1');
  });

  test('does not override explicit tab index with 0', () => {
    const { setCurrentTarget } = renderWithSingleTabStopNavigation(
      <div>
        <InternalCheckbox id="checkbox1" checked={false} tabIndex={-1} />
        <InternalCheckbox id="checkbox2" checked={false} tabIndex={-1} />
      </div>
    );
    setCurrentTarget(getCheckboxInput('#checkbox1'));
    expect(getCheckboxInput('#checkbox1')).toHaveAttribute('tabIndex', '-1');
    expect(getCheckboxInput('#checkbox2')).toHaveAttribute('tabIndex', '-1');
  });
});
