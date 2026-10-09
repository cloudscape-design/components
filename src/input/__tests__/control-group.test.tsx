// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';

import Input from '../../../lib/components/input';
import ControlGroup from '../../../lib/components/internal/components/control-group';
import { PositionProbe } from '../../internal/components/control-group/__tests__/common';

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
});
