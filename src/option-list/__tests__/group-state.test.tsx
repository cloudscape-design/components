// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { fireEvent } from '@testing-library/react';

import { KeyCode } from '@cloudscape-design/component-toolkit/internal';

import OptionList, { OptionListProps } from '../../../lib/components/option-list';
import { clickOption, groupedOptions, highlightedValue, pressKey, renderOptionList, Stateful, Wrapper } from './common';

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

  test('announces the group of the highlighted option', () => {
    const { wrapper, listbox } = renderOptionList(<Stateful options={groupedOptions} />);
    fireEvent.focus(listbox);
    expect(wrapper.findOptionByValue('ec2')!.getElement()).toHaveTextContent('Compute');
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

      fireEvent.focus(listbox);
      expect(highlightedValue(wrapper)).toBe('ec2');
      pressKey(listbox, KeyCode.down);
      pressKey(listbox, KeyCode.down);
      expect(highlightedValue(wrapper)).toBe('s3');
      pressKey(listbox, KeyCode.home);
      pressKey(listbox, KeyCode.up);
      expect(highlightedValue(wrapper)).toBe('efs');
    });

    test('arrows wrap at the first and last options when the list starts and ends with an empty group', () => {
      const { wrapper, listbox } = renderOptionList(
        <Stateful
          options={[
            { value: 'g0', label: 'Empty start', options: [] },
            { value: 'apple', label: 'Apple' },
            { value: 'banana', label: 'Banana' },
            { value: 'g1', label: 'Empty end', options: [] },
          ]}
        />
      );
      fireEvent.focus(listbox);
      pressKey(listbox, KeyCode.end);
      expect(highlightedValue(wrapper)).toBe('banana');
      pressKey(listbox, KeyCode.down);
      expect(highlightedValue(wrapper)).toBe('apple');
      pressKey(listbox, KeyCode.up);
      expect(highlightedValue(wrapper)).toBe('banana');
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
      fireEvent.focus(listbox);
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

      fireEvent.focus(listbox);
      pressKey(listbox, KeyCode.home);
      expect(wrapper.findGroupHeaderByValue('compute')!.isHighlighted()).toBe(true);
      pressKey(listbox, KeyCode.enter);
      expect(onChange).toHaveBeenLastCalledWith(['efs', 'ec2', 'lambda']);
      pressKey(listbox, KeyCode.space);
      expect(onChange).toHaveBeenLastCalledWith(['efs']);
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

  describe('type-ahead', () => {
    const typeAheadOptions: OptionListProps.Options = [
      {
        value: 'compute',
        label: 'Compute',
        options: [
          { value: 'ec2', label: 'EC2' },
          { value: 'lambda', label: 'Lambda' },
          { value: 'fargate', label: 'Fargate' },
        ],
      },
      {
        value: 'databases',
        label: 'Databases',
        disabled: true,
        options: [
          { value: 'cassandra', label: 'Cassandra' },
          { value: 'documentdb', label: 'DocumentDB' },
        ],
      },
      { value: 'cherry', label: 'Cherry' },
    ];
    const type = (listbox: HTMLElement, key: string) => fireEvent.keyDown(listbox, { key });
    const isComputeHighlighted = (wrapper: Wrapper) => wrapper.findGroupHeaderByValue('compute')!.isHighlighted();

    test('multi: highlights the option that matches, not its group, and Enter selects only that option', () => {
      const onChange = jest.fn();
      const { wrapper, listbox } = renderOptionList(
        <Stateful selectionType="multi" options={typeAheadOptions} onChange={onChange} />
      );
      fireEvent.focus(listbox);
      type(listbox, 'e');
      expect(isComputeHighlighted(wrapper)).toBe(false);
      expect(highlightedValue(wrapper)).toBe('ec2');
      pressKey(listbox, KeyCode.enter);
      expect(onChange).toHaveBeenLastCalledWith(['ec2']);
    });

    test('multi: repeating a key cycles through the matching group and options, skipping a disabled group', () => {
      const { wrapper, listbox } = renderOptionList(<Stateful selectionType="multi" options={typeAheadOptions} />);
      fireEvent.focus(listbox);
      type(listbox, 'c');
      expect(isComputeHighlighted(wrapper)).toBe(true);
      type(listbox, 'c');
      expect(highlightedValue(wrapper)).toBe('cherry');
      type(listbox, 'c');
      expect(isComputeHighlighted(wrapper)).toBe(true);
    });

    test('single: skips the options of a group whose label matches', () => {
      const { wrapper, listbox } = renderOptionList(<Stateful options={typeAheadOptions} />);
      fireEvent.focus(listbox);
      type(listbox, 'c');
      expect(highlightedValue(wrapper)).toBe('cherry');
      type(listbox, 'c');
      expect(highlightedValue(wrapper)).toBe('cherry');
    });
  });
});
