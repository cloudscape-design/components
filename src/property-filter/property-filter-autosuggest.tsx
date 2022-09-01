// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import clsx from 'clsx';
import React, { Ref, useCallback, useRef, useImperativeHandle } from 'react';

import { useKeyboardHandler } from '../autosuggest/controller';
import { useAutosuggestItems } from '../autosuggest/options-controller';
import { AutosuggestItem, AutosuggestProps } from '../autosuggest/interfaces';

import Dropdown from '../internal/components/dropdown';
import { useDropdownStatus } from '../internal/components/dropdown-status';
import DropdownFooter from '../internal/components/dropdown-footer';

import { useFormFieldContext } from '../internal/context/form-field-context';
import { getBaseProps } from '../internal/base-component';
import { generateUniqueId, useUniqueId } from '../internal/hooks/use-unique-id';
import { fireNonCancelableEvent, CancelableEventHandler } from '../internal/events';
import InternalInput from '../input/internal';
import { InputProps } from '../input/interfaces';
import styles from '../autosuggest/styles.css.js';
import { fireCancelableEvent } from '../internal/events/index';
import { InternalBaseComponentProps } from '../internal/hooks/use-base-component';
import AutosuggestOptionsList from '../autosuggest/options-list';
import { useAutosuggestDropdown } from '../autosuggest/dropdown-controller';

const DROPDOWN_WIDTH = 300;

export interface PropertyFilterAutosuggestRef extends InputProps.Ref {
  close: () => void;
}

export interface PropertyFilterAutosuggestProps extends AutosuggestProps, InternalBaseComponentProps {
  customContent?: React.ReactNode;
  filterText?: string;
  onOpen?: CancelableEventHandler<null>;
  onOptionClick?: CancelableEventHandler<AutosuggestProps.Option>;
  hideEnteredTextOption?: boolean;
}

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
      customContent,
      filterText,
      onOpen,
      onOptionClick,
      hideEnteredTextOption,
      ...rest
    } = props;
    const highlightText = filterText === undefined ? value : filterText;

    const selectOption = (option: AutosuggestItem) => {
      const value = option.value || '';
      fireNonCancelableEvent(onChange, { value });
      const selectedCancelled = fireCancelableEvent(onOptionClick, option);
      if (!selectedCancelled) {
        autosuggestDropdownHandlers.closeDropdown();
      } else {
        autosuggestItemsHandlers.resetHighlightWithKeyboard();
      }
    };

    const [autosuggestItemsState, autosuggestItemsHandlers] = useAutosuggestItems({
      options: options || [],
      filterValue: value,
      filterText: value,
      filteringType,
      hideEnteredTextLabel: hideEnteredTextOption,
      onSelectItem: selectOption,
    });
    const [{ open }, autosuggestDropdownHandlers, autosuggestDropdownRefs] = useAutosuggestDropdown({
      onClose: () => autosuggestItemsHandlers.resetHighlightWithKeyboard(),
    });

    const fireLoadMore = useLoadMoreItems(onLoadItems);

    const handleInputChange: InputProps['onChange'] = e => {
      autosuggestDropdownHandlers.openDropdown();
      autosuggestItemsHandlers.resetHighlightWithKeyboard();
      onChange && onChange(e);
    };

    const handleKeyDown = useKeyboardHandler(
      open,
      autosuggestDropdownHandlers.openDropdown,
      autosuggestDropdownHandlers.closeDropdown,
      autosuggestItemsHandlers.interceptKeyDown,
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

    useImperativeHandle(ref, () => ({
      focus(...args: Parameters<HTMLElement['focus']>) {
        inputRef.current?.focus(...args);
      },
      select() {},
      close() {
        autosuggestDropdownHandlers.closeDropdown();
      },
    }));

    const selfControlId = useUniqueId('input');
    const controlId = formFieldContext.controlId ?? selfControlId;
    const dropdownId = useUniqueId('dropdown');
    const listId = useUniqueId('list');

    // From an a11y point of view we only count the dropdown as 'expanded' if there are items that a user can dropdown into
    const expanded = open && autosuggestItemsState.items.length > 1;
    const highlightedOptionId = autosuggestItemsState.highlightedOption ? generateUniqueId() : undefined;
    const nativeAttributes = {
      placeholder,
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

    const handleInputFocus: InputProps['onFocus'] = () => {
      const openPrevented = fireCancelableEvent(onOpen, null);
      if (!openPrevented) {
        autosuggestDropdownHandlers.openDropdown();
        fireLoadMore(true, false, '');
      }
    };

    const isEmpty = !value && !autosuggestItemsState.items.length;
    const showRecoveryLink = open && statusType === 'error' && props.recoveryText;
    const dropdownStatus = useDropdownStatus({ ...props, isEmpty, onRecoveryClick: handleRecoveryClick });

    const handleMouseDown = (event: React.MouseEvent) => {
      // prevent currently focused element from losing it
      if (!customContent) {
        event.preventDefault();
      }
    };

    return (
      <div
        {...baseProps}
        className={clsx(styles.root, baseProps.className)}
        onBlur={autosuggestDropdownHandlers.handleBlur}
      >
        <Dropdown
          key={customContent ? 'custom' : 'options'}
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
              <div ref={autosuggestDropdownRefs.footerRef} className={styles['dropdown-footer']}>
                <DropdownFooter content={dropdownStatus.content} hasItems={autosuggestItemsState.items.length >= 1} />
              </div>
            ) : null
          }
          expandToViewport={expandToViewport}
          hasContent={autosuggestItemsState.items.length >= 1 || dropdownStatus.content !== null}
          trapFocus={!!showRecoveryLink || !!customContent}
        >
          <div ref={autosuggestDropdownRefs.contentRef}>
            {open ? (
              customContent ? (
                customContent
              ) : (
                <AutosuggestOptionsList
                  autosuggestItemsState={autosuggestItemsState}
                  autosuggestItemsHandlers={autosuggestItemsHandlers}
                  selectOption={selectOption}
                  highlightedOptionId={highlightedOptionId}
                  highlightText={highlightText}
                  listId={listId}
                  controlId={controlId}
                  enteredTextLabel={enteredTextLabel}
                  handleLoadMore={handleLoadMore}
                  hasDropdownStatus={dropdownStatus.content !== null}
                  virtualScroll={virtualScroll}
                  listBottom={!dropdownStatus.isSticky ? <DropdownFooter content={dropdownStatus.content} /> : null}
                />
              )
            ) : null}
          </div>
        </Dropdown>
      </div>
    );
  }
);

export default PropertyFilterAutosuggest;
