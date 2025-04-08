// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';

import { ActionsWrapper } from '../../../../lib/components/alert/actions-wrapper';

let mockElementOffsetLeft = 200;

Object.defineProperties(window.HTMLElement.prototype, {
  offsetLeft: {
    configurable: true,
    enumerable: true,
    get() {
      return mockElementOffsetLeft;
    },
  },
});

const defaultProps = {
  className: '',
  action: null,
  buttonText: 'Action',
  onButtonClick: () => {},
  testUtilClasses: { actionButton: '', actionSlot: '' },
  discoveredActions: [],
};

describe('actions-wrapper `wrappedClass` functionality', () => {
  it('adds wrapped class to actions if they are displayed on a new line', () => {
    mockElementOffsetLeft = 10;
    const className = 'class-to-add';
    const { container } = render(<ActionsWrapper {...defaultProps} containerWidth={500} wrappedClass={className} />);
    expect(container.querySelector(`.${className}`)).toBeTruthy();
  });
  it('does not add wrapped class to actions if they are displayed on same line', () => {
    mockElementOffsetLeft = 400;
    const className = 'class-to-add';
    const { container } = render(<ActionsWrapper {...defaultProps} containerWidth={500} wrappedClass={className} />);
    expect(container.querySelector(`.${className}`)).toBeFalsy();
  });
});
