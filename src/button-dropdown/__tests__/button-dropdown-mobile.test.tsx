// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';

import ButtonDropdown, { ButtonDropdownProps } from '../../../lib/components/button-dropdown';
import createWrapper from '../../../lib/components/test-utils/dom';

import mobileGroupStyles from '../../../lib/components/button-dropdown/mobile-expandable-group/styles.selectors.js';

jest.mock('../../../lib/components/internal/hooks/use-mobile', () => ({
  useMobile: jest.fn().mockReturnValue(true),
}));

const groupItems: ButtonDropdownProps.Items = [
  { id: 'g1', text: 'Group 1', items: [] as ButtonDropdownProps.Items } as ButtonDropdownProps.ItemGroup,
  { id: 'g2', text: 'Group 2', items: [{ id: 'g2i1', text: 'Action 1' }] } as ButtonDropdownProps.ItemGroup,
];

describe('ButtonDropdown expandable groups on mobile', () => {
  test('renders the group inline instead of as a fly-out', () => {
    const result = render(
      <ButtonDropdown items={groupItems} expandableGroups={true}>
        Actions
      </ButtonDropdown>
    );
    const wrapper = createWrapper(result.container).findButtonDropdown()!;
    wrapper.openDropdown();
    wrapper.findExpandableCategoryById('g2')!.click();
    expect(wrapper.findOpenDropdown()!.find(`.${mobileGroupStyles.dropdown}[data-open=true]`)).not.toBeNull();
    expect(wrapper.findExpandableCategoryById('g2')!.findAll('li').length).toBe(1);
  });
});
