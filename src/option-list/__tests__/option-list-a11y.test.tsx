// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { fireEvent, render } from '@testing-library/react';

import { KeyCode } from '@cloudscape-design/component-toolkit/internal';

import '../../__a11y__/to-validate-a11y';
import { OptionListProps } from '../../../lib/components/option-list';
import { groupedOptions, pressKey, renderOptionList, Stateful, withDisabled } from './common';

import selectableItemStyles from '../../../lib/components/internal/components/selectable-item/styles.css.js';

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

  describe('renderHighlightedAriaLive', () => {
    test('announces the highlighted option with the custom text, for example with custom option content', () => {
      const { wrapper, listbox } = renderOptionList(
        <Stateful
          options={[{ value: 'a' }, { value: 'b' }]}
          renderOption={({ item }) => <span>{item.option.value === 'a' ? 'Production' : 'Staging'}</span>}
          renderHighlightedAriaLive={option => (option.value === 'a' ? 'Production' : 'Staging')}
        />
      );
      // The visible custom content is hidden from screen readers while highlighted, so only this text is announced.
      const announcement = () =>
        wrapper
          .findHighlightedOption()!
          .getElement()
          .closest('[role="option"]')!
          .querySelector(`.${selectableItemStyles['screenreader-content']}`)!.textContent;
      fireEvent.focus(listbox);
      expect(announcement()).toBe('Production');
      pressKey(listbox, KeyCode.down);
      expect(announcement()).toBe('Staging');
    });

    test('receives the consumer option objects and the group when it changes', () => {
      const renderHighlightedAriaLive = jest.fn(() => 'announcement');
      const [compute] = groupedOptions as OptionListProps.OptionGroup[];
      const { listbox } = renderOptionList(
        <Stateful options={groupedOptions} renderHighlightedAriaLive={renderHighlightedAriaLive} />
      );
      fireEvent.focus(listbox);
      expect(renderHighlightedAriaLive).toHaveBeenLastCalledWith(compute.options[0], compute);
    });
  });
});
