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
import { SomeRequired } from '../internal/types.js';

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
      selectedAriaLabel,
      renderHighlightedAriaLive,
      selectedOption,
      onBlur,
      onFocus,
      onLoadItems,
      onChange,
      virtualScroll,
      expandToViewport,
      __inFilteringToken,
      __internalRootRef = null,
      ...restProps
    }: InternalSelectProps,
    externalRef: React.Ref<SelectProps.Ref>
  ) => {
    const baseProps = getBaseProps(restProps);
    const formFieldContext = useFormFieldContext(restProps);

    const { handleLoadMore, handleRecoveryClick, fireLoadItems } = useLoadItems({
      onLoadItems,
      options,
      statusType,
    });

    checkControlled('Select', 'selectedOption', selectedOption, 'onChange', onChange);

    checkOptionValueField('Select', 'options', options);

    const [filteringValue, setFilteringValue] = useState('');

    const { filteredOptions, parentMap } = prepareOptions(options, filteringType, filteringValue);

    const rootRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLButtonElement>(null);

    const selfControlId = useUniqueId('trigger');
    const controlId = formFieldContext.controlId ?? selfControlId;

    const scrollToIndex = useRef<SelectListProps.SelectListRef>(null);
    const {
      isOpen,
      highlightedOption,
      highlightedIndex,
      highlightedType,
      getTriggerProps,
      getFilterProps,
      getMenuProps,
      getOptionProps,
      isKeyboard,
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
    });

    const handleNativeSearch = useNativeSearch({
      isEnabled: filteringType === 'none',
      options: filteredOptions,
      highlightOption: !isOpen ? selectOption : highlightOption,
      highlightedOption: !isOpen ? selectedOption : highlightedOption?.option,
      isKeyboard,
    });

    useEffect(() => {
      scrollToIndex.current?.(highlightedIndex);
    }, [highlightedIndex]);

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
        ref={triggerRef}
        placeholder={placeholder}
        disabled={disabled}
        ariaLabel={ariaLabel}
        triggerVariant={triggerVariant}
        triggerProps={getTriggerProps(disabled)}
        selectedOption={selectedOption}
        isOpen={isOpen}
        inFilteringToken={__inFilteringToken}
        {...formFieldContext}
        controlId={controlId}
      />
    );

    const menuProps = {
      ...getMenuProps(),
      onLoadMore: handleLoadMore,
      ariaLabelledby: controlId,
    };

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
    });

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

    return (
      <div
        {...baseProps}
        ref={mergedRef}
        className={clsx(styles.root, baseProps.className)}
        onKeyPress={handleNativeSearch}
      >
        <Dropdown
          open={isOpen}
          stretchTriggerHeight={__inFilteringToken}
          trigger={trigger}
          header={filter}
          onMouseDown={handleMouseDown}
          footer={dropdownStatus.isSticky ? <DropdownFooter content={dropdownStatus.content} /> : null}
          expandToViewport={expandToViewport}
        >
          <ListComponent
            listBottom={!dropdownStatus.isSticky ? <DropdownFooter content={dropdownStatus.content} /> : null}
            menuProps={menuProps}
            getOptionProps={getOptionProps}
            filteredOptions={filteredOptions}
            filteringValue={filteringValue}
            ref={scrollToIndex}
            hasDropdownStatus={dropdownStatus.content !== null}
            screenReaderContent={announcement}
            highlightedType={highlightedType}
          />
        </Dropdown>
      </div>
    );
  }
);

export default InternalSelect;
