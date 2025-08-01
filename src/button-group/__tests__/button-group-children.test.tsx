// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { render } from '@testing-library/react';

import Button from '../../../lib/components/button';
import ButtonGroup from '../../../lib/components/button-group';
import createWrapper from '../../../lib/components/test-utils/dom';

describe('ButtonGroup children property', () => {
  test('renders children', () => {
    const { container } = render(
      <ButtonGroup variant="children">
        <Button data-testid="child-element">Button one</Button>
        <Button data-testid="child-element-two">Another button</Button>
      </ButtonGroup>
    );

    const wrapper = createWrapper(container);
    const buttonGroup = wrapper.findButtonGroup()!;

    expect(buttonGroup.findContent().findAllButtons()).toHaveLength(2);

    const childElement = wrapper.find('[data-testid="child-element"]');
    expect(childElement).not.toBeNull();
    expect(childElement!.getElement()).toHaveTextContent('Button one');
  });
});
