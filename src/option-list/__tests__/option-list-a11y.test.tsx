// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';

import { KeyCode } from '@cloudscape-design/component-toolkit/internal';

import '../../__a11y__/to-validate-a11y';
import { OptionListProps } from '../../../lib/components/option-list';
import {
  focusList,
  groupedOptions,
  highlightedValue,
  highlightFirstGroupHeader,
  pressKey,
  renderOptionList,
  Stateful,
  withDisabled,
  Wrapper,
} from './common';

import selectableItemStyles from '../../../lib/components/internal/components/selectable-item/styles.selectors.js';

describe('OptionList a11y', () => {
  test.each<[string, OptionListProps.SelectionType, OptionListProps.Options, string]>([
    ['single selection', 'single', withDisabled, 'a'],
    ['multi selection', 'multi', withDisabled, 'a'],
    ['single selection with groups', 'single', groupedOptions, 'ec2'],
    ['multi selection with groups', 'multi', groupedOptions, 'ec2'],
  ])('is accessible: %s', async (_, selectionType, source, selected) => {
    const { container } = render(
      <Stateful selectionType={selectionType} options={source} initialSelected={[selected]} />
    );
    await expect(container).toValidateA11y();
  });

  test('is accessible while an option is highlighted', async () => {
    const { container, listbox } = renderOptionList(<Stateful selectionType="multi" options={groupedOptions} />);
    focusList(listbox);
    pressKey(listbox, KeyCode.down);
    expect(listbox).toHaveAttribute('aria-activedescendant');
    await expect(container).toValidateA11y();
  });

  // The visible content of the highlighted option is hidden from screen readers, so only this text is announced.
  const announcement = (wrapper: Wrapper) =>
    wrapper.findHighlightedOption()!.find(`.${selectableItemStyles['screenreader-content']}`)!.getElement().textContent;

  test('announces the group of the highlighted option by default', () => {
    const { wrapper, listbox } = renderOptionList(<Stateful options={groupedOptions} />);
    focusList(listbox);
    expect(highlightedValue(wrapper)).toBe('ec2');
    expect(announcement(wrapper)).toContain('Compute');
  });

  describe('renderHighlightedAriaLive', () => {
    test('announces the highlighted option with the custom text, for example with custom option content', () => {
      const { wrapper, listbox } = renderOptionList(
        <Stateful
          options={[{ value: 'a' }, { value: 'b' }]}
          renderOption={({ item }) => <span>{item.option.value === 'a' ? 'Production' : 'Staging'}</span>}
          renderHighlightedAriaLive={option => (option.value === 'a' ? 'Production' : 'Staging')}
        />
      );
      focusList(listbox);
      expect(announcement(wrapper)).toBe('Production');
      pressKey(listbox, KeyCode.down);
      expect(announcement(wrapper)).toBe('Staging');
    });

    test('receives the consumer option objects and the group when it changes', () => {
      const renderHighlightedAriaLive = jest.fn(() => 'announcement');
      const [compute] = groupedOptions as OptionListProps.OptionGroup[];
      const { listbox } = renderOptionList(
        <Stateful options={groupedOptions} renderHighlightedAriaLive={renderHighlightedAriaLive} />
      );
      focusList(listbox);
      expect(renderHighlightedAriaLive).toHaveBeenLastCalledWith(compute.options[0], compute);
    });

    test('receives the consumer group object when a group header is highlighted in multi selection', () => {
      const renderHighlightedAriaLive = jest.fn(() => 'announcement');
      const [compute] = groupedOptions as OptionListProps.OptionGroup[];
      const { listbox } = renderOptionList(
        <Stateful
          selectionType="multi"
          options={groupedOptions}
          renderHighlightedAriaLive={renderHighlightedAriaLive}
        />
      );
      highlightFirstGroupHeader(listbox);
      const calls = renderHighlightedAriaLive.mock
        .calls as unknown as Parameters<OptionListProps.ContainingOptionAndGroupString>[];
      expect(calls[calls.length - 1][0]).toBe(compute);
    });
  });
});
