// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { OptionDefinition, OptionGroup } from '../../../../types/option';
import { DropdownOption } from '../../option/interfaces';
import { isGroup } from '../../option/utils/filter-options';
import { findOptionIndex } from '../utils/connect-options';
import { GroupState, SelectionModel } from './interfaces';

interface MultiSelectionConfig {
  /** The options the user can currently see. Choosing a group toggles only its visible, enabled children. */
  options: ReadonlyArray<DropdownOption>;
  /**
   * All options, including the ones hidden by filtering. Select-all keeps hidden selected options and
   * reports "all selected" against this list. Defaults to `options`.
   */
  allOptions?: ReadonlyArray<DropdownOption>;
  /** Whether group headers can be highlighted and chosen. */
  interactiveGroups?: boolean;
}

const nonParentOptions = (options: ReadonlyArray<DropdownOption>) =>
  options
    .filter(item => item.type !== 'parent' && item.type !== 'select-all')
    .map(item => item.option as OptionDefinition);

/**
 * Any number of options. Choosing an option toggles it. Choosing a group toggles its visible, enabled
 * children. Choosing select-all toggles every visible, enabled option.
 */
export function multiSelection(
  selectedOptions: ReadonlyArray<OptionDefinition>,
  { options, allOptions = options, interactiveGroups = false }: MultiSelectionConfig
): SelectionModel {
  const selectedValues = new Set<string | undefined>(selectedOptions.map(option => option.value));
  const visible = nonParentOptions(options);
  const all = nonParentOptions(allOptions);

  const isSomeSelected = selectedOptions.length > 0;
  const isAllSelected = all.every(option => selectedValues.has(option.value));
  const isAllVisibleSelectableSelected =
    isSomeSelected && visible.every(option => option.disabled || selectedValues.has(option.value));

  const getOptionGroupState = (group: OptionGroup): GroupState => {
    const totalSelected = group.options.filter(item => !!item.value && selectedValues.has(item.value)).length;
    const hasSelected = totalSelected > 0;
    const allSelected = totalSelected === group.options.length;
    return { selected: hasSelected && allSelected && interactiveGroups, indeterminate: hasSelected && !allSelected };
  };

  const getGroupState = (option: DropdownOption): GroupState => {
    if (option.type === 'select-all') {
      return { selected: isAllSelected, indeterminate: !isAllSelected && isSomeSelected };
    }
    return isGroup(option.option) ? getOptionGroupState(option.option) : { selected: false, indeterminate: false };
  };

  const toggleAll = () => {
    const visibleValues = new Set(visible.map(option => option.value));
    return isAllVisibleSelectableSelected
      ? selectedOptions.filter(option => !visibleValues.has(option.value))
      : all.filter(({ disabled, value }) => selectedValues.has(value) || (!disabled && visibleValues.has(value)));
  };

  const toggle = (toToggle: ReadonlyArray<OptionDefinition>) => {
    // Disabled options count as selected, so a group with a disabled child doesn't get stuck in one direction.
    const allSelected = toToggle.every(item => findOptionIndex(selectedOptions, item) > -1 || item.disabled);
    if (allSelected) {
      return selectedOptions.filter(option => findOptionIndex(toToggle, option) === -1);
    }
    return selectedOptions.filter(item => findOptionIndex(toToggle, item) === -1).concat(toToggle);
  };

  return {
    selectionType: 'multi',
    interactiveGroups,
    selectedOptions,
    getGroupState,
    getNextSelection: (option: DropdownOption) => {
      if (option.type === 'select-all') {
        return toggleAll();
      }
      if (isGroup(option.option)) {
        const visibleChildren = option.option.options.filter(
          item => findOptionIndex(visible, item) > -1 && !item.disabled
        );
        return toggle(visibleChildren);
      }
      return toggle([option.option]);
    },
  };
}
