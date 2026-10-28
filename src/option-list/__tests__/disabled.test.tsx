// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { fireEvent } from '@testing-library/react';

import { KeyCode } from '@cloudscape-design/component-toolkit/internal';

import { OptionListProps } from '../../../lib/components/option-list';
import createWrapper from '../../../lib/components/test-utils/dom';
import {
  clickOption,
  highlightedValue,
  options,
  pressKey,
  renderOptionList,
  selectedLabels,
  Stateful,
  withDisabled,
} from './common';

const findTooltip = () => createWrapper().findTooltip();

describe('OptionList disabled options', () => {
  test.each<OptionListProps.SelectionType>(['single', 'multi'])(
    'marks disabled options and ignores clicks on them (%s)',
    selectionType => {
      const onChange = jest.fn();
      const { wrapper } = renderOptionList(
        <Stateful selectionType={selectionType} options={withDisabled} onChange={onChange} />
      );
      const disabledOption = wrapper.findOptionByValue('b')!;
      expect(disabledOption.isDisabled()).toBe(true);
      expect(disabledOption.getElement()).toHaveAttribute('aria-disabled', 'true');
      expect(wrapper.findOptionByValue('a')!.isDisabled()).toBe(false);

      clickOption(wrapper, 2);
      expect(onChange).not.toHaveBeenCalled();
      expect(wrapper.findSelectedOptions()).toHaveLength(0);
    }
  );

  test('keyboard can reach a disabled option but Enter does not select it', () => {
    const onChange = jest.fn();
    const { wrapper, listbox } = renderOptionList(<Stateful options={withDisabled} onChange={onChange} />);
    fireEvent.focus(listbox);
    pressKey(listbox, KeyCode.down);
    expect(highlightedValue(wrapper)).toBe('b');
    pressKey(listbox, KeyCode.enter);
    expect(onChange).not.toHaveBeenCalled();
  });

  test('a selected disabled option stays selected and cannot be deselected in multi mode', () => {
    const onChange = jest.fn();
    const { wrapper } = renderOptionList(
      <Stateful selectionType="multi" options={withDisabled} initialSelected={['b']} onChange={onChange} />
    );
    clickOption(wrapper, 2);
    expect(onChange).not.toHaveBeenCalled();
    expect(selectedLabels(wrapper)).toEqual(['Second']);
  });

  test('describes the disabled option with its disabled reason', () => {
    const { wrapper } = renderOptionList(<Stateful options={withDisabled} />);
    const describedBy = wrapper.findOptionByValue('b')!.getElement().getAttribute('aria-describedby');
    expect(describedBy).toBeTruthy();
    expect(document.getElementById(describedBy!)).toHaveTextContent('Not available in this Region');
  });

  test.each<OptionListProps.SelectionType>(['single', 'multi'])(
    'describes the disabled option with its disabled reason when renderOption is used (%s)',
    selectionType => {
      const { wrapper, listbox } = renderOptionList(
        <Stateful
          selectionType={selectionType}
          options={withDisabled}
          renderOption={({ item }) => <span>Custom {item.option.label}</span>}
        />
      );
      const describedBy = wrapper.findOptionByValue('b')!.getElement().getAttribute('aria-describedby');
      expect(describedBy).toBeTruthy();
      expect(document.getElementById(describedBy!)).toHaveTextContent('Not available in this Region');

      // Custom content owns the visible output, so the tooltip isn't shown.
      fireEvent.focus(listbox);
      pressKey(listbox, KeyCode.down);
      expect(highlightedValue(wrapper)).toBe('b');
      expect(findTooltip()).toBeNull();
    }
  );

  test('Escape closes the disabled reason tooltip and keeps the highlight and selection', () => {
    const onChange = jest.fn();
    const { wrapper, listbox } = renderOptionList(
      <Stateful
        options={[options[0], { value: 'b', label: 'Second', disabled: true, disabledReason: <b>Needs a quota</b> }]}
        initialSelected={['a']}
        onChange={onChange}
      />
    );
    fireEvent.focus(listbox);
    expect(findTooltip()).toBeNull();
    pressKey(listbox, KeyCode.down);
    expect(findTooltip()!.findContent()!.getElement()).toHaveTextContent('Needs a quota');

    fireEvent.keyDown(listbox, { key: 'Escape', keyCode: KeyCode.escape });
    expect(findTooltip()).toBeNull();
    expect(highlightedValue(wrapper)).toBe('b');
    expect(onChange).not.toHaveBeenCalled();
    expect(selectedLabels(wrapper)).toEqual(['First']);
  });
});
