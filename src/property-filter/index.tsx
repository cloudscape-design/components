// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { warnOnce } from '@cloudscape-design/component-toolkit/internal';
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
      filteringProperties,
      filteringOptions = [],
      customGroupsText = [],
      enableTokenGroups = false,
      disableFreeTextFiltering = false,
      asyncProperties,
      expandToViewport,
      hideOperations = false,
      readOnlyOperations = false,
      tokenLimit,
      virtualScroll,
      ...rest
    }: PropertyFilterProps,
    ref: React.Ref<Ref>
  ) => {
    let hasCustomForms = false;
    let hasEnumTokens = false;
    let hasCustomFormatters = false;
    for (const property of filteringProperties) {
      for (const operator of property.operators ?? []) {
        if (typeof operator === 'object') {
          hasCustomForms = hasCustomForms || !!operator.form;
          hasEnumTokens = hasEnumTokens || operator.tokenType === 'enum';
          hasCustomFormatters = hasCustomFormatters || !!operator.format;
        }
      }
    }

    const baseComponentProps = useBaseComponent('PropertyFilter', {
      props: {
        asyncProperties,
        disableFreeTextFiltering,
        enableTokenGroups,
        expandToViewport,
        hideOperations,
        readOnlyOperations,
        tokenLimit,
        virtualScroll,
      },
      metadata: {
        hasCustomForms,
        hasEnumTokens,
        hasCustomFormatters,
      },
    });

    const componentAnalyticsMetadata: GeneratedAnalyticsMetadataPropertyFilterComponent = {
      name: 'awsui.PropertyFilter',
      label: `.${analyticsSelectors['search-field']} input`,
      properties: {
        disabled: `${!!rest.disabled}`,
        queryTokensCount: `${rest.query && rest.query.tokens ? rest.query.tokens.length : 0}`,
      },
    };

    if (hideOperations && enableTokenGroups) {
      warnOnce('PropertyFilter', 'Operations cannot be hidden when token groups are enabled.');
      hideOperations = false;
    }

    return (
      <PropertyFilterInternal
        ref={ref}
        {...baseComponentProps}
        filteringProperties={filteringProperties}
        filteringOptions={filteringOptions}
        customGroupsText={customGroupsText}
        enableTokenGroups={enableTokenGroups}
        disableFreeTextFiltering={disableFreeTextFiltering}
        asyncProperties={asyncProperties}
        expandToViewport={expandToViewport}
        hideOperations={hideOperations}
        readOnlyOperations={readOnlyOperations}
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
