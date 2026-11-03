// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { renderHook } from '../../../../__tests__/render-hook';
import { useMobile } from '../../../hooks/use-mobile';
import { useStickyHeaderCopy } from '../use-sticky-header-copy';

jest.mock('../../../hooks/use-mobile', () => ({
  useMobile: jest.fn().mockReturnValue(false),
}));

function elementAt(top: number, height = 40) {
  const element = document.createElement('div');
  element.getBoundingClientRect = () =>
    ({ top, bottom: top + height, left: 0, right: 0, width: 0, height, x: 0, y: top }) as DOMRect;
  document.body.appendChild(element);
  return element;
}

function renderStickyHeaderCopy({ theadTop, secondaryTheadTop }: { theadTop: number; secondaryTheadTop: number }) {
  const refs = {
    tableRef: { current: elementAt(0) },
    theadRef: { current: elementAt(theadTop) },
    secondaryTheadRef: { current: elementAt(secondaryTheadTop) },
    secondaryTableRef: { current: elementAt(0) },
    tableWrapperRef: { current: elementAt(0) },
  };
  return { refs, ...renderHook(() => useStickyHeaderCopy(refs)) };
}

beforeEach(() => {
  window.scrollTo = jest.fn();
  jest.mocked(useMobile).mockReturnValue(false);
});

afterEach(() => {
  document.body.innerHTML = '';
});

test('pulls the table wrapper up by the header height', () => {
  const { refs } = renderStickyHeaderCopy({ theadTop: 0, secondaryTheadTop: 0 });
  expect(refs.tableWrapperRef.current.style.marginBlockStart).toBe('-40px');
});

describe('scrollToTop', () => {
  test('scrolls up by the distance between the header and its sticky copy', () => {
    const { result } = renderStickyHeaderCopy({ theadTop: 100, secondaryTheadTop: 250 });
    result.current.scrollToTop();
    expect(window.scrollTo).toHaveBeenCalledWith({ top: window.pageYOffset - 150 });
  });

  test('does not scroll when the header is already in view', () => {
    const { result } = renderStickyHeaderCopy({ theadTop: 250, secondaryTheadTop: 250 });
    result.current.scrollToTop();
    expect(window.scrollTo).not.toHaveBeenCalled();
  });

  test('does not scroll on mobile', () => {
    jest.mocked(useMobile).mockReturnValue(true);
    const { result } = renderStickyHeaderCopy({ theadTop: 100, secondaryTheadTop: 250 });
    result.current.scrollToTop();
    expect(window.scrollTo).not.toHaveBeenCalled();
  });
});

describe('scrollToRow', () => {
  test('scrolls a row hidden under the copy back into view', () => {
    const { result } = renderStickyHeaderCopy({ theadTop: 0, secondaryTheadTop: 100 });
    result.current.scrollToRow(elementAt(120));
    expect(window.scrollTo).toHaveBeenCalledWith({ top: window.pageYOffset - 20 });
  });

  test('does not scroll on mobile', () => {
    jest.mocked(useMobile).mockReturnValue(true);
    const { result } = renderStickyHeaderCopy({ theadTop: 0, secondaryTheadTop: 100 });
    result.current.scrollToRow(elementAt(120));
    expect(window.scrollTo).not.toHaveBeenCalled();
  });
});
