// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState, useContext } from 'react';
import range from 'lodash/range';

import PropertyFilter from '~components/property-filter';
import { PropertyFilterProps } from '~components/property-filter/interfaces';

import AppContext, { AppContextType } from '../app/app-context';
import ScreenshotArea from '../utils/screenshot-area';
import { i18nStrings } from './common-props';
import { useOptionsLoader } from '../common/options-loader';

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
const filteringOptions = range(1000).map(value => ({
  propertyKey: 'property',
  value: value + '',
}));

interface ExtendedWindow {
  loadItemsCalls: PropertyFilterProps.LoadItemsDetail[];
}
declare let window: ExtendedWindow;
window.loadItemsCalls = [];

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
  const [fetchTarget, setFetchTarget] = useState<'properties' | 'options'>('properties');
  const propertiesLoader = useOptionsLoader({ timeout: 100 });
  const optionsLoader = useOptionsLoader<PropertyFilterProps.FilteringOption>({ pageSize: 100, timeout: 100 });
  const status = { properties: propertiesLoader, options: optionsLoader }[fetchTarget].status;

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

    const fetchTarget = filteringProperty && filteringOperator ? 'options' : 'properties';
    setFetchTarget(fetchTarget);

    if (fetchTarget === 'properties') {
      propertiesLoader.fetchItems({ sourceItems: filteringProperties, filteringText, firstPage });
    } else {
      optionsLoader.fetchItems({ sourceItems: filteringOptions, filteringText, firstPage });
    }
  };

  return (
    <>
      <h1>Integration tests fixture for async loading suggestions</h1>
      <ScreenshotArea disableAnimations={true}>
        <PropertyFilter
          i18nStrings={i18nStrings}
          query={query}
          onChange={e => setQuery(e.detail)}
          filteringProperties={filteringProperties}
          filteringOptions={optionsLoader.items}
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
