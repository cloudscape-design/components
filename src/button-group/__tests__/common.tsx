// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { render } from '@testing-library/react';

import ButtonGroup, { ButtonGroupProps } from '../../../lib/components/button-group';
import createWrapper from '../../../lib/components/test-utils/dom';

const defaultProps: ButtonGroupProps = {
  variant: 'icon',
  ariaLabel: 'Chat actions',
  items: [],
};

export function renderButtonGroup(props: Partial<ButtonGroupProps>, ref?: React.Ref<ButtonGroupProps.Ref>) {
  const renderResult = render(<ButtonGroup ref={ref} {...defaultProps} {...props} />);
  const wrapper = createWrapper(renderResult.container).findButtonGroup()!;
  const rerender = (props: Partial<ButtonGroupProps>) =>
    renderResult.rerender(<ButtonGroup ref={ref} {...defaultProps} {...props} />);
  return { wrapper, rerender };
}
