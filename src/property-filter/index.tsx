// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { getAnalyticsMetadataAttribute } from '@cloudscape-design/component-toolkit/internal/analytics-metadata';

import useBaseComponent from '../internal/hooks/use-base-component';
import { applyDisplayName } from '../internal/utils/apply-display-name';
import { GeneratedAnalyticsMetadataPropertyFilterComponent } from './analytics-metadata/interfaces';
import { PropertyFilterProps, Ref } from './interfaces';
import PropertyFilterInternal from './internal';

import analyticsSelectors from './analytics-metadata/styles.css.js';

export { PropertyFilterProps };

const PropertyFilter = React.forwardRef(
  (
    {
      filteringOptions = [],
      customGroupsText = [],
      enableTokenGroups = false,
      disableFreeTextFiltering = false,
      asyncProperties,
      expandToViewport,
      hideOperations,
      tokenLimit,
      virtualScroll,
      ...rest
    }: PropertyFilterProps,
    ref: React.Ref<Ref>
  ) => {
    const baseComponentProps = useBaseComponent('PropertyFilter', {
      props: { asyncProperties, disableFreeTextFiltering, expandToViewport, hideOperations, tokenLimit, virtualScroll },
    });

    const componentAnalyticsMetadata: GeneratedAnalyticsMetadataPropertyFilterComponent = {
      name: 'awsui.PropertyFilter',
      label: `.${analyticsSelectors['search-field']} input`,
      properties: {
        disabled: `${!!rest.disabled}`,
        queryTokensCount: `${rest.query && rest.query.tokens ? rest.query.tokens.length : 0}`,
      },
    };

    return (
      <PropertyFilterInternal
        ref={ref}
        {...baseComponentProps}
        filteringOptions={filteringOptions}
        customGroupsText={customGroupsText}
        enableTokenGroups={enableTokenGroups}
        disableFreeTextFiltering={disableFreeTextFiltering}
        asyncProperties={asyncProperties}
        expandToViewport={expandToViewport}
        hideOperations={hideOperations}
        tokenLimit={tokenLimit}
        virtualScroll={virtualScroll}
        {...getAnalyticsMetadataAttribute({ component: componentAnalyticsMetadata })}
        {...rest}
      />
    );
  }
);

applyDisplayName(PropertyFilter, 'PropertyFilter');
export default PropertyFilter;
