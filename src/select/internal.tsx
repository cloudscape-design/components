// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState, useRef, useEffect } from 'react';
import clsx from 'clsx';
import styles from './styles.css.js';

import Dropdown from '../internal/components/dropdown';
import { useDropdownStatus } from '../internal/components/dropdown-status';
import Filter from './parts/filter';
import Trigger from './parts/trigger';
import { useUniqueId } from '../internal/hooks/use-unique-id';

import { getBaseProps } from '../internal/base-component';
import { SelectProps } from './interfaces';
import { prepareOptions } from '../internal/components/option/utils/prepare-options';
import { useSelect } from './utils/use-select';
import { checkOptionValueField } from './utils/check-option-value-field';
import { useNativeSearch } from './utils/use-native-search';
import { fireNonCancelableEvent } from '../internal/events';
import { useLoadItems } from './utils/use-load-items';
import { useAnnouncement } from './utils/use-announcement';
import { useFormFieldContext } from '../internal/context/form-field-context';
import PlainList, { SelectListProps } from './parts/plain-list';
import VirtualList from './parts/virtual-list';
import DropdownFooter from '../internal/components/dropdown-footer';
import checkControlled from '../internal/hooks/check-controlled';
import { InternalBaseComponentProps } from '../internal/hooks/use-base-component';
import { useMergeRefs } from '../internal/hooks/use-merge-refs';
import { OptionGroup } from '../internal/components/option/interfaces.js';
import { SomeRequired } from '../internal/types';
import ScreenreaderOnly from '../internal/components/screenreader-only/index.js';
import { joinStrings } from '../internal/utils/strings/join-strings.js';
import { useInternalI18n } from '../internal/i18n/context.js';

export interface InternalSelectProps extends SomeRequired<SelectProps, 'options'>, InternalBaseComponentProps {
  __inFilteringToken?: boolean;
}

const InternalSelect = React.forwardRef(
  (
    {
      options,
      filteringType = 'none',
      filteringPlaceholder,
      filteringAriaLabel,
      filteringClearAriaLabel,
      filteringResultsText,
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
      triggerVariant = 'label',
      renderHighlightedAriaLive,
      selectedOption,
      onBlur,
      onFocus,
      onLoadItems,
      onChange,
      virtualScroll,
      expandToViewport,
      autoFocus,
      __inFilteringToken,
      __internalRootRef = null,
      ...restProps
    }: InternalSelectProps,
    externalRef: React.Ref<SelectProps.Ref>
  ) => {
    const baseProps = getBaseProps(restProps);
    const formFieldContext = useFormFieldContext(restProps);

    const i18n = useInternalI18n('select');
    const errorIconAriaLabel = i18n('errorIconAriaLabel', restProps.errorIconAriaLabel);
    const selectedAriaLabel = i18n('selectedAriaLabel', restProps.selectedAriaLabel);

    const { handleLoadMore, handleRecoveryClick, fireLoadItems } = useLoadItems({
      onLoadItems,
      options,
      statusType,
    });

    checkControlled('Select', 'selectedOption', selectedOption, 'onChange', onChange);

    checkOptionValueField('Select', 'options', options);

    const [filteringValue, setFilteringValue] = useState('');

    const { filteredOptions, parentMap, totalCount, matchesCount } = prepareOptions(
      options,
      filteringType,
      filteringValue
    );

    const rootRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLButtonElement>(null);

    const selfControlId = useUniqueId('trigger');
    const controlId = formFieldContext.controlId ?? selfControlId;

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
      selectOption,
      announceSelected,
    } = useSelect({
      selectedOptions: selectedOption ? [selectedOption] : [],
      updateSelectedOption: option => fireNonCancelableEvent(onChange, { selectedOption: option }),
      options: filteredOptions,
      filteringType,
      onBlur,
      onFocus,
      externalRef,
      fireLoadItems,
      setFilteringValue,
      statusType,
    });

    const handleNativeSearch = useNativeSearch({
      isEnabled: filteringType === 'none',
      options: filteredOptions,
      highlightOption: !isOpen ? selectOption : highlightOption,
      highlightedOption: !isOpen ? selectedOption : highlightedOption?.option,
    });

    const selectAriaLabelId = useUniqueId('select-arialabel-');
    const footerId = useUniqueId('footer');

    useEffect(() => {
      scrollToIndex.current?.(highlightedIndex);
    }, [highlightedIndex]);

    const filter = (
      <Filter
        clearAriaLabel={filteringClearAriaLabel}
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
        ref={triggerRef}
        placeholder={placeholder}
        disabled={disabled}
        triggerVariant={triggerVariant}
        triggerProps={getTriggerProps(disabled, autoFocus)}
        selectedOption={selectedOption}
        isOpen={isOpen}
        inFilteringToken={__inFilteringToken}
        {...formFieldContext}
        controlId={controlId}
        ariaLabelledby={joinStrings(formFieldContext.ariaLabelledby, selectAriaLabelId)}
      />
    );

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
      errorIconAriaLabel,
      onRecoveryClick: handleRecoveryClick,
    });

    const menuProps = {
      ...getMenuProps(),
      onLoadMore: handleLoadMore,
      ariaLabelledby: joinStrings(selectAriaLabelId, controlId),
      ariaDescribedby: dropdownStatus.content ? footerId : undefined,
    };

    const announcement = useAnnouncement({
      announceSelected,
      highlightedOption,
      getParent: option => parentMap.get(option)?.option as undefined | OptionGroup,
      selectedAriaLabel,
      renderHighlightedAriaLive,
    });

    const ListComponent = virtualScroll ? VirtualList : PlainList;

    const handleMouseDown = (event: React.MouseEvent) => {
      const target = event.target as HTMLElement;

      if (target !== document.activeElement) {
        // prevent currently focused element from losing it
        event.preventDefault();
      }
    };

    const mergedRef = useMergeRefs(rootRef, __internalRootRef);

    const dropdownProps = getDropdownProps();

    return (
      <div
        {...baseProps}
        ref={mergedRef}
        className={clsx(styles.root, baseProps.className)}
        onKeyPress={handleNativeSearch}
      >
        <Dropdown
          {...dropdownProps}
          ariaLabelledby={dropdownProps.dropdownContentRole ? joinStrings(selectAriaLabelId, controlId) : undefined}
          ariaDescribedby={
            dropdownProps.dropdownContentRole ? (dropdownStatus.content ? footerId : undefined) : undefined
          }
          open={isOpen}
          stretchTriggerHeight={__inFilteringToken}
          trigger={trigger}
          header={filter}
          onMouseDown={handleMouseDown}
          footer={
            dropdownStatus.isSticky ? (
              <DropdownFooter content={isOpen ? dropdownStatus.content : null} id={footerId} />
            ) : null
          }
          expandToViewport={expandToViewport}
        >
          <ListComponent
            listBottom={
              !dropdownStatus.isSticky ? (
                <DropdownFooter content={isOpen ? dropdownStatus.content : null} id={footerId} />
              ) : null
            }
            menuProps={menuProps}
            getOptionProps={getOptionProps}
            filteredOptions={filteredOptions}
            filteringValue={filteringValue}
            ref={scrollToIndex}
            hasDropdownStatus={dropdownStatus.content !== null}
            screenReaderContent={announcement}
            highlightType={highlightType}
          />
        </Dropdown>
        <ScreenreaderOnly id={selectAriaLabelId}>{ariaLabel}</ScreenreaderOnly>
      </div>
    );
  }
);

export default InternalSelect;
