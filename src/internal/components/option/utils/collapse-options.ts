// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { SelectProps } from '../../../../select/interfaces';
import { OptionGroup } from '../../../../types/option';
import { generateTestIndexes } from '../../options-list/utils/test-indexes';
import { DropdownOption } from '../interfaces';

/**
 * Resolves a stable key for a group so its expanded/collapsed state can be tracked
 * across renders. The top-level index within `options` is used because it is stable
 * regardless of whether the consumer recreates the options array on every render.
 */
export function getGroupKey(options: SelectProps.Options, group: OptionGroup): number {
  return options.indexOf(group);
}

interface ApplyGroupCollapseProps {
  options: SelectProps.Options;
  filteredOptions: ReadonlyArray<DropdownOption>;
  parentMap: Map<DropdownOption, DropdownOption>;
  collapsedGroups: ReadonlySet<number>;
}

/**
 * Given the flattened + filtered dropdown options, marks each `parent` option as
 * collapsible, sets its expanded state, and removes the child options of any
 * collapsed group. Test indexes are regenerated so test-utils keep working for the
 * visible subset.
 *
 * The `parent` DropdownOption objects are recreated on every render by
 * `flattenOptions`, so mutating them here is safe.
 */
export function applyGroupCollapse({
  options,
  filteredOptions,
  parentMap,
  collapsedGroups,
}: ApplyGroupCollapseProps): DropdownOption[] {
  const result: DropdownOption[] = [];
  let currentGroupCollapsed = false;

  for (const option of filteredOptions) {
    if (option.type === 'parent') {
      const groupIndex = getGroupKey(options, option.option as OptionGroup);
      const collapsed = groupIndex !== -1 && collapsedGroups.has(groupIndex);
      currentGroupCollapsed = collapsed;
      option.collapsible = true;
      option.expanded = !collapsed;
      result.push(option);
    } else if (option.type === 'child') {
      if (!currentGroupCollapsed) {
        result.push(option);
      }
    } else {
      currentGroupCollapsed = false;
      result.push(option);
    }
  }

  generateTestIndexes(result, parentMap.get.bind(parentMap));

  return result;
}
