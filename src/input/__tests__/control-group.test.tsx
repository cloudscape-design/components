// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';

import Input from '../../../lib/components/input';
import ControlGroup from '../../../lib/components/internal/components/control-group';
import { PositionProbe } from '../../internal/components/control-group/__tests__/common';

const noop = () => {};

describe('Input in control group', () => {
  // The control group renders a hidden measurement ghost that duplicates its children,
  // so prefix/suffix content (which renders immediately) appears twice. The first match
  // is the real control's; the second is in the inert ghost.
  test('resets the context for prefix content', () => {
    const { getAllByTestId } = render(
      <ControlGroup>
        <Input value="" onChange={noop} prefix={<PositionProbe />} />
      </ControlGroup>
    );

    expect(getAllByTestId('probe')[0]).toHaveTextContent('none');
  });

  test('resets the context for suffix content', () => {
    const { getAllByTestId } = render(
      <ControlGroup>
        <Input value="" onChange={noop} suffix={<PositionProbe />} />
      </ControlGroup>
    );

    expect(getAllByTestId('probe')[0]).toHaveTextContent('none');
  });
});
