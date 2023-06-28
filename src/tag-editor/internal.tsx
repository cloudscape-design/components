// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useRef, useState } from 'react';

import { AutosuggestProps } from '../autosuggest/interfaces';
import InternalAutosuggest from '../autosuggest/internal';
import { InputProps } from '../input/interfaces';
import { DropdownStatusProps } from '../internal/components/dropdown-status';

import { KeyCode } from '../internal/keycode';
import { makeCancellable, PromiseCancelledSignal } from '../internal/utils/promises';

import styles from './styles.css.js';

interface FilteringParams {
  key?: string;
  value?: string;
}
export interface TagControlProps {
  row: number;
  value: string;
  readOnly: boolean;
  defaultOptions: AutosuggestProps.Options;
  placeholder?: string;
  errorText?: string;
  loadingText?: string;
  suggestionText?: string;
  tooManySuggestionText?: string;
  limit: number;
  filteringKey?: string;
  clearAriaLabel?: string;
  enteredTextLabel?: (value: string) => string;
  onChange: (value: string, row: number) => void;
  onBlur?: (row: number) => void;
  onRequest?: (value: string) => Promise<readonly string[]>;

  initialOptionsRef?: React.MutableRefObject<AutosuggestProps.Options>;
}

export const TagControl = React.forwardRef(
  (
    {
      row,
      value,
      readOnly,
      defaultOptions,
      placeholder,
      errorText,
      loadingText,
      suggestionText,
      tooManySuggestionText,
      limit,
      filteringKey,
      enteredTextLabel,
      clearAriaLabel,
      onChange,
      onBlur,
      onRequest,
      initialOptionsRef,
    }: TagControlProps,
    ref: React.Ref<InputProps.Ref>
  ) => {
    const [options, setOptions] = useState<AutosuggestProps.Options>(defaultOptions);
    const [statusType, setStatusType] = useState<DropdownStatusProps.StatusType>();
    const requestCancelFnRef = useRef<{ cancel: () => void; isCancelled: () => boolean }>({
      cancel: () => {},
      isCancelled: () => false,
    });

    const latestFilteringQuery = useRef<FilteringParams>({ key: undefined, value: undefined });
    const isSameQuery = (key: string | undefined, value: string) =>
      latestFilteringQuery.current.key === key && latestFilteringQuery.current.value === value;

    const onLoadItems = (filteringText: string) => {
      if (!onRequest || isSameQuery(filteringKey, filteringText) || requestCancelFnRef.current.isCancelled()) {
        return;
      }
      requestCancelFnRef.current.cancel();

      if (latestFilteringQuery.current.key !== filteringKey) {
        // Reset suggestions for values if the key is different.
        setOptions([]);
      } else if (filteringText === '' && initialOptionsRef?.current && initialOptionsRef.current.length > 0) {
        // Load in the background, if the value is empty and we already have suggestions.
        setOptions(initialOptionsRef.current);
      }

      setStatusType('loading');
      latestFilteringQuery.current = { key: filteringKey, value: filteringText };

      const { promise, cancel, isCancelled } = makeCancellable(onRequest(filteringText));
      promise
        .then(newValues => {
          const newOptions = newValues.map(value => ({ value }));
          setStatusType(undefined);
          setOptions(newOptions);
          if (initialOptionsRef) {
            initialOptionsRef.current = newOptions;
          }
        })
        .catch(err => {
          if (!(err instanceof PromiseCancelledSignal)) {
            setStatusType('error');
          }
        });
      requestCancelFnRef.current = { cancel, isCancelled };
    };

    return (
      <InternalAutosuggest
        ref={ref}
        value={value}
        readOnly={readOnly}
        statusType={statusType}
        options={options.length < limit ? options : []}
        empty={options.length < limit ? suggestionText : tooManySuggestionText}
        placeholder={placeholder}
        errorText={errorText}
        loadingText={loadingText}
        enteredTextLabel={enteredTextLabel}
        clearAriaLabel={clearAriaLabel}
        onChange={({ detail }) => onChange(detail.value, row)}
        onBlur={() => onBlur?.(row)}
        onFocus={() => {
          onLoadItems('');
        }}
        onLoadItems={({ detail }) => {
          onLoadItems(detail.filteringText);
        }}
      />
    );
  }
);

export interface UndoButtonProps {
  children: React.ReactNode;
  onClick: () => void;
}

export const UndoButton = React.forwardRef(
  ({ children, onClick }: UndoButtonProps, ref: React.Ref<HTMLAnchorElement>) => {
    return (
      <a
        ref={ref}
        role="button"
        tabIndex={0}
        className={styles['undo-button']}
        onClick={onClick}
        onKeyDown={event => {
          if (event.keyCode === KeyCode.space || event.keyCode === KeyCode.enter) {
            event.preventDefault();
          }
          // Enter activates the button on key down instead of key up.
          if (event.keyCode === KeyCode.enter) {
            onClick();
          }
        }}
        onKeyUp={event => {
          // Emulate button behavior, which also fires on space.
          if (event.keyCode === KeyCode.space) {
            onClick();
          }
        }}
      >
        {children}
      </a>
    );
  }
);
