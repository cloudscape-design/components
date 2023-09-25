// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { Ref, useImperativeHandle, useRef } from 'react';
import clsx from 'clsx';

import { useAutosuggestItems } from './options-controller';
import { AutosuggestItem, AutosuggestProps } from './interfaces';

import { useDropdownStatus } from '../internal/components/dropdown-status';
import DropdownFooter from '../internal/components/dropdown-footer';

import { useUniqueId } from '../internal/hooks/use-unique-id';
import {
  BaseKeyDetail,
  fireCancelableEvent,
  fireNonCancelableEvent,
  NonCancelableCustomEvent,
} from '../internal/events';
import { BaseChangeDetail } from '../input/interfaces';
import { checkOptionValueField } from '../select/utils/check-option-value-field';
import checkControlled from '../internal/hooks/check-controlled';
import { InternalBaseComponentProps } from '../internal/hooks/use-base-component';
import AutosuggestOptionsList from './options-list';
import { useAutosuggestLoadMore } from './load-more-controller';
import { OptionsLoadItemsDetail } from '../internal/components/dropdown/interfaces';
import AutosuggestInput, { AutosuggestInputRef } from '../internal/components/autosuggest-input';
import { useFormFieldContext } from '../contexts/form-field';
import { useInternalI18n } from '../i18n/context';

import styles from './styles.css.js';
import { warnOnce } from '@cloudscape-design/component-toolkit/internal';

export interface InternalAutosuggestProps extends AutosuggestProps, InternalBaseComponentProps {}

const InternalAutosuggest = React.forwardRef((props: InternalAutosuggestProps, ref: Ref<AutosuggestProps.Ref>) => {
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
    clearAriaLabel,
    name,
    disabled,
    disableBrowserAutocorrect = false,
    autoFocus,
    readOnly,
    ariaLabel,
    ariaRequired,
    enteredTextLabel,
    filteringResultsText,
    onKeyDown,
    virtualScroll,
    expandToViewport,
    onSelect,
    renderHighlightedAriaLive,
    __internalRootRef,
    ...restProps
  } = props;

  checkControlled('Autosuggest', 'value', value, 'onChange', onChange);
  checkOptionValueField('Autosuggest', 'options', options);

  const autosuggestInputRef = useRef<AutosuggestInputRef>(null);
  useImperativeHandle(
    ref,
    () => ({
      focus: () => autosuggestInputRef.current?.focus(),
      select: () => autosuggestInputRef.current?.select(),
    }),
    []
  );

  const i18n = useInternalI18n('autosuggest');
  const errorIconAriaLabel = i18n('errorIconAriaLabel', restProps.errorIconAriaLabel);
  const selectedAriaLabel = i18n('selectedAriaLabel', restProps.selectedAriaLabel);
  const recoveryText = i18n('recoveryText', restProps.recoveryText);

  if (!enteredTextLabel) {
    warnOnce('Autosuggest', 'A value for enteredTextLabel must be provided.');
  }

  const [autosuggestItemsState, autosuggestItemsHandlers] = useAutosuggestItems({
    options: options || [],
    filterValue: value,
    filterText: value,
    filteringType,
    hideEnteredTextLabel: false,
    onSelectItem: (option: AutosuggestItem) => {
      const value = option.value || '';
      fireNonCancelableEvent(onChange, { value });
      fireNonCancelableEvent(onSelect, {
        value,
        selectedOption: option.type !== 'use-entered' ? option.option : undefined,
      });
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

  const handleKeyUp = (event: CustomEvent<BaseKeyDetail>) => {
    fireCancelableEvent(onKeyUp, event.detail, event);
  };

  const handleKeyDown = (event: CustomEvent<BaseKeyDetail>) => {
    fireCancelableEvent(onKeyDown, event.detail, event);
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
  const footerControlId = useUniqueId('footer');
  const controlId = formFieldContext.controlId ?? selfControlId;
  const listId = useUniqueId('list');
  const highlightedOptionIdSource = useUniqueId();
  const highlightedOptionId = autosuggestItemsState.highlightedOption ? highlightedOptionIdSource : undefined;

  const isEmpty = !value && !autosuggestItemsState.items.length;
  const isFiltered = !!value && value.length !== 0;
  const filteredText = isFiltered
    ? filteringResultsText?.(autosuggestItemsState.items.length, options?.length ?? 0)
    : undefined;
  const dropdownStatus = useDropdownStatus({
    ...props,
    isEmpty,
    isFiltered,
    recoveryText,
    errorIconAriaLabel,
    onRecoveryClick: handleRecoveryClick,
    filteringResultsText: filteredText,
    hasRecoveryCallback: !!onLoadItems,
  });

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
      clearAriaLabel={clearAriaLabel}
      disableBrowserAutocorrect={disableBrowserAutocorrect}
      expandToViewport={expandToViewport}
      ariaControls={listId}
      ariaActivedescendant={highlightedOptionId}
      dropdownExpanded={autosuggestItemsState.items.length > 1 || dropdownStatus.content !== null}
      dropdownContent={
        <AutosuggestOptionsList
          statusType={statusType}
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
          listBottom={
            !dropdownStatus.isSticky ? <DropdownFooter content={dropdownStatus.content} id={footerControlId} /> : null
          }
          ariaDescribedby={dropdownStatus.content ? footerControlId : undefined}
        />
      }
      dropdownFooter={
        dropdownStatus.isSticky ? (
          <DropdownFooter
            id={footerControlId}
            content={dropdownStatus.content}
            hasItems={autosuggestItemsState.items.length >= 1}
          />
        ) : null
      }
      loopFocus={statusType === 'error' && !!recoveryText && !!onLoadItems}
      onCloseDropdown={handleCloseDropdown}
      onDelayedInput={handleDelayedInput}
      onPressArrowDown={handlePressArrowDown}
      onPressArrowUp={handlePressArrowUp}
      onPressEnter={handlePressEnter}
    />
  );
});

export default InternalAutosuggest;
