// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useState } from 'react';
import { format } from 'date-fns';

import { DatePicker, FormField, TimeInput } from '~components';
import { I18nProvider } from '~components/i18n';
import messages from '~components/i18n/messages/all.en';
import { usePropertyFilterI18n } from '~components/property-filter/i18n-utils';
import { InternalFilteringProperty } from '~components/property-filter/interfaces';
import { TokenEditor, TokenEditorProps } from '~components/property-filter/token-editor';

import createPermutations from '../utils/permutations';
import PermutationsView from '../utils/permutations-view';
import ScreenshotArea from '../utils/screenshot-area';
import { i18nStrings } from './common-props';

const externalProperty = {
  key: '',
  operators: [],
  propertyLabel: '',
  groupValuesLabel: '',
} as const;

const openCalendarAriaLabel = (selectedDate: string | null) =>
  'Choose Date' + (selectedDate ? `, selected date is ${selectedDate}` : '');

const nameProperty: InternalFilteringProperty = {
  propertyKey: 'name',
  propertyLabel: 'Name',
  groupValuesLabel: 'Name values',
  operators: ['=', '!='],
  defaultOperator: '=',
  getValueFormatter: () => null,
  getValueFormRenderer: () => null,
  externalProperty,
};

const dateProperty: InternalFilteringProperty = {
  propertyKey: 'date',
  propertyLabel: 'Date',
  groupValuesLabel: 'Date values',
  operators: ['=', '!='],
  defaultOperator: '=',
  getValueFormatter: () => (value: Date) => (value ? format(value, 'yyyy-MM-dd') : ''),
  getValueFormRenderer:
    () =>
    ({ value }) => (
      <FormField>
        <DatePicker value={value ? format(value, 'yyyy-MM-dd') : ''} openCalendarAriaLabel={openCalendarAriaLabel} />
      </FormField>
    ),
  externalProperty,
};

const dateTimeProperty: InternalFilteringProperty = {
  propertyKey: 'date',
  propertyLabel: 'Date time',
  groupValuesLabel: 'Date time values',
  operators: ['=', '!='],
  defaultOperator: '=',
  getValueFormatter: () => (value: Date) => (value ? format(value, 'yyyy-MM-dd hh:mm') : ''),
  getValueFormRenderer:
    () =>
    ({ value }) => (
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
        <FormField description="Date">
          <DatePicker value={value ? format(value, 'yyyy-MM-dd') : ''} openCalendarAriaLabel={openCalendarAriaLabel} />
        </FormField>
        <FormField description="Time">
          <TimeInput value={value ? format(value, 'hh:mm:ss') : ''} />
        </FormField>
      </div>
    ),
  externalProperty,
};

const defaultProps: Omit<TokenEditorProps, 'i18nStrings'> = {
  supportsGroups: true,
  asyncProps: {},
  customGroupsText: [],
  freeTextFiltering: {
    disabled: false,
    operators: [':', '!:'],
    defaultOperator: ':',
  },
  filteringProperties: [nameProperty, dateProperty],
  filteringOptions: [],
  onSubmit: () => {},
  onDismiss: () => {},
  tokensToCapture: [],
  onTokenCapture: () => {},
  onTokenRelease: () => {},
  tempGroup: [{ property: null, operator: ':', value: 'search text' }],
  onChangeTempGroup: () => {},
};

const tokenPermutations = createPermutations<Partial<TokenEditorProps>>([
  // Single name property
  {
    tempGroup: [[{ property: nameProperty, operator: '=', value: 'John' }]],
    supportsGroups: [false, true],
  },
  // Single date property
  {
    tempGroup: [[{ property: dateProperty, operator: '=', value: new Date('2020-01-01') }]],
  },
  // Single date/time property
  {
    tempGroup: [[{ property: dateTimeProperty, operator: '=', value: new Date('2020-01-01T01:00') }]],
  },
  // Multiple properties
  {
    tempGroup: [
      [
        { property: nameProperty, operator: '=', value: 'John' },
        { property: dateTimeProperty, operator: '=', value: new Date('2020-01-01T01:00') },
        { property: nameProperty, operator: '=', value: 'Jack' },
      ],
    ],
    tokensToCapture: [
      [
        { standaloneIndex: 0, property: dateProperty, operator: '=', value: new Date('2020-01-01') },
        { standaloneIndex: 1, property: dateProperty, operator: '=', value: new Date('2020-01-02') },
        { standaloneIndex: 2, property: dateProperty, operator: '=', value: new Date('2020-01-03') },
        { standaloneIndex: 3, property: dateProperty, operator: '=', value: new Date('2020-01-04') },
        { standaloneIndex: 4, property: dateProperty, operator: '=', value: new Date('2020-01-05') },
      ],
    ],
  },
]);

function TokenEditorStateful(props: Omit<TokenEditorProps, 'i18nStrings'>) {
  const [tempGroup, setTempGroup] = useState(props.tempGroup);
  const capturedTokenIndices = tempGroup.map(token => token.standaloneIndex).filter(Boolean);
  const tokensToCapture = props.tokensToCapture.filter((_, index) => !capturedTokenIndices.includes(index));
  const i18nStringsInternal = usePropertyFilterI18n(i18nStrings);
  return (
    <TokenEditor
      {...props}
      i18nStrings={i18nStringsInternal}
      tokensToCapture={tokensToCapture}
      tempGroup={tempGroup}
      onChangeTempGroup={setTempGroup}
      onDismiss={() => {
        setTempGroup(props.tempGroup);
      }}
      onSubmit={() => {
        setTempGroup(props.tempGroup);
      }}
    />
  );
}

export default function () {
  return (
    <>
      <I18nProvider messages={[messages]} locale="en">
        <h1>Property filter editor permutations</h1>
        <ScreenshotArea disableAnimations={true}>
          <PermutationsView
            permutations={tokenPermutations}
            render={permutation => <TokenEditorStateful {...defaultProps} {...permutation} />}
          />
        </ScreenshotArea>
      </I18nProvider>
    </>
  );
}
