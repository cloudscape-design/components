// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import PropertyFilter from '~components/property-filter';
import ScreenshotArea from '../utils/screenshot-area';
import { PropertyFilterProps } from '~components/property-filter/interfaces';
import { columnDefinitions, i18nStrings } from './common-props';

const filteringProperties: readonly PropertyFilterProps.FilteringProperty[] = columnDefinitions.map(def => ({
  key: def.id,
  operators: def.type === 'text' ? ['=', '!=', ':', '!:'] : ['=', '!=', '>', '<', '<=', '>='],
  propertyLabel: def.propertyLabel,
  groupValuesLabel: `${def.propertyLabel} values`,
}));

export default function () {
  return (
    <>
      <h1>Strings wrapping screenshot page</h1>
      <ScreenshotArea disableAnimations={true} style={{ height: '1000px' }}>
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
          onChange={() => {}}
          filteringProperties={filteringProperties}
          filteringOptions={[]}
          virtualScroll={true}
          countText="5 matches"
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
              {
                operator: ':',
                value: 'filtering token',
              },
              { operator: ':', value: 'second filtering token' },
            ],
            operation: 'and',
          }}
          onChange={() => {}}
          filteringProperties={filteringProperties}
          filteringOptions={[]}
          virtualScroll={true}
          countText="5 matches"
          i18nStrings={i18nStrings}
        />
      </ScreenshotArea>
    </>
  );
}
