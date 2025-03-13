// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useCallback, useEffect, useRef } from 'react';

import { warnOnce } from '@cloudscape-design/component-toolkit/internal';

import { useInternalI18n } from '../i18n/context';
import { DropdownStatusProps, useDropdownStatus } from '../internal/components/dropdown-status';
import { OptionDefinition, OptionGroup } from '../internal/components/option/interfaces';
import { isGroup } from '../internal/components/option/utils/filter-options';
import { prepareOptions } from '../internal/components/option/utils/prepare-options';
import { fireNonCancelableEvent } from '../internal/events';
import { SomeRequired } from '../internal/types';
import { joinStrings } from '../internal/utils/strings';
import { SelectListProps } from '../select/parts/plain-list';
import { checkOptionValueField } from '../select/utils/check-option-value-field.js';
import { findOptionIndex } from '../select/utils/connect-options';
import { useAnnouncement } from '../select/utils/use-announcement';
import { useLoadItems } from '../select/utils/use-load-items';
import { useNativeSearch } from '../select/utils/use-native-search';
import { useSelect } from '../select/utils/use-select';
import { TokenGroupProps } from '../token-group/interfaces';
import { MultiselectProps } from './interfaces';

type UseMultiselectOptions = SomeRequired<
  Pick<
    MultiselectProps,
    | 'options'
    | 'selectedOptions'
    | 'filteringType'
    | 'filteringResultsText'
    | 'disabled'
    | 'noMatch'
    | 'renderHighlightedAriaLive'
    | 'deselectAriaLabel'
    | 'keepOpen'
    | 'onBlur'
    | 'onFocus'
    | 'onLoadItems'
    | 'onChange'
    | 'selectedAriaLabel'
    | 'enableSelectAll'
  > &
    DropdownStatusProps & {
      controlId?: string;
      ariaLabelId: string;
      footerId: string;
      filteringValue: string;
      setFilteringValue?: (value: string) => void;
      externalRef: React.Ref<MultiselectProps.Ref>;
    },
  'options' | 'selectedOptions' | 'filteringType' | 'statusType' | 'keepOpen'
> & { embedded?: boolean };

export function useMultiselect({
  options,
  filteringType,
  filteringResultsText,
  disabled,
  statusType,
  empty,
  loadingText,
  finishedText,
  errorText,
  noMatch,
  renderHighlightedAriaLive,
  selectedOptions,
  deselectAriaLabel,
  keepOpen,
  onBlur,
  onFocus,
  onLoadItems,
  onChange,
  controlId,
  ariaLabelId,
  footerId,
  filteringValue,
  setFilteringValue,
  externalRef,
  embedded,
  enableSelectAll,
  ...restProps
}: UseMultiselectOptions) {
  checkOptionValueField('Multiselect', 'options', options);

  const i18n = useInternalI18n('multiselect');
  const i18nCommon = useInternalI18n('select');
  const recoveryText = i18nCommon('recoveryText', restProps.recoveryText);
  const errorIconAriaLabel = i18nCommon('errorIconAriaLabel', restProps.errorIconAriaLabel);
  const selectedAriaLabel = i18nCommon('selectedAriaLabel', restProps.selectedAriaLabel);

  if (restProps.recoveryText && !onLoadItems) {
    warnOnce('Multiselect', '`onLoadItems` must be provided for `recoveryText` to be displayed.');
  }

  const { handleLoadMore, handleRecoveryClick, fireLoadItems } = useLoadItems({
    onLoadItems,
    options,
    statusType,
  });
  const useInteractiveGroups = true;
  const { allOptions, filteredOptions, parentMap, totalCount, matchesCount } = prepareOptions(
    options,
    filteringType,
    filteringValue
  );

  const allNonParentOptions = allOptions.filter(item => item.type !== 'parent' && item.type !== 'toggle-all');

  const allSelectableOptions = allNonParentOptions
    .filter(option => !option.option.disabled)
    .map(option => option.option);

  const filteredNonParentOptions = filteredOptions
    .filter(item => item.type !== 'parent' && item.type !== 'toggle-all')
    .map(item => item.option);

  const selectedValues = new Set(selectedOptions.map(option => option.value));
  const isSomeSelected = selectedOptions.length > 0;
  const isAllVisibleSelected =
    isSomeSelected && filteredNonParentOptions.every(option => selectedValues.has(option.value));
  const isAllSelectableSelected =
    isAllVisibleSelected && allSelectableOptions.every(option => selectedValues.has(option.value));
  const isAllSelected =
    isAllSelectableSelected && allNonParentOptions.every(option => selectedValues.has(option.option.value));

  const updateSelectedOption = useCallback(
    (option: OptionDefinition | OptionGroup) => {
      // switch between selection and deselection behavior, ignores disabled options to prevent
      // getting stuck on one behavior when an option is disabled and its state cannot be changed
      const isAllChildrenSelected = (optionsArray: OptionDefinition[]) =>
        optionsArray.every(item => findOptionIndex(selectedOptions, item) > -1 || item.disabled);
      const intersection = (visibleOptions: OptionDefinition[], options: OptionDefinition[]) =>
        visibleOptions.filter(item => findOptionIndex(options, item) > -1 && !item.disabled);
      const union = (visibleOptions: OptionDefinition[], options: OptionDefinition[]) =>
        visibleOptions.filter(item => findOptionIndex(options, item) === -1).concat(options);
      const select = (options: OptionDefinition[], selectedOptions: OptionDefinition[]) => {
        return union(selectedOptions, options);
      };
      const unselect = (options: OptionDefinition[], selectedOptions: OptionDefinition[]) => {
        return selectedOptions.filter(option => findOptionIndex(options, option) === -1);
      };
      let newSelectedOptions = [...selectedOptions];

      if (isGroup(option)) {
        const visibleOptions = intersection([...option.options], filteredNonParentOptions);
        newSelectedOptions = isAllChildrenSelected(visibleOptions)
          ? unselect(visibleOptions, newSelectedOptions)
          : select(visibleOptions, newSelectedOptions);
      } else {
        newSelectedOptions = isAllChildrenSelected([option])
          ? unselect([option], newSelectedOptions)
          : select([option], newSelectedOptions);
      }

      fireNonCancelableEvent(onChange, {
        selectedOptions: newSelectedOptions,
      });
    },
    [selectedOptions, onChange, filteredNonParentOptions]
  );

  const scrollToIndex = useRef<SelectListProps.SelectListRef>(null);
  const {
    isOpen,
    highlightType,
    highlightedOption,
    highlightedIndex,
    getTriggerProps,
    getDropdownProps,
    getFilterProps,
    getMenuProps,
    getOptionProps,
    highlightOption,
    announceSelected,
    setHighlightedIndexWithMouse,
    menuId,
    closeDropdownIfNecessary,
  } = useSelect({
    selectedOptions,
    updateSelectedOption,
    items: enableSelectAll ? [{ type: 'toggle-all', option: {} }, ...filteredOptions] : filteredOptions,
    filteringType,
    onFocus,
    onBlur,
    externalRef,
    keepOpen,
    fireLoadItems,
    setFilteringValue,
    useInteractiveGroups,
    statusType,
    embedded,
    enableSelectAll,
    isAllSelected,
  });

  const toggleAll = () => {
    const filteredNonParentOptionValues = new Set(filteredNonParentOptions.map(option => option.value));
    fireNonCancelableEvent(onChange, {
      selectedOptions: isAllVisibleSelected
        ? selectedOptions.filter(option => !filteredNonParentOptionValues.has(option.value))
        : allNonParentOptions
            .filter(({ option: { value } }) => selectedValues.has(value) || filteredNonParentOptionValues.has(value))
            .map(option => option.option),
    });
    closeDropdownIfNecessary();
  };

  const wrapperOnKeyDown = useNativeSearch({
    isEnabled: filteringType === 'none' && isOpen,
    options: filteredOptions,
    highlightOption: highlightOption,
    highlightedOption: highlightedOption?.option,
    useInteractiveGroups,
  });

  const isEmpty = !options || options.length === 0;
  const isNoMatch = filteredOptions && filteredOptions.length === 0;
  const isFiltered =
    filteringType !== 'none' && filteringValue.length > 0 && filteredOptions && filteredOptions.length > 0;
  const filteredText = isFiltered ? filteringResultsText?.(matchesCount, totalCount) : undefined;
  const dropdownStatus = useDropdownStatus({
    statusType,
    empty,
    loadingText,
    finishedText,
    errorText,
    recoveryText,
    isEmpty,
    isNoMatch,
    noMatch,
    isFiltered,
    filteringResultsText: filteredText,
    onRecoveryClick: handleRecoveryClick,
    errorIconAriaLabel: errorIconAriaLabel,
    hasRecoveryCallback: !!onLoadItems,
  });

  const announcement = useAnnouncement({
    announceSelected,
    highlightedOption,
    getParent: option => parentMap.get(option)?.option as undefined | OptionGroup,
    selectedAriaLabel,
    renderHighlightedAriaLive,
  });

  const tokens: TokenGroupProps['items'] = selectedOptions.map(option => ({
    label: option.label,
    disabled: disabled || option.disabled,
    labelTag: option.labelTag,
    description: option.description,
    iconAlt: option.iconAlt,
    iconName: option.iconName,
    iconUrl: option.iconUrl,
    iconSvg: option.iconSvg,
    tags: option.tags,
    dismissLabel: i18n('deselectAriaLabel', deselectAriaLabel?.(option), format =>
      format({ option__label: option.label ?? '' })
    ),
  }));

  useEffect(() => {
    scrollToIndex.current?.(highlightedIndex);
  }, [highlightedIndex]);

  const dropdownOnMouseDown = (event: React.MouseEvent) => {
    const target = event.target as HTMLElement;

    if (target !== document.activeElement) {
      // prevent currently focused element from losing it
      event.preventDefault();
    }
  };

  const tokenOnDismiss: TokenGroupProps['onDismiss'] = ({ detail }) => {
    const optionToDeselect = selectedOptions[detail.itemIndex];
    updateSelectedOption(optionToDeselect);
    const targetRef = getTriggerProps().ref;
    if (targetRef.current) {
      targetRef.current.focus();
    }
  };

  return {
    isOpen,
    tokens,
    announcement,
    dropdownStatus,
    filteringValue,
    filteredOptions,
    highlightType,
    scrollToIndex,
    getFilterProps,
    getTriggerProps,
    getMenuProps: () => ({
      ...getMenuProps(),
      onLoadMore: handleLoadMore,
      ariaLabelledby: joinStrings(ariaLabelId, controlId),
      ariaDescribedby: dropdownStatus.content ? footerId : undefined,
      embedded,
    }),
    getOptionProps,
    getTokenProps: () => ({ onDismiss: tokenOnDismiss }),
    getDropdownProps: () => ({ ...getDropdownProps(), onMouseDown: dropdownOnMouseDown }),
    getWrapperProps: () => ({ onKeyDown: wrapperOnKeyDown }),
    isAllSelected,
    isSomeSelected,
    toggleAll,
    highlightedIndex,
    setHighlightedIndexWithMouse,
    menuId,
  };
}
