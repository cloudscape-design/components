// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { DropdownOption, OptionDefinition } from '../../internal/components/option/interfaces';

export const connectOptionsByValue = (
  options: ReadonlyArray<DropdownOption>,
  selectedOptions: ReadonlyArray<OptionDefinition>
): ReadonlyArray<DropdownOption> => {
  return (selectedOptions || []).map(selectedOption => {
    for (const dropdownOption of options) {
      if (
        dropdownOption.type !== 'parent' &&
        (dropdownOption.option as OptionDefinition).value === selectedOption.value
      ) {
        return dropdownOption;
      }
    }
    return { option: selectedOption };
  });
};

export const findOptionIndex = (options: ReadonlyArray<OptionDefinition>, option: OptionDefinition) => {
  for (let index = 0; index < options.length; index++) {
    const __option = options[index];
    if (__option === option || __option.value === option.value) {
      return index;
    }
  }
  return -1;
};
