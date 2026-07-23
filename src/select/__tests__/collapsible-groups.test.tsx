// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';
import { render } from '@testing-library/react';

import { KeyCode } from '@cloudscape-design/test-utils-core/utils';

import Select, { SelectProps } from '../../../lib/components/select';
import createWrapper from '../../../lib/components/test-utils/dom';

const options: SelectProps.Options = [
  { label: 'First', value: '1' },
  {
    label: 'Group A',
    options: [
      { label: 'A1', value: 'a1' },
      { label: 'A2', value: 'a2' },
    ],
  },
  {
    label: 'Group B',
    options: [
      { label: 'B1', value: 'b1' },
      { label: 'B2', value: 'b2' },
    ],
  },
];

const defaultProps: SelectProps = {
  options,
  selectedOption: null,
  onChange: () => {},
};

function renderSelect(props?: Partial<SelectProps>) {
  const onChange = jest.fn();
  const { container } = render(<Select {...defaultProps} onChange={onChange} {...props} />);
  const wrapper = createWrapper(container).findSelect()!;
  return { wrapper, onChange };
}

describe('Select collapsibleGroups', () => {
  test('does not add aria-expanded to group headers by default (backward compatible)', () => {
    const { wrapper } = renderSelect();
    wrapper.openDropdown();
    const dropdown = wrapper.findDropdown()!;
    expect(dropdown.findGroup(1)!.getElement()).not.toHaveAttribute('aria-expanded');
    // group header keeps the presentation role when not collapsible
    expect(dropdown.findGroup(1)!.getElement()).toHaveAttribute('role', 'presentation');
  });

  test('renders group headers as expanded disclosure controls when enabled', () => {
    const { wrapper } = renderSelect({ collapsibleGroups: true });
    wrapper.openDropdown();
    const dropdown = wrapper.findDropdown()!;
    expect(dropdown.findGroup(1)!.getElement()).toHaveAttribute('aria-expanded', 'true');
    expect(dropdown.findGroup(1)!.getElement()).toHaveAttribute('role', 'option');
    // children of an expanded group are visible
    expect(dropdown.findOptionInGroup(1, 1)!.getElement()).toHaveTextContent('A1');
    expect(dropdown.findOptionInGroup(1, 2)!.getElement()).toHaveTextContent('A2');
  });

  test('collapses and expands a group when its header is activated', () => {
    const { wrapper } = renderSelect({ collapsibleGroups: true });
    wrapper.openDropdown();
    const dropdown = wrapper.findDropdown()!;

    // collapse group A by clicking its header
    dropdown.findGroup(1)!.fireEvent(new MouseEvent('mouseup', { bubbles: true }));
    expect(wrapper.findDropdown()!.findGroup(1)!.getElement()).toHaveAttribute('aria-expanded', 'false');
    expect(wrapper.findDropdown()!.findOptionInGroup(1, 1)).toBeNull();
    // other groups remain unaffected
    expect(wrapper.findDropdown()!.findOptionInGroup(2, 1)!.getElement()).toHaveTextContent('B1');

    // expand it again
    wrapper
      .findDropdown()!
      .findGroup(1)!
      .fireEvent(new MouseEvent('mouseup', { bubbles: true }));
    expect(wrapper.findDropdown()!.findGroup(1)!.getElement()).toHaveAttribute('aria-expanded', 'true');
    expect(wrapper.findDropdown()!.findOptionInGroup(1, 1)!.getElement()).toHaveTextContent('A1');
  });

  test('activating a group header does not select an option', () => {
    const { wrapper, onChange } = renderSelect({ collapsibleGroups: true });
    wrapper.openDropdown();
    wrapper
      .findDropdown()!
      .findGroup(1)!
      .fireEvent(new MouseEvent('mouseup', { bubbles: true }));
    expect(onChange).not.toHaveBeenCalled();
  });

  test('child options remain selectable when groups are collapsible', () => {
    const { wrapper, onChange } = renderSelect({ collapsibleGroups: true });
    wrapper.openDropdown();
    wrapper
      .findDropdown()!
      .findOptionInGroup(1, 1)!
      .fireEvent(new MouseEvent('mouseup', { bubbles: true }));
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({ detail: expect.objectContaining({ selectedOption: { label: 'A1', value: 'a1' } }) })
    );
  });

  test('collapsed children are removed from the filtered result but headers stay', () => {
    const { wrapper } = renderSelect({ collapsibleGroups: true });
    wrapper.openDropdown();
    const dropdown = wrapper.findDropdown()!;
    const optionCountExpanded = dropdown.findOptions().length;

    dropdown.findGroup(1)!.fireEvent(new MouseEvent('mouseup', { bubbles: true }));
    // two child options of group A disappear
    expect(wrapper.findDropdown()!.findOptions().length).toBe(optionCountExpanded - 2);
    // both group headers are still present
    expect(wrapper.findDropdown()!.findGroups()).toHaveLength(2);
  });

  test('Right/Left arrow keys expand and collapse the highlighted group header', () => {
    const { wrapper } = renderSelect({ collapsibleGroups: true, filteringType: 'none' });
    wrapper.openDropdown();
    const menu = wrapper.findDropdown()!.findOptionsContainer()!;

    // On open, the first option ("First") is highlighted; one ArrowDown moves to the "Group A" header.
    menu.keydown(KeyCode.down);
    // collapse with ArrowLeft
    menu.keydown(KeyCode.left);
    expect(wrapper.findDropdown()!.findGroup(1)!.getElement()).toHaveAttribute('aria-expanded', 'false');
    // expand with ArrowRight
    wrapper.findDropdown()!.findOptionsContainer()!.keydown(KeyCode.right);
    expect(wrapper.findDropdown()!.findGroup(1)!.getElement()).toHaveAttribute('aria-expanded', 'true');
  });
});
