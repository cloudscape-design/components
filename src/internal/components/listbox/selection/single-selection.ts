// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { OptionDefinition } from '../../../../types/option';
import { DropdownOption } from '../../option/interfaces';
import { isGroup } from '../../option/utils/filter-options';
import { SelectionModel } from './interfaces';

/**
 * One option at a time. Choosing the selected option again keeps it selected.
 * Only the first entry of `selectedOptions` is used. Group headers are never selectable.
 */
export function singleSelection(selectedOptions: ReadonlyArray<OptionDefinition>): SelectionModel {
  const selected = selectedOptions.slice(0, 1);
  const selectedValue = selected[0]?.value;

  return {
    selectionType: 'single',
    interactiveGroups: false,
    selectedOptions: selected,
    getGroupState: (option: DropdownOption) => {
      if (!isGroup(option.option)) {
        return { selected: false, indeterminate: false };
      }
      const children = option.option.options;
      // A child with a falsy value never counts as selected, even when the selected value is also falsy.
      const totalSelected = children.filter(child => !!child.value && child.value === selectedValue).length;
      return { selected: false, indeterminate: totalSelected > 0 && totalSelected !== children.length };
    },
    getNextSelection: (option: DropdownOption) => [option.option as OptionDefinition],
  };
}
