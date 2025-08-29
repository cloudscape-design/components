// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import scrollToIndex from '../utils/scroll-to-index';

describe('scroll-to-index', () => {
  function runWith({
    menu,
    item,
  }: {
    menu: { top: number; bottom: number; scrollPaddingBlockStart: number };
    item: { top: number; bottom: number };
  }) {
    const menuEl: Partial<HTMLElement> = {
      getBoundingClientRect: jest.fn(
        () =>
          ({
            top: menu.top,
            bottom: menu.bottom,
            height: menu.bottom - menu.top,
          }) as DOMRect
      ),
      style: {
        scrollPaddingBlockStart: `${menu.scrollPaddingBlockStart}px`,
      } as Partial<HTMLElement['style']> as any,
      clientHeight: 100,
      querySelector: () => itemEl,
    };
    const scrollBy = (menuEl.scrollBy = jest.fn());
    const itemEl: Partial<HTMLElement> = {
      getBoundingClientRect: jest.fn(
        () =>
          ({
            top: item.top,
            bottom: item.bottom,
            height: item.bottom - item.top,
          }) as DOMRect
      ),
    };
    scrollToIndex({ index: 1, menuEl: menuEl as HTMLElement });
    return { scrollBy };
  }
  it('scrolls to the top of an item if that item is above visible area', () => {
    const { scrollBy } = runWith({
      menu: {
        top: 100,
        bottom: 200,
        scrollPaddingBlockStart: 0,
      },
      item: {
        top: 0,
        bottom: 50,
      },
    });
    expect(scrollBy).toHaveBeenCalledWith({ top: -100 });
  });
  it('scrolls to the bottom of an item if that item is below visible area', () => {
    const { scrollBy } = runWith({
      menu: {
        top: 100,
        bottom: 200,
        scrollPaddingBlockStart: 0,
      },
      item: {
        top: 200,
        bottom: 250,
      },
    });
    expect(scrollBy).toHaveBeenCalledWith({ top: 50 });
  });
  it('scrolls to the top of an item if that item is below and larger than the visible area', () => {
    const { scrollBy } = runWith({
      menu: {
        top: 100,
        bottom: 200,
        scrollPaddingBlockStart: 0,
      },
      item: {
        top: 300,
        bottom: 500,
      },
    });
    expect(scrollBy).toHaveBeenCalledWith({ top: 200 });
  });
  it('scrolls to the top of an item if that item is large and partially visible', () => {
    const { scrollBy } = runWith({
      menu: {
        top: 100,
        bottom: 200,
        scrollPaddingBlockStart: 0,
      },
      item: {
        top: 150,
        bottom: 500,
      },
    });
    expect(scrollBy).toHaveBeenCalledWith({ top: 50 });
  });
  it('does not scroll if item is fully visible', () => {
    const { scrollBy } = runWith({
      menu: {
        top: 100,
        bottom: 200,
        scrollPaddingBlockStart: 0,
      },
      item: {
        top: 150,
        bottom: 200,
      },
    });
    expect(scrollBy).not.toHaveBeenCalled();
  });
  describe('scroll padding', () => {
    it('does not scroll if item is fully visible', () => {
      const { scrollBy } = runWith({
        menu: {
          top: 100,
          bottom: 200,
          scrollPaddingBlockStart: 10,
        },
        item: {
          top: 110,
          bottom: 150,
        },
      });
      expect(scrollBy).not.toHaveBeenCalled();
    });
    it('scrolls to the top of an item if that item is above the visible area', () => {
      const { scrollBy } = runWith({
        menu: {
          top: 100,
          bottom: 200,
          scrollPaddingBlockStart: 10,
        },
        item: {
          top: 50,
          bottom: 100,
        },
      });
      expect(scrollBy).toHaveBeenCalledWith({ top: -60 });
    });
    it('scrolls to the top of an item if that item is partially above the visible area', () => {
      const { scrollBy } = runWith({
        menu: {
          top: 100,
          bottom: 200,
          scrollPaddingBlockStart: 10,
        },
        item: {
          top: 105,
          bottom: 120,
        },
      });
      expect(scrollBy).toHaveBeenCalledWith({ top: -5 });
    });
    it('scrolls to the top of an item if that item is large and partially visible', () => {
      const { scrollBy } = runWith({
        menu: {
          top: 100,
          bottom: 200,
          scrollPaddingBlockStart: 30,
        },
        item: {
          top: 150,
          bottom: 500,
        },
      });
      expect(scrollBy).toHaveBeenCalledWith({ top: 20 });
    });
  });
});
