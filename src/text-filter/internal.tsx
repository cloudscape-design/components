// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useRef } from 'react';
import clsx from 'clsx';

import { useUniqueId } from '@cloudscape-design/component-toolkit/internal';

import InternalInput from '../input/internal';
import { getBaseProps } from '../internal/base-component';
import { fireNonCancelableEvent } from '../internal/events';
import useForwardFocus from '../internal/hooks/forward-focus';
import { InternalBaseComponentProps } from '../internal/hooks/use-base-component';
import { joinStrings } from '../internal/utils/strings';
import { InternalLiveRegionRef } from '../live-region/internal';
import { useTableIntegration } from './analytics/use-table-integration';
import { TextFilterProps } from './interfaces';
import { SearchResults } from './search-results';
import useDebounceSearchResultCallback from './use-debounce-search-result-callback';

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
      disableBrowserAutocorrect,
      onChange,
      onDelayedChange,
      loading = false,
      style,
      __internalRootRef,
      ...rest
    }: InternalTextFilterProps,
    ref: React.Ref<TextFilterProps.Ref>
  ) => {
    const baseProps = getBaseProps(rest);
    const inputRef = useRef<HTMLInputElement>(null);
    const searchResultsRef = useRef<InternalLiveRegionRef>(null);
    useForwardFocus(ref, inputRef);
    useTableIntegration(filteringText, countText);

    const searchResultsId = useUniqueId('text-filter-search-results');
    const showResults = filteringText && countText && !disabled;

    useDebounceSearchResultCallback({
      searchQuery: filteringText,
      countText,
      loading,
      announceCallback: () => {
        searchResultsRef.current?.reannounce();
      },
    });

    return (
      <div {...baseProps} className={clsx(baseProps.className, styles.root)} ref={__internalRootRef}>
        <InternalInput
          __inheritFormFieldProps={true}
          disableBrowserAutocorrect={disableBrowserAutocorrect}
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
          style={style}
        />
        {showResults ? (
          <SearchResults renderLiveRegion={!loading} id={searchResultsId} ref={searchResultsRef}>
            {countText}
          </SearchResults>
        ) : null}
      </div>
    );
  }
);

export default InternalTextFilter;
