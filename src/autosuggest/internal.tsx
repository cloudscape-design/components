// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import clsx from 'clsx';
import React, { Ref, useCallback, useEffect, useRef, useState } from 'react';

import {
  useAutosuggestItems,
  useFilteredItems,
  useKeyboardHandler,
  useSelectVisibleOption,
  useHighlightVisibleOption,
  getParentGroup,
} from './controller';
import { useDropdownA11yProps } from './hooks/a11y';
import { AutosuggestItem, AutosuggestProps } from './interfaces';
import VirtualList from './virtual-list';
import PlainList from './plain-list';

import Dropdown from '../internal/components/dropdown';
import { useDropdownStatus } from '../internal/components/dropdown-status';
import DropdownFooter from '../internal/components/dropdown-footer';

import { useFormFieldContext } from '../internal/context/form-field-context';
import { getBaseProps } from '../internal/base-component';
import { useUniqueId } from '../internal/hooks/use-unique-id';
import useForwardFocus from '../internal/hooks/forward-focus';
import { fireNonCancelableEvent, CancelableEventHandler } from '../internal/events';
import { createHighlightedOptionHook } from '../internal/components/options-list/utils/use-highlight-option';
import InternalInput from '../input/internal';
import { InputProps } from '../input/interfaces';
import styles from './styles.css.js';
import { checkOptionValueField } from '../select/utils/check-option-value-field';
import checkControlled from '../internal/hooks/check-controlled';
import { fireCancelableEvent } from '../internal/events/index';
import { InternalBaseComponentProps } from '../internal/hooks/use-base-component';
import { useAnnouncement } from '../select/utils/use-announcement';
import { OptionGroup } from '../internal/components/option/interfaces';
import TabTrap from '../internal/components/tab-trap';

export interface InternalAutosuggestProps extends AutosuggestProps, InternalBaseComponentProps {
  __filterText?: string;
  __dropdownWidth?: number;
  __onOptionClick?: CancelableEventHandler<AutosuggestProps.Option>;
  __disableShowAll?: boolean;
  __hideEnteredTextOption?: boolean;
  __onOpen?: CancelableEventHandler<null>;
}

const isInteractive = (option?: AutosuggestItem) => {
  return !!option && !option.disabled && option.type !== 'parent';
};

const isHighlightable = (option?: AutosuggestItem) => {
  return !!option && option.type !== 'parent';
};

const useHighlightedOption = createHighlightedOptionHook({ isHighlightable: isHighlightable });

const createMouseEventHandler =
  (handler: (index: number) => void, usingMouse: React.MutableRefObject<boolean>) => (itemIndex: number) => {
    // prevent mouse events to avoid losing focus from the input
    usingMouse.current = true;
    if (itemIndex > -1) {
      handler(itemIndex);
    }
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
    __dropdownWidth,
    __onOptionClick,
    __disableShowAll,
    __hideEnteredTextOption,
    __onOpen,
    __internalRootRef,
    ...rest
  } = props;
  let { __filterText: filterText } = rest;
  filterText = filterText === undefined ? value : filterText;

  checkControlled('Autosuggest', 'value', value, 'onChange', onChange);
  checkOptionValueField('Autosuggest', 'options', options);

  const usingMouse = useRef(true);
  const [showAll, setShowAll] = useState(false);
  const [open, setOpen] = useState(false);
  const autosuggestItems = useAutosuggestItems(options);
  const filteredItems = useFilteredItems(
    autosuggestItems,
    value,
    filterText,
    filteringType,
    showAll,
    __hideEnteredTextOption
  );
  const openDropdown = () => !readOnly && setOpen(true);
  const scrollToIndex = useRef<(index: number) => void>(null);
  const { highlightedOption, highlightedIndex, moveHighlight, resetHighlight, setHighlightedIndex } =
    useHighlightedOption(filteredItems);
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
    const selectedCancelled = fireCancelableEvent(__onOptionClick, option);
    if (!selectedCancelled) {
      closeDropdown();
    } else {
      resetHighlight();
    }
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

  const highlightVisibleOption = useHighlightVisibleOption(filteredItems, setHighlightedIndex, isHighlightable);
  const selectVisibleOption = useSelectVisibleOption(filteredItems, selectOption, isInteractive);
  const handleMouseUp = createMouseEventHandler(selectVisibleOption, usingMouse);
  const handleMouseMove = createMouseEventHandler(highlightVisibleOption, usingMouse);
  const handleKeyDown = useKeyboardHandler(moveHighlight, openDropdown, selectHighlighted, usingMouse, open, onKeyDown);
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
  const expanded = open && filteredItems.length > 1;
  const [inputA11yProps, highlightedA11yProps] = useDropdownA11yProps(listId, expanded, ariaLabel, highlightedOption);

  const nativeAttributes = {
    name,
    placeholder,
    autoFocus,
    onClick: openDropdown,
    ...inputA11yProps,
  };
  const handleInputFocus: InputProps['onFocus'] = e => {
    !__disableShowAll && setShowAll(true);
    const openPrevented = fireCancelableEvent(__onOpen, null);
    if (!openPrevented) {
      openDropdown();
      fireLoadMore(true, false, '');
    }
    onFocus?.(e);
  };

  useEffect(() => {
    scrollToIndex.current?.(highlightedIndex);
  }, [highlightedIndex]);

  const isEmpty = !value && !filteredItems.length;
  const showRecoveryLink = open && statusType === 'error' && props.recoveryText;
  const dropdownStatus = useDropdownStatus({ ...props, isEmpty, onRecoveryClick: handleRecoveryClick });
  const ListComponent = virtualScroll ? VirtualList : PlainList;

  const handleMouseDown = (event: React.MouseEvent) => {
    // prevent currently focused element from losing it
    event.preventDefault();
  };

  const announcement = useAnnouncement({
    announceSelected: true,
    highlightedOption,
    getParent: option => getParentGroup(option)?.option as undefined | OptionGroup,
    selectedAriaLabel,
    renderHighlightedAriaLive,
  });

  return (
    <div {...baseProps} className={clsx(styles.root, baseProps.className)} ref={__internalRootRef} onBlur={handleBlur}>
      <Dropdown
        minWidth={__dropdownWidth}
        stretchWidth={!__dropdownWidth}
        trigger={
          <>
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
            <TabTrap
              focusNextCallback={() => dropdownStatus.focusRecoveryLink()}
              disabled={!open || !showRecoveryLink}
            />
          </>
        }
        onMouseDown={handleMouseDown}
        open={open}
        dropdownId={dropdownId}
        footer={
          dropdownStatus.isSticky ? (
            <div ref={dropdownFooterRef} className={styles['dropdown-footer']}>
              <TabTrap focusNextCallback={() => inputRef.current?.focus()} disabled={!showRecoveryLink} />
              <DropdownFooter content={dropdownStatus.content} hasItems={filteredItems.length >= 1} />
              <TabTrap focusNextCallback={() => inputRef.current?.focus()} disabled={!showRecoveryLink} />
            </div>
          ) : null
        }
        expandToViewport={expandToViewport}
        hasContent={filteredItems.length >= 1 || dropdownStatus.content !== null}
      >
        {open && (
          <ListComponent
            listBottom={!dropdownStatus.isSticky ? <DropdownFooter content={dropdownStatus.content} /> : null}
            handleLoadMore={handleLoadMore}
            filteredItems={filteredItems}
            highlightText={filterText}
            usingMouse={usingMouse}
            highlightedOption={highlightedOption}
            enteredTextLabel={enteredTextLabel}
            ref={scrollToIndex}
            highlightedA11yProps={highlightedA11yProps}
            hasDropdownStatus={dropdownStatus.content !== null}
            menuProps={{
              id: listId,
              onMouseUp: handleMouseUp,
              onMouseMove: handleMouseMove,
              ariaLabelledby: controlId,
            }}
            screenReaderContent={announcement}
          />
        )}
      </Dropdown>
    </div>
  );
});

export default InternalAutosuggest;
