// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useEffect, useRef, useState } from 'react';
import { render as rtlRender } from '@testing-library/react';

import PropertyFilter from '../../../lib/components/property-filter';
import { PropertyFilterProps } from '../interfaces';
import { createDefaultProps } from './common';
import { createExtendedWrapper } from './extended-wrapper';

// Defines components with state management and async loading behaviors,
// to be used for testing complete user flows.

export function createRenderer(defaultProps: Partial<PropertyFilterProps>, options: { async?: boolean } = {}) {
  return (props?: Partial<PropertyFilterProps>) => {
    const Component = options.async ? StatefulAsyncPropertyFilter : StatefulPropertyFilter;
    rtlRender(
      <Component
        {...createDefaultProps(props?.filteringProperties ?? [], props?.filteringOptions ?? [])}
        {...defaultProps}
        {...props}
      />
    );
    const wrapper = createExtendedWrapper();
    return { wrapper };
  };
}

function StatefulPropertyFilter(props: PropertyFilterProps) {
  const [query, setQuery] = useState<PropertyFilterProps.Query>(props.query);
  return (
    <PropertyFilter
      {...props}
      query={query}
      onChange={event => {
        props.onChange(event);
        setQuery(event.detail);
      }}
    />
  );
}

declare global {
  interface Window {
    loadingComplete(): void;
  }
}

function StatefulAsyncPropertyFilter(props: PropertyFilterProps) {
  const loadingCb = useRef(() => {});
  useEffect(() => {
    window.loadingComplete = () => {
      loadingCb.current();
      loadingCb.current = () => {};
    };
  }, []);

  const [filteringStatusType, setFilteringStatusType] = useState<PropertyFilterProps.StatusType>('pending');
  const [filteringProperties, setFilteringProperties] = useState<readonly PropertyFilterProps.FilteringProperty[]>(
    props.asyncProperties ? [] : props.filteringProperties
  );
  const [filteringOptions, setFilteringOptions] = useState<readonly PropertyFilterProps.FilteringOption[]>([]);

  function loadProperties(filteringText: string) {
    if (props.asyncProperties) {
      setFilteringProperties(props.filteringProperties.filter(p => p.propertyLabel.includes(filteringText)));
    }
  }

  function loadOptions(filteringProperty: undefined | PropertyFilterProps.FilteringProperty, filteringText: string) {
    setFilteringOptions(
      (props.filteringOptions ?? []).filter(
        o =>
          (!filteringProperty || o.propertyKey === filteringProperty?.key) &&
          (o.label || o.value).includes(filteringText)
      )
    );
  }

  const onLoadItems: PropertyFilterProps['onLoadItems'] = ({ detail }) => {
    setFilteringStatusType('loading');
    loadingCb.current = () => {
      setFilteringStatusType('finished');
      loadProperties(detail.filteringText);
      loadOptions(detail.filteringProperty, detail.filteringText);
    };
  };

  return (
    <StatefulPropertyFilter
      {...props}
      filteringProperties={filteringProperties}
      filteringOptions={filteringOptions}
      filteringStatusType={filteringStatusType}
      onLoadItems={onLoadItems}
    />
  );
}
