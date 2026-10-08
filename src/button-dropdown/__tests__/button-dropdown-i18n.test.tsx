// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';

import ButtonDropdown, { ButtonDropdownProps } from '../../../lib/components/button-dropdown';
import TestI18nProvider from '../../../lib/components/i18n/testing';
import createWrapper from '../../../lib/components/test-utils/dom';

const items: ButtonDropdownProps.Items = [
  { id: 'i1', text: 'Cut' },
  { id: 'i2', text: 'Copy' },
  { id: 'i3', text: 'Paste' },
];

function renderDropdown(jsx: React.ReactElement) {
  const { container } = render(jsx);
  return createWrapper(container).findButtonDropdown()!;
}

describe('i18n', () => {
  describe('filteringResultsText', () => {
    it('uses filteringResultsText from i18n provider when not specified', () => {
      const wrapper = renderDropdown(
        <TestI18nProvider
          messages={{
            'button-dropdown': {
              filteringResultsText: '{matchesCount} out of {totalCount} items',
            },
          }}
        >
          <ButtonDropdown items={items} ariaLabel="Actions" filteringType="auto">
            Actions
          </ButtonDropdown>
        </TestI18nProvider>
      );
      wrapper.openDropdown();
      wrapper.findFilteringInput()!.setInputValue('Co');
      const footer = wrapper.findFooterRegion();
      expect(footer).not.toBeNull();
      expect(footer!.getElement()).toHaveTextContent('1 out of 3 items');
    });

    it('uses filteringResultsText prop over i18n provider', () => {
      const wrapper = renderDropdown(
        <TestI18nProvider
          messages={{
            'button-dropdown': {
              filteringResultsText: '{matchesCount} out of {totalCount} items',
            },
          }}
        >
          <ButtonDropdown
            items={items}
            ariaLabel="Actions"
            filteringType="auto"
            filteringResultsText={(matchesCount, totalCount) => `Custom ${matchesCount}/${totalCount}`}
          >
            Actions
          </ButtonDropdown>
        </TestI18nProvider>
      );
      wrapper.openDropdown();
      wrapper.findFilteringInput()!.setInputValue('Co');
      const footer = wrapper.findFooterRegion();
      expect(footer).not.toBeNull();
      expect(footer!.getElement()).toHaveTextContent('Custom 1/3');
    });
  });

  describe('i18nStrings.filteringItemAriaDescription', () => {
    it('uses i18nStrings.filteringItemAriaDescription from i18n provider when not specified', () => {
      const wrapper = renderDropdown(
        <TestI18nProvider
          messages={{
            'button-dropdown': {
              'i18nStrings.filteringItemAriaDescription': 'Continue typing to further filter the list',
            },
          }}
        >
          <ButtonDropdown items={items} ariaLabel="Actions" filteringType="auto">
            Actions
          </ButtonDropdown>
        </TestI18nProvider>
      );
      wrapper.openDropdown();
      const menuItem = wrapper.findItemById('i1')!.find('[role="menuitem"]')!.getElement();
      expect(menuItem).toHaveAccessibleDescription('Continue typing to further filter the list');
    });

    it('uses i18nStrings.filteringItemAriaDescription prop over i18n provider', () => {
      const wrapper = renderDropdown(
        <TestI18nProvider
          messages={{
            'button-dropdown': {
              'i18nStrings.filteringItemAriaDescription': 'Continue typing to further filter the list',
            },
          }}
        >
          <ButtonDropdown
            items={items}
            ariaLabel="Actions"
            filteringType="auto"
            i18nStrings={{ filteringItemAriaDescription: 'Custom description' }}
          >
            Actions
          </ButtonDropdown>
        </TestI18nProvider>
      );
      wrapper.openDropdown();
      const menuItem = wrapper.findItemById('i1')!.find('[role="menuitem"]')!.getElement();
      expect(menuItem).toHaveAccessibleDescription('Custom description');
    });
  });
});
