// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { RefObject, useEffect, useRef } from 'react';

import { useUniqueId } from '@cloudscape-design/component-toolkit/internal';

import { SelectProps } from '../../../select/interfaces';
import { BaseKeyDetail, CancelableEventHandler } from '../../../types/events';
import { OptionDefinition, OptionGroup } from '../../../types/option';
import { KeyCode } from '../../keycode';
import { DropdownOption } from '../option/interfaces';
import { isGroupInteractive, isInteractive } from '../option/utils/filter-options';
import {
  HighlightedOptionHandlers,
  HighlightType,
  useHighlightedOption,
} from '../options-list/utils/use-highlight-option';
import { getOptionId } from '../options-list/utils/use-ids';
import { useMenuKeyboard } from '../options-list/utils/use-keyboard';
import { ListElementProps, ScrollToIndexRef } from './interfaces';
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
  /** Called when Escape is pressed. When omitted, Escape is not handled and keeps propagating. */
  onEscape?: () => void;
  /** Group of the option, announced with the highlighted option. */
  getParent: (option: DropdownOption) => undefined | OptionGroup;
  /** Added to the announcement when the highlighted option is selected. */
  selectedAriaLabel?: string;
  /** Custom announcement for the highlighted option. */
  renderHighlightedAriaLive?: SelectProps.ContainingOptionAndGroupString;
}

export type BaseListProps = Pick<
  ListElementProps,
  'id' | 'ref' | 'onMouseUp' | 'onMouseMove' | 'onKeyDown' | 'onFocus' | 'onBlur' | 'nativeAttributes'
>;
export interface UseListboxApi {
  /** Id of the list element; row ids are `getOptionId(listId, index)`. */
  listId: string;
  highlightedIndex: number;
  highlightType: HighlightType;
  highlightedOption: DropdownOption | undefined;
  /** Id of the highlighted row, for `aria-activedescendant`; undefined when `highlightedIndex` is -1. */
  activeDescendantId: string | undefined;
  /** Pass as `ref` to the list; it is called with `highlightedIndex` whenever the highlighted index changes. */
  scrollToIndex: RefObject<ScrollToIndexRef>;
  /** `selectedOptions` connected to rendered rows, in selection order. */
  selectedOptions: ReadonlyArray<DropdownOption>;
  /** Raw highlight setters from `useHighlightedOption`. */
  highlight: HighlightedOptionHandlers<DropdownOption>;
  /** Chooses `option`, or the highlighted option when omitted. Ignores non-interactive options. */
  selectOption(option?: DropdownOption): void;
  /**
   * Keydown handler for a filter input that controls the list. Home and End keep their native action there, to move
   * the text cursor. The list element gets its own handler from `getListProps({ withKeyboard: true })`, which
   * prevents the native Home and End action.
   */
  onKeyDown: CancelableEventHandler<BaseKeyDetail>;
  /** `onMouseUp` / `onMouseMove` for the list element. */
  mouseHandlers: ReturnType<typeof getListMouseHandlers>;
  /** Ref of the list element, also set by `getListProps`. */
  listRef: RefObject<HTMLDivElement>;
  /**
   * Base props for the list element: id, ref and mouse handlers. With `withKeyboard`, also `onKeyDown` and
   * `aria-activedescendant`, for a list that has focus itself (not through a filter input). This `onKeyDown`
   * prevents the native Home and End action, so they don't scroll the page or a scroll container. With `embedded`, also
   * `onFocus` and `onBlur`, for an embedded list: an always visible list that is a tab stop. Focus highlights the
   * first selected option (in selection order), or the first option when nothing is selected, and blur clears the
   * highlight. A hover highlight is kept on focus, so a click selects the hovered option.
   * Callers that add native attributes spread `nativeAttributes`.
   */
  getListProps(options: { withKeyboard: boolean; embedded?: boolean }): BaseListProps;
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
 * Focus handling of an embedded list is shared through `getListProps({ embedded })`. Open state, filter,
 * type-ahead and the highlight on open stay with the callers, because they differ per component.
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

  // Shared by the list element and a filter input. In a filter input, Home and End also move the text cursor.
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
    onEscape,
    // With 'keyboard-highlight', Space chooses only while an option has a keyboard highlight, and types otherwise.
    preventNativeSpace: spaceSelects === 'always' || (!!highlightedOption && highlightType.type === 'keyboard'),
  });
  // On the list element, Home and End only move the highlight, so they don't scroll the page or a scroll container.
  const onListKeyDown: CancelableEventHandler<BaseKeyDetail> = event => {
    if (event.detail.keyCode === KeyCode.home || event.detail.keyCode === KeyCode.end) {
      event.preventDefault();
    }
    onKeyDown(event);
  };

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
  const scrollToIndex = useRef<ScrollToIndexRef>(null);
  useEffect(() => {
    scrollToIndex.current?.(highlightedIndex);
  }, [highlightedIndex]);

  const listRef = useRef<HTMLDivElement>(null);
  const getListProps = ({ withKeyboard, embedded }: { withKeyboard: boolean; embedded?: boolean }) => {
    const listProps: BaseListProps = { id: listId, ref: listRef, ...mouseHandlers };
    if (withKeyboard) {
      listProps.onKeyDown = onListKeyDown;
      listProps.nativeAttributes = { 'aria-activedescendant': activeDescendantId };
    }
    if (embedded) {
      // Like opening Select or Multiselect with the keyboard: highlight the first selected option (in selection
      // order) and scroll it into view, or the first option when nothing in the list is selected.
      listProps.onFocus = () => {
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
      listProps.onBlur = () => {
        highlight.resetHighlightWithKeyboard();
      };
    }
    return listProps;
  };

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
    listRef,
    getListProps,
    getOptionProps,
    announceSelected,
    announcement,
  };
}
