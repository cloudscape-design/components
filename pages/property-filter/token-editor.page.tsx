// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import PropertyFilter from '~components/property-filter';
import { PropertyFilterProps } from '~components/property-filter/interfaces';
import PropertyFilterInternal from '~components/property-filter/internal';

import ScreenshotArea from '../utils/screenshot-area';
import { columnDefinitions, filteringProperties as commonFilteringProperties, i18nStrings } from './common-props';

const filteringProperties: readonly PropertyFilterProps.FilteringProperty[] = columnDefinitions.map(def => ({
  key: def.id,
  operators: def.type === 'text' ? ['=', '!=', ':', '!:'] : ['=', '!=', '>', '<', '<=', '>='],
  propertyLabel: def.propertyLabel,
  groupValuesLabel: `${def.propertyLabel} values`,
}));

const commonProps = {
  onChange: () => {},
  filteringProperties,
  filteringOptions: [],
  i18nStrings,
  countText: '5 matches',
  disableFreeTextFiltering: false,
  virtualScroll: true,
} as const;

export default function () {
  return (
    <>
      <h1>Strings wrapping screenshot page</h1>
      <ScreenshotArea disableAnimations={true} style={{ blockSize: '1000px' }}>
        <PropertyFilter
          className="property-filter-overflow"
          query={{
            tokens: [
              {
                operator: ':',
                value: 'filtering token',
              },
            ],
            operation: 'and',
          }}
          {...commonProps}
          i18nStrings={{
            ...i18nStrings,
            editTokenHeader: 'Edit filter editTokenHeadereditTokenHeadereditTokenHeadereditTokenHeader',
            propertyText: 'Property propertyTextpropertyTextpropertyTextpropertyTextpropertyText',
            operatorText: 'Operator operatorTextoperatorTextoperatorTextoperatorTextoperatorTextoperatorText',
            valueText: 'Value valuesTextvalueTextvalueTextvalueTextvalueTextvalueTextvalueTextvalueText',
            cancelActionText: 'Cancel cancelActionTextcancelActionTextcancelActionTextcancelActionText',
            applyActionText: 'Apply applyActionTextapplyActionTextapplyActionTextapplyActionText',
          }}
        />
        <PropertyFilter
          className="property-filter-default"
          query={{
            tokens: [
              { operator: ':', value: 'filtering token' },
              { operator: ':', value: 'second filtering token' },
            ],
            operation: 'and',
          }}
          {...commonProps}
        />
        <PropertyFilter
          className="property-filter-custom-prop-boolean"
          query={{
            tokens: [{ propertyKey: 'stopped', operator: '=', value: 'true' }],
            operation: 'and',
          }}
          {...commonProps}
          filteringProperties={commonFilteringProperties}
        />
        <PropertyFilter
          className="property-filter-custom-prop-datetime"
          query={{
            tokens: [{ propertyKey: 'lasteventat', operator: '>', value: '2022-01-01T00:00:00' }],
            operation: 'and',
          }}
          {...commonProps}
          filteringProperties={commonFilteringProperties}
        />
        <PropertyFilter
          className="property-filter-free-text-operators"
          query={{
            tokens: [
              { operator: '!=', value: 'not equal filtering token' },
              { operator: '^', value: 'starts with filtering token' },
            ],
            operation: 'and',
          }}
          {...commonProps}
          freeTextFiltering={{ operators: [':', '!:', '=', '!=', '^', '!^'] }}
        />
        <PropertyFilterInternal
          className="property-filter-group-editor"
          query={{
            tokens: [{ propertyKey: 'instanceid', operator: '=', value: 'i123' }],
            operation: 'and',
          }}
          {...commonProps}
          customGroupsText={[]}
          enableTokenGroups={true}
        />
      </ScreenshotArea>
    </>
  );
}
