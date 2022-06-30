// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import clsx from 'clsx';
import React, { useRef } from 'react';
import InternalInput from '../input/internal';
import { getBaseProps } from '../internal/base-component';
import useForwardFocus from '../internal/hooks/forward-focus';
import { fireNonCancelableEvent } from '../internal/events';
import styles from './styles.css.js';
import { InternalBaseComponentProps } from '../internal/hooks/use-base-component';
import { TextFilterProps } from './interfaces';

type InternalTextFilterProps = TextFilterProps & InternalBaseComponentProps;

const InternalTextFilter = React.forwardRef(
  (
    {
      filteringText,
      filteringAriaLabel,
      filteringPlaceholder,
      disabled,
      countText,
      onChange,
      onDelayedChange,
      __internalRootRef,
      ...rest
    }: InternalTextFilterProps,
    ref: React.Ref<TextFilterProps.Ref>
  ) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const baseProps = getBaseProps(rest);
    useForwardFocus(ref, inputRef);
    const showResults = filteringText && countText && !disabled;

    return (
      <span {...baseProps} className={clsx(baseProps.className, styles.root)} ref={__internalRootRef}>
        <InternalInput
          ref={inputRef}
          className={styles.input}
          type="search"
          ariaLabel={filteringAriaLabel}
          placeholder={filteringPlaceholder}
          value={filteringText}
          disabled={disabled}
          autoComplete={false}
          onChange={event => fireNonCancelableEvent(onChange, { filteringText: event.detail.value })}
          __onDelayedInput={event => fireNonCancelableEvent(onDelayedChange, { filteringText: event.detail.value })}
        />
        <span
          aria-live="polite"
          aria-atomic="true"
          className={clsx(styles.results, showResults && styles['results-visible'])}
        >
          {showResults ? countText : ''}
        </span>
      </span>
    );
  }
);

export default InternalTextFilter;
