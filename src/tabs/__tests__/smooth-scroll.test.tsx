// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';
import { waitFor } from '@testing-library/react';
import { isMotionDisabled } from '../../../lib/components/internal/motion';
import nativeSupport from '../../../lib/components/tabs/native-smooth-scroll-supported';
import smoothScroll from '../../../lib/components/tabs/smooth-scroll';
import createWrapper from '../../../lib/components/test-utils/dom';

jest.mock('../../../lib/components/tabs/native-smooth-scroll-supported', () => {
  return jest.fn();
});
jest.mock('../../../lib/components/internal/motion', () => {
  const mock = jest.fn();
  return { isMotionDisabled: mock };
});
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

async function usesCustomScrollingFunction(element: HTMLElement, scrollLeft: number) {
  expect(nativeScrollMock).not.toHaveBeenCalled();
  await waitFor(() => {
    expect(element.scrollLeft).toEqual(scrollLeft);
  });
}

beforeEach(() => {
  (nativeSupport as jest.Mock).mockReturnValue(false);
  (isMotionDisabled as jest.Mock).mockReturnValue(false);
  nativeScrollMock.mockClear();
});

describe('Smooth scroll', () => {
  test('uses native scrollTo function if the browser supports it', () => {
    (nativeSupport as jest.Mock).mockReturnValue(true);
    const element = renderScrollableElement();
    smoothScroll(element, 100);
    expect(nativeScrollMock).toHaveBeenCalled();
  });
  test('relies on custom function when browsers do not support it', async () => {
    const element = renderScrollableElement();
    smoothScroll(element, 100);
    await usesCustomScrollingFunction(element, 100);
  });
  test('does not animate when motion is disabled', () => {
    (isMotionDisabled as jest.Mock).mockReturnValue(true);
    const element = renderScrollableElement();
    smoothScroll(element, 100);
    expect(nativeScrollMock).not.toHaveBeenCalled();
    expect(element.scrollLeft).toEqual(100);
  });
  test('animates left with custom function', async () => {
    const element = renderScrollableElement();
    element.scrollLeft = 500;
    smoothScroll(element, 100);
    await usesCustomScrollingFunction(element, 100);
  });
});
