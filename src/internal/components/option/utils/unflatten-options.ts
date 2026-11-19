// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { DropdownOption } from '../interfaces';

interface ParentDropdownOption {
  type: 'parent';
  index: number;
  option: DropdownOption;
  children: ChildDropdownOption[];
}

interface ChildDropdownOption {
  type: 'child';
  index: number;
  option: DropdownOption;
}

export type NestedDropdownOption = ParentDropdownOption | ChildDropdownOption;

export function unflattenOptions(options: ReadonlyArray<DropdownOption>): NestedDropdownOption[] {
  const nestedOptions: NestedDropdownOption[] = [];
  let currentParent: ParentDropdownOption | undefined;

  options.forEach((option, index) => {
    if (option.type === 'parent') {
      const wrapped: ParentDropdownOption = { type: 'parent', option, index, children: [] };
      currentParent = wrapped;
      nestedOptions.push(wrapped);
    } else if (option.type === 'child') {
      (currentParent?.children ?? nestedOptions).push({ type: 'child', option, index });
    } else {
      currentParent = undefined;
      nestedOptions.push({ type: 'child', option, index });
    }
  });

  return nestedOptions;
}
