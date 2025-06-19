// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react';

import { KeyCode } from '@cloudscape-design/test-utils-core/utils';

import Select, { SelectProps } from '../../../lib/components/select';
import createWrapper from '../../../lib/components/test-utils/dom';
import { defaultOptions, defaultProps } from './common';

// Mocks for the disabled reason tooltip popover
jest.mock('../../../lib/components/popover/utils/positions', () => {
  const originalModule = jest.requireActual('../../../lib/components/popover/utils/positions');
  return {
    ...originalModule,
    getOffsetDimensions: () => ({ offsetWidth: 136, offsetHeight: 44 }), // Approximate mock dimensions for the disabled reason popover dimensions
    isCenterOutside: () => true, // Simulate the trigger being scrolled away from the dropdown
  };
});
jest.mock('../../../lib/components/internal/utils/scrollable-containers', () => {
  const originalModule = jest.requireActual('../../../lib/components/internal/utils/scrollable-containers');
  return {
    __esModule: true,
    ...originalModule,
    getFirstScrollableParent: () => createWrapper().findSelect()!.findDropdown()!.getElement(),
  };
});

function renderSelect(props?: Partial<SelectProps>) {
  const { container } = render(<Select {...defaultProps} {...props} />);
  const wrapper = createWrapper(container).findSelect()!;
  return { container, wrapper };
}

describe.each([false, true])('expandToViewport=%s', expandToViewport => {
  describe('Disabled state', () => {
    test('enabled by default', () => {
      const { wrapper } = renderSelect();
      expect(wrapper.isDisabled()).toEqual(false);
      wrapper.openDropdown();
      expect(wrapper.findDropdown({ expandToViewport })!.findOpenDropdown()).toBeTruthy();
    });

    test('can be disabled', () => {
      const { wrapper } = renderSelect({ disabled: true });
      expect(wrapper.isDisabled()).toEqual(true);
      wrapper.openDropdown();
      expect(wrapper.findDropdown({ expandToViewport })?.findOpenDropdown()).toBeFalsy();
    });

    describe('Disabled item with reason', () => {
      test('has no tooltip open by default', () => {
        const { wrapper } = renderSelect({
          options: [{ label: 'First', value: '1', disabled: true, disabledReason: 'disabled reason' }],
        });
        wrapper.openDropdown();

        expect(wrapper.findDropdown({ expandToViewport }).findOption(1)!.findDisabledReason()).toBe(null);
      });

      test('has no tooltip without disabledReason', () => {
        const { wrapper } = renderSelect({
          options: [{ label: 'First', value: '1', disabled: true }],
        });
        wrapper.openDropdown();
        wrapper.findTrigger()!.keydown(KeyCode.down);

        expect(wrapper.findDropdown({ expandToViewport }).findOption(1)!.findDisabledReason()).toBe(null);
      });

      test('open tooltip when the item is highlighted', () => {
        const { wrapper } = renderSelect({
          options: [{ label: 'First', value: '1', disabled: true, disabledReason: 'disabled reason' }],
        });
        wrapper.openDropdown();
        wrapper.findTrigger().keydown(KeyCode.down);

        expect(
          wrapper.findDropdown({ expandToViewport }).findOption(1)!.findDisabledReason()!.getElement()
        ).toHaveTextContent('disabled reason');
      });

      test('has no disabledReason a11y attributes by default', () => {
        const { wrapper } = renderSelect({
          options: defaultOptions,
        });
        wrapper.openDropdown();

        expect(
          wrapper.findDropdown({ expandToViewport })!.find('[data-test-index="1"]')!.getElement()
        ).not.toHaveAttribute('aria-describedby');
        expect(wrapper.findDropdown({ expandToViewport })!.find('[data-test-index="1"]')!.find('span[hidden]')).toBe(
          null
        );
      });

      test('has disabledReason a11y attributes', () => {
        const { wrapper } = renderSelect({
          options: [{ label: 'First', value: '1', disabled: true, disabledReason: 'disabled reason' }],
        });
        wrapper.openDropdown();

        expect(wrapper.findDropdown({ expandToViewport })!.find('[data-test-index="1"]')!.getElement()).toHaveAttribute(
          'aria-describedby'
        );
        expect(
          wrapper.findDropdown({ expandToViewport })!.find('[data-test-index="1"]')!.find('span[hidden]')!.getElement()
        ).toHaveTextContent('disabled reason');
      });

      test('can not select disabled with reason option', () => {
        const onChange = jest.fn();
        const { wrapper } = renderSelect({
          options: [{ label: 'First', value: '1', disabled: true, disabledReason: 'disabled reason' }],
          onChange,
        });
        wrapper.openDropdown();
        wrapper.selectOptionByValue('1', { expandToViewport });
        expect(onChange).not.toHaveBeenCalled();
      });

      test('click on disabled with reason option does not close dropdown', () => {
        const { wrapper } = renderSelect({
          options: [{ label: 'First', value: '1', disabled: true, disabledReason: 'disabled reason' }],
        });
        wrapper.openDropdown();
        wrapper.selectOptionByValue('1', { expandToViewport });
        expect(wrapper.findDropdown({ expandToViewport })?.findOpenDropdown()).toBeTruthy();
      });

      test('closes tooltip when Esc is pressed but leaves dropdown open', () => {
        const { wrapper } = renderSelect({
          options: [{ label: 'First', value: '1', disabled: true, disabledReason: 'disabled reason' }],
        });
        wrapper.openDropdown();
        wrapper.findTrigger().keydown(KeyCode.down);
        expect(
          wrapper.findDropdown({ expandToViewport }).findOption(1)!.findDisabledReason()!.getElement()
        ).toHaveTextContent('disabled reason');
        fireEvent.keyDown(wrapper.findDropdown({ expandToViewport }).findOptionsContainer()!.getElement(), {
          key: 'Escape',
        });
        expect(wrapper.findDropdown().findOpenDropdown()).not.toBeNull();
        expect(wrapper.findDropdown({ expandToViewport }).findOption(1)!.findDisabledReason()).toBeNull();
      });

      test('hides disabled reason when the option is scrolled away', async () => {
        const options = [...Array(50).keys()].map(n => {
          const numberToDisplay = (n + 1).toString();
          const baseOption = {
            value: numberToDisplay,
            label: `Option ${numberToDisplay}`,
          };
          if (n === 0) {
            return { ...baseOption, disabled: true, disabledReason: 'disabled reason' };
          }
          return baseOption;
        });

        const { wrapper } = renderSelect({
          options,
        });
        wrapper.openDropdown();

        wrapper.findTrigger().keydown(KeyCode.down);
        const dropdown = wrapper.findDropdown({ expandToViewport });
        expect(dropdown.findOption(1)!.findDisabledReason()!.getElement()).toHaveTextContent('disabled reason');
        window.dispatchEvent(new Event('scroll'));
        await waitFor(() => {
          expect(dropdown.findOption(1)!.findDisabledReason()).toBe(null);
        });
      });
    });
  });
});
