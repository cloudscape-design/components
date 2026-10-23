// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';

import { createWrapper } from '@cloudscape-design/test-utils-core/dom';

import ControlGroup from '../../../lib/components/control-group';
import Input from '../../../lib/components/input';
import { PositionProbe } from '../../control-group/__tests__/common';

const noop = () => {};

describe('Input in control group', () => {
  test('resets the context for prefix content', () => {
    const { container } = render(
      <ControlGroup>
        <Input value="" onChange={noop} prefix={<PositionProbe />} />
      </ControlGroup>
    );

    expect(createWrapper(container).findControlGroup()!.findControls()[0].getElement()).toHaveTextContent('none');
  });

  test('resets the context for suffix content', () => {
    const { container } = render(
      <ControlGroup>
        <Input value="" onChange={noop} suffix={<PositionProbe />} />
      </ControlGroup>
    );

    expect(createWrapper(container).findControlGroup()!.findControls()[0].getElement()).toHaveTextContent('none');
  });
});
