// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { DropdownOption, OptionGroup } from '../interfaces';

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

  const attachedChildren = new Set<DropdownOption>();

  options.forEach((option, index) => {
    if (option.type === 'parent') {
      const wrapped: ParentDropdownOption = { type: 'parent', option, index, children: [] };
      (option.option as OptionGroup).options.forEach(child => {
        const childOption = options.find(o => o.type === 'child' && o.option.value === child.value);
        if (childOption) {
          wrapped.children.push({ type: 'child', option: childOption, index });
          attachedChildren.add(childOption);
        }
      });
      nestedOptions.push(wrapped);
    } else if (!attachedChildren.has(option)) {
      nestedOptions.push({ type: 'child', option, index });
    }
  });

  return nestedOptions;
}
