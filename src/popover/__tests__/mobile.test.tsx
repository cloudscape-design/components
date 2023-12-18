// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { render } from '@testing-library/react';
import createWrapper from '../../../lib/components/test-utils/dom';
import Popover from '../../../lib/components/popover';
import { calculatePosition } from '../../../lib/components/popover/utils/positions';

jest.mock('../../../lib/components/internal/hooks/use-mobile', () => ({
  useMobile: jest.fn().mockReturnValue(true),
}));

jest.mock('../../../lib/components/popover/utils/positions', () => ({
  ...jest.requireActual('../../../lib/components/popover/utils/positions'),
  calculatePosition: jest.fn(),
  getOffsetDimensions: () => ({ offsetWidth: 200, offsetHeight: 300 }),
}));

const originalGetComputedStyle = window.getComputedStyle;
const fakeGetComputedStyle: Window['getComputedStyle'] = (...args) => {
  const result = originalGetComputedStyle(...args);
  result.borderWidth = '2px'; // Approximate mock value for the popover body' border width
  result.width = '10px'; // Approximate mock value for the popover arrow's width
  result.height = '10px'; // Approximate mock value for the popover arrow's height
  return result;
};

const originalScrollBy = window.scrollBy;

beforeEach(() => {
  window.getComputedStyle = fakeGetComputedStyle;
  window.scrollBy = jest.fn();
  window.innerHeight = 500;
});
afterEach(() => {
  window.getComputedStyle = originalGetComputedStyle;
  window.scrollBy = originalScrollBy;
});

function renderPopover() {
  const { container } = render(<Popover>Trigger</Popover>);
  return createWrapper(container).findPopover();
}

describe('Scrolls beyond the viewport if necessary on mobile screen', () => {
  test('scrolls up when the container has more space at the top', () => {
    (calculatePosition as jest.Mock).mockReturnValue({
      scrollable: false,
      internalPosition: 'top-center',
      boundingBox: { top: -50, left: 0, width: 200, height: 300 },
    });
    const popover = renderPopover()!;
    popover.findTrigger().click();
    expect(window.scrollBy).toHaveBeenCalledWith(0, -50);
  });
  test('scrolls down when the container has more space at the bottom', () => {
    (calculatePosition as jest.Mock).mockReturnValue({
      scrollable: false,
      internalPosition: 'bottom-center',
      boundingBox: { top: 300, left: 0, width: 200, height: 300 },
    });
    const popover = renderPopover()!;
    popover.findTrigger().click();
    expect(window.scrollBy).toHaveBeenCalledWith(0, 100);
  });
  test('does not scroll down past the popover top', () => {
    (calculatePosition as jest.Mock).mockReturnValue({
      scrollable: false,
      internalPosition: 'bottom-center',
      boundingBox: { top: 300, left: 0, width: 200, height: 600 },
    });
    const popover = renderPopover()!;
    popover.findTrigger().click();
    expect(window.scrollBy).toHaveBeenCalledWith(0, 300);
  });
});
