// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useRef } from 'react';

import { useStableCallback, useUniqueId } from '@cloudscape-design/component-toolkit/internal';

import type { SelectProps } from '../../../select/interfaces';
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
  /** Called after an option is chosen. The select dropdown uses this to close. */
  onSelectOption?: (option: DropdownOption) => void;
  /** Called on Escape. When omitted, Escape is not handled and keeps propagating. */
  onEscape?: () => void;
  /**
   * The list is rendered inline instead of inside a dropdown: it is a tab stop, handles its own focus and blur,
   * and clears the highlight on blur. Defaults to `true`.
   */
  embedded?: boolean;
  /**
   * Embedded only. Picks the focus and pointer rules of an embedded list. Each variant keeps the behaviour its
   * component had before the list engine was shared.
   *
   * - `default` (used by the public OptionList): no highlight until the user interacts. Keyboard focus highlights the selected option,
   *   or the first one. Focus from a click adds no keyboard highlight. Leaving an unfocused list with the pointer
   *   clears the highlight.
   * - `embedded-multiselect`: on mount, highlights the selected option (or the first one) the way an opening
   *   dropdown does. Keyboard focus highlights the first option only when nothing is highlighted.
   */
  embeddedBehavior?: 'default' | 'embedded-multiselect';
  /** Type-ahead on the list. Defaults to `embedded`. */
  typeAhead?: boolean;
  /** Returns the group of a child option, used by announcements. */
  getParent?: (option: DropdownOption) => OptionGroup | undefined;
  renderHighlightedAriaLive?: SelectProps.ContainingOptionAndGroupString;
  i18nStrings?: { selectedAriaLabel?: string };
}

export interface UseListboxApi {
  selection: SelectionModel;
  listId: string;
  listRef: React.RefObject<HTMLDivElement>;
  highlightedOption: DropdownOption | undefined;
  highlightedIndex: number;
  highlightType: HighlightType;
  /** Whether the highlighted option is selected. */
  announceSelected: boolean;
  /** Live-region text for the highlighted option. */
  announcement: string;

  /** Programmatic highlight. A mouse-source highlight still scrolls the option into view. */
  highlightOption(option: DropdownOption, source: HighlightType['type']): void;
  highlightFirstOption(source: HighlightType['type']): void;
  clearHighlight(): void;
  /** Chooses `option`, or the highlighted option when omitted. Ignores non-interactive options. */
  selectOption(option?: DropdownOption): void;
  selectHighlightedOption(): void;

  /** Spread onto the list. Includes keyboard, mouse, focus/blur and aria-activedescendant. */
  getListProps(): ListElementProps;
  getOptionProps: GetOptionProps;
  /**
   * Props for an input that keeps focus while it drives the list (combobox pattern), such as the filter.
   * When used, the caller does not spread the keyboard part of getListProps.
   */
  getComboboxInputProps(): {
    onKeyDown: CancelableEventHandler<BaseKeyDetail>;
    ariaActiveDescendant: string | undefined;
  };
  /** Type-ahead handler. Attach to a container of the list. No-op when type-ahead is off. */
  onTypeAhead(event: React.KeyboardEvent): void;
}

const noParent = () => undefined;

export function useListbox({
  options,
  selection,
  onChange,
  onSelectOption,
  onEscape,
  embedded = true,
  embeddedBehavior = 'default',
  typeAhead = embedded,
  getParent = noParent,
  renderHighlightedAriaLive,
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
      highlightFirstOptionWithMouse,
      goHomeWithKeyboard,
      goEndWithKeyboard,
    },
  ] = useHighlightedOption({ options, isHighlightable });
  const highlightedOptionId = getOptionId(listId, highlightedIndex);
  const isDefaultBehavior = embeddedBehavior === 'default';

  // Embedded Multiselect used to be a dropdown that starts open, so it highlighted an option on mount with the
  // mouse highlight style (which also scrolls it into view). This runs once, after the first render.
  const mountHighlightDone = useRef(false);
  useEffect(() => {
    if (mountHighlightDone.current) {
      return;
    }
    mountHighlightDone.current = true;
    if (!embedded || isDefaultBehavior || options.length === 0) {
      return;
    }
    const selectedOption = connectedSelected[0];
    if (!selectedOption || !options.includes(selectedOption)) {
      highlightFirstOptionWithMouse();
    } else {
      setHighlightedIndexWithMouse(options.indexOf(selectedOption), true);
    }
  });

  const stableOnSelectOption = useStableCallback((option: DropdownOption) => onSelectOption?.(option));

  const selectOption = (option?: DropdownOption) => {
    const optionToSelect = option || highlightedOption;
    if (!optionToSelect || !interactivityCheck(optionToSelect)) {
      return;
    }
    onChange(selection.getNextSelection(optionToSelect));
    stableOnSelectOption(optionToSelect);
  };

  const highlightOption = (option: DropdownOption, source: HighlightType['type']) => {
    if (source === 'keyboard') {
      highlightOptionWithKeyboard(option);
    } else {
      setHighlightedIndexWithMouse(options.indexOf(option), true);
    }
  };

  const highlightFirstOption = (source: HighlightType['type']) =>
    source === 'keyboard' ? goHomeWithKeyboard() : highlightFirstOptionWithMouse();

  const navigation = {
    goUp: () => {
      if (
        (!interactiveGroups && highlightedOption?.type === 'child' && highlightedIndex === 1) ||
        highlightedIndex === 0
      ) {
        goEndWithKeyboard();
        return;
      }
      moveHighlightWithKeyboard(-1);
    },
    goDown: () => {
      if (highlightedIndex === options.length - 1) {
        goHomeWithKeyboard();
        return;
      }
      moveHighlightWithKeyboard(1);
    },
    selectOption: () => selectOption(),
    goHome: goHomeWithKeyboard,
    goEnd: goEndWithKeyboard,
    closeDropdown: onEscape,
  };
  // When the list has focus, Space always chooses. In an input, Space types unless an option is keyboard-highlighted.
  const menuKeyDownHandler = useMenuKeyboard({ ...navigation, preventNativeSpace: true });
  const listKeyDownHandler: CancelableEventHandler<BaseKeyDetail> = event => {
    // The focused list sits inside a scroll container or the page, so the browser's own Home/End scrolling would
    // also scroll that container to its top or bottom, racing the scroll that brings the highlighted option into
    // view. Arrow keys are already prevented by the shared handler.
    if (event.detail.keyCode === KeyCode.home || event.detail.keyCode === KeyCode.end) {
      event.preventDefault();
    }
    menuKeyDownHandler(event);
  };
  const inputKeyDownHandler = useMenuKeyboard({
    ...navigation,
    preventNativeSpace: !!highlightedOption && highlightType.type === 'keyboard',
  });

  const getListProps = (): ListElementProps => {
    const listProps: ListElementProps = {
      id: listId,
      ref: listRef,
      open: true,
      embedded: embedded || undefined,
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
      nativeAttributes: { 'aria-activedescendant': highlightedOptionId },
    };
    if (embedded && isDefaultBehavior) {
      listProps.nativeAttributes = {
        ...listProps.nativeAttributes,
        // Focus caused by a click is followed by mouse highlight and selection, so skip the keyboard highlight.
        // Only a mousedown that moves focus into the list counts: on an already focused list no focus event
        // follows, and the flag would leak into the next programmatic or keyboard focus.
        onMouseDown: () => (pointerDown.current = listRef.current !== document.activeElement),
      };
      listProps.onFocus = () => {
        const fromPointer = pointerDown.current;
        pointerDown.current = false;
        if (fromPointer || highlightedOption) {
          return;
        }
        // The first selected option in list order, not selection order, as the ARIA listbox pattern describes.
        const selectedSet = new Set(connectedSelected);
        const selectedOption = options.find(option => selectedSet.has(option));
        if (selectedOption) {
          highlightOptionWithKeyboard(selectedOption);
        } else {
          goHomeWithKeyboard();
        }
      };
      listProps.onBlur = () => {
        pointerDown.current = false;
        resetHighlightWithKeyboard();
      };
      listProps.onMouseLeave = () => {
        if (listRef.current !== document.activeElement) {
          resetHighlightWithKeyboard();
        }
      };
    } else if (embedded) {
      listProps.onFocus = () => {
        if (!highlightedOption) {
          goHomeWithKeyboard();
        }
      };
      listProps.onBlur = () => resetHighlightWithKeyboard();
    }
    return listProps;
  };

  const getComboboxInputProps = () => ({
    onKeyDown: inputKeyDownHandler,
    ariaActiveDescendant: highlightedOptionId,
  });

  const isSelectedAt = (index: number) => {
    const option = options[index]?.option;
    return !!option && isGroup(option)
      ? selection.getGroupState(options[index]).selected
      : connectedSelectedSet.has(options[index]);
  };

  const getOptionProps = (option: DropdownOption, index: number) => {
    const isSelectAll = option.type === 'select-all';
    const groupState = isSelectAll || isGroup(option.option) ? selection.getGroupState(option) : undefined;
    const optionProps: any = {
      key: index,
      option,
      highlighted: option === highlightedOption,
      selected: isSelectAll ? groupState!.selected : connectedSelectedSet.has(option) || !!groupState?.selected,
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
    renderHighlightedAriaLive,
  });

  const onTypeAhead = useTypeAhead({
    isEnabled: typeAhead,
    options,
    highlightOption: option => highlightOptionWithKeyboard(option),
    highlightedOption: highlightedOption?.option,
    interactiveGroups,
  });

  return {
    selection,
    listId,
    listRef,
    highlightedOption,
    highlightedIndex,
    highlightType,
    announceSelected,
    announcement,
    highlightOption,
    highlightFirstOption,
    clearHighlight: resetHighlightWithKeyboard,
    selectOption,
    selectHighlightedOption: () => selectOption(),
    getListProps,
    getOptionProps,
    getComboboxInputProps,
    onTypeAhead,
  };
}
