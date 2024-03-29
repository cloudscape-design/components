// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { onPaginationClick } from '../../../lib/components/tabs/scroll-utils';
import smoothScroll from '../../../lib/components/tabs/smooth-scroll';
jest.mock('../../../lib/components/tabs/smooth-scroll', () => {
  return jest.fn();
});

const HEADER_BAR_WIDTH = 610;

describe('onPaginationClick function', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  test('scroll to the right direction by 75% of the clientWidth', () => {
    const mockHeaderBarRef = getMockHeaderBarRef(0);
    onPaginationClick(mockHeaderBarRef, 'forward');

    const expectedScrollLeft = 458; // actual scrollLeft + 75% of the HEADER_BAR_WIDTH rounded to the next largest int
    expect(smoothScroll).toHaveBeenCalledWith(mockHeaderBarRef.current, expectedScrollLeft);
  });

  test('scroll to the left direction by 75% of the clientWidth', () => {
    const mockHeaderBarRef = getMockHeaderBarRef(460);
    onPaginationClick(mockHeaderBarRef, 'backward');

    const expectedScrollLeft = 2; // actual scrollLeft - 75% of the HEADER_BAR_WIDTH rounded to the next largest int
    expect(smoothScroll).toHaveBeenCalledWith(mockHeaderBarRef.current, expectedScrollLeft);
  });

  test('scroll to the right direction without negative scrollLeft', () => {
    const mockHeaderBarRef = getMockHeaderBarRef(0);
    onPaginationClick(mockHeaderBarRef, 'backward');
    expect(smoothScroll).toHaveBeenCalledWith(mockHeaderBarRef.current, 0);
  });
});

function getMockHeaderBarRef(scrollLeft: number) {
  const headerBarRef = {
    current: {
      clientWidth: HEADER_BAR_WIDTH,
      offsetWidth: HEADER_BAR_WIDTH,
      scrollWidth: 2770, // random number which does not affect the tests.
      scrollLeft,
    },
  } as React.RefObject<HTMLUListElement>;

  return headerBarRef;
}
