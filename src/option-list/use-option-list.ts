// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ListElementProps } from '../internal/components/listbox/interfaces';
import { SelectionModel } from '../internal/components/listbox/selection/interfaces';
import { useListbox, UseListboxProps } from '../internal/components/listbox/use-listbox';
import { useTypeAhead } from '../internal/components/listbox/use-type-ahead';
import { DropdownOption } from '../internal/components/option/interfaces';

interface UseOptionListProps
  extends Pick<UseListboxProps, 'getParent' | 'selectedAriaLabel' | 'renderHighlightedAriaLive'> {
  /** Flattened options in list order. */
  options: ReadonlyArray<DropdownOption>;
  selection: SelectionModel;
  /** Called with the interactive option the user chose. */
  onSelect: (option: DropdownOption) => void;
}

/**
 * The list state of OptionList: the shared `useListbox` with OptionList's settings, plus the parts of a list that is
 * always visible. The list is a tab stop; keyboard, mouse and aria-activedescendant come from `useListbox`.
 * This hook adds focus and blur, the mouse-leave reset and type-ahead.
 */
export function useOptionList({
  options,
  selection,
  onSelect,
  getParent,
  selectedAriaLabel,
  renderHighlightedAriaLive,
}: UseOptionListProps) {
  const {
    listRef,
    getListProps,
    scrollToIndex,
    highlightType,
    announcement,
    getOptionProps,
    highlightedOption,
    highlight,
    selectedOptions,
  } = useListbox({
    options,
    selectedOptions: selection.selectedOptions,
    selection,
    interactiveGroups: selection.interactiveGroups,
    onSelect,
    // When the list has focus, Space always chooses.
    spaceSelects: 'always',
    getParent,
    selectedAriaLabel,
    renderHighlightedAriaLive,
  });

  // Focus entry, like opening Select or Multiselect with the keyboard: highlight the first selected option (in
  // selection order) and scroll it into view, or the first option when nothing in the list is selected.
  // A highlight that is already there, such as a hover highlight, is kept, so a click selects the hovered option.
  const onFocus = () => {
    if (highlightedOption) {
      return;
    }
    const firstSelected = selectedOptions.find(option => options.includes(option));
    if (firstSelected) {
      highlight.highlightOptionWithKeyboard(firstSelected);
    } else {
      highlight.goHomeWithKeyboard();
    }
  };

  const listProps: ListElementProps = {
    ...getListProps({ withKeyboard: true }),
    onFocus,
    // Like closing Select or Multiselect, leaving the list clears the highlight.
    onBlur: () => highlight.resetHighlightWithKeyboard(),
    open: true,
    // The list element is a tab stop without dropdown corners.
    embedded: true,
    isMultiSelect: selection.selectionType === 'multi' || undefined,
  };

  // Attached to the root, not the list, so leaving the whole component clears a hover highlight.
  const onMouseLeave = () => {
    if (listRef.current !== document.activeElement) {
      highlight.resetHighlightWithKeyboard();
    }
  };

  const onTypeAhead = useTypeAhead({
    isEnabled: true,
    options,
    highlightOption: highlight.highlightOptionWithKeyboard,
    highlightedOption: highlightedOption?.option,
    interactiveGroups: selection.interactiveGroups,
  });

  return {
    listRef,
    listProps,
    scrollToIndex,
    highlightType,
    announcement,
    getOptionProps,
    getRootProps: () => ({ onKeyDown: onTypeAhead, onMouseLeave }),
  };
}
