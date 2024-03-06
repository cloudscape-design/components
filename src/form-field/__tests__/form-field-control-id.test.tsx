// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';
import FormField, { FormFieldProps } from '../../../lib/components/form-field';
import Input from '../../../lib/components/input';
import createWrapper from '../../../lib/components/test-utils/dom';
import styles from '../../../lib/components/form-field/styles.css.js';

const testInput = <Input value="follow me on tiktok" onChange={() => {}} />;

const errorSelector = `:scope > .${styles.hints} .${styles.error}`;
const warningSelector = `:scope > .${styles.hints} .${styles.warning}`;

function renderFormField(props: FormFieldProps = {}) {
  const renderResult = render(<FormField {...props} />);
  return createWrapper(renderResult.container).findFormField()!;
}

describe('controlId', () => {
  describe('when set on form field', () => {
    const formFieldControlId = 'test-control-id';

    test('renders a label with a "for" attribute that matches the controlId', () => {
      const wrapper = renderFormField({
        label: 'label',
        controlId: formFieldControlId,
      });

      expect(wrapper.findLabel()?.getElement()).toHaveAttribute('for', formFieldControlId);
    });

    test('renders id for description based on controlId', () => {
      const wrapper = renderFormField({ controlId: formFieldControlId, description: 'Test description' });
      expect(wrapper.findDescription()?.getElement().id).toBe(`${formFieldControlId}-description`);
    });

    test('renders id for errorText based on controlId', () => {
      const wrapper = renderFormField({ controlId: formFieldControlId, errorText: 'Test error' });
      expect(wrapper.find(errorSelector)?.getElement().id).toBe(`${formFieldControlId}-error`);
    });

    test('renders id for warningText based on controlId', () => {
      const wrapper = renderFormField({ controlId: formFieldControlId, warningText: 'Test warning' });
      expect(wrapper.find(warningSelector)?.getElement().id).toBe(`${formFieldControlId}-warning`);
    });

    test('renders id for constraintText based on controlId', () => {
      const wrapper = renderFormField({ controlId: formFieldControlId, constraintText: 'Test constraint' });
      expect(wrapper.findConstraint()?.getElement().id).toBe(`${formFieldControlId}-constraint`);
    });

    test('sets the right ids for all props when everything is set at the sameTime', () => {
      const wrapper = renderFormField({
        controlId: formFieldControlId,
        label: 'label',
        description: 'desc',
        constraintText: 'constraint',
        errorText: 'error',
      });

      expect(wrapper.findLabel()?.getElement()).toHaveAttribute('for', formFieldControlId);
      expect(wrapper.findDescription()?.getElement().id).toBe(`${formFieldControlId}-description`);
      expect(wrapper.find(errorSelector)?.getElement().id).toBe(`${formFieldControlId}-error`);
      expect(wrapper.findConstraint()?.getElement().id).toBe(`${formFieldControlId}-constraint`);
    });

    test('sets the right ids for all props when everything including warningText is set at the sameTime', () => {
      const wrapper = renderFormField({
        controlId: formFieldControlId,
        label: 'label',
        description: 'desc',
        constraintText: 'constraint',
        warningText: 'warning',
      });

      expect(wrapper.findLabel()?.getElement()).toHaveAttribute('for', formFieldControlId);
      expect(wrapper.findDescription()?.getElement().id).toBe(`${formFieldControlId}-description`);
      expect(wrapper.find(warningSelector)?.getElement().id).toBe(`${formFieldControlId}-warning`);
      expect(wrapper.findConstraint()?.getElement().id).toBe(`${formFieldControlId}-constraint`);
    });

    test("sets id for control elements if they don't set it themselves", () => {
      const wrapper = renderFormField({ controlId: formFieldControlId, children: testInput });
      expect(wrapper.findControl()?.findInput()?.findNativeInput().getElement().id).toBe(formFieldControlId);
    });

    test('does not set id for control elements when they set it themselves', () => {
      const controlControlId = 'not-what-form-field-sets';
      const wrapper = renderFormField({
        controlId: formFieldControlId,
        children: <Input value="" controlId={controlControlId} onChange={() => {}} />,
      });
      expect(wrapper.findControl()?.findInput()?.findNativeInput().getElement().id).toBe(controlControlId);
    });

    test('should not produce duplicated "for" attribute values in nested form fields', () => {
      const renderResult = render(
        <FormField id="parent" controlId="parent-control-id" label={'Parent field'}>
          <FormField id="child" controlId="child-control-id" label={'Child field'}>
            {testInput}
          </FormField>
        </FormField>
      );

      const wrapper = createWrapper(renderResult.container);
      const parentWrapper = wrapper.findFormField('#parent')!;
      const childWrapper = wrapper.findFormField('#child')!;
      const controlElement = childWrapper.findControl()?.findInput()?.findNativeInput().getElement();

      const parentFor = parentWrapper.findLabel()?.getElement().getAttribute('for');
      const childFor = childWrapper.findLabel()?.getElement().getAttribute('for');

      expect(parentFor).toBe('parent-control-id');
      expect(childFor).toBe('child-control-id');
      expect(controlElement?.id).toBe('child-control-id');
    });
  });

  describe('when undefined', () => {
    test('generates own id and renders a label with a "for" attribute that matches it', () => {
      const wrapper = renderFormField({
        label: 'label',
      });

      expect(wrapper.findLabel()?.getElement()).toHaveAttribute('for');
    });

    test('generates own id and uses it for description', () => {
      const wrapper = renderFormField({ description: 'Test description' });
      expect(wrapper.findDescription()?.getElement()).toHaveAttribute('id');
    });

    test('generates own id and uses it for errorText', () => {
      const wrapper = renderFormField({ errorText: 'Test error' });
      expect(wrapper.find(errorSelector)?.getElement()).toHaveAttribute('id');
    });

    test('generates own id and uses it for warningText', () => {
      const wrapper = renderFormField({ warningText: 'Test warning' });
      expect(wrapper.find(warningSelector)?.getElement()).toHaveAttribute('id');
    });

    test('generates own id and uses it for constraintText', () => {
      const wrapper = renderFormField({ constraintText: 'Test constraint' });
      expect(wrapper.findConstraint()?.getElement()).toHaveAttribute('id');
    });

    test('generates own id and uses it on all props', () => {
      const wrapper = renderFormField({
        label: 'label',
        description: 'desc',
        constraintText: 'constraint',
        errorText: 'error',
      });

      const labelId = wrapper.findLabel()?.getElement().id;

      expect(labelId).not.toBeUndefined();
      expect(wrapper.findDescription()?.getElement().id).toBe(labelId?.replace('label', 'description'));
      expect(wrapper.find(errorSelector)?.getElement().id).toBe(labelId?.replace('label', 'error'));
      expect(wrapper.findConstraint()?.getElement().id).toBe(labelId?.replace('label', 'constraint'));
    });

    test('generates own id and uses it on all props including warningText', () => {
      const wrapper = renderFormField({
        label: 'label',
        description: 'desc',
        constraintText: 'constraint',
        warningText: 'warning',
      });

      const labelId = wrapper.findLabel()?.getElement().id;

      expect(labelId).not.toBeUndefined();
      expect(wrapper.findDescription()?.getElement().id).toBe(labelId?.replace('label', 'description'));
      expect(wrapper.find(warningSelector)?.getElement().id).toBe(labelId?.replace('label', 'warning'));
      expect(wrapper.findConstraint()?.getElement().id).toBe(labelId?.replace('label', 'constraint'));
    });

    test("generates own id and uses it for setting control elements if they don't set it themselves", () => {
      const wrapper = renderFormField({ children: testInput });
      expect(wrapper.findControl()?.findInput()?.findNativeInput().getElement()).toHaveAttribute('id');
    });

    test('does not set id for control elements when they set it themselves', () => {
      const controlControlId = 'not-what-form-field-sets';
      const wrapper = renderFormField({
        children: <Input value="" controlId={controlControlId} onChange={() => {}} />,
      });
      expect(wrapper.findControl()?.findInput()?.findNativeInput().getElement().id).toBe(controlControlId);
    });

    test('generates unique ids for every form field component', () => {
      const renderResult = render(
        <>
          <FormField data-testid="1" label="Label1"></FormField>
          <FormField data-testid="2" label="Label2"></FormField>
        </>
      );

      const wrapper1 = createWrapper(renderResult.container).findFormField('[data-testid="1"]')!;
      const wrapper2 = createWrapper(renderResult.container).findFormField('[data-testid="2"]')!;
      expect(wrapper1.findLabel()?.getElement().id).not.toBe(wrapper2.findLabel()?.getElement().id);
    });

    test('keeps unique id constant when rerendering the form field component', () => {
      const renderResult = render(<FormField label="Label1"></FormField>);

      const wrapper = createWrapper(renderResult.container).findFormField()!;
      const id0 = wrapper.findLabel()?.getElement().id;

      renderResult.rerender(<FormField label="Label2"></FormField>);
      const id1 = wrapper.findLabel()?.getElement().id;

      expect(id0).toBe(id1);
    });

    test('should not produce duplicated "for" attribute values in nested form fields', () => {
      const renderResult = render(
        <FormField id="parent" label={'Parent field'}>
          <FormField id="child" label={'Child field'}>
            {testInput}
          </FormField>
        </FormField>
      );

      const wrapper = createWrapper(renderResult.container);
      const parentWrapper = wrapper.findFormField('#parent')!;
      const childWrapper = wrapper.findFormField('#child')!;
      const controlElement = childWrapper.findControl()?.findInput()?.findNativeInput().getElement();

      const parentFor = parentWrapper.findLabel()?.getElement().getAttribute('for');
      const childFor = childWrapper.findLabel()?.getElement().getAttribute('for');

      expect(controlElement).not.toBeNull();
      expect(parentFor).not.toBe(childFor);
      expect(childFor).toBe(controlElement?.id);
    });
  });
});
