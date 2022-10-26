// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { createRef } from 'react';
import { render } from '@testing-library/react';
import createWrapper from '../../../lib/components/test-utils/dom';
import PopoverContainer, { PopoverContainerProps } from '../../../lib/components/popover/container';

import styles from '../../../lib/components/popover/styles.selectors.js';

const defaultProps: PopoverContainerProps = {
  trackRef: createRef(),
  position: 'top',
  arrow: () => null,
  fixedWidth: false,
  children: 'content',
  size: 'medium',
};

function renderPopoverContainer(props: Partial<PopoverContainerProps>) {
  const { container } = render(<PopoverContainer {...defaultProps} {...props} />);
  const containerWrapper = createWrapper(container).findByClassName(styles.container)!;
  const bodyWrapper = createWrapper(container).findByClassName(styles['container-body'])!;
  return { containerWrapper, bodyWrapper };
}

test('renders provided arrow', () => {
  const arrow = jest.fn();
  renderPopoverContainer({ arrow });
  expect(arrow).toHaveBeenCalledTimes(1);
  expect(arrow).toHaveBeenCalledWith(null);
});

test('assigns body class name', () => {
  const { bodyWrapper } = renderPopoverContainer({ bodyClassName: 'body' });
  expect(bodyWrapper.getElement()!).toHaveClass('body');
});
