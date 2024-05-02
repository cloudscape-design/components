// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';
import FormField from '../../../lib/components/form-field';
import createWrapper from '../../../lib/components/test-utils/dom';

describe('test-util selectors', () => {
  test('find the correct elements even when nesting', () => {
    const renderResult = render(
      <FormField
        id="outer"
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
        >
          <div id="innerControl" />
        </FormField>
      </FormField>
    );

    const outerFormFieldWrapper = createWrapper(renderResult.container).findFormField('#outer')!;
    const innerFormFieldWrapper = createWrapper(renderResult.container).findFormField('#inner')!;

    expect(outerFormFieldWrapper.findLabel()?.getElement()).toHaveTextContent('outer label');
    expect(outerFormFieldWrapper.findDescription()?.getElement()).toHaveTextContent('outer description');
    expect(outerFormFieldWrapper.findConstraint()?.getElement()).toHaveTextContent('outer constraintText');
    expect(outerFormFieldWrapper.findError()?.getElement()).toHaveTextContent('outer errorText');
    expect(outerFormFieldWrapper.findControl()?.getElement().children[0]).toHaveAttribute('id', 'inner');

    expect(innerFormFieldWrapper.findLabel()?.getElement()).toHaveTextContent('inner label');
    expect(innerFormFieldWrapper.findDescription()?.getElement()).toHaveTextContent('inner description');
    expect(innerFormFieldWrapper.findConstraint()?.getElement()).toHaveTextContent('inner constraintText');
    expect(innerFormFieldWrapper.findError()?.getElement()).toHaveTextContent('inner errorText');
    expect(innerFormFieldWrapper.findControl()?.getElement().children[0]).toHaveAttribute('id', 'innerControl');
  });

  test('find the correct warning elements even when nesting', () => {
    const renderResult = render(
      <FormField id="outer" warningText="outer warningText">
        <FormField id="inner" warningText="inner warningText">
          <div />
        </FormField>
      </FormField>
    );

    const outerFormFieldWrapper = createWrapper(renderResult.container).findFormField('#outer')!;
    const innerFormFieldWrapper = createWrapper(renderResult.container).findFormField('#inner')!;

    expect(outerFormFieldWrapper.findWarning()?.getElement()).toHaveTextContent('outer warningText');
    expect(innerFormFieldWrapper.findWarning()?.getElement()).toHaveTextContent('inner warningText');
  });
});
