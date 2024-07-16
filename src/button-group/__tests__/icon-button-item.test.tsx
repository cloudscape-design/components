// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';
import { ButtonGroupProps } from '../../../lib/components/button-group/interfaces';
import createWrapper from '../../../lib/components/test-utils/dom';
import ButtonGroup from '../../../lib/components/button-group';

const renderButtonGroup = (props: ButtonGroupProps, ref?: React.Ref<ButtonGroupProps.Ref>) => {
  const renderResult = render(<ButtonGroup ref={ref} {...props} />);
  return createWrapper(renderResult.container).findButtonGroup()!;
};

describe('IconButtonItem', () => {
  const item: ButtonGroupProps.IconButton = {
    type: 'icon-button',
    id: 'test-button',
    text: 'Test Button',
    iconName: 'add-plus',
    loading: false,
    loadingText: 'Loading...',
    disabled: false,
    popoverFeedback: 'Action Popover',
  };

  test('renders the button', () => {
    const wrapper = renderButtonGroup({ variant: 'icon', items: [item], ariaLabel: 'Chat actions' });

    expect(wrapper.findButtonById('test-button')).not.toBeNull();
    expect(wrapper.findTooltip()).toBeNull();
  });
});
