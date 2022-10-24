// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';
import createWrapper, { InputWrapper } from '../../../lib/components/test-utils/dom';
import InternalFormField from '../../../lib/components/form-field/internal';
import InternalInput from '../../../lib/components/input/internal';
import styles from '../../../lib/components/input/styles.css.js';
import { DEBOUNCE_DEFAULT_DELAY } from '../../../lib/components/internal/debounce';

function renderInput(jsx: React.ReactElement) {
  render(jsx);
  const wrapper = createWrapper().findComponent(`.${styles['input-container']}`, InputWrapper)!;
  return { wrapper };
}

test('should call onDelayedInput and onChange handlers respectively', async () => {
  const onDelayedInput = jest.fn();
  const onChange = jest.fn();
  const { wrapper } = renderInput(
    <InternalInput
      value=""
      onChange={event => onChange(event.detail)}
      __onDelayedInput={event => onDelayedInput(event.detail)}
    />
  );
  wrapper.setInputValue('first');
  expect(onChange).toHaveBeenCalledWith({ value: 'first' });
  expect(onDelayedInput).not.toHaveBeenCalled();
  wrapper.setInputValue('second');
  expect(onChange).toHaveBeenCalledWith({ value: 'second' });
  // wait the debounce delay and extra more time for stability
  await new Promise(resolve => setTimeout(resolve, DEBOUNCE_DEFAULT_DELAY + 50));
  expect(onDelayedInput).toHaveBeenCalledTimes(1);
  expect(onDelayedInput).toHaveBeenCalledWith({ value: 'second' });
});

test('inherits form-field properties', () => {
  render(
    <InternalFormField controlId="control-id" label="Label" description="description" errorText="error">
      <InternalInput value="" __inheritFormFieldProps={true} />
    </InternalFormField>
  );
  const element = createWrapper().find('input')!.getElement();

  expect(element).toHaveAttribute('id', 'control-id');
  expect(element).toHaveAttribute('aria-labelledby', 'control-id-label');
  expect(element).toHaveAttribute('aria-describedby', 'control-id-error control-id-description');
  expect(element).toHaveAttribute('aria-invalid', 'true');
});

test('overrides form-field properties', () => {
  render(
    <InternalFormField controlId="control-id" label="Label" description="description" errorText="error">
      <InternalInput value="" controlId="id" ariaLabelledby="label" ariaDescribedby="description" invalid={false} />
    </InternalFormField>
  );
  const element = createWrapper().find('input')!.getElement();

  expect(element).toHaveAttribute('id', 'id');
  expect(element).toHaveAttribute('aria-labelledby', 'label');
  expect(element).toHaveAttribute('aria-describedby', 'description');
  expect(element).not.toHaveAttribute('aria-invalid');
});
