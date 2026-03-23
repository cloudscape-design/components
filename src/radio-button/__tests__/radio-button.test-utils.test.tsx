// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';

import RadioButton from '../../../lib/components/radio-button';
import createWrapper from '../../../lib/components/test-utils/dom';
import { renderRadioButton } from './common';

describe('Radio Button test utils', () => {
  test('findRadioButton', () => {
    const radioButton = renderRadioButton(<RadioButton name="group" checked={false} />);
    expect(radioButton).toBeTruthy();
  });

  test('findAllRadioButtons', () => {
    const wrapper = createWrapper(
      render(
        <div>
          <RadioButton name="group" checked={false} />
          <RadioButton name="group" checked={false} />
        </div>
      ).container
    );
    expect(wrapper.findAllRadioButtons()).toHaveLength(2);
  });

  test('findLabel', () => {
    const radioButton = renderRadioButton(
      <RadioButton name="group" checked={false}>
        My radio button label
      </RadioButton>
    );
    expect(radioButton.findLabel().getElement().textContent).toBe('My radio button label');
  });

  test('findDescription', () => {
    const radioButton = renderRadioButton(
      <RadioButton name="group" checked={false} description="My radio button description" />
    );
    expect(radioButton.findDescription()!.getElement().textContent).toBe('My radio button description');
  });

  test('findNativeInput', () => {
    const radioButton = renderRadioButton(<RadioButton name="group" checked={false} />);
    expect(radioButton.findNativeInput()!.getElement().tagName).toBe('INPUT');
  });
});
