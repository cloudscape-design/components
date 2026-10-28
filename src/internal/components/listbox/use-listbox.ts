// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useRef, useState } from 'react';

import { useUniqueId } from '@cloudscape-design/component-toolkit/internal';

import { BaseKeyDetail, CancelableEventHandler } from '../../../types/events';
import { OptionDefinition, OptionGroup } from '../../../types/option';
import { KeyCode } from '../../keycode';
import { DropdownOption } from '../option/interfaces';
import { isGroup, isGroupInteractive, isInteractive } from '../option/utils/filter-options';
import { OptionsListProps } from '../options-list';
import { HighlightType, useHighlightedOption } from '../options-list/utils/use-highlight-option';
import { getOptionId } from '../options-list/utils/use-ids';
import { useMenuKeyboard } from '../options-list/utils/use-keyboard';
import { ItemProps } from './parts/item';
import { SelectionModel } from './selection/interfaces';
import { useAnnouncement } from './use-announcement';
import { useTypeAhead } from './use-type-ahead';
import { connectOptionsByValue } from './utils/connect-options';

export type ListElementProps = Omit<OptionsListProps, 'children'> & { ref: React.RefObject<HTMLDivElement> };
export type GetOptionProps = (option: DropdownOption, index: number) => ItemProps;

export interface UseListboxProps {
  /** Visible options. Filtering is the caller's job. */
  options: ReadonlyArray<DropdownOption>;
  selection: SelectionModel;
  /** Called with the full next selection when the user chooses an option. */
  onChange: (selectedOptions: ReadonlyArray<OptionDefinition>) => void;
  /** Returns the group of a child option, used by announcements. */
  getParent?: (option: DropdownOption) => OptionGroup | undefined;
  i18nStrings?: { selectedAriaLabel?: string };
}

export interface UseListboxApi {
  selection: SelectionModel;
  listId: string;
  listRef: React.RefObject<HTMLDivElement>;
  highlightedIndex: number;
  highlightType: HighlightType;
  /** Changes on every keyboard highlight request, even one that keeps the highlighted index. */
  scrollRequest: number;
  /** Live-region text for the highlighted option. */
  announcement: string;

  /** Chooses `option`, or the highlighted option when omitted. Ignores non-interactive options. */
  selectOption(option?: DropdownOption): void;

  /**
   * Spread onto the list. The list is rendered inline: it is a tab stop and handles keyboard, mouse, focus, blur
   * and aria-activedescendant.
   */
  getListProps(): ListElementProps;
  getOptionProps: GetOptionProps;
  /** Type-ahead handler. Attach to a container of the list. */
  onTypeAhead(event: React.KeyboardEvent): void;
}

const noParent = () => undefined;

// Options are recreated when the consumer's options change, so they are matched by `value`, which must be unique.
// Group headers are compared only with group headers, so a group and an option sharing a value don't match.
// Without a value there is nothing stable to match by.
const isSameOption = (a: DropdownOption, b: DropdownOption) =>
  a.option.value !== undefined && a.option.value === b.option.value && (a.type === 'parent') === (b.type === 'parent');

export function useListbox({
  options,
  selection,
  onChange,
  getParent = noParent,
  i18nStrings,
}: UseListboxProps): UseListboxApi {
  const { interactiveGroups, selectionType } = selection;
  const interactivityCheck = interactiveGroups ? isGroupInteractive : isInteractive;
  const isHighlightable = (option?: DropdownOption) => !!option && (interactiveGroups || option.type !== 'parent');

  const listRef = useRef<HTMLDivElement>(null);
  const listId = useUniqueId('option-list');
  const pointerDown = useRef(false);

  const connectedSelected = connectOptionsByValue(options, selection.selectedOptions);
  const connectedSelectedSet = new Set(connectedSelected);

  const [
    { highlightType, highlightedOption, highlightedIndex },
    {
      moveHighlightWithKeyboard,
      resetHighlightWithKeyboard,
      setHighlightedIndexWithMouse,
      highlightOptionWithKeyboard,
      goHomeWithKeyboard,
      goEndWithKeyboard,
    },
  ] = useHighlightedOption({ options, isHighlightable });
  const highlightedOptionId = highlightedOption ? getOptionId(listId, highlightedIndex) : undefined;

  // The highlight is stored as an index, so when the options change it must follow the highlighted option to its
  // new index, or be cleared when that option is gone. This runs during render (the "previous props" pattern), so a
  // stale index is never committed. It keeps the highlight type and doesn't request a scroll.
  const [previousOptions, setPreviousOptions] = useState(options);
  if (previousOptions !== options) {
    setPreviousOptions(options);
    const previousHighlighted = previousOptions[highlightedIndex];
    const nextIndex = previousHighlighted
      ? options.findIndex(option => isSameOption(option, previousHighlighted) && isHighlightable(option))
      : -1;
    if (nextIndex === -1) {
      if (highlightedIndex !== -1) {
        resetHighlightWithKeyboard();
      }
    } else if (nextIndex !== highlightedIndex) {
      if (highlightType.type === 'mouse') {
        setHighlightedIndexWithMouse(nextIndex, highlightType.moveFocus);
      } else {
        highlightOptionWithKeyboard(options[nextIndex]);
      }
    }
  }

  // Counts keyboard highlight requests. A request that keeps the highlighted index (End again after scrolling
  // away, or a keyboard highlight of the hovered option) changes no highlight state, so this is what tells the
  // list to scroll again. Mouse highlights don't count.
  const [scrollRequest, setScrollRequest] = useState(0);
  const requestScroll = () => setScrollRequest(count => count + 1);
  const withScroll =
    <Args extends unknown[]>(highlight: (...args: Args) => void) =>
    (...args: Args) => {
      highlight(...args);
      requestScroll();
    };
  const moveHighlight = withScroll(moveHighlightWithKeyboard);
  const highlightOption = withScroll(highlightOptionWithKeyboard);
  const goHome = withScroll(goHomeWithKeyboard);
  const goEnd = withScroll(goEndWithKeyboard);

  const selectOption = (option?: DropdownOption) => {
    const optionToSelect = option || highlightedOption;
    if (!optionToSelect || !interactivityCheck(optionToSelect)) {
      return;
    }
    onChange(selection.getNextSelection(optionToSelect));
  };

  const menuKeyDownHandler = useMenuKeyboard({
    goUp: () => {
      if (
        (!interactiveGroups && highlightedOption?.type === 'child' && highlightedIndex === 1) ||
        highlightedIndex === 0
      ) {
        goEnd();
        return;
      }
      moveHighlight(-1);
    },
    goDown: () => {
      if (highlightedIndex === options.length - 1) {
        goHome();
        return;
      }
      moveHighlight(1);
    },
    selectOption: () => selectOption(),
    goHome,
    goEnd,
    // When the list has focus, Space always chooses.
    preventNativeSpace: true,
  });
  const listKeyDownHandler: CancelableEventHandler<BaseKeyDetail> = event => {
    // The focused list sits inside a scroll container or the page, so the browser's own Home/End scrolling would
    // also scroll that container to its top or bottom, racing the scroll that brings the highlighted option into
    // view. Arrow keys are already prevented by the shared handler.
    if (event.detail.keyCode === KeyCode.home || event.detail.keyCode === KeyCode.end) {
      event.preventDefault();
    }
    menuKeyDownHandler(event);
  };

  const getListProps = (): ListElementProps => ({
    id: listId,
    ref: listRef,
    open: true,
    embedded: true,
    isMultiSelect: selectionType === 'multi' || undefined,
    onMouseUp: itemIndex => {
      if (itemIndex > -1) {
        selectOption(options[itemIndex]);
      }
    },
    onMouseMove: itemIndex => {
      if (itemIndex > -1) {
        setHighlightedIndexWithMouse(itemIndex);
      }
    },
    onKeyDown: listKeyDownHandler,
    nativeAttributes: {
      'aria-activedescendant': highlightedOptionId,
      // Focus caused by a click is followed by mouse highlight and selection, so skip the keyboard highlight.
      // Only a mousedown that moves focus into the list counts: on an already focused list no focus event
      // follows, and the flag would leak into the next programmatic or keyboard focus.
      onMouseDown: () => (pointerDown.current = listRef.current !== document.activeElement),
    },
    onFocus: () => {
      const fromPointer = pointerDown.current;
      pointerDown.current = false;
      if (fromPointer || highlightedOption) {
        return;
      }
      // The first selected option in list order, not selection order, as the ARIA listbox pattern describes.
      const selectedOption = options.find(option => connectedSelectedSet.has(option));
      if (selectedOption) {
        highlightOption(selectedOption);
      } else {
        goHome();
      }
    },
    onBlur: () => {
      pointerDown.current = false;
      resetHighlightWithKeyboard();
    },
    onMouseLeave: () => {
      if (listRef.current !== document.activeElement) {
        resetHighlightWithKeyboard();
      }
    },
  });

  const isSelectedAt = (index: number) => {
    const option = options[index]?.option;
    return !!option && isGroup(option)
      ? selection.getGroupState(options[index]).selected
      : connectedSelectedSet.has(options[index]);
  };

  const getOptionProps = (option: DropdownOption, index: number) => {
    const groupState = isGroup(option.option) ? selection.getGroupState(option) : undefined;
    const optionProps: any = {
      key: index,
      option,
      highlighted: option === highlightedOption,
      selected: connectedSelectedSet.has(option) || !!groupState?.selected,
      isNextSelected: isSelectedAt(index + 1),
      isPreviousSelected: isSelectedAt(index - 1),
      indeterminate: !!groupState?.indeterminate,
      ['data-mouse-target']: isHighlightable(option) ? index : -1,
      id: getOptionId(listId, index),
    };
    return optionProps;
  };

  const announceSelected =
    !!highlightedOption &&
    (connectedSelectedSet.has(highlightedOption) ||
      (isGroup(highlightedOption.option) && selection.getGroupState(highlightedOption).selected));

  const announcement = useAnnouncement({
    announceSelected,
    highlightedOption,
    getParent,
    selectedAriaLabel: i18nStrings?.selectedAriaLabel,
  });

  const onTypeAhead = useTypeAhead({
    isEnabled: true,
    options,
    highlightOption,
    highlightedOption: highlightedOption?.option,
    interactiveGroups,
  });

  return {
    selection,
    listId,
    listRef,
    highlightedIndex,
    highlightType,
    scrollRequest,
    announcement,
    selectOption,
    getListProps,
    getOptionProps,
    onTypeAhead,
  };
}
