// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';
import FormField, { FormFieldProps } from '../../../lib/components/form-field';
import createWrapper, { ElementWrapper } from '../../../lib/components/test-utils/dom';
import {
  useFormFieldContext,
  FormFieldValidationControlProps,
} from '../../../lib/components/internal/context/form-field-context';

const TestControl = () => {
  const contextValues = useFormFieldContext({});
  return <div>{JSON.stringify(contextValues, null, 2)}</div>;
};

const getContext = (control: ElementWrapper | null) => {
  const contextValueString = control!.getElement().textContent;
  const context = JSON.parse(contextValueString!) as FormFieldValidationControlProps;
  return context;
};

function getWrapperAndContextControl(props: FormFieldProps = {}) {
  const renderResult = render(
    <FormField {...props}>
      <TestControl />
    </FormField>
  );

  const wrapper = createWrapper(renderResult.container).findFormField()!;
  const contextValueString = wrapper.findControl()?.getElement().textContent;
  const context = JSON.parse(contextValueString!);
  return { wrapper, context };
}

function getWrapperAndContextSecondaryControl(props: FormFieldProps = {}) {
  const renderResult = render(<FormField {...props} secondaryControl={<TestControl />} />);

  const wrapper = createWrapper(renderResult.container).findFormField()!;
  const contextValueString = wrapper.findSecondaryControl()?.getElement().textContent;
  const context = JSON.parse(contextValueString!);
  return { wrapper, context };
}

[
  {
    controlName: 'control',
    getWrapperAndContext: getWrapperAndContextControl,
  },
  {
    controlName: 'secondaryControl',
    getWrapperAndContext: getWrapperAndContextSecondaryControl,
  },
].forEach(({ controlName, getWrapperAndContext }) => {
  describe(controlName, () => {
    describe('ariaLabelledby', () => {
      test('is passed to children when a label is defined on the form field', () => {
        const controlId = 'test-control-id';
        const { context } = getWrapperAndContext({ controlId, label: 'hello' });
        expect(context.ariaLabelledby).toBe(`${controlId}-label`);
      });

      test('is not passed to children when the label on form field is set to empty string', () => {
        const { context } = getWrapperAndContext({ label: '', description: '' });
        expect(context.ariaLabelledby).toBeUndefined();
      });

      test('is not passed to children when no label is defined on the form field', () => {
        const { context } = getWrapperAndContext();
        expect(context.ariaLabelledby).toBeUndefined();
      });
    });

    describe('ariaDescribedby', () => {
      // Tests for correct ID generation are in form-field-control-id.test.tsx
      test('form field generates describedby with the right values in the right order', () => {
        const check = (
          errorText: string | undefined,
          description: string | undefined,
          constraintText: string | undefined
        ) => {
          const controlId = 'control-id';

          const {
            context: { ariaDescribedby },
          } = getWrapperAndContext({ controlId, errorText, description, constraintText });

          const errorTextId = `${controlId}-error`;
          const descriptionId = `${controlId}-description`;
          const constraintId = `${controlId}-constraint`;

          const expectedDescribedBy =
            !errorText && !description && !constraintText
              ? undefined
              : `${errorText ? errorTextId : ''}${description ? ' ' + descriptionId : ''}${
                  constraintText ? ' ' + constraintId : ''
                }`.trimLeft();

          expect(ariaDescribedby).toBe(expectedDescribedBy);
        };

        const errorText = 'errorText';
        const description = 'description';
        const constraintText = 'constraintText';

        check(errorText, description, constraintText);

        check(undefined, description, constraintText);
        check(errorText, undefined, constraintText);
        check(errorText, description, undefined);

        check(undefined, undefined, constraintText);
        check(errorText, undefined, undefined);
        check(undefined, description, undefined);

        check(undefined, undefined, undefined);

        check('', description, constraintText);
        check(errorText, '', constraintText);
        check(errorText, description, '');

        check('', '', constraintText);
        check(errorText, '', '');
        check('', description, '');

        check('', '', '');
      });

      test('form field passes a describedBy value to children in case appropriate slots are set', () => {
        const controlId = 'test-id';
        const { context } = getWrapperAndContext({ controlId, description: 'something' });
        expect(context.ariaDescribedby).toBe(`${controlId}-description`);
      });

      test('form field does not pass a describedBy value to children when not corresponding slots are set', () => {
        const { context } = getWrapperAndContext();
        expect(context.ariaDescribedby).toBeUndefined();
      });
    });

    describe('invalid', () => {
      test('form field passes an invalid=false flag to children when errorText is not set', () => {
        const { wrapper, context } = getWrapperAndContext();
        expect(context.invalid).toBe(false);
        expect(wrapper.findError()).toBeNull();
      });

      test('form field passes an invalid=false flag to children when errorText is set to an empty string', () => {
        const { wrapper, context } = getWrapperAndContext({ errorText: '' });
        expect(context.invalid).toBe(false);
        expect(wrapper.findError()).toBeNull();
      });

      test('form field passes an invalid=true flag to children when errorText is set to a non-empty string', () => {
        const errorText = 'wrong, do it again';
        const { wrapper, context } = getWrapperAndContext({ errorText });
        expect(context.invalid).toBe(true);
        expect(wrapper.findError()?.getElement()).toHaveTextContent(errorText);
      });
    });
  });
});

describe('controlId', () => {
  test('is passed to children when defined on form field', () => {
    const controlId = 'test-control-id';
    const { context } = getWrapperAndContextControl({ controlId });
    expect(context.controlId).toBe(controlId);
  });

  test('is generated and then passed to children when set to empty string', () => {
    const { context } = getWrapperAndContextControl({ controlId: '' });
    expect(context.controlId).toBeDefined();
    expect(context.controlId).not.toBe('');
  });

  test('is generated and then passed to children when undefined', () => {
    const { context } = getWrapperAndContextControl();
    expect(context.controlId).toBeDefined();
  });

  test('is not passed to secondaryControl', () => {
    const controlId = 'some-control-id';
    const { context } = getWrapperAndContextSecondaryControl({
      controlId: controlId,
      label: 'Label',
      errorText: 'errorText',
    });

    expect(context.controlId).toBeUndefined();
    expect(context.ariaLabelledby).toBe(`${controlId}-label`);
    expect(context.ariaDescribedby).toBe(`${controlId}-error`);
    expect(context.invalid).toBe(true);
  });
});

describe('nested form fields', () => {
  const renderNestedFormFields = (element: JSX.Element) => {
    const renderResult = render(element);

    return {
      outerFormFieldWrapper: createWrapper(renderResult.container).findFormField('#outer')!,
      innerFormFieldWrapper: createWrapper(renderResult.container).findFormField('#inner')!,
    };
  };

  test("inner form fields combine their label with the outer form field's label", () => {
    const { outerFormFieldWrapper, innerFormFieldWrapper } = renderNestedFormFields(
      <FormField
        id="outer"
        label="outer label"
        description="outer description"
        constraintText="outer constrainttext"
        errorText="outer errortext"
      >
        <FormField
          id="inner"
          label="inner label"
          description="inner description"
          constraintText="outer description"
          errorText="outer description"
        >
          <TestControl />
        </FormField>
      </FormField>
    );

    const outerLabelId = outerFormFieldWrapper.findLabel()?.getElement().id;
    const innerLabelId = innerFormFieldWrapper.findLabel()?.getElement().id;

    const context = getContext(innerFormFieldWrapper.findControl());
    expect(context.ariaLabelledby).toBe(`${outerLabelId} ${innerLabelId}`);
  });

  test("inner form fields combine their description with the outer form field's description", () => {
    const { outerFormFieldWrapper, innerFormFieldWrapper } = renderNestedFormFields(
      <FormField
        id="outer"
        label="outer label"
        description="outer description"
        constraintText="outer constrainttext"
        errorText="outer errortext"
      >
        <FormField
          id="inner"
          label="inner label"
          description="inner description"
          constraintText="outer description"
          errorText="outer description"
        >
          <TestControl />
        </FormField>
      </FormField>
    );

    const outerErrorId = outerFormFieldWrapper.findError()?.getElement().id;
    const outerDescriptionId = outerFormFieldWrapper.findDescription()?.getElement().id;
    const outerConstraintId = outerFormFieldWrapper.findConstraint()?.getElement().id;

    const innerErrorId = innerFormFieldWrapper.findError()?.getElement().id;
    const innerDescriptionId = innerFormFieldWrapper.findDescription()?.getElement().id;
    const innerConstraintId = innerFormFieldWrapper.findConstraint()?.getElement().id;

    const context = getContext(innerFormFieldWrapper.findControl());
    expect(context.ariaDescribedby).toBe(
      [outerErrorId, outerDescriptionId, outerConstraintId, innerErrorId, innerDescriptionId, innerConstraintId].join(
        ' '
      )
    );
  });

  test('inner form fields are marked as invalid when the outer form field is invalid', () => {
    const { innerFormFieldWrapper } = renderNestedFormFields(
      <FormField
        id="outer"
        label="outer label"
        description="outer description"
        constraintText="outer constrainttext"
        errorText="outer errortext"
      >
        <FormField id="inner" label="inner label" description="inner description" constraintText="outer description">
          <TestControl />
        </FormField>
      </FormField>
    );

    const context = getContext(innerFormFieldWrapper.findControl());
    expect(context.invalid).toBe(true);
  });

  test("outer form fields don't override nested form field's controlId for control", () => {
    const outerControlId = 'outer-control-id';
    const { innerFormFieldWrapper } = renderNestedFormFields(
      <FormField controlId={outerControlId} label="outer label">
        <FormField id="inner" label="inner label">
          <TestControl />
        </FormField>
      </FormField>
    );

    // the "for" attribute of form field labels matches the controlId
    const innerControlId = innerFormFieldWrapper.findLabel()?.getElement().getAttribute('for');

    const context = getContext(innerFormFieldWrapper.findControl());
    expect(context.controlId).not.toBe(outerControlId);
    expect(context.controlId).toBe(innerControlId);
  });

  test("outer form fields don't override nested form field's controlId for secondary control", () => {
    const outerControlId = 'outer-control-id';
    const { innerFormFieldWrapper } = renderNestedFormFields(
      <FormField
        controlId={outerControlId}
        label="outer label"
        description="outer description"
        constraintText="outer constraintText"
        errorText="outer errorText"
      >
        <FormField
          id="inner"
          label="inner label"
          description="inner description"
          constraintText="inner constraintText"
          errorText="inner errorText"
          secondaryControl={<TestControl />}
        />
      </FormField>
    );

    // the "for" attribute of form field labels matches the controlId
    const innerControlId = innerFormFieldWrapper.findLabel()?.getElement().getAttribute('for');

    const context = getContext(innerFormFieldWrapper.findSecondaryControl());

    expect(context.controlId).not.toBe(outerControlId);
    expect(context.controlId).not.toBe(innerControlId);
    expect(context.controlId).toBeUndefined();
  });
});
