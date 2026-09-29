// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ButtonDropdownProps } from '../interfaces';
import { isGroupExpandable } from '../utils/utils';

const group = (expandable?: boolean): ButtonDropdownProps.ItemGroup => ({
  text: 'group',
  items: [{ id: 'child', text: 'child' }],
  ...(expandable === undefined ? {} : { expandable }),
});

const action: ButtonDropdownProps.Item = { id: 'a', text: 'action' };
const checkbox: ButtonDropdownProps.CheckboxItem = { id: 'c', text: 'checkbox', itemType: 'checkbox', checked: false };

describe('isGroupExpandable (inherit-override)', () => {
  test('unset flag inherits the dropdown-level default', () => {
    expect(isGroupExpandable(group(undefined), true)).toBe(true);
    expect(isGroupExpandable(group(undefined), false)).toBe(false);
  });

  test('explicit true overrides the default in both directions', () => {
    expect(isGroupExpandable(group(true), false)).toBe(true);
    expect(isGroupExpandable(group(true), true)).toBe(true);
  });

  test('explicit false overrides the default in both directions', () => {
    expect(isGroupExpandable(group(false), true)).toBe(false);
    expect(isGroupExpandable(group(false), false)).toBe(false);
  });

  test('non-group items are never expandable', () => {
    expect(isGroupExpandable(action, true)).toBe(false);
    expect(isGroupExpandable(checkbox, true)).toBe(false);
  });
});
