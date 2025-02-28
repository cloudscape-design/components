// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';

import { warnOnce } from '@cloudscape-design/component-toolkit/internal';

import { useInternalI18n } from '../i18n/context.js';
import { getBaseProps } from '../internal/base-component/index.js';
import Dropdown from '../internal/components/dropdown/index.js';
import DropdownFooter from '../internal/components/dropdown-footer/index.js';
import { useDropdownStatus } from '../internal/components/dropdown-status/index.js';
import { OptionGroup } from '../internal/components/option/interfaces.js';
import { prepareOptions } from '../internal/components/option/utils/prepare-options.js';
import { useFormFieldContext } from '../internal/context/form-field-context.js';
import { fireNonCancelableEvent } from '../internal/events/index.js';
import checkControlled from '../internal/hooks/check-controlled/index.js';
import { InternalBaseComponentProps } from '../internal/hooks/use-base-component/index.js';
import { useMergeRefs } from '../internal/hooks/use-merge-refs/index.js';
import { useUniqueId } from '../internal/hooks/use-unique-id/index.js';
import { SomeRequired } from '../internal/types.js';
import { joinStrings } from '../internal/utils/strings/join-strings.js';
import { SelectProps } from './interfaces.js';
import Filter from './parts/filter.js';
import PlainList, { SelectListProps } from './parts/plain-list.js';
import Trigger from './parts/trigger.js';
import VirtualList from './parts/virtual-list.js';
import { checkOptionValueField } from './utils/check-option-value-field.js';
import { useAnnouncement } from './utils/use-announcement.js';
import { useLoadItems } from './utils/use-load-items.js';
import { useNativeSearch } from './utils/use-native-search.js';
import { useSelect } from './utils/use-select.js';

import styles from './styles.css.js';

export interface InternalSelectProps extends SomeRequired<SelectProps, 'options'>, InternalBaseComponentProps {
  __inFilteringToken?: 'root' | 'nested';
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
      inlineLabelText,
      ariaRequired,
      placeholder,
      disabled,
      readOnly,
      ariaLabel,
      statusType = 'finished',
      empty,
      loadingText,
      finishedText,
      errorText,
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
    const recoveryText = i18n('recoveryText', restProps.recoveryText);

    if (restProps.recoveryText && !onLoadItems) {
      warnOnce('Select', '`onLoadItems` must be provided for `recoveryText` to be displayed.');
    }

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
        readOnly={readOnly}
        triggerVariant={triggerVariant}
        triggerProps={getTriggerProps(disabled, autoFocus)}
        selectedOption={selectedOption}
        isOpen={isOpen}
        inFilteringToken={__inFilteringToken}
        inlineLabelText={inlineLabelText}
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
      hasRecoveryCallback: !!onLoadItems,
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
        onKeyDown={handleNativeSearch}
      >
        <Dropdown
          {...dropdownProps}
          ariaLabelledby={dropdownProps.dropdownContentRole ? joinStrings(selectAriaLabelId, controlId) : undefined}
          ariaDescribedby={
            dropdownProps.dropdownContentRole ? (dropdownStatus.content ? footerId : undefined) : undefined
          }
          open={isOpen}
          stretchTriggerHeight={!!__inFilteringToken}
          stretchBeyondTriggerWidth={true}
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
        <div hidden={true} id={selectAriaLabelId}>
          {ariaLabel || inlineLabelText}
        </div>
      </div>
    );
  }
);

export default InternalSelect;
