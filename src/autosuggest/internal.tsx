// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import clsx from 'clsx';
import React, { Ref, useCallback, useRef, useState } from 'react';

import { useKeyboardHandler } from './controller';
import { useAutosuggestItems } from './options-controller';
import { AutosuggestItem, AutosuggestProps } from './interfaces';

import Dropdown from '../internal/components/dropdown';
import { useDropdownStatus } from '../internal/components/dropdown-status';
import DropdownFooter from '../internal/components/dropdown-footer';

import { useFormFieldContext } from '../internal/context/form-field-context';
import { getBaseProps } from '../internal/base-component';
import { generateUniqueId, useUniqueId } from '../internal/hooks/use-unique-id';
import useForwardFocus from '../internal/hooks/forward-focus';
import { fireNonCancelableEvent } from '../internal/events';
import InternalInput from '../input/internal';
import { InputProps } from '../input/interfaces';
import styles from './styles.css.js';
import { checkOptionValueField } from '../select/utils/check-option-value-field';
import checkControlled from '../internal/hooks/check-controlled';
import { InternalBaseComponentProps } from '../internal/hooks/use-base-component';
import AutosuggestOptionsList from './options-list';

export interface InternalAutosuggestProps extends AutosuggestProps, InternalBaseComponentProps {}

const isInteractive = (option?: AutosuggestItem) => {
  return !!option && !option.disabled && option.type !== 'parent';
};

const useLoadMoreItems = (onLoadItems: AutosuggestProps['onLoadItems']) => {
  const lastFilteringText = useRef<string | null>(null);
  return useCallback(
    (firstPage: boolean, samePage: boolean, filteringText?: string) => {
      if (samePage || !firstPage || filteringText === undefined || lastFilteringText.current !== filteringText) {
        if (filteringText !== undefined) {
          lastFilteringText.current = filteringText;
        }
        if (lastFilteringText.current !== null && onLoadItems) {
          fireNonCancelableEvent(onLoadItems, { filteringText: lastFilteringText.current, firstPage, samePage });
        }
      }
    },
    [onLoadItems]
  );
};

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

  const [open, setOpen] = useState(false);
  const {
    items,
    setShowAll,
    highlightedOption,
    highlightedIndex,
    highlightType,
    moveHighlight,
    resetHighlight,
    setHighlightedIndex,
  } = useAutosuggestItems({
    options: options || [],
    filterValue: value,
    filterText: value,
    filteringType,
    hideEnteredTextLabel: false,
  });
  const openDropdown = () => !readOnly && setOpen(true);
  const closeDropdown = () => {
    setOpen(false);
    resetHighlight();
  };
  const handleBlur: React.FocusEventHandler = event => {
    if (event.currentTarget.contains(event.relatedTarget) || dropdownFooterRef.current?.contains(event.relatedTarget)) {
      return;
    }
    closeDropdown();
    fireNonCancelableEvent(onBlur);
  };
  const selectOption = (option: AutosuggestItem) => {
    const value = option.value || '';
    fireNonCancelableEvent(onChange, { value });
    closeDropdown();
    fireNonCancelableEvent(onSelect, { value });
  };
  const selectHighlighted = () => {
    if (highlightedOption) {
      if (isInteractive(highlightedOption)) {
        selectOption(highlightedOption);
      }
    } else {
      closeDropdown();
    }
  };

  const fireLoadMore = useLoadMoreItems(onLoadItems);

  const handleInputChange: InputProps['onChange'] = e => {
    openDropdown();
    setShowAll(false);
    resetHighlight();
    onChange && onChange(e);
  };

  const handleKeyDown = useKeyboardHandler(moveHighlight, openDropdown, selectHighlighted, open, onKeyDown);
  const handleLoadMore = useCallback(() => {
    options && options.length && statusType === 'pending' && fireLoadMore(false, false);
  }, [fireLoadMore, options, statusType]);
  const handleRecoveryClick = useCallback(() => {
    fireLoadMore(false, true);
    inputRef.current?.focus();
  }, [fireLoadMore]);

  const formFieldContext = useFormFieldContext(rest);
  const baseProps = getBaseProps(rest);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownFooterRef = useRef<HTMLDivElement>(null);
  useForwardFocus(ref, inputRef);

  const selfControlId = useUniqueId('input');
  const controlId = formFieldContext.controlId ?? selfControlId;
  const dropdownId = useUniqueId('dropdown');
  const listId = useUniqueId('list');

  // From an a11y point of view we only count the dropdown as 'expanded' if there are items that a user can dropdown into
  const expanded = open && items.length > 1;
  const highlightedOptionId = highlightedOption ? generateUniqueId() : undefined;
  const nativeAttributes = {
    name,
    placeholder,
    autoFocus,
    onClick: openDropdown,
    role: 'combobox',
    'aria-autocomplete': 'list',
    'aria-expanded': expanded,
    'aria-controls': listId,
    // 'aria-owns' needed for safari+vo to announce activedescendant content
    'aria-owns': listId,
    'aria-label': ariaLabel,
    'aria-activedescendant': highlightedOptionId,
  };

  const handleInputFocus: InputProps['onFocus'] = e => {
    setShowAll(true);
    openDropdown();
    fireLoadMore(true, false, '');
    onFocus?.(e);
  };

  const isEmpty = !value && !items.length;
  const showRecoveryLink = open && statusType === 'error' && props.recoveryText;
  const dropdownStatus = useDropdownStatus({ ...props, isEmpty, onRecoveryClick: handleRecoveryClick });

  const handleMouseDown = (event: React.MouseEvent) => {
    // prevent currently focused element from losing it
    event.preventDefault();
  };

  return (
    <div {...baseProps} className={clsx(styles.root, baseProps.className)} ref={__internalRootRef} onBlur={handleBlur}>
      <Dropdown
        trigger={
          <InternalInput
            type="search"
            value={value}
            onChange={handleInputChange}
            __onDelayedInput={event => fireLoadMore(true, false, event.detail.value)}
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
        onMouseDown={handleMouseDown}
        open={open}
        dropdownId={dropdownId}
        footer={
          dropdownStatus.isSticky ? (
            <div ref={dropdownFooterRef} className={styles['dropdown-footer']}>
              <DropdownFooter content={dropdownStatus.content} hasItems={items.length >= 1} />
            </div>
          ) : null
        }
        expandToViewport={expandToViewport}
        hasContent={items.length >= 1 || dropdownStatus.content !== null}
        trapFocus={!!showRecoveryLink}
      >
        {open && (
          <AutosuggestOptionsList
            options={items}
            highlightedOption={highlightedOption}
            selectOption={selectOption}
            highlightedIndex={highlightedIndex}
            setHighlightedIndex={setHighlightedIndex}
            highlightedOptionId={highlightedOptionId}
            highlightText={value}
            listId={listId}
            controlId={controlId}
            enteredTextLabel={enteredTextLabel}
            handleLoadMore={handleLoadMore}
            hasDropdownStatus={dropdownStatus.content !== null}
            virtualScroll={virtualScroll}
            selectedAriaLabel={selectedAriaLabel}
            renderHighlightedAriaLive={renderHighlightedAriaLive}
            listBottom={!dropdownStatus.isSticky ? <DropdownFooter content={dropdownStatus.content} /> : null}
            highlightType={highlightType}
          />
        )}
      </Dropdown>
    </div>
  );
});

export default InternalAutosuggest;
