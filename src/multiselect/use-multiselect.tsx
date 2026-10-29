// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useEffect, useRef } from 'react';

import { warnOnce } from '@cloudscape-design/component-toolkit/internal';

import { useInternalI18n } from '../i18n/context';
import { useDropdownStatus } from '../internal/components/dropdown-status';
import { multiSelection } from '../internal/components/listbox/selection/multi-selection';
import { useAnnouncement } from '../internal/components/listbox/use-announcement';
import { useTypeAhead } from '../internal/components/listbox/use-type-ahead';
import { checkOptionValueField } from '../internal/components/listbox/utils/check-option-value-field.js';
import { DropdownOption } from '../internal/components/option/interfaces';
import { prepareOptions } from '../internal/components/option/utils/prepare-options';
import { fireNonCancelableEvent } from '../internal/events';
import { SomeRequired } from '../internal/types';
import { joinStrings } from '../internal/utils/strings';
import { SelectListProps } from '../select/parts/plain-list';
import { useLoadItems } from '../select/utils/use-load-items';
import { useSelect } from '../select/utils/use-select';
import { TokenGroupProps } from '../token-group/interfaces';
import { DropdownStatusProps } from '../types/dropdown-status';
import { OptionDefinition, OptionGroup } from '../types/option';
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
    | 'i18nStrings'
    | 'dropdownRole'
    | 'dropdownAriaDescribedby'
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
  i18nStrings,
  dropdownRole,
  dropdownAriaDescribedby,
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
  const { flatOptions, filteredOptions, parentMap, totalCount, matchesCount } = prepareOptions(
    options,
    filteringType,
    filteringValue
  );

  const selectAllOption: DropdownOption = {
    type: 'select-all',
    afterHeader: filteringType !== 'none',
    option: { label: i18n('i18nStrings.selectAllText', i18nStrings?.selectAllText) },
  };

  const visibleOptions =
    enableSelectAll && filteredOptions.length ? [selectAllOption, ...filteredOptions] : filteredOptions;

  const selection = multiSelection(selectedOptions, {
    options: filteredOptions,
    // Includes visible and non-visible (filtered out) options
    allOptions: flatOptions,
    interactiveGroups: useInteractiveGroups,
  });

  const toggleAll = () => {
    fireNonCancelableEvent(onChange, { selectedOptions: selection.getNextSelection(selectAllOption) });
  };

  const updateSelectedOption = (option: OptionDefinition | OptionGroup) => {
    fireNonCancelableEvent(onChange, { selectedOptions: selection.getNextSelection({ option }) });
  };

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
    focusActiveRef,
    closeDropdown,
  } = useSelect({
    selectedOptions,
    updateSelectedOption,
    options: visibleOptions,
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
    selection,
    toggleAll,
    dropdownRole,
  });

  const wrapperOnKeyDown = useTypeAhead({
    isEnabled: filteringType === 'none' && isOpen,
    options: visibleOptions,
    highlightOption: highlightOption,
    highlightedOption: highlightedOption?.option,
    interactiveGroups: useInteractiveGroups,
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
    filteringResultsText: filteredText,
    onRecoveryClick: () => {
      handleRecoveryClick();
      focusActiveRef();
    },
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
    filteredOptions: visibleOptions,
    highlightType,
    scrollToIndex,
    getFilterProps,
    getTriggerProps,
    getMenuProps: () => ({
      ...getMenuProps(),
      onLoadMore: handleLoadMore,
      ariaLabelledby: joinStrings(ariaLabelId, controlId),
      ariaDescribedby: joinStrings(dropdownStatus.content ? footerId : undefined, dropdownAriaDescribedby),
      embedded,
    }),
    getOptionProps,
    getTokenProps: () => ({ onDismiss: tokenOnDismiss }),
    getDropdownProps: () => ({ ...getDropdownProps(), onMouseDown: dropdownOnMouseDown }),
    getWrapperProps: () => ({ onKeyDown: wrapperOnKeyDown }),
    highlightedIndex,
    closeDropdown,
  };
}
