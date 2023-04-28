// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { useRef } from 'react';

import { fireNonCancelableEvent, NonCancelableEventHandler } from '../internal/events/index';
import { AutosuggestProps } from '../autosuggest/interfaces';

import { ComparisonOperator, FilteringProperty, LoadItemsDetail } from './interfaces';

/**
 * This hook generates `onBlur`, `onFocus` and `onLoadItems` handlers that make sure an `onLoadItems` event
 * fires exactly once every time control they are used on gets focused.
 * It is necessary to do this because Autosuggest and Select dedupe their `onLoadItems` events stopping
 * the same event from firing twice in a row. This means, refocusing the control sometimes results in
 * `onLoadItems` firing, but sometimes not.
 */
export const useLoadItems = (
  onLoadItems?: NonCancelableEventHandler<LoadItemsDetail>,
  focusFilteringText?: string,
  currentFilteringProperty?: FilteringProperty,
  currentFilteringText?: string,
  currentFilteringOperator?: ComparisonOperator
) => {
  const focusIn = useRef<boolean>(false);
  const handleBlur = () => {
    focusIn.current = true;
  };
  const fireLoadItems = (detail: { firstPage: boolean; samePage: boolean; filteringText?: string }) => {
    fireNonCancelableEvent(onLoadItems, {
      ...detail,
      filteringText: currentFilteringText ?? detail.filteringText ?? '',
      filteringProperty: currentFilteringProperty,
      filteringOperator: currentFilteringOperator,
    });
    focusIn.current = false;
  };
  const handleFocus = () => {
    if (focusIn.current) {
      fireLoadItems({ firstPage: true, samePage: false, filteringText: focusFilteringText });
    }
  };
  const handleLoadItems: NonCancelableEventHandler<AutosuggestProps.LoadItemsDetail> = ({ detail }) =>
    fireLoadItems(detail);
  return {
    onBlur: handleBlur,
    onFocus: handleFocus,
    onLoadItems: handleLoadItems,
  };
};
