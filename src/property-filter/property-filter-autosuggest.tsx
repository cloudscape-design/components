// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import clsx from 'clsx';
import React, { Ref, useCallback, useRef, useState } from 'react';

import { useKeyboardHandler } from '../autosuggest/controller';
import { useAutosuggestItems } from '../autosuggest/options-controller';
import { AutosuggestItem, AutosuggestProps } from '../autosuggest/interfaces';

import Dropdown from '../internal/components/dropdown';
import { useDropdownStatus } from '../internal/components/dropdown-status';
import DropdownFooter from '../internal/components/dropdown-footer';

import { useFormFieldContext } from '../internal/context/form-field-context';
import { getBaseProps } from '../internal/base-component';
import { generateUniqueId, useUniqueId } from '../internal/hooks/use-unique-id';
import useForwardFocus from '../internal/hooks/forward-focus';
import { fireNonCancelableEvent, CancelableEventHandler } from '../internal/events';
import InternalInput from '../input/internal';
import { InputProps } from '../input/interfaces';
import styles from '../autosuggest/styles.css.js';
import { fireCancelableEvent } from '../internal/events/index';
import { InternalBaseComponentProps } from '../internal/hooks/use-base-component';
import AutosuggestOptionsList from '../autosuggest/options-list';

const DROPDOWN_WIDTH = 300;

export interface PropertyFilterAutosuggestProps extends AutosuggestProps, InternalBaseComponentProps {
  filterText?: string;
  onOpen?: CancelableEventHandler<null>;
  onOptionClick?: CancelableEventHandler<AutosuggestProps.Option>;
  hideEnteredTextOption?: boolean;
}

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

const PropertyFilterAutosuggest = React.forwardRef(
  (props: PropertyFilterAutosuggestProps, ref: Ref<InputProps.Ref>) => {
    const {
      value,
      onChange,
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
      filterText,
      onOpen,
      onOptionClick,
      hideEnteredTextOption,
      ...rest
    } = props;
    const highlightText = filterText === undefined ? value : filterText;

    const usingMouse = useRef(true);
    const [open, setOpen] = useState(false);
    const { items, highlightedOption, highlightedIndex, moveHighlight, resetHighlight, setHighlightedIndex } =
      useAutosuggestItems({
        options: options || [],
        filterValue: value,
        filterText: highlightText,
        filteringType,
        hideEnteredTextLabel: hideEnteredTextOption,
      });
    const openDropdown = () => setOpen(true);
    const closeDropdown = () => {
      setOpen(false);
      resetHighlight();
    };
    const handleBlur: React.FocusEventHandler = event => {
      if (
        event.currentTarget.contains(event.relatedTarget) ||
        dropdownFooterRef.current?.contains(event.relatedTarget)
      ) {
        return;
      }
      closeDropdown();
    };
    const selectOption = (option: AutosuggestItem) => {
      const value = option.value || '';
      fireNonCancelableEvent(onChange, { value });
      const selectedCancelled = fireCancelableEvent(onOptionClick, option);
      if (!selectedCancelled) {
        closeDropdown();
      } else {
        resetHighlight();
      }
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
      resetHighlight();
      onChange && onChange(e);
    };

    const handleKeyDown = useKeyboardHandler(
      moveHighlight,
      openDropdown,
      selectHighlighted,
      usingMouse,
      open,
      onKeyDown
    );
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
      placeholder,
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

    const handleInputFocus: InputProps['onFocus'] = () => {
      const openPrevented = fireCancelableEvent(onOpen, null);
      if (!openPrevented) {
        openDropdown();
        fireLoadMore(true, false, '');
      }
    };

    const isEmpty = !value && !items.length;
    const showRecoveryLink = open && statusType === 'error' && props.recoveryText;
    const dropdownStatus = useDropdownStatus({ ...props, isEmpty, onRecoveryClick: handleRecoveryClick });

    const handleMouseDown = (event: React.MouseEvent) => {
      // prevent currently focused element from losing it
      event.preventDefault();
    };

    return (
      <div {...baseProps} className={clsx(styles.root, baseProps.className)} onBlur={handleBlur}>
        <Dropdown
          minWidth={DROPDOWN_WIDTH}
          stretchWidth={false}
          trigger={
            <InternalInput
              type="search"
              value={value}
              onChange={handleInputChange}
              __onDelayedInput={event => fireLoadMore(true, false, event.detail.value)}
              onFocus={handleInputFocus}
              onKeyDown={handleKeyDown}
              disabled={disabled}
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
              highlightText={highlightText}
              listId={listId}
              controlId={controlId}
              enteredTextLabel={enteredTextLabel}
              handleLoadMore={handleLoadMore}
              hasDropdownStatus={dropdownStatus.content !== null}
              virtualScroll={virtualScroll}
              listBottom={!dropdownStatus.isSticky ? <DropdownFooter content={dropdownStatus.content} /> : null}
              usingMouse={usingMouse}
            />
          )}
        </Dropdown>
      </div>
    );
  }
);

export default PropertyFilterAutosuggest;
