// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { RefObject, useEffect, useRef } from 'react';

import { useUniqueId } from '@cloudscape-design/component-toolkit/internal';

import { SelectProps } from '../../../select/interfaces';
import { BaseKeyDetail, CancelableEventHandler } from '../../../types/events';
import { OptionDefinition, OptionGroup } from '../../../types/option';
import { DropdownOption } from '../option/interfaces';
import { isGroupInteractive, isInteractive } from '../option/utils/filter-options';
import {
  HighlightedOptionHandlers,
  HighlightType,
  useHighlightedOption,
} from '../options-list/utils/use-highlight-option';
import { getOptionId } from '../options-list/utils/use-ids';
import { useMenuKeyboard } from '../options-list/utils/use-keyboard';
import { SelectListProps } from './parts/plain-list';
import { SelectionModel } from './selection/interfaces';
import { useAnnouncement } from './use-announcement';
import { connectOptionsByValue } from './utils/connect-options';
import { getListboxNavigation } from './utils/navigation';
import {
  getListboxOptionProps,
  getListMouseHandlers,
  getSelectableOption,
  isAnnouncedSelected,
  isHighlightable,
} from './utils/option-props';

export interface UseListboxProps {
  /** Rendered options in list order (flattened, filtered, including select-all). */
  options: ReadonlyArray<DropdownOption>;
  /** Selected options, matched to the rendered rows by value. */
  selectedOptions: ReadonlyArray<OptionDefinition>;
  /** Group and select-all state. */
  selection: SelectionModel;
  /** Whether group headers (and select-all) can be highlighted and chosen. */
  interactiveGroups: boolean;
  /** Called with the interactive option the user chose (Enter, Space, mouse up, or `selectOption`). */
  onSelect: (option: DropdownOption) => void;
  /**
   * 'always': Space always chooses the highlighted option.
   * 'keyboard-highlight': Space chooses only while an option has a keyboard highlight, so it still types into a
   * filter input.
   */
  spaceSelects: 'always' | 'keyboard-highlight';
  /** Called when Escape is pressed. */
  onEscape: () => void;
  /** Group of the option, announced with the highlighted option. */
  getParent: (option: DropdownOption) => undefined | OptionGroup;
  /** Added to the announcement when the highlighted option is selected. */
  selectedAriaLabel?: string;
  /** Custom announcement for the highlighted option. */
  renderHighlightedAriaLive?: SelectProps.ContainingOptionAndGroupString;
}

export interface UseListboxApi {
  /** Id of the list element; row ids are `getOptionId(listId, index)`. */
  listId: string;
  highlightedIndex: number;
  highlightType: HighlightType;
  highlightedOption: DropdownOption | undefined;
  /** Id of the highlighted row, for `aria-activedescendant`; undefined when nothing is highlighted. */
  activeDescendantId: string | undefined;
  /** Pass as `ref` to the list; it is called with `highlightedIndex` whenever the highlight changes. */
  scrollToIndex: RefObject<SelectListProps.SelectListRef>;
  /** `selectedOptions` connected to rendered rows, in selection order. */
  selectedOptions: ReadonlyArray<DropdownOption>;
  /** Raw highlight setters from `useHighlightedOption`. */
  highlight: HighlightedOptionHandlers<DropdownOption>;
  /** Chooses `option`, or the highlighted option when omitted. Ignores non-interactive options. */
  selectOption(option?: DropdownOption): void;
  /** Keydown handler for the element that has focus (list or filter input). */
  onKeyDown: CancelableEventHandler<BaseKeyDetail>;
  /** `onMouseUp` / `onMouseMove` for the list element. */
  mouseHandlers: ReturnType<typeof getListMouseHandlers>;
  /** Props for the row at `index`. */
  getOptionProps(option: DropdownOption, index: number): ReturnType<typeof getListboxOptionProps>;
  /** Whether the live region announces the highlighted option as selected. */
  announceSelected: boolean;
  /** Live region text for the highlighted option. */
  announcement: string;
}

/**
 * List state shared by all list components: highlight, keyboard navigation, the choose guard, mouse handlers,
 * row props, scrolling the highlighted row into view, the active descendant and the live region announcement.
 * Focus, open state, filter, type-ahead and the highlight on open stay with the callers, because they differ
 * per component.
 */
export function useListbox({
  options,
  selectedOptions: selectedOptionsProp,
  selection,
  interactiveGroups,
  onSelect,
  spaceSelects,
  onEscape,
  getParent,
  selectedAriaLabel,
  renderHighlightedAriaLive,
}: UseListboxProps): UseListboxApi {
  const listId = useUniqueId('option-list');
  const selectedOptions = connectOptionsByValue(options, selectedOptionsProp);
  const selectedSet = new Set(selectedOptions);
  const [{ highlightType, highlightedOption, highlightedIndex }, highlight] = useHighlightedOption({
    options,
    isHighlightable: (option?: DropdownOption) => isHighlightable(option, interactiveGroups),
  });

  const interactivityCheck = interactiveGroups ? isGroupInteractive : isInteractive;
  const selectOption = (option?: DropdownOption) => {
    const optionToSelect = getSelectableOption(option, highlightedOption, interactivityCheck);
    if (optionToSelect) {
      onSelect(optionToSelect);
    }
  };

  const onKeyDown = useMenuKeyboard({
    ...getListboxNavigation({
      options,
      highlightedIndex,
      highlightedOption,
      interactiveGroups,
      moveHighlight: highlight.moveHighlightWithKeyboard,
      goHome: highlight.goHomeWithKeyboard,
      goEnd: highlight.goEndWithKeyboard,
    }),
    selectOption,
    goHome: highlight.goHomeWithKeyboard,
    goEnd: highlight.goEndWithKeyboard,
    closeDropdown: onEscape,
    // With 'keyboard-highlight', Space chooses only while an option has a keyboard highlight, and types otherwise.
    preventNativeSpace: spaceSelects === 'always' || (!!highlightedOption && highlightType.type === 'keyboard'),
  });

  const mouseHandlers = getListMouseHandlers({
    options,
    selectOption,
    setHighlightedIndexWithMouse: highlight.setHighlightedIndexWithMouse,
  });

  const getOptionProps = (option: DropdownOption, index: number) =>
    getListboxOptionProps(option, index, {
      options,
      selectedSet,
      selection,
      highlightedOption,
      interactiveGroups,
      listId,
    });

  const announceSelected = isAnnouncedSelected(highlightedOption, selectedSet, selection);
  const announcement = useAnnouncement({
    announceSelected,
    highlightedOption,
    getParent,
    selectedAriaLabel,
    renderHighlightedAriaLive,
  });

  const activeDescendantId = getOptionId(listId, highlightedIndex);

  // Keeps the highlighted option scrolled into view in the list passed `ref={scrollToIndex}`.
  const scrollToIndex = useRef<SelectListProps.SelectListRef>(null);
  useEffect(() => {
    scrollToIndex.current?.(highlightedIndex);
  }, [highlightedIndex]);

  return {
    listId,
    highlightedIndex,
    highlightType,
    highlightedOption,
    activeDescendantId,
    scrollToIndex,
    selectedOptions,
    highlight,
    selectOption,
    onKeyDown,
    mouseHandlers,
    getOptionProps,
    announceSelected,
    announcement,
  };
}
