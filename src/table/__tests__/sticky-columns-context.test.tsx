// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, createRef } from 'react';
import { render, act } from '@testing-library/react';
import { StickyColumnsContextProvider, useStickyColumnsContext } from '../sticky-columns-context';
const TestComponent = ({ callback }: { callback: (entry: any) => void }) => {
  const { subscribe, unsubscribe } = useStickyColumnsContext();

  useEffect(() => {
    subscribe(callback);
    return () => {
      unsubscribe(callback);
    };
  }, [subscribe, unsubscribe, callback]);

  return <div />;
};

describe('StickyColumnsContextProvider and useStickyColumnsContext', () => {
  let wrapperRef: React.RefObject<HTMLDivElement>;
  let tableRef: React.RefObject<HTMLTableElement>;
  const originalGetComputedStyle = window.getComputedStyle;

  beforeEach(() => {
    wrapperRef = createRef<HTMLDivElement>();
    tableRef = createRef<HTMLTableElement>();

    // Mock getComputedStyle to return custom padding values
    window.getComputedStyle = jest.fn(element => {
      if (element === tableRef.current) {
        return { ...originalGetComputedStyle(element), paddingLeft: '10', paddingRight: '10' };
      }
      return originalGetComputedStyle(element);
    });
  });

  afterEach(() => {
    // Restore the original getComputedStyle function
    window.getComputedStyle = originalGetComputedStyle;
  });

  test('should provide correct initial state', () => {
    const callback = jest.fn();

    render(
      <StickyColumnsContextProvider wrapperRef={wrapperRef} tableRef={tableRef} shouldDisableStickyColumns={false}>
        <TestComponent callback={callback} />
      </StickyColumnsContextProvider>
    );
    expect(callback).toHaveBeenCalledWith({ left: false, right: false });
  });

  test('should update state when scrolling', () => {
    const callback = jest.fn();

    render(
      <StickyColumnsContextProvider wrapperRef={wrapperRef} tableRef={tableRef} shouldDisableStickyColumns={false}>
        <div ref={wrapperRef} style={{ width: '50px', overflowX: 'scroll' }}>
          <table ref={tableRef} style={{ width: '100px' }}>
            <TestComponent callback={callback} />
          </table>
        </div>
      </StickyColumnsContextProvider>
    );

    act(() => {
      if (wrapperRef.current) {
        wrapperRef.current.scrollLeft = 25;
        wrapperRef.current.dispatchEvent(new Event('scroll'));
      }
    });

    expect(callback).toHaveBeenCalledTimes(2);
    expect(callback).toHaveBeenNthCalledWith(1, { left: false, right: false });
    expect(callback).toHaveBeenNthCalledWith(2, { left: true, right: false });
  });

  test('should not update state when shouldDisableStickyColumns is true', () => {
    const callback = jest.fn();

    render(
      <StickyColumnsContextProvider wrapperRef={wrapperRef} tableRef={tableRef} shouldDisableStickyColumns={true}>
        <div ref={wrapperRef} style={{ width: '50px', overflowX: 'scroll' }}>
          <table ref={tableRef} style={{ width: '100px' }}>
            <TestComponent callback={callback} />
          </table>
        </div>
      </StickyColumnsContextProvider>
    );

    act(() => {
      if (wrapperRef.current) {
        wrapperRef.current.scrollLeft = 25;
        wrapperRef.current.dispatchEvent(new Event('scroll'));
      }
    });
    expect(callback).toHaveBeenCalledWith({ left: false, right: false });
  });
});
