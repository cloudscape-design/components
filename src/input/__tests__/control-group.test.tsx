// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';

import Input from '../../../lib/components/input';
import ControlGroup from '../../../lib/components/internal/components/control-group';
import ControlGroupWrapper from '../../../lib/components/test-utils/dom/internal/control-group';
import { PositionProbe } from '../../internal/components/control-group/__tests__/common';

const noop = () => {};

function findControlGroup(container: HTMLElement) {
  const element = container.querySelector<HTMLElement>(`.${ControlGroupWrapper.rootSelector}`);
  return element && new ControlGroupWrapper(element);
}

describe('Input in control group', () => {
  test('resets the context for prefix content', () => {
    const { container } = render(
      <ControlGroup>
        <Input value="" onChange={noop} prefix={<PositionProbe />} />
      </ControlGroup>
    );

    expect(findControlGroup(container)!.findControls()[0].getElement()).toHaveTextContent('none');
  });

  test('resets the context for suffix content', () => {
    const { container } = render(
      <ControlGroup>
        <Input value="" onChange={noop} suffix={<PositionProbe />} />
      </ControlGroup>
    );

    expect(findControlGroup(container)!.findControls()[0].getElement()).toHaveTextContent('none');
  });
});
