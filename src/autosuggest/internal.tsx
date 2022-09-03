// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { Ref, useRef } from 'react';

import { useAutosuggestItems } from './options-controller';
import { AutosuggestItem, AutosuggestProps } from './interfaces';

import { useDropdownStatus } from '../internal/components/dropdown-status';
import DropdownFooter from '../internal/components/dropdown-footer';

import { generateUniqueId, useUniqueId } from '../internal/hooks/use-unique-id';
import {
  BaseKeyDetail,
  fireCancelableEvent,
  fireNonCancelableEvent,
  NonCancelableCustomEvent,
} from '../internal/events';
import { BaseChangeDetail, InputProps } from '../input/interfaces';
import styles from './styles.css.js';
import { checkOptionValueField } from '../select/utils/check-option-value-field';
import checkControlled from '../internal/hooks/check-controlled';
import { InternalBaseComponentProps } from '../internal/hooks/use-base-component';
import AutosuggestOptionsList from './options-list';
import { useAutosuggestLoadMore } from './load-more-controller';
import { OptionsLoadItemsDetail } from '../internal/components/dropdown/interfaces';
import AutosuggestInput, { AutosuggestInputRef } from './autosuggest-input';
import useForwardFocus from '../internal/hooks/forward-focus';
import { useFormFieldContext } from '../contexts/form-field';
import clsx from 'clsx';

export interface InternalAutosuggestProps extends AutosuggestProps, InternalBaseComponentProps {}

const InternalAutosuggest = React.forwardRef((props: InternalAutosuggestProps, ref: Ref<InputProps.Ref>) => {
  const {
    value,
    onChange,
    onBlur,
    onFocus,
    onKeyUp,
    onLoadItems,
    options,
    filteringType = 'auto',
    statusType = 'finished',
    placeholder,
    name,
    disabled,
    disableBrowserAutocorrect = false,
    autoFocus,
    readOnly,
    ariaLabel,
    ariaRequired,
    enteredTextLabel,
    onKeyDown,
    virtualScroll,
    expandToViewport,
    onSelect,
    selectedAriaLabel,
    renderHighlightedAriaLive,
    __internalRootRef,
    ...restProps
  } = props;

  checkControlled('Autosuggest', 'value', value, 'onChange', onChange);
  checkOptionValueField('Autosuggest', 'options', options);

  const autosuggestInputRef = useRef<AutosuggestInputRef>(null);

  useForwardFocus(ref, autosuggestInputRef);

  const [autosuggestItemsState, autosuggestItemsHandlers] = useAutosuggestItems({
    options: options || [],
    filterValue: value,
    filterText: value,
    filteringType,
    hideEnteredTextLabel: false,
    onSelectItem: (option: AutosuggestItem) => {
      const value = option.value || '';
      fireNonCancelableEvent(onChange, { value });
      fireNonCancelableEvent(onSelect, { value });
      autosuggestInputRef.current?.close();
    },
  });

  const autosuggestLoadMoreHandlers = useAutosuggestLoadMore({
    options,
    statusType,
    onLoadItems: (detail: OptionsLoadItemsDetail) => fireNonCancelableEvent(onLoadItems, detail),
  });

  const handleChange = (event: NonCancelableCustomEvent<BaseChangeDetail>) => {
    autosuggestItemsHandlers.setShowAll(false);
    autosuggestItemsHandlers.resetHighlightWithKeyboard();
    fireNonCancelableEvent(onChange, event.detail);
  };

  const handleDelayedInput = (event: NonCancelableCustomEvent<BaseChangeDetail>) => {
    autosuggestLoadMoreHandlers.fireLoadMoreOnInputChange(event.detail.value);
  };

  const handleBlur = () => {
    fireNonCancelableEvent(onBlur, null);
  };

  const handleFocus = () => {
    autosuggestItemsHandlers.setShowAll(true);
    autosuggestLoadMoreHandlers.fireLoadMoreOnInputFocus();
    fireNonCancelableEvent(onFocus, null);
  };

  const handleKeyUp = (e: CustomEvent<BaseKeyDetail>) => {
    fireCancelableEvent(onKeyUp, e.detail);
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

  const formFieldContext = useFormFieldContext(restProps);
  const selfControlId = useUniqueId('input');
  const controlId = formFieldContext.controlId ?? selfControlId;
  const listId = useUniqueId('list');
  const highlightedOptionId = autosuggestItemsState.highlightedOption ? generateUniqueId() : undefined;

  const isEmpty = !value && !autosuggestItemsState.items.length;
  const dropdownStatus = useDropdownStatus({ ...props, isEmpty, onRecoveryClick: handleRecoveryClick });

  return (
    <AutosuggestInput
      {...restProps}
      className={clsx(styles.root, restProps.className)}
      ref={autosuggestInputRef}
      __internalRootRef={__internalRootRef}
      value={value}
      onChange={handleChange}
      onBlur={handleBlur}
      onFocus={handleFocus}
      onKeyUp={handleKeyUp}
      onKeyDown={handleKeyDown}
      name={name}
      controlId={controlId}
      placeholder={placeholder}
      disabled={disabled}
      readOnly={readOnly}
      autoFocus={autoFocus}
      ariaLabel={ariaLabel}
      ariaRequired={ariaRequired}
      disableBrowserAutocorrect={disableBrowserAutocorrect}
      expandToViewport={expandToViewport}
      ariaControls={listId}
      ariaActivedescendant={highlightedOptionId}
      dropdownExpanded={autosuggestItemsState.items.length > 1}
      dropdownContent={
        <AutosuggestOptionsList
          autosuggestItemsState={autosuggestItemsState}
          autosuggestItemsHandlers={autosuggestItemsHandlers}
          highlightedOptionId={highlightedOptionId}
          highlightText={value}
          listId={listId}
          controlId={controlId}
          enteredTextLabel={enteredTextLabel}
          handleLoadMore={autosuggestLoadMoreHandlers.fireLoadMoreOnScroll}
          hasDropdownStatus={dropdownStatus.content !== null}
          virtualScroll={virtualScroll}
          selectedAriaLabel={selectedAriaLabel}
          renderHighlightedAriaLive={renderHighlightedAriaLive}
          listBottom={!dropdownStatus.isSticky ? <DropdownFooter content={dropdownStatus.content} /> : null}
        />
      }
      dropdownFooter={
        dropdownStatus.isSticky ? (
          <DropdownFooter content={dropdownStatus.content} hasItems={autosuggestItemsState.items.length >= 1} />
        ) : null
      }
      onCloseDropdown={handleCloseDropdown}
      onDelayedInput={handleDelayedInput}
      onPressArrowDown={handlePressArrowDown}
      onPressArrowUp={handlePressArrowUp}
      onPressEnter={handlePressEnter}
    />
  );
});

export default InternalAutosuggest;
