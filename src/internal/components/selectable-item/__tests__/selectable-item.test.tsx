// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';
import { render } from '@testing-library/react';

import SelectableItem from '../../../../../lib/components/internal/components/selectable-item';
import styles from '../../../../../lib/components/internal/components/selectable-item/styles.selectors.js';

function getAriaAttributeNames(element: null | Element): string[] {
  return element!.getAttributeNames().filter(name => name.startsWith('aria'));
}

it('does not assign aria attributes by default', () => {
  const { container } = render(<SelectableItem>Option</SelectableItem>);
  expect(getAriaAttributeNames(container.querySelector('li'))).toHaveLength(0);
});

it('does not assign aria attributes when highlighted', () => {
  const { container } = render(<SelectableItem highlighted={true}>Option</SelectableItem>);
  expect(getAriaAttributeNames(container.querySelector('li'))).toHaveLength(0);
});

it('assigns aria-selected when selected', () => {
  const { container } = render(<SelectableItem ariaSelected={true}>Option</SelectableItem>);
  expect(getAriaAttributeNames(container.querySelector('li'))).toHaveLength(1);
  expect(container.querySelector('li')).toHaveAttribute('aria-selected', 'true');
});

it('assigns aria-checked when checked', () => {
  const { container } = render(<SelectableItem ariaChecked={true}>Option</SelectableItem>);
  expect(getAriaAttributeNames(container.querySelector('li'))).toHaveLength(1);
  expect(container.querySelector('li')).toHaveAttribute('aria-checked', 'true');
});

it('highlighted option with screenReaderContent should have aria-hidden and screenReaderContent', () => {
  const { container } = render(
    <SelectableItem highlighted={true} screenReaderContent={'announcement'}>
      Option
    </SelectableItem>
  );
  expect(container.querySelector(`.${styles['option-content']}`)).toHaveAttribute('aria-hidden', 'true');
  expect(container.querySelector(`.${styles['screenreader-content']}`)).toContainHTML('announcement');
});

it('highlighted option with highlightType "mouse" should not add keyboard class to the item', () => {
  const { container } = render(
    <SelectableItem highlighted={true} highlightType="mouse">
      Highlighted Option
    </SelectableItem>
  );
  expect(container.querySelector(`.${styles.highlighted}`)).not.toBeNull();
  expect(container.querySelector(`.${styles['is-keyboard']}`)).toBeNull();
});

it('highlighted option with highlightType "keyboard" should add keyboard class to the item', () => {
  const { container } = render(
    <SelectableItem highlighted={true} highlightType="keyboard">
      Highlighted Option
    </SelectableItem>
  );
  expect(container.querySelector(`.${styles.highlighted}`)).not.toBeNull();
  expect(container.querySelector(`.${styles['is-keyboard']}`)).not.toBeNull();
});

it('assign aria-posinset and aria-setsize when set', () => {
  const { container } = render(
    <SelectableItem ariaPosinset={10} ariaSetsize={50}>
      Option
    </SelectableItem>
  );
  expect(getAriaAttributeNames(container.querySelector('li'))).toHaveLength(2);
  expect(container.querySelector('li')).toHaveAttribute('aria-posinset', '10');
  expect(container.querySelector('li')).toHaveAttribute('aria-setsize', '50');
});

it('assigns aria-disabled when disabled', () => {
  const { container } = render(<SelectableItem disabled={true}>Option</SelectableItem>);
  expect(getAriaAttributeNames(container.querySelector('li'))).toHaveLength(1);
  expect(container.querySelector('li')).toHaveAttribute('aria-disabled', 'true');
});

it('assigns aria-hidden when is parent', () => {
  const { container } = render(<SelectableItem isParent={true}>Option</SelectableItem>);
  expect(getAriaAttributeNames(container.querySelector('li'))).toHaveLength(1);
  expect(container.querySelector('li')).toHaveAttribute('aria-hidden', 'true');
});
