// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import clsx from 'clsx';
import React, { Ref, useRef } from 'react';

import { useInputKeydownHandler } from '../autosuggest/input-controller';
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
import { useAutosuggestDropdown } from '../autosuggest/dropdown-controller';
import { useAutosuggestLoadMore } from '../autosuggest/load-more-controller';
import { OptionsLoadItemsDetail } from '../internal/components/dropdown/interfaces';

const DROPDOWN_WIDTH = 300;

export interface PropertyFilterAutosuggestProps extends AutosuggestProps, InternalBaseComponentProps {
  filterText?: string;
  onOpen?: CancelableEventHandler<null>;
  onOptionClick?: CancelableEventHandler<AutosuggestProps.Option>;
  hideEnteredTextOption?: boolean;
}

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
          autosuggestDropdownHandlers.closeDropdown();
        } else {
          autosuggestItemsHandlers.resetHighlightWithKeyboard();
        }
      },
    });
    const [{ open }, autosuggestDropdownHandlers, autosuggestDropdownRefs] = useAutosuggestDropdown({
      onClose: () => autosuggestItemsHandlers.resetHighlightWithKeyboard(),
    });
    const autosuggestLoadMoreHandlers = useAutosuggestLoadMore({
      options,
      statusType,
      onLoadItems: (detail: OptionsLoadItemsDetail) => fireNonCancelableEvent(onLoadItems, detail),
    });

    const handleInputChange: InputProps['onChange'] = e => {
      autosuggestDropdownHandlers.openDropdown();
      autosuggestItemsHandlers.resetHighlightWithKeyboard();
      onChange && onChange(e);
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
        if (!autosuggestItemsHandlers.selectHighlightedOptionWithKeyboard()) {
          autosuggestDropdownHandlers.closeDropdown();
        }
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
        autosuggestLoadMoreHandlers.fireLoadMoreOnInputFocus();
      }
    };

    const isEmpty = !value && !autosuggestItemsState.items.length;
    const showRecoveryLink = open && statusType === 'error' && props.recoveryText;
    const dropdownStatus = useDropdownStatus({ ...props, isEmpty, onRecoveryClick: handleRecoveryClick });

    return (
      <div
        {...baseProps}
        className={clsx(styles.root, baseProps.className)}
        onBlur={autosuggestDropdownHandlers.handleBlur}
      >
        <Dropdown
          minWidth={DROPDOWN_WIDTH}
          stretchWidth={false}
          trigger={
            <InternalInput
              type="search"
              value={value}
              onChange={handleInputChange}
              __onDelayedInput={event => autosuggestLoadMoreHandlers.fireLoadMoreOnInputChange(event.detail.value)}
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
              highlightText={highlightText}
              listId={listId}
              controlId={controlId}
              enteredTextLabel={enteredTextLabel}
              handleLoadMore={autosuggestLoadMoreHandlers.fireLoadMoreOnScroll}
              hasDropdownStatus={dropdownStatus.content !== null}
              virtualScroll={virtualScroll}
              listBottom={!dropdownStatus.isSticky ? <DropdownFooter content={dropdownStatus.content} /> : null}
            />
          )}
        </Dropdown>
      </div>
    );
  }
);

export default PropertyFilterAutosuggest;
