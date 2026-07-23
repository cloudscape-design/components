// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';
import { render } from '@testing-library/react';

import Multiselect, { MultiselectProps } from '../../../lib/components/multiselect';
import createWrapper from '../../../lib/components/test-utils/dom';

const options: MultiselectProps.Options = [
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

const defaultProps: MultiselectProps = {
  options,
  selectedOptions: [],
  onChange: () => {},
};

function renderMultiselect(props?: Partial<MultiselectProps>) {
  const onChange = jest.fn();
  const { container } = render(<Multiselect {...defaultProps} onChange={onChange} {...props} />);
  const wrapper = createWrapper(container).findMultiselect()!;
  return { wrapper, onChange };
}

describe('Multiselect collapsibleGroups', () => {
  test('does not add aria-expanded to group headers by default', () => {
    const { wrapper } = renderMultiselect();
    wrapper.openDropdown();
    expect(wrapper.findDropdown()!.findGroup(1)!.getElement()).not.toHaveAttribute('aria-expanded');
  });

  test('renders group headers as expanded disclosure controls when enabled', () => {
    const { wrapper } = renderMultiselect({ collapsibleGroups: true });
    wrapper.openDropdown();
    const dropdown = wrapper.findDropdown()!;
    expect(dropdown.findGroup(1)!.getElement()).toHaveAttribute('aria-expanded', 'true');
    expect(dropdown.findOptionInGroup(1, 1)!.getElement()).toHaveTextContent('A1');
  });

  test('collapses a group and hides its children when the header is activated', () => {
    const { wrapper, onChange } = renderMultiselect({ collapsibleGroups: true });
    wrapper.openDropdown();
    wrapper
      .findDropdown()!
      .findGroup(1)!
      .fireEvent(new MouseEvent('mouseup', { bubbles: true }));
    expect(wrapper.findDropdown()!.findGroup(1)!.getElement()).toHaveAttribute('aria-expanded', 'false');
    expect(wrapper.findDropdown()!.findOptionInGroup(1, 1)).toBeNull();
    // toggling collapse must not change selection (does not select-all the group)
    expect(onChange).not.toHaveBeenCalled();
  });

  test('individual options remain selectable when groups are collapsible', () => {
    const { wrapper, onChange } = renderMultiselect({ collapsibleGroups: true });
    wrapper.openDropdown();
    wrapper
      .findDropdown()!
      .findOptionInGroup(2, 1)!
      .fireEvent(new MouseEvent('mouseup', { bubbles: true }));
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({
        detail: expect.objectContaining({ selectedOptions: [{ label: 'B1', value: 'b1' }] }),
      })
    );
  });
});
