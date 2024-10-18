// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';

import { isMotionDisabled } from '@cloudscape-design/component-toolkit/internal';

import smoothScroll from '../../../lib/components/tabs/smooth-scroll';
import createWrapper from '../../../lib/components/test-utils/dom';

jest.mock('@cloudscape-design/component-toolkit/internal', () => ({
  ...jest.requireActual('@cloudscape-design/component-toolkit/internal'),
  isMotionDisabled: jest.fn(),
}));
const nativeScrollMock = jest.fn();
Element.prototype.scrollTo = nativeScrollMock;

function renderScrollableElement(): HTMLElement {
  const renderResult = render(
    <div style={{ width: 500, overflowX: 'scroll' }}>
      <div className="scrollable" style={{ width: 2000 }}>
        Content
      </div>
    </div>
  );
  return createWrapper(renderResult.container).findByClassName('scrollable')!.getElement();
}

beforeEach(() => {
  (isMotionDisabled as jest.Mock).mockReturnValue(false);
  nativeScrollMock.mockClear();
});

describe('Smooth scroll', () => {
  test('does not animate when motion is disabled', () => {
    (isMotionDisabled as jest.Mock).mockReturnValue(true);
    const element = renderScrollableElement();
    smoothScroll(element, 100);
    expect(nativeScrollMock).not.toHaveBeenCalled();
    expect(element.scrollLeft).toEqual(100);
  });
});
