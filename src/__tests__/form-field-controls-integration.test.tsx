// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';
import FormField, { FormFieldProps } from '../../lib/components/form-field';
import createWrapper, { ElementWrapper } from '../../lib/components/test-utils/dom';

import { FormFieldValidationControlProps } from '../../lib/components/internal/context/form-field-context';
import { getRequiredPropsForComponent } from './required-props-for-components';
import { requireComponent } from './utils';

const formFieldControlComponents = [
  {
    componentName: 'input',
    findNativeElement: (wrapper: ElementWrapper) => wrapper.findInput()?.findNativeInput()?.getElement(),
  },
  {
    componentName: 'textarea',
    findNativeElement: (wrapper: ElementWrapper) => wrapper.findTextarea()?.findNativeTextarea().getElement(),
  },
  {
    componentName: 'radio-group',
    findNativeElement: (wrapper: ElementWrapper) => wrapper.findRadioGroup()?.getElement(),
  },
  {
    componentName: 'date-input',
    findNativeElement: (wrapper: ElementWrapper) => wrapper.findDateInput()?.findNativeInput()?.getElement(),
  },
  {
    componentName: 'time-input',
    findNativeElement: (wrapper: ElementWrapper) => wrapper.findTimeInput()?.findNativeInput()?.getElement(),
  },
  {
    componentName: 'autosuggest',
    findNativeElement: (wrapper: ElementWrapper) => wrapper.findAutosuggest()?.findNativeInput()?.getElement(),
  },
  {
    componentName: 'textarea',
    findNativeElement: (wrapper: ElementWrapper) => wrapper.findTextarea()?.findNativeTextarea()?.getElement(),
  },
  {
    componentName: 'select',
    findNativeElement: (wrapper: ElementWrapper) => wrapper.findSelect()?.findTrigger()?.getElement(),
  },
  {
    componentName: 'multiselect',
    findNativeElement: (wrapper: ElementWrapper) => wrapper.findMultiselect()?.findTrigger()?.getElement(),
  },
  {
    componentName: 'tiles',
    findNativeElement: (wrapper: ElementWrapper) => wrapper.findTiles()?.getElement(),
  },
  {
    componentName: 'date-picker',
    findNativeElement: (wrapper: ElementWrapper) => wrapper.findDatePicker()?.findNativeInput()?.getElement(),
  },
  {
    componentName: 'date-range-picker',
    findNativeElement: (wrapper: ElementWrapper) => wrapper.findDateRangePicker()?.findLabel()?.getElement(),
  },
  {
    componentName: 'file-upload',
    findNativeElement: (wrapper: ElementWrapper) => wrapper.findFileUpload()?.findNativeInput().getElement(),
  },
  {
    componentName: 'slider',
    findNativeElement: (wrapper: ElementWrapper) => wrapper.findSlider()?.findNativeInput().getElement(),
  },
];

formFieldControlComponents.forEach(({ componentName, findNativeElement }) => {
  function renderComponentIntoFormField(
    formFieldProps: FormFieldProps = {},
    controlComponentProps: FormFieldValidationControlProps = {}
  ) {
    const { default: Component } = requireComponent(componentName);
    const requiredProps = getRequiredPropsForComponent(componentName) ?? {};
    const renderResult = render(
      <FormField {...formFieldProps}>
        <Component {...requiredProps} {...controlComponentProps} value="" onChange={() => {}} />
      </FormField>
    );
    const formFieldWrapper = createWrapper(renderResult.container).findFormField()!;
    const controlWrapper = formFieldWrapper.findControl()!;
    return { formFieldWrapper, controlWrapper };
  }

  describe(`${componentName}`, () => {
    const isGroupComponent = ['radio-group', 'tiles'].includes(componentName);
    if (!isGroupComponent) {
      describe('controlId', () => {
        test('applies controlId from FormField when controlId is not set on itself', () => {
          const formFieldControlId = 'form-field-control-id';
          const { controlWrapper } = renderComponentIntoFormField({ controlId: formFieldControlId });
          expect(findNativeElement(controlWrapper)?.id).toBe(formFieldControlId);
        });

        test('overwrites controlId from FormField when controlId is set on itself', () => {
          const formFieldControlId = 'form-field-control-id';
          const controlControlId = 'control-control-id';
          const { controlWrapper } = renderComponentIntoFormField(
            { controlId: formFieldControlId },
            { controlId: controlControlId }
          );

          expect(findNativeElement(controlWrapper)?.id).not.toBe(formFieldControlId);
          expect(findNativeElement(controlWrapper)?.id).toBe(controlControlId);
        });
      });

      describe('invalid', () => {
        test('applies invalid from FormField when invalid is not set on itself', () => {
          const { controlWrapper } = renderComponentIntoFormField({
            errorText: 'something',
          });
          expect(findNativeElement(controlWrapper)).toHaveAttribute('aria-invalid', 'true');
        });

        test('overwrites invalid=true from FormField when invalid=false is set on itself', () => {
          const { controlWrapper } = renderComponentIntoFormField(
            {
              errorText: 'something',
            },
            { invalid: false }
          );
          expect(findNativeElement(controlWrapper)).not.toHaveAttribute('aria-invalid');
        });

        test('overwrites invalid=false from FormField when invalid=true is set on itself', () => {
          const { controlWrapper } = renderComponentIntoFormField({}, { invalid: true });
          expect(findNativeElement(controlWrapper)).toHaveAttribute('aria-invalid', 'true');
        });

        test('applies invalid from FormField when other fields are set on itself', () => {
          const { controlWrapper } = renderComponentIntoFormField(
            { errorText: 'something' },
            { controlId: 'control-id' }
          );

          expect(findNativeElement(controlWrapper)).toHaveAttribute('aria-invalid', 'true');
        });
      });
    }

    describe('ariaLabelledby', () => {
      test('applies ariaLabelledby from FormField when ariaLabelledby is not set on itself', () => {
        const formFieldControlId = 'form-field-control-id';
        const { controlWrapper } = renderComponentIntoFormField({
          controlId: formFieldControlId,
          label: 'something',
        });
        expect(findNativeElement(controlWrapper)?.getAttribute('aria-labelledby')).toMatch(
          `${formFieldControlId}-label`
        );
      });

      test('overwrites ariaLabelledby from FormField when ariaLabelledby is set on itself', () => {
        const formFieldControlId = 'form-field-control-id';
        const controlAriaLabelledby = 'control-aria-labelled-by';
        const { controlWrapper } = renderComponentIntoFormField(
          { controlId: formFieldControlId, description: 'something' },
          { ariaLabelledby: controlAriaLabelledby }
        );

        expect(findNativeElement(controlWrapper)?.getAttribute('aria-labelledby')).not.toMatch(
          `${formFieldControlId}-label`
        );
        expect(findNativeElement(controlWrapper)?.getAttribute('aria-labelledby')).toMatch(controlAriaLabelledby);
      });

      test('does not overwrite the value when it is set to undefined', () => {
        const formFieldControlId = 'form-field-control-id';
        const { controlWrapper } = renderComponentIntoFormField(
          { controlId: formFieldControlId, label: 'something' },
          { ariaLabelledby: undefined }
        );

        expect(findNativeElement(controlWrapper)?.getAttribute('aria-labelledby')).toMatch(
          `${formFieldControlId}-label`
        );
      });

      test('applies ariaLabelledby from FormField when other fields are set on itself', () => {
        const { formFieldWrapper, controlWrapper } = renderComponentIntoFormField(
          { label: 'something' },
          { controlId: 'some-control-id' }
        );

        const formFieldLabelId = formFieldWrapper.findLabel()?.getElement().id;
        expect(findNativeElement(controlWrapper)?.getAttribute('aria-labelledby')).toMatch(
          formFieldLabelId!.toString()
        );
      });
    });

    describe('ariaDescribedby', () => {
      test('applies ariaDescribedby from FormField when ariaDescribedby is not set on itself', () => {
        const formFieldControlId = 'form-field-control-id';
        const { controlWrapper } = renderComponentIntoFormField({
          controlId: formFieldControlId,
          description: 'something',
        });
        expect(findNativeElement(controlWrapper)).toHaveAttribute(
          'aria-describedby',
          `${formFieldControlId}-description`
        );
      });

      test('overwrites ariaDescribedby from FormField when ariaDescribedby is set on itself', () => {
        const formFieldControlId = 'form-field-control-id';
        const controlAriaDescribedby = 'control-aria-described-by';
        const { controlWrapper } = renderComponentIntoFormField(
          { controlId: formFieldControlId, description: 'something' },
          { ariaDescribedby: controlAriaDescribedby }
        );

        expect(findNativeElement(controlWrapper)).not.toHaveAttribute(
          'aria-describedby',
          `${formFieldControlId}-description`
        );
        expect(findNativeElement(controlWrapper)).toHaveAttribute('aria-describedby', controlAriaDescribedby);
      });

      test('applies ariaDescribedBy from FormField when other fields are set on itself', () => {
        const controlControlId = 'control-control-id';
        const { formFieldWrapper, controlWrapper } = renderComponentIntoFormField(
          { description: 'something' },
          { controlId: controlControlId }
        );

        const formFieldDescriptionId = formFieldWrapper.findDescription()?.getElement().id;
        expect(findNativeElement(controlWrapper)).toHaveAttribute('aria-describedby', formFieldDescriptionId);
      });
    });
  });
});
