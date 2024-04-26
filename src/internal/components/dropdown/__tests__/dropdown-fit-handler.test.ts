// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { getDropdownPosition } from '../../../../../lib/components/internal/components/dropdown/dropdown-fit-handler';

const windowSize = {
  insetBlockStart: 0,
  insetInlineStart: 0,
  inlineSize: 1000,
  blockSize: 1000,
};
const defaults = {
  dropInlineStart: false,
  dropBlockStart: false,
  blockSize: '605px',
  insetInlineStart: 'auto',
  inlineSize: '100px',
};

function getSizedElement(width: number, height: number, top = 0, left = 0) {
  const element = document.createElement('div');

  element.getBoundingClientRect = () =>
    ({ width, height, top, left, bottom: top + height, right: left + width }) as DOMRect;
  Object.defineProperty(element, 'offsetHeight', { value: height });
  Object.defineProperty(element, 'offsetWidth', { value: width });
  return element;
}

describe('getDropdownPosition', () => {
  test('prefers dropping down by default', () => {
    const trigger = getSizedElement(100, 50, 300, 100);
    const dropdown = getSizedElement(100, 300);
    expect(
      getDropdownPosition({ triggerElement: trigger, dropdownElement: dropdown, overflowParents: [windowSize] })
    ).toEqual(defaults);
  });

  test('drops up if space above is not enough', () => {
    const trigger = getSizedElement(100, 50, 900, 100);
    const dropdown = getSizedElement(100, 300);
    expect(
      getDropdownPosition({ triggerElement: trigger, dropdownElement: dropdown, overflowParents: [windowSize] })
    ).toEqual({
      ...defaults,
      dropBlockStart: true,
      blockSize: '853px',
    });
  });

  test('drops left if dropdown is too wide', () => {
    const trigger = getSizedElement(100, 50, 300, 500);
    const dropdown = getSizedElement(600, 400);
    expect(
      getDropdownPosition({ triggerElement: trigger, dropdownElement: dropdown, overflowParents: [windowSize] })
    ).toEqual({
      ...defaults,
      dropInlineStart: true,
      inlineSize: '550px',
    });
  });

  test('falls back to central position when there is not enough space from both sides', () => {
    const trigger = getSizedElement(900, 50, 300, 50);
    const dropdown = getSizedElement(900, 400);
    expect(
      getDropdownPosition({ triggerElement: trigger, dropdownElement: dropdown, overflowParents: [windowSize] })
    ).toEqual({
      ...defaults,
      inlineSize: '900px',
    });
  });

  test('supports dropdown minWidth override', () => {
    const trigger = getSizedElement(500, 50, 300, 100);
    const dropdown = getSizedElement(200, 400);
    expect(
      getDropdownPosition({
        triggerElement: trigger,
        dropdownElement: dropdown,
        overflowParents: [windowSize],
        minWidth: 300,
      })
    ).toEqual({
      ...defaults,
      inlineSize: '300px',
    });
  });

  test('dropdown can grow beyond the minWidth', () => {
    const trigger = getSizedElement(500, 50, 300, 100);
    const dropdown = getSizedElement(600, 400);
    expect(
      getDropdownPosition({
        triggerElement: trigger,
        dropdownElement: dropdown,
        overflowParents: [windowSize],
        minWidth: 300,
      })
    ).toEqual({
      ...defaults,
      inlineSize: '600px',
    });
  });

  test('minWidth cannot be more than trigger width', () => {
    const trigger = getSizedElement(200, 50, 300, 100);
    const dropdown = getSizedElement(100, 400);
    expect(
      getDropdownPosition({
        triggerElement: trigger,
        dropdownElement: dropdown,
        overflowParents: [windowSize],
        minWidth: 300,
      })
    ).toEqual({
      ...defaults,
      inlineSize: '200px',
    });
  });

  test('dropdown matches trigger width when trigger sticks to the right screen edge', () => {
    const trigger = getSizedElement(100, 50, 300, windowSize.inlineSize - 110);
    const dropdown = getSizedElement(100, 400);

    expect(
      getDropdownPosition({ triggerElement: trigger, dropdownElement: dropdown, overflowParents: [windowSize] })
    ).toEqual({
      ...defaults,
      dropInlineStart: true, // TODO: this value is incorrect, should be fixed, see AWSUI-16369 for details
    });
  });

  test('takes parent overflow elements when they are found', () => {
    const trigger = getSizedElement(100, 50, 300, 100);
    const dropdown = getSizedElement(100, 300);
    expect(
      getDropdownPosition({ triggerElement: trigger, dropdownElement: dropdown, overflowParents: [windowSize] })
    ).toEqual(defaults);
    const scrollableContainer = { insetBlockStart: 100, insetInlineStart: 0, blockSize: 400, inlineSize: 400 };
    expect(
      getDropdownPosition({
        triggerElement: trigger,
        dropdownElement: dropdown,
        overflowParents: [windowSize, scrollableContainer],
      })
    ).toEqual({
      ...defaults,
      dropBlockStart: true,
      blockSize: '140px',
    });
  });

  test('adjusts left offset if preferCenter=true', () => {
    const trigger = getSizedElement(100, 50, 300, 100);
    const dropdown = getSizedElement(200, 300);
    expect(
      getDropdownPosition({
        triggerElement: trigger,
        dropdownElement: dropdown,
        overflowParents: [windowSize],
        preferCenter: true,
      })
    ).toEqual({
      ...defaults,
      inlineSize: '200px',
      insetInlineStart: '-50px',
    });
  });

  test('does not change offset if preferCenter=true, but it does not fit', () => {
    const trigger = getSizedElement(100, 50, 300, 15);
    const dropdown = getSizedElement(200, 300);
    expect(
      getDropdownPosition({
        triggerElement: trigger,
        dropdownElement: dropdown,
        overflowParents: [windowSize],
        preferCenter: true,
      })
    ).toEqual({
      ...defaults,
      inlineSize: '200px',
    });
  });

  describe('with stretchBeyondTriggerWidth=true', () => {
    test('can expand beyond trigger width', () => {
      const triggerElement = getSizedElement(100, 50, 300, 15);
      const dropdownElement = getSizedElement(200, 300);

      expect(
        getDropdownPosition({
          triggerElement,
          dropdownElement,
          overflowParents: [windowSize],
          stretchBeyondTriggerWidth: true,
        })
      ).toEqual({
        ...defaults,
        inlineSize: '200px',
      });
    });

    test('cannot expand beyond the XXS breakpoint', () => {
      const triggerElement = getSizedElement(100, 50, 300, 15);
      const dropdownElement = getSizedElement(1000, 300);

      expect(
        getDropdownPosition({
          triggerElement,
          dropdownElement,
          overflowParents: [windowSize],
          stretchBeyondTriggerWidth: true,
        })
      ).toEqual({
        ...defaults,
        inlineSize: '465px',
      });
    });

    test('will always grow to the width of the trigger if possible', () => {
      const triggerElement = getSizedElement(700, 50, 300, 15);
      const dropdownElement = getSizedElement(400, 300);

      expect(
        getDropdownPosition({
          triggerElement,
          dropdownElement,
          overflowParents: [windowSize],
          stretchBeyondTriggerWidth: true,
        })
      ).toEqual({
        ...defaults,
        inlineSize: '700px',
      });
    });
  });
});
