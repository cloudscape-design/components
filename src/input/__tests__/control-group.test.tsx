// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';

import Input from '../../../lib/components/input';
import ControlGroup from '../../../lib/components/internal/components/control-group';
import { PositionProbe } from '../../internal/components/control-group/__tests__/common';

import buttonStyles from '../../../lib/components/button/styles.css.js';
import inputStyles from '../../../lib/components/input/styles.css.js';

const noop = () => {};

describe('Input in control group', () => {
  test('resets the context for prefix content', () => {
    const { getByTestId } = render(
      <ControlGroup>
        <Input value="" onChange={noop} prefix={<PositionProbe />} />
      </ControlGroup>
    );

    expect(getByTestId('probe')).toHaveTextContent('none');
  });

  test('resets the context for suffix content', () => {
    const { getByTestId } = render(
      <ControlGroup>
        <Input value="" onChange={noop} suffix={<PositionProbe />} />
      </ControlGroup>
    );

    expect(getByTestId('probe')).toHaveTextContent('none');
  });

  test('does not apply the grouped class to the clear button', () => {
    const { container } = render(
      <ControlGroup>
        <Input type="search" value="service" onChange={noop} />
      </ControlGroup>
    );

    const clearButton = container.querySelector('.' + inputStyles['input-button-right']);
    expect(clearButton).not.toBeNull();
    expect(clearButton).not.toHaveClass(buttonStyles.grouped);
  });
});
