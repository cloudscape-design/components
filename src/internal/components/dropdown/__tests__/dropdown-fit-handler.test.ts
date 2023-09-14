// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { getDropdownPosition } from '../../../../../lib/components/internal/components/dropdown/dropdown-fit-handler';

const windowSize = {
  top: 0,
  left: 0,
  width: 1000,
  height: 1000,
};
const defaults = {
  dropLeft: false,
  dropUp: false,
  height: '605px',
  left: 'auto',
  width: '100px',
};

function getSizedElement(width: number, height: number, top = 0, left = 0) {
  const element = document.createElement('div');
  element.getBoundingClientRect = () =>
    ({ width, height, top, left, bottom: top + height, right: left + width } as DOMRect);
  Object.defineProperty(element, 'offsetHeight', { value: height });
  Object.defineProperty(element, 'offsetWidth', { value: width });
  return element;
}

describe('getDropdownPosition', () => {
  test('prefers dropping down by default', () => {
    const triggerBox = getSizedElement(100, 50, 300, 100).getBoundingClientRect();
    const dropdown = getSizedElement(100, 300);
    expect(getDropdownPosition({ triggerBox, dropdownElement: dropdown, overflowParents: [windowSize] })).toEqual(
      defaults
    );
  });

  test('drops up if space above is not enough', () => {
    const triggerBox = getSizedElement(100, 50, 900, 100).getBoundingClientRect();
    const dropdown = getSizedElement(100, 300);
    expect(getDropdownPosition({ triggerBox, dropdownElement: dropdown, overflowParents: [windowSize] })).toEqual({
      ...defaults,
      dropUp: true,
      height: '853px',
    });
  });

  test('drops left if dropdown is too wide', () => {
    const triggerBox = getSizedElement(100, 50, 300, 500).getBoundingClientRect();
    const dropdown = getSizedElement(600, 400);
    expect(getDropdownPosition({ triggerBox, dropdownElement: dropdown, overflowParents: [windowSize] })).toEqual({
      ...defaults,
      dropLeft: true,
      width: '550px',
    });
  });

  test('falls back to central position when there is not enough space from both sides', () => {
    const triggerBox = getSizedElement(900, 50, 300, 50).getBoundingClientRect();
    const dropdown = getSizedElement(900, 400);
    expect(getDropdownPosition({ triggerBox, dropdownElement: dropdown, overflowParents: [windowSize] })).toEqual({
      ...defaults,
      width: '900px',
    });
  });

  test('supports dropdown minWidth override', () => {
    const triggerBox = getSizedElement(500, 50, 300, 100).getBoundingClientRect();
    const dropdown = getSizedElement(200, 400);
    expect(
      getDropdownPosition({
        triggerBox,
        dropdownElement: dropdown,
        overflowParents: [windowSize],
        minWidth: 300,
      })
    ).toEqual({
      ...defaults,
      width: '300px',
    });
  });

  test('dropdown can grow beyond the minWidth', () => {
    const triggerBox = getSizedElement(500, 50, 300, 100).getBoundingClientRect();
    const dropdown = getSizedElement(600, 400);
    expect(
      getDropdownPosition({
        triggerBox,
        dropdownElement: dropdown,
        overflowParents: [windowSize],
        minWidth: 300,
      })
    ).toEqual({
      ...defaults,
      width: '600px',
    });
  });

  test('minWidth cannot be more than trigger width', () => {
    const triggerBox = getSizedElement(200, 50, 300, 100).getBoundingClientRect();
    const dropdown = getSizedElement(100, 400);
    expect(
      getDropdownPosition({
        triggerBox,
        dropdownElement: dropdown,
        overflowParents: [windowSize],
        minWidth: 300,
      })
    ).toEqual({
      ...defaults,
      width: '200px',
    });
  });

  test('dropdown matches trigger width when trigger sticks to the right screen edge', () => {
    const triggerBox = getSizedElement(100, 50, 300, windowSize.width - 110).getBoundingClientRect();
    const dropdown = getSizedElement(100, 400);

    expect(getDropdownPosition({ triggerBox, dropdownElement: dropdown, overflowParents: [windowSize] })).toEqual({
      ...defaults,
      dropLeft: true, // TODO: this value is incorrect, should be fixed, see AWSUI-16369 for details
    });
  });

  test('takes parent overflow elements when they are found', () => {
    const triggerBox = getSizedElement(100, 50, 300, 100).getBoundingClientRect();
    const dropdown = getSizedElement(100, 300);
    expect(getDropdownPosition({ triggerBox, dropdownElement: dropdown, overflowParents: [windowSize] })).toEqual(
      defaults
    );
    const scrollableContainer = { top: 100, left: 0, height: 400, width: 400 };
    expect(
      getDropdownPosition({
        triggerBox,
        dropdownElement: dropdown,
        overflowParents: [windowSize, scrollableContainer],
      })
    ).toEqual({
      ...defaults,
      dropUp: true,
      height: '140px',
    });
  });

  test('adjusts left offset if preferCenter=true', () => {
    const triggerBox = getSizedElement(100, 50, 300, 100).getBoundingClientRect();
    const dropdown = getSizedElement(200, 300);
    expect(
      getDropdownPosition({
        triggerBox,
        dropdownElement: dropdown,
        overflowParents: [windowSize],
        preferCenter: true,
      })
    ).toEqual({
      ...defaults,
      width: '200px',
      left: '-50px',
    });
  });

  test('does not change offset if preferCenter=true, but it does not fit', () => {
    const triggerBox = getSizedElement(100, 50, 300, 15).getBoundingClientRect();
    const dropdown = getSizedElement(200, 300);
    expect(
      getDropdownPosition({
        triggerBox,
        dropdownElement: dropdown,
        overflowParents: [windowSize],
        preferCenter: true,
      })
    ).toEqual({
      ...defaults,
      width: '200px',
    });
  });

  describe('with stretchBeyondTriggerWidth=true', () => {
    test('can expand beyond trigger width', () => {
      const triggerBox = getSizedElement(100, 50, 300, 15).getBoundingClientRect();
      const dropdownElement = getSizedElement(200, 300);

      expect(
        getDropdownPosition({
          triggerBox,
          dropdownElement,
          overflowParents: [windowSize],
          stretchBeyondTriggerWidth: true,
        })
      ).toEqual({
        ...defaults,
        width: '200px',
      });
    });

    test('cannot expand beyond the XXS breakpoint', () => {
      const triggerBox = getSizedElement(100, 50, 300, 15).getBoundingClientRect();
      const dropdownElement = getSizedElement(1000, 300);

      expect(
        getDropdownPosition({
          triggerBox,
          dropdownElement,
          overflowParents: [windowSize],
          stretchBeyondTriggerWidth: true,
        })
      ).toEqual({
        ...defaults,
        width: '465px',
      });
    });

    test('will always grow to the width of the trigger if possible', () => {
      const triggerBox = getSizedElement(700, 50, 300, 15).getBoundingClientRect();
      const dropdownElement = getSizedElement(400, 300);

      expect(
        getDropdownPosition({
          triggerBox,
          dropdownElement,
          overflowParents: [windowSize],
          stretchBeyondTriggerWidth: true,
        })
      ).toEqual({
        ...defaults,
        width: '700px',
      });
    });
  });
});
