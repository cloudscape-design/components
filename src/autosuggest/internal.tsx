// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import clsx from 'clsx';
import React, { Ref, useRef } from 'react';

import { useInputKeydownHandler } from './input-controller';
import { useAutosuggestItems } from './options-controller';
import { AutosuggestItem, AutosuggestProps } from './interfaces';

import Dropdown from '../internal/components/dropdown';
import { useDropdownStatus } from '../internal/components/dropdown-status';
import DropdownFooter from '../internal/components/dropdown-footer';

import { useFormFieldContext } from '../internal/context/form-field-context';
import { getBaseProps } from '../internal/base-component';
import { generateUniqueId, useUniqueId } from '../internal/hooks/use-unique-id';
import useForwardFocus from '../internal/hooks/forward-focus';
import { fireCancelableEvent, fireNonCancelableEvent } from '../internal/events';
import InternalInput from '../input/internal';
import { InputProps } from '../input/interfaces';
import styles from './styles.css.js';
import { checkOptionValueField } from '../select/utils/check-option-value-field';
import checkControlled from '../internal/hooks/check-controlled';
import { InternalBaseComponentProps } from '../internal/hooks/use-base-component';
import AutosuggestOptionsList from './options-list';
import { useAutosuggestDropdown } from './dropdown-controller';
import { useAutosuggestLoadMore } from './load-more-controller';
import { OptionsLoadItemsDetail } from '../internal/components/dropdown/interfaces';

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
    ...rest
  } = props;

  checkControlled('Autosuggest', 'value', value, 'onChange', onChange);
  checkOptionValueField('Autosuggest', 'options', options);

  const [autosuggestItemsState, autosuggestItemsHandlers] = useAutosuggestItems({
    options: options || [],
    filterValue: value,
    filterText: value,
    filteringType,
    hideEnteredTextLabel: false,
    onSelectItem: (option: AutosuggestItem) => {
      const value = option.value || '';
      fireNonCancelableEvent(onChange, { value });
      autosuggestDropdownHandlers.closeDropdown();
      fireNonCancelableEvent(onSelect, { value });
    },
  });
  const [{ open }, autosuggestDropdownHandlers, autosuggestDropdownRefs] = useAutosuggestDropdown({
    readOnly,
    onClose: () => autosuggestItemsHandlers.resetHighlightWithKeyboard(),
    onBlur: () => fireNonCancelableEvent(onBlur),
  });
  const autosuggestLoadMoreHandlers = useAutosuggestLoadMore({
    options,
    statusType,
    onLoadItems: (detail: OptionsLoadItemsDetail) => fireNonCancelableEvent(onLoadItems, detail),
  });

  const handleInputChange = (value: string) => {
    autosuggestDropdownHandlers.openDropdown();
    autosuggestItemsHandlers.setShowAll(false);
    autosuggestItemsHandlers.resetHighlightWithKeyboard();
    fireNonCancelableEvent(onChange, { value });
  };

  const handleKeyDown = useInputKeydownHandler({
    open,
    onPressArrowDown() {
      autosuggestItemsHandlers.moveHighlightWithKeyboard(1);
      autosuggestDropdownHandlers.openDropdown();
    },
    onPressArrowUp() {
      autosuggestItemsHandlers.moveHighlightWithKeyboard(-1);
      autosuggestDropdownHandlers.openDropdown();
    },
    onPressEnter() {
      autosuggestItemsHandlers.selectHighlightedOptionWithKeyboard();
      autosuggestDropdownHandlers.closeDropdown();
    },
    onPressEsc() {
      if (open) {
        autosuggestDropdownHandlers.closeDropdown();
      } else if (value) {
        fireNonCancelableEvent(onChange, { value: '' });
      }
    },
    onKeyDown(e) {
      fireCancelableEvent(onKeyDown, e.detail);
    },
  });

  const handleRecoveryClick = () => {
    autosuggestLoadMoreHandlers.fireLoadMoreOnRecoveryClick();
    inputRef.current?.focus();
  };

  const formFieldContext = useFormFieldContext(rest);
  const baseProps = getBaseProps(rest);
  const inputRef = useRef<HTMLInputElement>(null);
  useForwardFocus(ref, inputRef);

  const selfControlId = useUniqueId('input');
  const controlId = formFieldContext.controlId ?? selfControlId;
  const dropdownId = useUniqueId('dropdown');
  const listId = useUniqueId('list');

  // From an a11y point of view we only count the dropdown as 'expanded' if there are items that a user can dropdown into
  const expanded = open && autosuggestItemsState.items.length > 1;
  const highlightedOptionId = autosuggestItemsState.highlightedOption ? generateUniqueId() : undefined;
  const nativeAttributes = {
    name,
    placeholder,
    autoFocus,
    onClick: autosuggestDropdownHandlers.openDropdown,
    role: 'combobox',
    'aria-autocomplete': 'list',
    'aria-expanded': expanded,
    'aria-controls': listId,
    // 'aria-owns' needed for safari+vo to announce activedescendant content
    'aria-owns': listId,
    'aria-label': ariaLabel,
    'aria-activedescendant': highlightedOptionId,
  };

  const handleInputFocus = () => {
    autosuggestItemsHandlers.setShowAll(true);
    autosuggestDropdownHandlers.openDropdown();
    autosuggestLoadMoreHandlers.fireLoadMoreOnInputFocus();
    fireNonCancelableEvent(onFocus, null);
  };

  const isEmpty = !value && !autosuggestItemsState.items.length;
  const showRecoveryLink = open && statusType === 'error' && props.recoveryText;
  const dropdownStatus = useDropdownStatus({ ...props, isEmpty, onRecoveryClick: handleRecoveryClick });

  return (
    <div
      {...baseProps}
      className={clsx(styles.root, baseProps.className)}
      ref={__internalRootRef}
      onBlur={autosuggestDropdownHandlers.handleBlur}
    >
      <Dropdown
        trigger={
          <InternalInput
            type="search"
            value={value}
            onChange={event => handleInputChange(event.detail.value)}
            __onDelayedInput={event => autosuggestLoadMoreHandlers.fireLoadMoreOnInputChange(event.detail.value)}
            onFocus={handleInputFocus}
            onKeyDown={handleKeyDown}
            onKeyUp={onKeyUp}
            disabled={disabled}
            disableBrowserAutocorrect={disableBrowserAutocorrect}
            readOnly={readOnly}
            ariaRequired={ariaRequired}
            ref={inputRef}
            autoComplete={false}
            __nativeAttributes={nativeAttributes}
            {...formFieldContext}
            controlId={controlId}
          />
        }
        onMouseDown={autosuggestDropdownHandlers.handleMouseDown}
        open={open}
        dropdownId={dropdownId}
        footer={
          dropdownStatus.isSticky ? (
            <div ref={autosuggestDropdownRefs.footerRef} className={styles['dropdown-footer']}>
              <DropdownFooter content={dropdownStatus.content} hasItems={autosuggestItemsState.items.length >= 1} />
            </div>
          ) : null
        }
        expandToViewport={expandToViewport}
        hasContent={autosuggestItemsState.items.length >= 1 || dropdownStatus.content !== null}
        trapFocus={!!showRecoveryLink}
      >
        {open && (
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
        )}
      </Dropdown>
    </div>
  );
});

export default InternalAutosuggest;
