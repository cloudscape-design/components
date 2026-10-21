// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { OptionDefinition } from '../../../../types/option';
import { DropdownOption } from '../../option/interfaces';

export type SelectionType = 'single' | 'multi';

export interface GroupState {
  selected: boolean;
  indeterminate: boolean;
}

/**
 * Describes how a list selects options. Covers what the `useInteractiveGroups`, `checkboxes` and
 * `isMultiSelect` flags express today. Implementations are pure functions of their inputs.
 */
export interface SelectionModel {
  /** Drives aria-multiselectable and the row style. */
  selectionType: SelectionType;
  /** Whether group headers (and select-all) can be highlighted and chosen. */
  interactiveGroups: boolean;
  /**
   * The selected options. Rows are matched to them by `value` (the first option with a matching value wins),
   * so this is the single source of truth for which rows render as selected.
   */
  selectedOptions: ReadonlyArray<OptionDefinition>;

  /** For group headers and select-all. */
  getGroupState(option: DropdownOption): GroupState;
  /** Returns the selection that results from the user choosing `option`. */
  getNextSelection(option: DropdownOption): ReadonlyArray<OptionDefinition>;
}
