// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import {
  calculatePosition,
  intersectRectangles,
  PRIORITY_MAPPING,
} from '../../../lib/components/popover/utils/positions';

const arrow = { inlineSize: 15, blockSize: 15 };
const body = { inlineSize: 250, blockSize: 250 };
const viewport = { insetBlockStart: 0, insetInlineStart: 0, blockSize: 1000, inlineSize: 1000 };

describe('calculatePosition', () => {
  (
    [
      ['top', { insetBlockStart: 500, insetInlineStart: 500, blockSize: 25, inlineSize: 25 }],
      ['right', { insetBlockStart: 500, insetInlineStart: 500, blockSize: 25, inlineSize: 25 }],
      ['bottom', { insetBlockStart: 500, insetInlineStart: 500, blockSize: 25, inlineSize: 25 }],
      ['left', { insetBlockStart: 500, insetInlineStart: 500, blockSize: 25, inlineSize: 25 }],
    ] as const
  ).forEach(([preferredPosition, trigger]) => {
    test(`takes first position for preferredPosition="${preferredPosition}" from priority mapping when enough space for it`, () => {
      const position = calculatePosition({
        preferredPosition,
        trigger,
        arrow,
        body,
        container: viewport,
        viewport,
      });
      expect(position.internalPosition).toBe(PRIORITY_MAPPING[preferredPosition][0]);
    });
  });

  (
    [
      ['top', { insetBlockStart: 500, insetInlineStart: 100, blockSize: 25, inlineSize: 25 }],
      ['right', { insetBlockStart: 800, insetInlineStart: 500, blockSize: 25, inlineSize: 25 }],
      ['bottom', { insetBlockStart: 500, insetInlineStart: 100, blockSize: 25, inlineSize: 25 }],
      ['left', { insetBlockStart: 800, insetInlineStart: 500, blockSize: 25, inlineSize: 25 }],
    ] as const
  ).forEach(([preferredPosition, trigger]) => {
    test(`takes second position for preferredPosition="${preferredPosition}" from priority mapping when not enough space for first`, () => {
      const position = calculatePosition({
        preferredPosition,
        trigger,
        arrow,
        body,
        container: viewport,
        viewport,
      });
      expect(position.internalPosition).toBe(PRIORITY_MAPPING[preferredPosition][1]);
    });
  });

  describe('disregards preferredPosition in favor of fixedInternalPosition when defined', () => {
    (
      [
        ['top', { insetBlockStart: 500, insetInlineStart: 500, blockSize: 25, inlineSize: 25 }],
        ['right', { insetBlockStart: 500, insetInlineStart: 500, blockSize: 25, inlineSize: 25 }],
        ['bottom', { insetBlockStart: 500, insetInlineStart: 500, blockSize: 25, inlineSize: 25 }],
        ['left', { insetBlockStart: 500, insetInlineStart: 500, blockSize: 25, inlineSize: 25 }],
      ] as const
    ).forEach(([preferredPosition, trigger]) => {
      test(`preferredPosition="${preferredPosition}"`, () => {
        const position = calculatePosition({
          preferredPosition,
          fixedInternalPosition: 'right-top',
          trigger,
          arrow,
          body,
          container: viewport,
          viewport,
        });
        expect(position.internalPosition).toBe('right-top');
      });
    });
  });

  (
    [
      ['top', { insetBlockStart: 200, insetInlineStart: 500, blockSize: 25, inlineSize: 25 }],
      ['bottom', { insetBlockStart: 800, insetInlineStart: 500, blockSize: 25, inlineSize: 25 }],
    ] as const
  ).forEach(([preferredPosition, trigger]) => {
    test(`flips position for preferredPosition="${preferredPosition}" from priority mapping when not enough space above/below`, () => {
      const position = calculatePosition({
        preferredPosition,
        trigger,
        arrow,
        body,
        container: viewport,
        viewport,
      });
      expect(position.internalPosition).toBe(PRIORITY_MAPPING[preferredPosition][3]);
    });
  });

  (
    [
      [{ insetBlockStart: 0, insetInlineStart: 0, blockSize: 1000, inlineSize: 1000 }, 'top-center'],
      [{ insetBlockStart: 0, insetInlineStart: 0, blockSize: 1000, inlineSize: 600 }, 'top-left'],
      [{ insetBlockStart: 450, insetInlineStart: 250, blockSize: 1000, inlineSize: 350 }, 'bottom-left'],
    ] as const
  ).forEach(([container, expected], index) => {
    test(`for container #${index} finds position ${expected} that fits into it`, () => {
      const trigger = { insetBlockStart: 500, insetInlineStart: 500, blockSize: 25, inlineSize: 25 };
      const position = calculatePosition({ preferredPosition: 'top', trigger, arrow, body, container, viewport });
      expect(position.internalPosition).toBe(expected);
    });
  });

  test("returns the position with the largest availabe area, if can't fit inside viewport", () => {
    const trigger = { insetBlockStart: 0, insetInlineStart: 0, blockSize: 25, inlineSize: 25 };
    const container = { insetBlockStart: 0, insetInlineStart: 0, blockSize: 600, inlineSize: 1000 };
    const viewport = { insetBlockStart: 0, insetInlineStart: 0, blockSize: 100, inlineSize: 100 };
    const position = calculatePosition({ preferredPosition: 'bottom', trigger, arrow, body, container, viewport });
    expect(position.internalPosition).toBe('bottom-center');
  });

  test('disregards the container bound, when rendered inside a portal', () => {
    // trigger is in the right bottom corner of the container.
    // Normally, the popover would open top-left, to try to fit inside it
    const trigger = { insetBlockStart: 175, insetInlineStart: 175, blockSize: 25, inlineSize: 25 };
    const container = { insetBlockStart: 100, insetInlineStart: 100, blockSize: 100, inlineSize: 100 };
    const viewport = { insetBlockStart: 0, insetInlineStart: 0, blockSize: 1000, inlineSize: 1000 };
    const position = calculatePosition({
      preferredPosition: 'bottom',
      trigger,
      arrow,
      body,
      container,
      viewport,
      renderWithPortal: true,
    });
    expect(position.internalPosition).toBe('bottom-center');
  });

  (
    [
      // bottom-right
      [
        { insetInlineStart: 200, insetBlockStart: 200, blockSize: 25, inlineSize: 25 },
        { inlineSize: 250, blockSize: 1000 },
      ],
      // bottom-left
      [
        { insetInlineStart: 800, insetBlockStart: 200, blockSize: 25, inlineSize: 25 },
        { inlineSize: 250, blockSize: 1000 },
      ],
      // top-right
      [
        { insetInlineStart: 200, insetBlockStart: 800, blockSize: 25, inlineSize: 25 },
        { inlineSize: 250, blockSize: 1000 },
      ],
      // top-left
      [
        { insetInlineStart: 800, insetBlockStart: 800, blockSize: 25, inlineSize: 25 },
        { inlineSize: 250, blockSize: 1000 },
      ],
    ] as const
  ).forEach(([trigger, body], index) => {
    describe(`index=${index} returns scrollable=true if can't fit popover into viewport`, () => {
      test.each([false, true])('renderWithPortal=%s', renderWithPortal => {
        const container = { ...viewport, blockSize: viewport.blockSize * 2 };
        const position = calculatePosition({
          preferredPosition: 'top',
          trigger,
          arrow,
          body,
          container,
          viewport,
          renderWithPortal,
        });
        expect(position.scrollable).toBe(true);
        expect(position.rect.inlineSize).toBe(250);
        expect(position.rect.blockSize).toBeLessThan(900);
      });
    });
  });
});

describe('intersectRectangles', () => {
  it('returns the area of the intersection of passed in rectangles', () => {
    const rects = [
      { insetBlockStart: 0, insetInlineStart: 0, inlineSize: 10, blockSize: 10 },
      { insetBlockStart: 5, insetInlineStart: 5, inlineSize: 10, blockSize: 10 },
    ];
    expect(intersectRectangles(rects)).toEqual(25);
  });
  it('returns null, if there is no intersection', () => {
    const rects = [
      { insetBlockStart: 0, insetInlineStart: 0, inlineSize: 5, blockSize: 5 },
      { insetBlockStart: 10, insetInlineStart: 10, inlineSize: 5, blockSize: 5 },
    ];
    expect(intersectRectangles(rects)).toEqual(null);
  });
  it('returns null, if no rectangles were passed', () => {
    expect(intersectRectangles([])).toEqual(null);
  });
});
