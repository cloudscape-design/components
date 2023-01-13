// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useCallback, useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import { useMergeRefs } from '../internal/hooks/use-merge-refs';

import { InternalBaseComponentProps } from '../internal/hooks/use-base-component/index.js';
import { useFormFieldContext } from '../internal/context/form-field-context';
import { getBaseProps } from '../internal/base-component';
import { fireNonCancelableEvent } from '../internal/events';
import { useUniqueId } from '../internal/hooks/use-unique-id';
import { isGroup } from '../internal/components/option/utils/filter-options';

import DropdownFooter from '../internal/components/dropdown-footer/index.js';
import { prepareOptions } from '../internal/components/option/utils/prepare-options';
import { OptionDefinition, OptionGroup } from '../internal/components/option/interfaces';
import Dropdown from '../internal/components/dropdown';
import { useDropdownStatus } from '../internal/components/dropdown-status';

import { useSelect, MenuProps } from '../select/utils/use-select';
import { useNativeSearch } from '../select/utils/use-native-search';
import { useLoadItems } from '../select/utils/use-load-items';
import { useAnnouncement } from '../select/utils/use-announcement';
import { findOptionIndex } from '../select/utils/connect-options';
import PlainList, { SelectListProps } from '../select/parts/plain-list';
import VirtualList from '../select/parts/virtual-list';
import { checkOptionValueField } from '../select/utils/check-option-value-field.js';
import Filter from '../select/parts/filter';
import Trigger from '../select/parts/trigger';

import TokenGroup, { TokenGroupProps } from '../token-group/index.js';

import { MultiselectProps } from './interfaces';
import styles from './styles.css.js';
import ScreenreaderOnly from '../internal/components/screenreader-only';
import { joinStrings } from '../internal/utils/strings';

type InternalMultiselectProps = MultiselectProps & InternalBaseComponentProps;

const InternalMultiselect = React.forwardRef(
  (
    {
      options = [],
      filteringType = 'none',
      filteringPlaceholder,
      filteringAriaLabel,
      ariaRequired,
      placeholder,
      disabled,
      ariaLabel,
      statusType = 'finished',
      empty,
      loadingText,
      finishedText,
      errorText,
      recoveryText,
      noMatch,
      selectedAriaLabel,
      renderHighlightedAriaLive,
      selectedOptions = [],
      deselectAriaLabel,
      keepOpen = true,
      tokenLimit,
      i18nStrings,
      onBlur,
      onFocus,
      onLoadItems,
      onChange,
      virtualScroll,
      hideTokens = false,
      expandToViewport,
      __internalRootRef = null,
      autoFocus,
      ...restProps
    }: InternalMultiselectProps,
    externalRef: React.Ref<MultiselectProps.Ref>
  ) => {
    checkOptionValueField('Multiselect', 'options', options);

    const baseProps = getBaseProps(restProps);
    const formFieldContext = useFormFieldContext(restProps);

    const { handleLoadMore, handleRecoveryClick, fireLoadItems } = useLoadItems({
      onLoadItems,
      options,
      statusType,
    });
    const useInteractiveGroups = true;
    const [filteringValue, setFilteringValue] = useState('');
    const { filteredOptions, parentMap } = prepareOptions(options, filteringType, filteringValue);

    const updateSelectedOption = useCallback(
      (option: OptionDefinition | OptionGroup) => {
        const filtered = filteredOptions.filter(item => item.type !== 'parent').map(item => item.option);

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
          const visibleOptions = intersection([...option.options], filtered);
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
      [onChange, selectedOptions, filteredOptions]
    );

    const rootRef = useRef<HTMLDivElement>(null);

    const selfControlId = useUniqueId('trigger');
    const controlId = formFieldContext.controlId ?? selfControlId;

    const multiSelectAriaLabelId = useUniqueId('multiselect-arialabel-');

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
    } = useSelect({
      selectedOptions,
      updateSelectedOption,
      options: filteredOptions,
      filteringType,
      onFocus,
      onBlur,
      externalRef,
      keepOpen,
      fireLoadItems,
      setFilteringValue,
      useInteractiveGroups,
    });

    const handleNativeSearch = useNativeSearch({
      isEnabled: filteringType === 'none' && isOpen,
      options: filteredOptions,
      highlightOption: highlightOption,
      highlightedOption: highlightedOption?.option,
      useInteractiveGroups,
    });

    const isEmpty = !options || options.length === 0;
    const isNoMatch = filteredOptions && filteredOptions.length === 0;
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
      onRecoveryClick: handleRecoveryClick,
      errorIconAriaLabel: restProps.errorIconAriaLabel,
    });

    const filter = (
      <Filter
        filteringType={filteringType}
        placeholder={filteringPlaceholder}
        ariaLabel={filteringAriaLabel}
        ariaRequired={ariaRequired}
        value={filteringValue}
        {...getFilterProps()}
      />
    );

    const trigger = (
      <Trigger
        placeholder={placeholder}
        disabled={disabled}
        triggerProps={getTriggerProps(disabled, autoFocus)}
        selectedOption={null}
        isOpen={isOpen}
        {...formFieldContext}
        controlId={controlId}
        ariaLabelledby={joinStrings(formFieldContext.ariaLabelledby, multiSelectAriaLabelId)}
      />
    );

    const menuProps: MenuProps = {
      ...getMenuProps(),
      onLoadMore: handleLoadMore,
      ariaLabelledby: joinStrings(multiSelectAriaLabelId, controlId),
    };

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
      dismissLabel: deselectAriaLabel ? deselectAriaLabel(option) : undefined,
    }));

    useEffect(() => {
      scrollToIndex.current?.(highlightedIndex);
    }, [highlightedIndex]);

    const ListComponent = virtualScroll ? VirtualList : PlainList;

    const handleMouseDown = (event: React.MouseEvent) => {
      const target = event.target as HTMLElement;

      if (target !== document.activeElement) {
        // prevent currently focused element from losing it
        event.preventDefault();
      }
    };

    const showTokens = !hideTokens && tokens.length > 0;
    const handleTokenDismiss: TokenGroupProps['onDismiss'] = ({ detail }) => {
      const optionToDeselect = selectedOptions[detail.itemIndex];
      updateSelectedOption(optionToDeselect);
      const targetRef = getTriggerProps().ref;
      if (targetRef.current) {
        targetRef.current.focus();
      }
    };

    const tokenGroupI18nStrings: TokenGroupProps.I18nStrings = {
      limitShowFewer: i18nStrings?.tokenLimitShowFewer,
      limitShowMore: i18nStrings?.tokenLimitShowMore,
    };

    const mergedRef = useMergeRefs(rootRef, __internalRootRef);

    return (
      <div
        {...baseProps}
        ref={mergedRef}
        className={clsx(styles.root, baseProps.className)}
        onKeyPress={handleNativeSearch}
      >
        <Dropdown
          {...getDropdownProps()}
          open={isOpen}
          trigger={trigger}
          header={filter}
          onMouseDown={handleMouseDown}
          footer={dropdownStatus.isSticky ? <DropdownFooter content={isOpen ? dropdownStatus.content : null} /> : null}
          expandToViewport={expandToViewport}
        >
          <ListComponent
            listBottom={
              !dropdownStatus.isSticky ? <DropdownFooter content={isOpen ? dropdownStatus.content : null} /> : null
            }
            menuProps={menuProps}
            getOptionProps={getOptionProps}
            filteredOptions={filteredOptions}
            filteringValue={filteringValue}
            ref={scrollToIndex}
            hasDropdownStatus={dropdownStatus.content !== null}
            checkboxes={true}
            useInteractiveGroups={useInteractiveGroups}
            screenReaderContent={announcement}
            highlightType={highlightType}
          />
        </Dropdown>
        {showTokens && (
          <TokenGroup
            limit={tokenLimit}
            items={tokens}
            onDismiss={handleTokenDismiss}
            i18nStrings={tokenGroupI18nStrings}
          />
        )}
        <ScreenreaderOnly id={multiSelectAriaLabelId}>{ariaLabel}</ScreenreaderOnly>
      </div>
    );
  }
);

export default InternalMultiselect;
