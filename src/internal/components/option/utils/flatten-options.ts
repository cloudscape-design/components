// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { DropdownOption, OptionDefinition, OptionGroup } from '../interfaces';

export const flattenOptions = (options: ReadonlyArray<OptionDefinition | OptionGroup>) => {
  const parentMap = new Map<DropdownOption, DropdownOption>();

  const flatOptions = options.reduce<DropdownOption[]>((acc, option) => {
    if ('options' in option) {
      const { options, ...rest } = option;
      const parentDropdownOption: DropdownOption = { type: 'parent', option };
      const allOptionsDisabled = options.every(option => option.disabled);
      if (option.disabled || allOptionsDisabled) {
        parentDropdownOption.disabled = true;
      }
      acc.push(parentDropdownOption);
      options.forEach(child => {
        const childDropdownOption: DropdownOption = { type: 'child', option: child };
        if (rest.disabled || child.disabled) {
          childDropdownOption.disabled = true;
        }
        acc.push(childDropdownOption);
        parentMap.set(childDropdownOption, parentDropdownOption);
      });
    } else {
      const dropdownOption: DropdownOption = { option };
      if (option.disabled) {
        dropdownOption.disabled = true;
      }
      acc.push(dropdownOption);
    }

    return acc;
  }, []);

  return {
    flatOptions,
    parentMap,
  };
};
