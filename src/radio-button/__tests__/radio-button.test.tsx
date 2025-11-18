// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';

import RadioButton from '../../../lib/components/radio-button';
import createWrapper from '../../../lib/components/test-utils/dom';

describe('test utils', () => {
  test('findRadioButton', () => {
    const wrapper = createWrapper(
      render(
        <RadioButton value="a" name="name" checked={false}>
          a
        </RadioButton>
      ).container.parentElement!
    );
    expect(wrapper.findRadioButton()).toBeTruthy();
  });
  test('findAllRadioButtons', () => {
    const wrapper = createWrapper(
      render(
        <div>
          <RadioButton value="a" name="name" checked={false}>
            a
          </RadioButton>
          <RadioButton value="b" name="name" checked={false}>
            b
          </RadioButton>
        </div>
      ).container
    );
    expect(wrapper.findAllRadioButtons()).toHaveLength(2);
  });
});
