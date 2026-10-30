// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { fireEvent } from '@testing-library/react';

import { KeyCode } from '@cloudscape-design/component-toolkit/internal';

import { OptionListProps } from '../../../lib/components/option-list';
import { groupedOptions, pressKey, renderOptionList, Stateful } from './common';

describe('OptionList renderOption', () => {
  test('renders custom content for options and group headers with the original options', () => {
    const renderOption = jest.fn(({ item }: Parameters<OptionListProps['renderOption'] & {}>[0]) => (
      <span>{`${item.type}: ${item.option.label}`}</span>
    ));
    const { wrapper } = renderOptionList(
      <Stateful options={groupedOptions} initialSelected={['ec2']} renderOption={renderOption} />
    );
    expect(wrapper.findOptionByValue('ec2')!.getElement()).toHaveTextContent('item: EC2');
    expect(wrapper.findGroupHeaderByValue('compute')!.getElement()).toHaveTextContent('group: Compute');

    const [compute] = groupedOptions as OptionListProps.OptionGroup[];
    const items = renderOption.mock.calls.map(([{ item }]) => item);
    expect(items).toContainEqual({ type: 'group', index: 0, option: compute, disabled: false });
    expect(items).toContainEqual({
      type: 'item',
      index: 1,
      option: compute.options[0],
      selected: true,
      highlighted: false,
      disabled: false,
      parent: { type: 'group', index: 0, option: compute, disabled: false },
    });
    expect(items.find(item => item.option === compute.options[0])!.option).toBe(compute.options[0]);

    // Single selection leaves out the multi-selection group state, on group headers and on `parent`.
    const groupItems = [
      ...items.filter(item => item.type === 'group'),
      ...items.flatMap(item => (item.type === 'item' && item.parent ? [item.parent] : [])),
    ];
    expect(groupItems.length).toBeGreaterThan(0);
    for (const group of groupItems) {
      expect(group).not.toHaveProperty('selected');
      expect(group).not.toHaveProperty('indeterminate');
      expect(group).not.toHaveProperty('highlighted');
    }
  });

  test('multi: items carry the option icon, and group header items the group and its checkbox state', () => {
    const icon = <span data-testid="custom-icon" />;
    const iconOptions: OptionListProps.Options = [
      {
        value: 'compute',
        label: 'Compute',
        options: [
          { value: 'ec2', label: 'EC2', icon },
          { value: 'lambda', label: 'Lambda' },
        ],
      },
    ];
    const optionIcons: React.ReactNode[] = [];
    const groupStates: Array<Pick<OptionListProps.OptionGroupItem, 'selected' | 'indeterminate' | 'highlighted'>> = [];
    const renderOption = jest.fn(({ item }: { item: OptionListProps.Item }) => {
      if (item.type === 'item') {
        optionIcons.push(item.option.icon);
      } else {
        groupStates.push({
          selected: item.selected,
          indeterminate: item.indeterminate,
          highlighted: item.highlighted,
        });
      }
      return null;
    });
    const { wrapper, listbox } = renderOptionList(
      <Stateful selectionType="multi" options={iconOptions} initialSelected={['ec2']} renderOption={renderOption} />
    );
    expect(optionIcons).toContain(icon);
    expect(renderOption).toHaveBeenCalledWith(
      expect.objectContaining({ item: expect.objectContaining({ type: 'group', option: iconOptions[0] }) })
    );
    expect(groupStates[groupStates.length - 1]).toEqual({ selected: false, indeterminate: true, highlighted: false });

    fireEvent.focus(listbox);
    pressKey(listbox, KeyCode.home);
    expect(wrapper.findGroupHeaderByValue('compute')!.isHighlighted()).toBe(true);
    expect(groupStates[groupStates.length - 1]).toEqual({ selected: false, indeterminate: true, highlighted: true });

    pressKey(listbox, KeyCode.enter);
    expect(groupStates[groupStates.length - 1]).toEqual({ selected: true, indeterminate: false, highlighted: true });
  });
});
