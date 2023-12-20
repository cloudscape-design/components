// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState, useRef, useContext } from 'react';
import range from 'lodash/range';

import PropertyFilter from '~components/property-filter';
import { PropertyFilterProps } from '~components/property-filter/interfaces';

import AppContext, { AppContextType } from '../app/app-context';
import ScreenshotArea from '../utils/screenshot-area';
import { i18nStrings } from './common-props';

type PropertyFilterDemoContext = React.Context<
  AppContextType<{
    token: string;
    asyncProperties: boolean;
  }>
>;

const filteringProperties = [
  {
    key: 'property',
    operators: ['=', '!=', '>', '<', '<=', '>='],
    propertyLabel: 'label',
    groupValuesLabel: `Label values`,
  },
] as const;
const serverFilteringOptions = range(1000).map(value => ({
  propertyKey: 'property',
  value: value + '',
}));

interface ExtendedWindow {
  loadItemsCalls: PropertyFilterProps.LoadItemsDetail[];
}
declare let window: ExtendedWindow;
window.loadItemsCalls = [];

const fetchOptions = async () => {
  await new Promise(resolve => setTimeout(() => resolve(''), 100));
  return serverFilteringOptions;
};

export default function () {
  const { urlParams } = useContext(AppContext as PropertyFilterDemoContext);
  const [query, setQuery] = useState<PropertyFilterProps['query']>({
    tokens: [
      urlParams.token === 'freeText'
        ? ({ operator: ':', value: '1' } as const)
        : ({ propertyKey: 'property', operator: ':', value: '1' } as const),
    ],
    operation: 'and',
  });
  const request = useRef<{
    filteringText: string;
    filteringProperty?: PropertyFilterProps.FilteringProperty;
    filteringOperator?: PropertyFilterProps.ComparisonOperator;
  }>();
  const [filteringOptions, setFilteringOptions] = useState<PropertyFilterProps['filteringOptions']>([]);
  const [status, setStatus] = useState<PropertyFilterProps['filteringStatusType']>('pending');
  const fetchData = async (
    filteringText: string,
    filteringProperty?: PropertyFilterProps.FilteringProperty,
    filteringOperator?: PropertyFilterProps.ComparisonOperator
  ) => {
    const items = await fetchOptions();
    if (
      !request.current ||
      request.current.filteringText !== filteringText ||
      request.current.filteringProperty !== filteringProperty ||
      request.current.filteringOperator !== filteringOperator
    ) {
      // there is another request in progress, discard the result of this one
      return;
    }
    setStatus('finished');
    setFilteringOptions(items);
  };

  const handleLoadItems = ({ detail }: { detail: PropertyFilterProps.LoadItemsDetail }) => {
    const { filteringProperty, filteringOperator, filteringText, firstPage, samePage } = detail;
    window.loadItemsCalls.push({
      filteringText,
      samePage,
      firstPage,
      ...(filteringProperty
        ? {
            filteringProperty,
          }
        : {}),
      ...(filteringOperator ? { filteringOperator } : {}),
    });
    setStatus('loading');
    request.current = {
      filteringProperty,
      filteringOperator,
      filteringText,
    };
    fetchData(filteringText, filteringProperty, filteringOperator);
  };

  return (
    <>
      <h1>Integration tests fixture for async loading suggestions</h1>
      <ScreenshotArea>
        <PropertyFilter
          i18nStrings={i18nStrings}
          query={query}
          onChange={e => setQuery(e.detail)}
          filteringProperties={filteringProperties}
          filteringOptions={filteringOptions}
          filteringStatusType={status}
          filteringLoadingText={'loading text'}
          filteringErrorText={'error text'}
          filteringRecoveryText={'recovery text'}
          filteringFinishedText={'finished text'}
          onLoadItems={handleLoadItems}
          asyncProperties={urlParams.asyncProperties}
          virtualScroll={true}
        />
      </ScreenshotArea>
    </>
  );
}
