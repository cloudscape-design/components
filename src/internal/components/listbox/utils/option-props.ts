// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { DropdownOption } from '../../option/interfaces';
import { isGroup } from '../../option/utils/filter-options';
import { getOptionId } from '../../options-list/utils/use-ids';
import { SelectionModel } from '../selection/interfaces';

/** Group headers can be highlighted only when groups are interactive. */
export const isHighlightable = (option: DropdownOption | undefined, interactiveGroups: boolean) =>
  !!option && (interactiveGroups || option.type !== 'parent');

interface OptionPropsContext {
  /** Rendered options, in list order. */
  options: ReadonlyArray<DropdownOption>;
  /** Selected options, connected to the rendered options by `connectOptionsByValue`. */
  selectedSet: ReadonlySet<DropdownOption>;
  selection: SelectionModel;
  highlightedOption: DropdownOption | undefined;
  interactiveGroups: boolean;
  listId: string;
}

// Only group neighbours use group state. Select-all never counts as a selected neighbour, so the row
// below it doesn't get the previous-item-selected style.
const isSelectedNeighbour = (
  option: DropdownOption | undefined,
  { selectedSet, selection }: Pick<OptionPropsContext, 'selectedSet' | 'selection'>
) =>
  !!option && isGroup(option.option)
    ? selection.getGroupState(option).selected
    : selectedSet.has(option as DropdownOption);

/** Props for one listbox row. */
export function getListboxOptionProps(option: DropdownOption, index: number, context: OptionPropsContext) {
  const { options, selectedSet, selection, highlightedOption, interactiveGroups, listId } = context;
  const isSelectAll = option.type === 'select-all';
  const groupState = isSelectAll || isGroup(option.option) ? selection.getGroupState(option) : undefined;
  const selected = isSelectAll ? !!groupState?.selected : selectedSet.has(option) || !!groupState?.selected;
  const optionProps: any = {
    key: index,
    option,
    highlighted: option === highlightedOption,
    selected,
    isNextSelected: isSelectedNeighbour(options[index + 1], context),
    isPreviousSelected: isSelectedNeighbour(options[index - 1], context),
    indeterminate: !!groupState?.indeterminate,
    ['data-mouse-target']: isHighlightable(option, interactiveGroups) ? index : -1,
    id: getOptionId(listId, index),
  };
  return optionProps;
}

/** The option to choose: `option`, or the highlighted option when omitted. Undefined when it isn't interactive. */
export const getSelectableOption = (
  option: DropdownOption | undefined,
  highlightedOption: DropdownOption | undefined,
  interactivityCheck: (option: DropdownOption) => boolean
) => {
  const optionToSelect = option || highlightedOption;
  return optionToSelect && interactivityCheck(optionToSelect) ? optionToSelect : undefined;
};

interface ListMouseHandlersProps {
  options: ReadonlyArray<DropdownOption>;
  selectOption: (option: DropdownOption) => void;
  setHighlightedIndexWithMouse: (index: number) => void;
}

/** Mouse handlers for the list. An item index of -1 means the pointer isn't over a highlightable option. */
export const getListMouseHandlers = ({
  options,
  selectOption,
  setHighlightedIndexWithMouse,
}: ListMouseHandlersProps) => ({
  onMouseUp: (itemIndex: number) => {
    if (itemIndex > -1) {
      selectOption(options[itemIndex]);
    }
  },
  onMouseMove: (itemIndex: number) => {
    if (itemIndex > -1) {
      setHighlightedIndexWithMouse(itemIndex);
    }
  },
});

/** Whether the live region announces the highlighted option as selected. */
export const isAnnouncedSelected = (
  highlightedOption: DropdownOption | undefined,
  selectedSet: ReadonlySet<DropdownOption>,
  selection: SelectionModel
) =>
  !!highlightedOption &&
  (selectedSet.has(highlightedOption) ||
    (isGroup(highlightedOption.option) && selection.getGroupState(highlightedOption).selected));
