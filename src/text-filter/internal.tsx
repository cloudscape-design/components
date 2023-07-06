// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import clsx from 'clsx';
import React, { useRef } from 'react';
import InternalInput from '../input/internal';
import { getBaseProps } from '../internal/base-component';
import useForwardFocus from '../internal/hooks/forward-focus';
import { fireNonCancelableEvent } from '../internal/events';
import { InternalBaseComponentProps } from '../internal/hooks/use-base-component';
import { useUniqueId } from '../internal/hooks/use-unique-id';
import { joinStrings } from '../internal/utils/strings';
import { TextFilterProps } from './interfaces';
import { SearchResults } from './search-results';

import styles from './styles.css.js';

type InternalTextFilterProps = TextFilterProps & InternalBaseComponentProps;

const InternalTextFilter = React.forwardRef(
  (
    {
      filteringText,
      filteringAriaLabel,
      filteringPlaceholder,
      filteringClearAriaLabel,
      controlId,
      ariaLabelledby,
      ariaDescribedby,
      disabled,
      countText,
      onChange,
      onDelayedChange,
      __internalRootRef,
      ...rest
    }: InternalTextFilterProps,
    ref: React.Ref<TextFilterProps.Ref>
  ) => {
    const baseProps = getBaseProps(rest);
    const inputRef = useRef<HTMLInputElement>(null);
    useForwardFocus(ref, inputRef);

    const searchResultsId = useUniqueId('text-filter-search-results');
    const showResults = filteringText && countText && !disabled;

    return (
      <div {...baseProps} className={clsx(baseProps.className, styles.root)} ref={__internalRootRef}>
        <InternalInput
          __inheritFormFieldProps={true}
          ref={inputRef}
          className={styles.input}
          type="search"
          ariaLabel={filteringAriaLabel}
          placeholder={filteringPlaceholder}
          value={filteringText}
          disabled={disabled}
          controlId={controlId}
          ariaLabelledby={ariaLabelledby}
          ariaDescribedby={joinStrings(showResults ? searchResultsId : undefined, ariaDescribedby)}
          autoComplete={false}
          clearAriaLabel={filteringClearAriaLabel}
          onChange={event => fireNonCancelableEvent(onChange, { filteringText: event.detail.value })}
          __onDelayedInput={event => fireNonCancelableEvent(onDelayedChange, { filteringText: event.detail.value })}
        />
        {showResults ? <SearchResults id={searchResultsId}>{countText}</SearchResults> : null}
      </div>
    );
  }
);

export default InternalTextFilter;
