// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { Ref, useRef } from 'react';

import { useAutosuggestItems } from '../autosuggest/options-controller';
import { AutosuggestItem, AutosuggestProps } from '../autosuggest/interfaces';

import { useDropdownStatus } from '../internal/components/dropdown-status';
import DropdownFooter from '../internal/components/dropdown-footer';

import { generateUniqueId, useUniqueId } from '../internal/hooks/use-unique-id';
import {
  fireNonCancelableEvent,
  CancelableEventHandler,
  NonCancelableCustomEvent,
  BaseKeyDetail,
} from '../internal/events';
import { BaseChangeDetail } from '../input/interfaces';
import styles from '../autosuggest/styles.css.js';
import { fireCancelableEvent } from '../internal/events/index';
import { InternalBaseComponentProps } from '../internal/hooks/use-base-component';
import AutosuggestOptionsList from '../autosuggest/options-list';
import { useAutosuggestLoadMore } from '../autosuggest/load-more-controller';
import { OptionsLoadItemsDetail } from '../internal/components/dropdown/interfaces';
import AutosuggestInput, { AutosuggestInputRef } from '../internal/components/autosuggest-input';
import { useMergeRefs } from '../internal/hooks/use-merge-refs';

const DROPDOWN_WIDTH = 300;

export interface PropertyFilterAutosuggestProps extends AutosuggestProps, InternalBaseComponentProps {
  customContent?: React.ReactNode;
  filterText?: string;
  onOptionClick?: CancelableEventHandler<AutosuggestProps.Option>;
  hideEnteredTextOption?: boolean;
}

const PropertyFilterAutosuggest = React.forwardRef(
  (props: PropertyFilterAutosuggestProps, ref: Ref<AutosuggestInputRef>) => {
    const {
      value,
      onChange,
      onFocus,
      onBlur,
      onLoadItems,
      options,
      filteringType = 'auto',
      statusType = 'finished',
      placeholder,
      disabled,
      ariaLabel,
      enteredTextLabel,
      onKeyDown,
      virtualScroll,
      expandToViewport,
      customContent,
      filterText,
      onOptionClick,
      hideEnteredTextOption,
      ...rest
    } = props;
    const highlightText = filterText === undefined ? value : filterText;

    const autosuggestInputRef = useRef<AutosuggestInputRef>(null);
    const mergedRef = useMergeRefs(autosuggestInputRef, ref);

    const [autosuggestItemsState, autosuggestItemsHandlers] = useAutosuggestItems({
      options: options || [],
      filterValue: value,
      filterText: highlightText,
      filteringType,
      hideEnteredTextLabel: hideEnteredTextOption,
      onSelectItem: (option: AutosuggestItem) => {
        const value = option.value || '';
        fireNonCancelableEvent(onChange, { value });
        const selectedCancelled = fireCancelableEvent(onOptionClick, option);
        if (!selectedCancelled) {
          autosuggestInputRef.current?.close();
        } else {
          autosuggestItemsHandlers.resetHighlightWithKeyboard();
        }
      },
    });

    const autosuggestLoadMoreHandlers = useAutosuggestLoadMore({
      options,
      statusType,
      onLoadItems: (detail: OptionsLoadItemsDetail) => fireNonCancelableEvent(onLoadItems, detail),
    });

    const handleChange = (event: NonCancelableCustomEvent<BaseChangeDetail>) => {
      autosuggestItemsHandlers.resetHighlightWithKeyboard();
      fireNonCancelableEvent(onChange, event.detail);
    };

    const handleDelayedInput = (event: NonCancelableCustomEvent<BaseChangeDetail>) => {
      autosuggestLoadMoreHandlers.fireLoadMoreOnInputChange(event.detail.value);
    };

    const handleFocus = () => {
      autosuggestLoadMoreHandlers.fireLoadMoreOnInputFocus();
      fireCancelableEvent(onFocus, null);
    };

    const handleBlur = () => {
      fireCancelableEvent(onBlur, null);
    };

    const handleKeyDown = (e: CustomEvent<BaseKeyDetail>) => {
      fireCancelableEvent(onKeyDown, e.detail);
    };

    const handlePressArrowDown = () => {
      autosuggestItemsHandlers.moveHighlightWithKeyboard(1);
    };

    const handlePressArrowUp = () => {
      autosuggestItemsHandlers.moveHighlightWithKeyboard(-1);
    };

    const handlePressEnter = () => {
      return autosuggestItemsHandlers.selectHighlightedOptionWithKeyboard();
    };

    const handleCloseDropdown = () => {
      autosuggestItemsHandlers.resetHighlightWithKeyboard();
    };

    const handleRecoveryClick = () => {
      autosuggestLoadMoreHandlers.fireLoadMoreOnRecoveryClick();
      autosuggestInputRef.current?.focus();
    };

    const handleDropdownMouseDown: React.MouseEventHandler = event => {
      // Prevent currently focused element from losing focus.
      event.preventDefault();
    };

    const selfControlId = useUniqueId('input');
    const controlId = rest.controlId ?? selfControlId;
    const listId = useUniqueId('list');
    const highlightedOptionId = autosuggestItemsState.highlightedOption ? generateUniqueId() : undefined;

    const isEmpty = !value && !autosuggestItemsState.items.length;
    const dropdownStatus = useDropdownStatus({ ...props, isEmpty, onRecoveryClick: handleRecoveryClick });

    return (
      <AutosuggestInput
        ref={mergedRef}
        className={styles.root}
        value={value}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        controlId={controlId}
        placeholder={placeholder}
        disabled={disabled}
        ariaLabel={ariaLabel}
        expandToViewport={expandToViewport}
        ariaControls={listId}
        ariaActivedescendant={highlightedOptionId}
        dropdownExpanded={autosuggestItemsState.items.length > 1}
        dropdownContentKey={customContent ? 'custom' : 'options'}
        dropdownContent={
          customContent || (
            <AutosuggestOptionsList
              autosuggestItemsState={autosuggestItemsState}
              autosuggestItemsHandlers={autosuggestItemsHandlers}
              highlightedOptionId={highlightedOptionId}
              highlightText={highlightText}
              listId={listId}
              controlId={controlId}
              enteredTextLabel={enteredTextLabel}
              handleLoadMore={autosuggestLoadMoreHandlers.fireLoadMoreOnScroll}
              hasDropdownStatus={dropdownStatus.content !== null}
              virtualScroll={virtualScroll}
              listBottom={!dropdownStatus.isSticky ? <DropdownFooter content={dropdownStatus.content} /> : null}
            />
          )
        }
        dropdownFooter={
          dropdownStatus.isSticky ? (
            <DropdownFooter content={dropdownStatus.content} hasItems={autosuggestItemsState.items.length >= 1} />
          ) : null
        }
        dropdownWidth={DROPDOWN_WIDTH}
        onDropdownMouseDown={handleDropdownMouseDown}
        onCloseDropdown={handleCloseDropdown}
        onDelayedInput={handleDelayedInput}
        onPressArrowDown={handlePressArrowDown}
        onPressArrowUp={handlePressArrowUp}
        onPressEnter={handlePressEnter}
        {...rest}
      />
    );
  }
);

export default PropertyFilterAutosuggest;
