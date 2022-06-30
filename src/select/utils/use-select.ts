// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { RefObject } from 'react';
import { DropdownOption, OptionDefinition, OptionGroup } from '../../internal/components/option/interfaces';
import { isInteractive, isGroupInteractive, isGroup } from '../../internal/components/option/utils/filter-options';
import { useEffect, useRef, MutableRefObject } from 'react';
import { createHighlightedOptionHook } from '../../internal/components/options-list/utils/use-highlight-option';
import { useOpenState } from '../../internal/components/options-list/utils/use-open-state';
import { useMenuKeyboard, useTriggerKeyboard } from '../../internal/components/options-list/utils/use-keyboard';
import { useIds, getOptionId } from '../../internal/components/options-list/utils/use-ids';
import { connectOptionsByValue } from './connect-options';
import useForwardFocus from '../../internal/hooks/forward-focus';
import { OptionsListProps } from '../../internal/components/options-list';
import { FilterProps } from '../parts/filter';
import { ItemProps } from '../parts/item';
import { usePrevious } from '../../internal/hooks/use-previous';
import { BaseKeyDetail } from '../../internal/events';
import { CancelableEventHandler, fireCancelableEvent, NonCancelableEventHandler } from '../../internal/events/index';
import { containsOrEqual } from '../../internal/utils/dom';

export type MenuProps = Omit<OptionsListProps, 'children'> & { ref: React.RefObject<HTMLUListElement> };
export type GetOptionProps = (option: DropdownOption, index: number) => ItemProps;

interface UseSelectProps {
  selectedOptions: ReadonlyArray<OptionDefinition>;
  updateSelectedOption: (option: OptionDefinition) => void;
  options: ReadonlyArray<DropdownOption>;
  filteringType: string;
  keepOpen?: boolean;
  onBlur?: CancelableEventHandler;
  onFocus?: CancelableEventHandler;
  externalRef: React.Ref<any>;
  fireLoadItems: (filteringText: string) => void;
  setFilteringValue: (filteringText: string) => void;
  useInteractiveGroups?: boolean;
}

export interface SelectTriggerProps {
  ref: RefObject<HTMLButtonElement>;
  onMouseDown?: (event: CustomEvent) => void;
  onKeyDown?: (event: CustomEvent<BaseKeyDetail>) => void;
  ariaLabelledby?: string;
  onFocus: NonCancelableEventHandler;
  onBlur: NonCancelableEventHandler<{ relatedTarget: Node | null }>;
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
  fireLoadItems,
  setFilteringValue,
  useInteractiveGroups = false,
}: UseSelectProps) {
  const interactivityCheck = useInteractiveGroups ? isGroupInteractive : isInteractive;

  const isHighlightable = (option?: DropdownOption) => !!option && (useInteractiveGroups || option.type !== 'parent');
  const useHighlightedOption = createHighlightedOptionHook({ isHighlightable: isHighlightable });

  const filterRef = useRef<HTMLInputElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLUListElement>(null);
  const hasFilter = filteringType !== 'none';
  const activeRef = hasFilter ? filterRef : menuRef;
  const isKeyboard = useRef<boolean>(false);
  const isSelectingUsingSpace = useRef<boolean>(false);
  const __selectedOptions = connectOptionsByValue(options, selectedOptions);
  const __selectedValuesSet = selectedOptions.reduce((selectedValuesSet: Set<string>, item: OptionDefinition) => {
    if (item.value) {
      selectedValuesSet.add(item.value);
    }
    return selectedValuesSet;
  }, new Set<string>());
  const {
    highlightedOption,
    highlightedIndex,
    moveHighlight,
    resetHighlight,
    setHighlightedIndex,
    highlightOption,
    goHome,
    goEnd,
  } = useHighlightedOption(options);

  const { isOpen, openDropdown, closeDropdown, toggleDropdown } = useOpenState({
    onOpen: () => fireLoadItems(''),
    onClose: () => {
      resetHighlight();
      setFilteringValue('');
    },
  });

  const focused: MutableRefObject<boolean> = useRef<boolean>(false);
  const handleFocus = () => {
    if (!focused.current) {
      fireCancelableEvent(onFocus, {});
      focused.current = true;
    }
  };
  const handleBlur = ({ detail }: { detail: { relatedTarget: Node | null } }) => {
    const { relatedTarget } = detail;
    const nextFocusedIsTrigger = relatedTarget ? containsOrEqual(triggerRef.current, relatedTarget) : false;
    const nextFocusedInsideDropdown = relatedTarget
      ? containsOrEqual(menuRef.current, relatedTarget) || containsOrEqual(filterRef.current, relatedTarget)
      : false;
    const nextFocusedInsideComponent = nextFocusedIsTrigger || nextFocusedInsideDropdown;
    const focusingOut = focused.current && !nextFocusedInsideComponent;

    if (nextFocusedIsTrigger || focusingOut) {
      closeDropdown();
    }
    if (focusingOut) {
      fireCancelableEvent(onBlur, {});
      focused.current = false;
    }
  };

  const hasSelectedOption = __selectedOptions.length > 0;
  const { selectedOptionId, menuId } = useIds({ hasSelectedOption });
  const highlightedOptionId = getOptionId(menuId, highlightedIndex);

  const selectOption = (option?: DropdownOption) => {
    isSelectingUsingSpace.current = false;
    const optionToSelect = option || highlightedOption;
    if (!optionToSelect || !interactivityCheck(optionToSelect)) {
      return;
    }
    updateSelectedOption(optionToSelect.option);
    if (!keepOpen) {
      triggerRef.current?.focus();
      closeDropdown();
    }
  };

  const activeKeyDownHandler = useMenuKeyboard({
    moveHighlight,
    selectOption,
    goHome,
    goEnd,
    closeDropdown: () => {
      triggerRef.current?.focus();
      closeDropdown();
    },
    isKeyboard,
    isSelectingUsingSpace,
    preventNativeSpace: !hasFilter,
  });

  const triggerKeyDownHandler = useTriggerKeyboard({ openDropdown, goHome, isKeyboard });

  const getTriggerProps = (disabled = false) => {
    const triggerProps: SelectTriggerProps = {
      ref: triggerRef,
      onFocus: handleFocus,
      onBlur: handleBlur,
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
    if (hasSelectedOption) {
      triggerProps.ariaLabelledby = selectedOptionId;
    }
    return triggerProps;
  };

  const getFilterProps = (): Partial<FilterProps> => {
    if (!hasFilter) {
      return {};
    }

    return {
      ref: filterRef,
      onKeyDown: activeKeyDownHandler,
      __onBlurWithDetail: handleBlur,
      onFocus: handleFocus,
      onChange: event => {
        setFilteringValue(event.detail.value);
        resetHighlight();
      },
      __onDelayedInput: event => {
        fireLoadItems(event.detail.value);
      },
      __nativeAttributes: {
        'aria-activedescendant': highlightedOptionId,
        ['aria-owns']: menuId,
      },
    };
  };

  const getMenuProps = () => {
    const menuProps: MenuProps = {
      id: menuId,
      ref: menuRef,
      open: isOpen,
      onFocus: handleFocus,
      onBlur: handleBlur,
      onMouseUp: itemIndex => {
        isKeyboard.current = false;
        if (itemIndex > -1) {
          selectOption(options[itemIndex]);
        }
      },
      onMouseMove: itemIndex => {
        isKeyboard.current = false;
        if (itemIndex > -1) {
          setHighlightedIndex(itemIndex);
        }
      },
    };
    if (!hasFilter) {
      menuProps.onKeyDown = activeKeyDownHandler;
      menuProps.onBlur = handleBlur;
      menuProps.onFocus = handleFocus;
      menuProps.nativeAttributes = {
        'aria-activedescendant': highlightedOptionId,
      };
    }
    return menuProps;
  };
  const getGroupState = (option: OptionGroup) => {
    const totalSelected = option.options.filter(item => !!item.value && __selectedValuesSet.has(item.value)).length;
    const hasSelected = totalSelected > 0;
    const allSelected = totalSelected === option.options.length;
    return {
      selected: hasSelected && allSelected,
      indeterminate: hasSelected && !allSelected,
    };
  };

  const getOptionProps = (option: DropdownOption, index: number) => {
    const highlighted = option === highlightedOption;
    const groupState = isGroup(option.option) ? getGroupState(option.option) : undefined;
    const selected = __selectedOptions.indexOf(option) > -1 || !!groupState?.selected;
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
      indeterminate: !!groupState?.indeterminate,
      ['data-mouse-target']: isHighlightable(option) ? index : -1,
      id: getOptionId(menuId, index),
    };

    return optionProps;
  };

  const prevOpen = usePrevious<boolean>(isOpen);
  useEffect(() => {
    // highlight the first selected option, when opening the Select component
    if (isOpen && !prevOpen && hasSelectedOption) {
      setHighlightedIndex(options.indexOf(__selectedOptions[0]));
    }
  }, [isOpen, __selectedOptions, hasSelectedOption, setHighlightedIndex, options, prevOpen]);

  useEffect(() => {
    if (isOpen) {
      // dropdown-fit calculations ensure that the dropdown will fit inside the current
      // viewport, so prevent the browser from trying to scroll it into view (e.g. if
      // scroll-padding-top is set on a parent)
      activeRef.current?.focus({ preventScroll: true });
    }
  }, [isOpen, activeRef]);

  useForwardFocus(externalRef, triggerRef as React.RefObject<HTMLElement>);
  const highlightedGroupSelected =
    !!highlightedOption && isGroup(highlightedOption.option) && getGroupState(highlightedOption.option).selected;
  const announceSelected =
    !!highlightedOption && (__selectedOptions.indexOf(highlightedOption) > -1 || highlightedGroupSelected);

  return {
    isOpen,
    highlightedOption,
    highlightedIndex,
    getTriggerProps,
    getMenuProps,
    getFilterProps,
    getOptionProps,
    isKeyboard,
    highlightOption,
    selectOption,
    announceSelected,
  };
}
