// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useState } from 'react';
import { render } from '@testing-library/react';

import { KeyCode } from '@cloudscape-design/component-toolkit/internal';
import { createWrapper } from '@cloudscape-design/test-utils-core/dom';

import '../../__a11y__/to-validate-a11y';
import { MultiselectProps } from '../../../lib/components/multiselect';
import EmbeddedMultiselect, { EmbeddedMultiselectProps } from '../../../lib/components/multiselect/embedded';

import dropdownFooterStyles from '../../../lib/components/internal/components/dropdown-footer/styles.css.js';
import selectableItemsStyles from '../../../lib/components/internal/components/selectable-item/styles.css.js';
import multiselectStyles from '../../../lib/components/multiselect/styles.css.js';

const defaultOptions: MultiselectProps.Options = [
  { label: 'First', value: '1' },
  { label: 'Second', value: '2' },
  { label: 'Third', value: '3', lang: 'es' },
  { label: 'Fourth', value: '4' },
];

const defaultProps: EmbeddedMultiselectProps = {
  options: defaultOptions,
  selectedOptions: [],
  filteringType: 'auto',
  statusType: 'finished',
  controlId: '123',
  loadingText: 'Loading...',
  finishedText: 'Finished',
  errorText: 'Error',
};

function StatefulEmbeddedMultiselect(props: EmbeddedMultiselectProps) {
  const [selectedOptions, setSelectedOptions] = useState(props.selectedOptions);
  return (
    <EmbeddedMultiselect
      {...props}
      selectedOptions={selectedOptions}
      onChange={event => {
        props.onChange?.(event);
        setSelectedOptions(event.detail.selectedOptions);
      }}
    />
  );
}

function renderComponent(props: Partial<EmbeddedMultiselectProps>) {
  const { container } = render(
    <div>
      <label htmlFor="list-control">Input name</label>
      <input id="list-control" />
      <StatefulEmbeddedMultiselect {...defaultProps} {...props} />
    </div>
  );
  return { container };
}

test.each([false, true])('renders options, virtualScroll=%s', virtualScroll => {
  renderComponent({ virtualScroll });

  const items = createWrapper()
    .findAllByClassName(selectableItemsStyles['selectable-item'])
    .map(w => w.getElement());
  expect(items.map(item => item.textContent)).toEqual(['First', 'Second', 'Third', 'Fourth']);
});

test.each([
  { statusType: 'pending', expectedContent: null },
  { statusType: 'loading', expectedContent: 'Loading...' },
  { statusType: 'error', expectedContent: 'Error' },
  { statusType: 'finished', expectedContent: 'Finished' },
] as const)('renders footer with statusType="$statusType"', ({ statusType, expectedContent }) => {
  renderComponent({ statusType });

  const footer = createWrapper().findByClassName(dropdownFooterStyles.root);
  if (expectedContent) {
    expect(footer).not.toBe(null);
    expect(footer!.getElement()).toHaveTextContent(expectedContent);
  } else {
    expect(footer).toBe(null);
  }
});

test('ARIA labels', () => {
  renderComponent({ ariaLabel: 'My list', controlId: 'list-control', statusType: 'loading' });

  const group = createWrapper().findByClassName(multiselectStyles.embedded)!.getElement();
  expect(group).toHaveAttribute('role', 'group');
  expect(group).toHaveAccessibleName('My list');
  expect(group).toHaveAccessibleDescription('Loading...');

  const list = createWrapper().find('ul')!.getElement();
  expect(list).toHaveAttribute('role', 'listbox');
  expect(list).toHaveAccessibleName('My list Input name');
  expect(list).toHaveAccessibleDescription('Loading...');
});

test('highlights first option when list is focused and removes highlight when the focus is lost', () => {
  renderComponent({});

  const list = createWrapper().find('ul')!.getElement();
  list.focus();

  const highlightedItemsAfterFocus = createWrapper().findAllByClassName(selectableItemsStyles.highlighted);
  expect(highlightedItemsAfterFocus).toHaveLength(1);
  expect(highlightedItemsAfterFocus[0].getElement()).toHaveTextContent('First');

  list.blur();

  const highlightedItemsAfterBlur = createWrapper().findAllByClassName(selectableItemsStyles.highlighted);
  expect(highlightedItemsAfterBlur).toHaveLength(0);
});

test('selects options with Enter and Space and keeps highlight after Esc is pressed', () => {
  renderComponent({});

  createWrapper().find('ul')!.focus();
  createWrapper().find('ul')!.keydown(KeyCode.enter);
  createWrapper().find('ul')!.keydown(KeyCode.down);
  createWrapper().find('ul')!.keydown(KeyCode.space);

  const highlightedItems = createWrapper().findAllByClassName(selectableItemsStyles.highlighted);
  const selectedItems = createWrapper().findAllByClassName(selectableItemsStyles.selected);
  expect(highlightedItems).toHaveLength(1);
  expect(selectedItems).toHaveLength(2);

  createWrapper().find('ul')!.keydown(KeyCode.escape);

  const highlightedItemsAfterEscape = createWrapper().findAllByClassName(selectableItemsStyles.highlighted);
  const selectedItemsAfterEscape = createWrapper().findAllByClassName(selectableItemsStyles.selected);
  expect(highlightedItemsAfterEscape).toHaveLength(1);
  expect(selectedItemsAfterEscape).toHaveLength(2);
});
