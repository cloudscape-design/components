// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import useBaseComponent from '../internal/hooks/use-base-component';
import { applyDisplayName } from '../internal/utils/apply-display-name';
import { PropertyFilterProps, Ref } from './interfaces';
import PropertyFilterInternal from './internal';

export { PropertyFilterProps };

const PropertyFilter = React.forwardRef(
  (
    {
      filteringOptions = [],
      customGroupsText = [],
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
    return (
      <PropertyFilterInternal
        ref={ref}
        {...baseComponentProps}
        filteringOptions={filteringOptions}
        customGroupsText={customGroupsText}
        disableFreeTextFiltering={disableFreeTextFiltering}
        asyncProperties={asyncProperties}
        expandToViewport={expandToViewport}
        hideOperations={hideOperations}
        tokenLimit={tokenLimit}
        virtualScroll={virtualScroll}
        {...rest}
      />
    );
  }
);

applyDisplayName(PropertyFilter, 'PropertyFilter');
export default PropertyFilter;
