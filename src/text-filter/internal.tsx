// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useMemo, useRef } from 'react';
import clsx from 'clsx';

import InternalInput from '../input/internal';
import { getBaseProps } from '../internal/base-component';
import { useTableComponentsContext } from '../internal/context/table-component-context';
import { fireNonCancelableEvent } from '../internal/events';
import useForwardFocus from '../internal/hooks/forward-focus';
import { InternalBaseComponentProps } from '../internal/hooks/use-base-component';
import { useUniqueId } from '../internal/hooks/use-unique-id';
import { joinStrings } from '../internal/utils/strings';
import { InternalLiveRegionRef } from '../live-region/internal';
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
      __internalRootRef,
      ...rest
    }: InternalTextFilterProps,
    ref: React.Ref<TextFilterProps.Ref>
  ) => {
    const baseProps = getBaseProps(rest);
    const inputRef = useRef<HTMLInputElement>(null);
    const searchResultsRef = useRef<InternalLiveRegionRef>(null);
    useForwardFocus(ref, inputRef);

    const countValue = useMemo(() => {
      if (!countText || typeof countText !== 'string') {
        return undefined;
      }

      const m = countText.match(/\d+/);
      return m ? parseInt(m[0]) : undefined;
    }, [countText]);

    const searchResultsId = useUniqueId('text-filter-search-results');
    const showResults = filteringText && countText && !disabled;
    const tableComponentContext = useTableComponentsContext();

    useEffect(() => {
      if (tableComponentContext?.filterRef?.current) {
        tableComponentContext.filterRef.current.filterText = filteringText;
        tableComponentContext.filterRef.current.filterCount = countValue;
        tableComponentContext.filterRef.current.filtered = !!filteringText;

        return () => {
          delete tableComponentContext.filterRef.current?.filterText;
          delete tableComponentContext.filterRef.current?.filterCount;
          delete tableComponentContext.filterRef.current?.filtered;
        };
      }
    }, [tableComponentContext?.filterRef, countValue, filteringText]);

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
