// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { RefObject, useCallback } from 'react';
import { useEffect, useRef } from 'react';

import { useUniqueId } from '@cloudscape-design/component-toolkit/internal';

import { InternalDropdownProps } from '../../dropdown/internal';
import { ButtonTriggerProps } from '../../internal/components/button-trigger';
import { ListElementProps } from '../../internal/components/listbox/interfaces';
import { SelectionModel } from '../../internal/components/listbox/selection/interfaces';
import { singleSelection } from '../../internal/components/listbox/selection/single-selection';
import { useListbox } from '../../internal/components/listbox/use-listbox';
import { DropdownOption } from '../../internal/components/option/interfaces';
import { useTriggerKeyboard } from '../../internal/components/options-list/utils/use-keyboard';
import { useOpenState } from '../../internal/components/options-list/utils/use-open-state';
import { fireNonCancelableEvent } from '../../internal/events';
import useForwardFocus from '../../internal/hooks/forward-focus';
import { usePrevious } from '../../internal/hooks/use-previous';
import { DropdownStatusProps } from '../../types/dropdown-status';
import { NonCancelableEventHandler } from '../../types/events';
import { OptionDefinition, OptionGroup } from '../../types/option';
import { SelectProps } from '../interfaces';
import { FilterProps } from '../parts/filter';

interface UseSelectProps {
  selectedOptions: ReadonlyArray<OptionDefinition>;
  updateSelectedOption: (option: OptionDefinition) => void;
  options: ReadonlyArray<DropdownOption>;
  filteringType: string;
  keepOpen?: boolean;
  embedded?: boolean;
  onBlur?: NonCancelableEventHandler;
  onFocus?: NonCancelableEventHandler;
  externalRef: React.Ref<any>;
  fireLoadItems: (filteringText: string) => void;
  setFilteringValue?: (filteringText: string) => void;
  useInteractiveGroups?: boolean;
  statusType: DropdownStatusProps.StatusType;
  /**
   * Source of group and select-all state, built from `selectedOptions`.
   * Defaults to single selection over `selectedOptions`.
   */
  selection?: SelectionModel;
  toggleAll?: () => void;
  dropdownRole?: SelectProps.DropdownRole;
  /** Group of the option, announced with the highlighted option. Defaults to no group. */
  getParent?: (option: DropdownOption) => undefined | OptionGroup;
  selectedAriaLabel?: string;
  renderHighlightedAriaLive?: SelectProps.ContainingOptionAndGroupString;
}

export interface SelectTriggerProps extends ButtonTriggerProps {
  ref: RefObject<HTMLButtonElement>;
}

export function useSelect({
  selectedOptions,
  updateSelectedOption,
  options,
  filteringType,
  onBlur,
  onFocus,
  externalRef,
  keepOpen,
  embedded,
  fireLoadItems,
  setFilteringValue,
  useInteractiveGroups = false,
  statusType,
  selection = singleSelection(selectedOptions),
  toggleAll,
  dropdownRole,
  getParent = () => undefined,
  selectedAriaLabel,
  renderHighlightedAriaLive,
}: UseSelectProps) {
  const filterRef = useRef<HTMLInputElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const hasFilter = filteringType !== 'none' && !embedded;
  // Filtering always renders a dialog; `dropdownRole` can additionally force dialog semantics without a filter.
  const isDialog = hasFilter || dropdownRole === 'dialog';

  // `onSelect` and `onEscape` run only on user events, after `closeDropdownIfNecessary` and `handleEscape` below
  // are declared.
  const listbox = useListbox({
    options,
    selectedOptions,
    selection,
    interactiveGroups: useInteractiveGroups,
    onSelect: option => {
      if (option.type === 'select-all' && toggleAll) {
        toggleAll();
      } else {
        updateSelectedOption(option.option);
      }
      closeDropdownIfNecessary();
    },
    // With a filter input, Space types into it unless an option has a keyboard highlight.
    spaceSelects: hasFilter ? 'keyboard-highlight' : 'always',
    onEscape: () => handleEscape(),
    getParent,
    selectedAriaLabel,
    renderHighlightedAriaLive,
  });
  const activeRef = hasFilter ? filterRef : listbox.listRef;
  const {
    listId: menuId,
    highlightType,
    highlightedOption,
    highlightedIndex,
    selectedOptions: __selectedOptions,
    highlight: {
      resetHighlightWithKeyboard,
      setHighlightedIndexWithMouse,
      highlightOptionWithKeyboard,
      highlightFirstOptionWithMouse,
      goHomeWithKeyboard,
    },
  } = listbox;

  const { isOpen, openDropdown, closeDropdown, toggleDropdown, openedWithKeyboard } = useOpenState({
    defaultOpen: embedded,
    onOpen: () => fireLoadItems(''),
    onClose: () => {
      resetHighlightWithKeyboard();
      setFilteringValue?.('');
    },
  });

  const handleFocus = () => {
    fireNonCancelableEvent(onFocus, {});
  };

  const handleBlur = () => {
    fireNonCancelableEvent(onBlur, {});
    closeDropdown();
  };

  const hasSelectedOption = __selectedOptions.length > 0;
  const dialogId = useUniqueId('dialog');

  const closeDropdownIfNecessary = () => {
    if (!keepOpen) {
      triggerRef.current?.focus();
      closeDropdown();
    }
  };

  const handleEscape = () => {
    if (!embedded) {
      triggerRef.current?.focus();
      closeDropdown();
    }
  };

  const triggerKeyDownHandler = useTriggerKeyboard({
    openDropdown: () => openDropdown(true),
    goHome: goHomeWithKeyboard,
  });

  const getDropdownProps: () => Pick<
    InternalDropdownProps,
    'onFocus' | 'onBlur' | 'dropdownContentId' | 'ariaRole'
  > = () => ({
    onFocus: handleFocus,
    onBlur: handleBlur,
    dropdownContentId: dialogId,
    ariaRole: isDialog ? 'dialog' : undefined,
  });

  const getTriggerProps = (disabled = false, autoFocus = false) => {
    const triggerProps: SelectTriggerProps = {
      ref: triggerRef,
      onFocus: () => closeDropdown(),
      autoFocus,
      ariaHasPopup: isDialog ? 'dialog' : 'listbox',
      ariaControls: isOpen ? (isDialog ? dialogId : menuId) : undefined,
    };
    if (!disabled) {
      triggerProps.onMouseDown = (event: CustomEvent) => {
        event.preventDefault(); // prevent current focus from blurring as it immediately closes the dropdown
        if (isOpen) {
          triggerRef.current?.focus();
        }
        toggleDropdown();
      };
      triggerProps.onKeyDown = triggerKeyDownHandler;
    }
    return triggerProps;
  };

  const getFilterProps = (): Partial<FilterProps> => {
    if (!hasFilter || !setFilteringValue) {
      return {};
    }

    return {
      ref: filterRef,
      onKeyDown: listbox.onKeyDown,
      onChange: event => {
        setFilteringValue(event.detail.value);
        resetHighlightWithKeyboard();
      },
      __onDelayedInput: event => {
        fireLoadItems(event.detail.value);
      },
      nativeInputAttributes: {
        'aria-activedescendant': listbox.activeDescendantId,
        ['aria-owns']: menuId,
        ['aria-controls']: menuId,
      },
    };
  };

  const getMenuProps = () => {
    const menuProps: ListElementProps = {
      ...listbox.getListProps({ withKeyboard: !hasFilter, embedded }),
      open: isOpen,
      statusType,
    };
    return menuProps;
  };

  const prevOpen = usePrevious<boolean>(isOpen);
  useEffect(() => {
    // highlight the first selected option, when opening the Select component without filter input
    // keep the focus in the filter input when opening, so that screenreader can recognize the combobox
    if (isOpen && !prevOpen && options.length > 0 && !hasFilter) {
      if (openedWithKeyboard) {
        if (__selectedOptions[0]) {
          highlightOptionWithKeyboard(__selectedOptions[0]);
        } else {
          goHomeWithKeyboard();
        }
      } else {
        if (!__selectedOptions[0] || !options.includes(__selectedOptions[0])) {
          highlightFirstOptionWithMouse();
        } else {
          const highlightedIndex = options.indexOf(__selectedOptions[0]);
          setHighlightedIndexWithMouse(highlightedIndex, true);
        }
      }
    }
  }, [
    isOpen,
    __selectedOptions,
    hasSelectedOption,
    setHighlightedIndexWithMouse,
    highlightOptionWithKeyboard,
    highlightFirstOptionWithMouse,
    goHomeWithKeyboard,
    openedWithKeyboard,
    options,
    prevOpen,
    hasFilter,
  ]);

  const focusActiveRef = useCallback(() => {
    // dropdown-fit calculations ensure that the dropdown will fit inside the current
    // viewport, so prevent the browser from trying to scroll it into view (e.g. if
    // scroll-padding-top is set on a parent)
    activeRef.current?.focus({ preventScroll: true });
  }, [activeRef]);

  useEffect(() => {
    if (isOpen && !embedded) {
      focusActiveRef();
    }
  }, [isOpen, activeRef, embedded, focusActiveRef]);

  useForwardFocus(externalRef, triggerRef as React.RefObject<HTMLElement>);

  // Closes the dropdown and returns focus to the trigger, matching the normal close behavior.
  // Exposed to the public dropdown-customization render props via `DropdownContentProps.closeDropdown`.
  // Focusing the trigger fires its onFocus handler, which already closes the dropdown; only close
  // explicitly when the trigger is already focused (re-focusing it does not fire onFocus), so the
  // close side effects run exactly once.
  const closeDropdownAndRefocus = useCallback(() => {
    const trigger = triggerRef.current;
    if (trigger && trigger === document.activeElement) {
      closeDropdown();
    } else {
      trigger?.focus();
    }
  }, [closeDropdown]);

  return {
    isOpen,
    highlightedOption,
    highlightedIndex,
    highlightType,
    getTriggerProps,
    getDropdownProps,
    getMenuProps,
    getFilterProps,
    getOptionProps: listbox.getOptionProps,
    highlightOption: highlightOptionWithKeyboard,
    selectOption: listbox.selectOption,
    announceSelected: listbox.announceSelected,
    announcement: listbox.announcement,
    scrollToIndex: listbox.scrollToIndex,
    closeDropdown: closeDropdownAndRefocus,
    dialogId,
    focusActiveRef,
  };
}
