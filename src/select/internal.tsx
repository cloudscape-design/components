// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';

import { useMergeRefs, useUniqueId, warnOnce } from '@cloudscape-design/component-toolkit/internal';

import { useInternalI18n } from '../i18n/context.js';
import { getBaseProps } from '../internal/base-component';
import { getBreakpointValue } from '../internal/breakpoints';
import Dropdown from '../internal/components/dropdown';
import DropdownFooter from '../internal/components/dropdown-footer';
import { useDropdownStatus } from '../internal/components/dropdown-status';
import { OptionGroup } from '../internal/components/option/interfaces.js';
import { prepareOptions } from '../internal/components/option/utils/prepare-options.js';
import { useFormFieldContext } from '../internal/context/form-field-context';
import { fireNonCancelableEvent } from '../internal/events';
import checkControlled from '../internal/hooks/check-controlled';
import { InternalBaseComponentProps } from '../internal/hooks/use-base-component';
import { SomeRequired } from '../internal/types';
import { joinStrings } from '../internal/utils/strings/join-strings.js';
import { SelectProps } from './interfaces';
import Filter from './parts/filter';
import PlainList, { SelectListProps } from './parts/plain-list';
import Trigger from './parts/trigger';
import VirtualList from './parts/virtual-list';
import { checkOptionValueField } from './utils/check-option-value-field';
import { useAnnouncement } from './utils/use-announcement';
import { useLoadItems } from './utils/use-load-items';
import { useNativeSearch } from './utils/use-native-search';
import { useSelect } from './utils/use-select';

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
      __internalRootRef,
      renderOption,
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
      focusActiveRef,
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
      isEnabled: filteringType === 'none' && !readOnly,
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
        renderOption={renderOption}
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
      filteringResultsText: filteredText,
      errorIconAriaLabel,
      onRecoveryClick: () => {
        handleRecoveryClick();
        focusActiveRef();
      },
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

    const hasOptions = useRef(options.length > 0);
    hasOptions.current = hasOptions.current || options.length > 0;

    return (
      <div
        {...baseProps}
        ref={mergedRef}
        className={clsx(styles.root, baseProps.className)}
        onKeyDown={handleNativeSearch}
      >
        <Dropdown
          {...dropdownProps}
          ariaLabelledby={dropdownProps.ariaRole ? joinStrings(selectAriaLabelId, controlId) : undefined}
          ariaDescribedby={dropdownProps.ariaRole ? (dropdownStatus.content ? footerId : undefined) : undefined}
          open={isOpen}
          stretchTriggerHeight={!!__inFilteringToken}
          minWidth={expandToViewport ? undefined : 'trigger'}
          maxWidth={getBreakpointValue('xxs')} // AWSUI-19898
          trigger={trigger}
          header={filter}
          onMouseDown={handleMouseDown}
          footer={
            dropdownStatus.isSticky ? (
              <DropdownFooter content={isOpen ? dropdownStatus.content : null} id={footerId} />
            ) : null
          }
          expandToViewport={expandToViewport}
          // Forces dropdown position recalculation when new options are loaded
          contentKey={hasOptions.current.toString()}
          content={
            <ListComponent
              listBottom={
                !dropdownStatus.isSticky ? (
                  <DropdownFooter content={isOpen ? dropdownStatus.content : null} id={footerId} />
                ) : null
              }
              renderOption={renderOption}
              menuProps={menuProps}
              getOptionProps={getOptionProps}
              filteredOptions={filteredOptions}
              filteringValue={filteringValue}
              ref={scrollToIndex}
              hasDropdownStatus={dropdownStatus.content !== null}
              screenReaderContent={announcement}
              highlightType={highlightType}
            />
          }
        />
        <div hidden={true} id={selectAriaLabelId}>
          {ariaLabel || inlineLabelText}
        </div>
      </div>
    );
  }
);

export default InternalSelect;
