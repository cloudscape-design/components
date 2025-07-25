// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { RefObject } from 'react';
import { useEffect, useRef } from 'react';

import { useUniqueId } from '@cloudscape-design/component-toolkit/internal';

import { ButtonTriggerProps } from '../../internal/components/button-trigger';
import { DropdownProps } from '../../internal/components/dropdown/interfaces';
import { DropdownStatusProps } from '../../internal/components/dropdown-status';
import { DropdownOption, OptionDefinition, OptionGroup } from '../../internal/components/option/interfaces';
import { isGroup, isGroupInteractive, isInteractive } from '../../internal/components/option/utils/filter-options';
import { OptionsListProps } from '../../internal/components/options-list';
import { useHighlightedOption } from '../../internal/components/options-list/utils/use-highlight-option';
import { getOptionId } from '../../internal/components/options-list/utils/use-ids';
import { useMenuKeyboard, useTriggerKeyboard } from '../../internal/components/options-list/utils/use-keyboard';
import { useOpenState } from '../../internal/components/options-list/utils/use-open-state';
import { fireNonCancelableEvent, NonCancelableEventHandler } from '../../internal/events';
import useForwardFocus from '../../internal/hooks/forward-focus';
import { usePrevious } from '../../internal/hooks/use-previous';
import { FilterProps } from '../parts/filter';
import { ItemProps } from '../parts/item';
import { connectOptionsByValue } from './connect-options';

export type MenuProps = Omit<OptionsListProps, 'children'> & { ref: React.RefObject<HTMLUListElement> };
export type GetOptionProps = (option: DropdownOption, index: number) => ItemProps;

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
  isAllSelected?: boolean;
  isSomeSelected?: boolean;
  toggleAll?: () => void;
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
  isAllSelected,
  isSomeSelected,
  toggleAll,
}: UseSelectProps) {
  const interactivityCheck = useInteractiveGroups ? isGroupInteractive : isInteractive;

  const isHighlightable = (option?: DropdownOption) => !!option && (useInteractiveGroups || option.type !== 'parent');

  const filterRef = useRef<HTMLInputElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLUListElement>(null);
  const hasFilter = filteringType !== 'none' && !embedded;
  const activeRef = hasFilter ? filterRef : menuRef;
  const __selectedOptions = connectOptionsByValue(options, selectedOptions);
  const __selectedValuesSet = selectedOptions.reduce((selectedValuesSet: Set<string>, item: OptionDefinition) => {
    if (item.value) {
      selectedValuesSet.add(item.value);
    }
    return selectedValuesSet;
  }, new Set<string>());
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
  ] = useHighlightedOption({ options: options, isHighlightable });

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
  const menuId = useUniqueId('option-list');
  const dialogId = useUniqueId('dialog');
  const highlightedOptionId = getOptionId(menuId, highlightedIndex);

  const closeDropdownIfNecessary = () => {
    if (!keepOpen) {
      triggerRef.current?.focus();
      closeDropdown();
    }
  };

  const selectOption = (option?: DropdownOption) => {
    const optionToSelect = option || highlightedOption;
    if (!optionToSelect || !interactivityCheck(optionToSelect)) {
      return;
    }
    if (optionToSelect.type === 'select-all' && toggleAll) {
      toggleAll();
    } else {
      updateSelectedOption(optionToSelect.option);
    }
    closeDropdownIfNecessary();
  };

  const activeKeyDownHandler = useMenuKeyboard({
    goUp: () => {
      if (
        (!useInteractiveGroups && highlightedOption?.type === 'child' && highlightedIndex === 1) ||
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
    selectOption,
    goHome: goHomeWithKeyboard,
    goEnd: goEndWithKeyboard,
    closeDropdown: () => {
      if (!embedded) {
        triggerRef.current?.focus();
        closeDropdown();
      }
    },
    preventNativeSpace: !hasFilter || !!highlightedOption,
  });

  const triggerKeyDownHandler = useTriggerKeyboard({
    openDropdown: () => openDropdown(true),
    goHome: goHomeWithKeyboard,
  });

  const getDropdownProps: () => Pick<
    DropdownProps,
    'onFocus' | 'onBlur' | 'dropdownContentId' | 'dropdownContentRole'
  > = () => ({
    onFocus: handleFocus,
    onBlur: handleBlur,
    dropdownContentId: dialogId,
    dropdownContentRole: hasFilter ? 'dialog' : undefined,
  });

  const getTriggerProps = (disabled = false, autoFocus = false) => {
    const triggerProps: SelectTriggerProps = {
      ref: triggerRef,
      onFocus: () => closeDropdown(),
      autoFocus,
      ariaHasPopup: hasFilter ? 'dialog' : 'listbox',
      ariaControls: isOpen ? (hasFilter ? dialogId : menuId) : undefined,
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
      onKeyDown: activeKeyDownHandler,
      onChange: event => {
        setFilteringValue(event.detail.value);
        resetHighlightWithKeyboard();
      },
      __onDelayedInput: event => {
        fireLoadItems(event.detail.value);
      },
      __nativeAttributes: {
        'aria-activedescendant': highlightedOptionId,
        ['aria-owns']: menuId,
        ['aria-controls']: menuId,
      },
    };
  };

  const getMenuProps = () => {
    const menuProps: MenuProps = {
      id: menuId,
      ref: menuRef,
      open: isOpen,
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
      statusType,
    };
    if (!hasFilter) {
      menuProps.onKeyDown = activeKeyDownHandler;
      menuProps.nativeAttributes = {
        'aria-activedescendant': highlightedOptionId,
      };
    }
    if (embedded) {
      menuProps.onFocus = () => {
        if (!highlightedOption) {
          goHomeWithKeyboard();
        }
      };
      menuProps.onBlur = () => {
        resetHighlightWithKeyboard();
      };
    }
    return menuProps;
  };
  const getGroupState = (option: OptionGroup) => {
    const totalSelected = option.options.filter(item => !!item.value && __selectedValuesSet.has(item.value)).length;
    const hasSelected = totalSelected > 0;
    const allSelected = totalSelected === option.options.length;
    return {
      selected: hasSelected && allSelected && useInteractiveGroups,
      indeterminate: hasSelected && !allSelected,
    };
  };

  const getOptionProps = (option: DropdownOption, index: number) => {
    const isSelectAll = option.type === 'select-all';
    const highlighted = option === highlightedOption;
    const groupState = isGroup(option.option) ? getGroupState(option.option) : undefined;
    const selected = isSelectAll ? isAllSelected : __selectedOptions.indexOf(option) > -1 || !!groupState?.selected;
    const nextOption = options[index + 1]?.option;
    const isNextSelected =
      !!nextOption && isGroup(nextOption)
        ? getGroupState(nextOption).selected
        : __selectedOptions.indexOf(options[index + 1]) > -1;
    const optionProps: any = {
      key: index,
      option,
      highlighted,
      selected,
      isNextSelected,
      indeterminate: !!groupState?.indeterminate || (isSelectAll && !isAllSelected && isSomeSelected),
      ['data-mouse-target']: isHighlightable(option) ? index : -1,
      id: getOptionId(menuId, index),
    };

    return optionProps;
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

  useEffect(() => {
    if (isOpen && !embedded) {
      // dropdown-fit calculations ensure that the dropdown will fit inside the current
      // viewport, so prevent the browser from trying to scroll it into view (e.g. if
      // scroll-padding-top is set on a parent)
      activeRef.current?.focus({ preventScroll: true });
    }
  }, [isOpen, activeRef, embedded]);

  useForwardFocus(externalRef, triggerRef as React.RefObject<HTMLElement>);
  const highlightedGroupSelected =
    !!highlightedOption && isGroup(highlightedOption.option) && getGroupState(highlightedOption.option).selected;
  const announceSelected =
    !!highlightedOption && (__selectedOptions.indexOf(highlightedOption) > -1 || highlightedGroupSelected);

  return {
    isOpen,
    highlightedOption,
    highlightedIndex,
    highlightType,
    getTriggerProps,
    getDropdownProps,
    getMenuProps,
    getFilterProps,
    getOptionProps,
    highlightOption: highlightOptionWithKeyboard,
    selectOption,
    announceSelected,
    dialogId,
  };
}
