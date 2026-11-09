// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import { fireEvent } from '@testing-library/react';

import { KeyCode } from '@cloudscape-design/component-toolkit/internal';

import OptionList, { OptionListProps } from '../../../lib/components/option-list';
import {
  clickOption,
  focusList,
  groupedOptions,
  highlightedValue,
  highlightFirstGroupHeader,
  pressKey,
  renderOptionList,
  Stateful,
} from './common';

describe('OptionList option groups', () => {
  test('renders each group labelled by its header, and option finders skip the headers', () => {
    const { wrapper } = renderOptionList(<Stateful options={groupedOptions} />);
    expect(wrapper.findGroupHeaders().map(header => header.findLabel()!.getElement().textContent)).toEqual([
      'Compute',
      'Storage',
    ]);
    const header = wrapper.findGroupHeaderByValue('storage')!.getElement();
    expect(header.closest('[role="group"]')).toHaveAttribute('aria-labelledby', header.id);
    expect(wrapper.findOptions().map(option => option.getElement().dataset.value)).toEqual([
      'ec2',
      'lambda',
      's3',
      'efs',
    ]);
    expect(wrapper.findOptionByIndex(3)!.getElement().dataset.value).toBe('s3');
  });

  test('onChange returns the original options and never a group', () => {
    const onChange = jest.fn();
    const { wrapper } = renderOptionList(
      <OptionList
        ariaLabel="Services"
        options={groupedOptions}
        selectionType="multi"
        onChange={({ detail }) => onChange(detail.selectedOptions)}
      />
    );
    fireEvent.mouseUp(wrapper.findGroupHeaderByValue('compute')!.getElement());
    const [ec2, lambda] = (groupedOptions[0] as OptionListProps.OptionGroup).options;
    expect(onChange.mock.calls[0][0]).toHaveLength(2);
    expect(onChange.mock.calls[0][0][0]).toBe(ec2);
    expect(onChange.mock.calls[0][0][1]).toBe(lambda);
  });

  describe('single selection', () => {
    test('group headers cannot be chosen and arrow keys skip them', () => {
      const onChange = jest.fn();
      const { wrapper, listbox } = renderOptionList(<Stateful options={groupedOptions} onChange={onChange} />);
      fireEvent.mouseUp(wrapper.findGroupHeaderByValue('compute')!.getElement());
      expect(onChange).not.toHaveBeenCalled();

      focusList(listbox);
      expect(highlightedValue(wrapper)).toBe('ec2');
      pressKey(listbox, KeyCode.down);
      pressKey(listbox, KeyCode.down);
      expect(highlightedValue(wrapper)).toBe('s3');
      pressKey(listbox, KeyCode.home);
      pressKey(listbox, KeyCode.up);
      expect(highlightedValue(wrapper)).toBe('efs');
    });

    test('arrows still wrap when the list starts with a group that has options', () => {
      const { wrapper, listbox } = renderOptionList(
        <Stateful
          options={[
            { value: 'fruits', label: 'Fruits', options: [{ value: 'apple', label: 'Apple' }] },
            { value: 'banana', label: 'Banana' },
          ]}
        />
      );
      focusList(listbox);
      expect(highlightedValue(wrapper)).toBe('apple');
      pressKey(listbox, KeyCode.up);
      expect(highlightedValue(wrapper)).toBe('banana');
      pressKey(listbox, KeyCode.down);
      expect(highlightedValue(wrapper)).toBe('apple');
    });
  });

  describe('multi selection', () => {
    test('the group header is checked, mixed or unchecked by its selected options', () => {
      const { wrapper } = renderOptionList(<Stateful selectionType="multi" options={groupedOptions} />);
      const header = () => wrapper.findGroupHeaderByValue('compute')!;
      expect(header().getElement()).toHaveAttribute('aria-checked', 'false');
      clickOption(wrapper, 1);
      expect(header().getElement()).toHaveAttribute('aria-checked', 'mixed');
      expect(header().isSelected()).toBe(false);
      clickOption(wrapper, 2);
      expect(header().getElement()).toHaveAttribute('aria-checked', 'true');
      expect(header().isSelected()).toBe(true);
    });

    test('choosing a group header toggles its enabled options with the mouse and keyboard', () => {
      const onChange = jest.fn();
      const { wrapper, listbox } = renderOptionList(
        <Stateful selectionType="multi" options={groupedOptions} initialSelected={['efs']} onChange={onChange} />
      );
      const storageHeader = wrapper.findGroupHeaderByValue('storage')!.getElement();
      fireEvent.mouseUp(storageHeader);
      expect(onChange).toHaveBeenLastCalledWith(['efs', 's3']);
      fireEvent.mouseUp(storageHeader);
      expect(onChange).toHaveBeenLastCalledWith(['efs']);

      highlightFirstGroupHeader(listbox);
      expect(wrapper.findGroupHeaderByValue('compute')!.isHighlighted()).toBe(true);
      pressKey(listbox, KeyCode.enter);
      expect(onChange).toHaveBeenLastCalledWith(['efs', 'ec2', 'lambda']);
      pressKey(listbox, KeyCode.space);
      expect(onChange).toHaveBeenLastCalledWith(['efs']);
    });

    test('keeps the highlight when the options are recreated with the same values', () => {
      // The options are created on every render, so they are new objects after each change.
      // The highlight is index-based, and this passes because the index doesn't move.
      // Follow-up: keep the highlight on its option when options are added, removed or reordered.
      function RebuiltOptions() {
        const [selectedOptions, setSelectedOptions] = useState<ReadonlyArray<OptionListProps.Option>>([]);
        return (
          <OptionList
            ariaLabel="Services"
            selectionType="multi"
            options={[{ value: 'compute', label: 'Compute', options: [{ value: 'ec2', label: 'EC2' }] }]}
            selectedOptions={selectedOptions}
            onChange={({ detail }) => setSelectedOptions(detail.selectedOptions)}
          />
        );
      }
      const { wrapper, listbox } = renderOptionList(<RebuiltOptions />);
      const header = () => wrapper.findGroupHeaderByValue('compute')!;
      highlightFirstGroupHeader(listbox);
      expect(header().isHighlighted()).toBe(true);
      pressKey(listbox, KeyCode.enter);
      expect(header().isSelected()).toBe(true);
      expect(header().isHighlighted()).toBe(true);
      pressKey(listbox, KeyCode.enter);
      expect(header().isSelected()).toBe(false);
    });

    test('a disabled group disables its options', () => {
      const onChange = jest.fn();
      const { wrapper } = renderOptionList(
        <Stateful
          selectionType="multi"
          options={[{ value: 'db', label: 'Databases', disabled: true, options: [{ value: 'rds', label: 'RDS' }] }]}
          onChange={onChange}
        />
      );
      expect(wrapper.findGroupHeaderByValue('db')!.isDisabled()).toBe(true);
      expect(wrapper.findOptionByValue('rds')!.isDisabled()).toBe(true);
      fireEvent.mouseUp(wrapper.findGroupHeaderByValue('db')!.getElement());
      clickOption(wrapper, 1);
      expect(onChange).not.toHaveBeenCalled();
    });
  });
});
