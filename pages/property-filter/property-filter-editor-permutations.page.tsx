// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useState } from 'react';
import { format } from 'date-fns';

import { DatePicker, FormField, TimeInput } from '~components';
import { I18nProvider } from '~components/i18n';
import messages from '~components/i18n/messages/all.en';
import { InternalFilteringProperty } from '~components/property-filter/interfaces';
import { TokenEditor, TokenEditorProps } from '~components/property-filter/token-editor-grouped';

import createPermutations from '../utils/permutations';
import PermutationsView from '../utils/permutations-view';
import ScreenshotArea from '../utils/screenshot-area';
import { i18nStrings } from './common-props';

import styles from './token-editor.scss';

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

const defaultProps: TokenEditorProps = {
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
  i18nStrings: {
    ...i18nStrings,
    tokenEditorTokenActionsLabel: token =>
      `Filter remove actions for ${token.propertyLabel} ${token.operator} ${token.value}`,
    tokenEditorTokenRemoveLabel: () => 'Remove filter',
    tokenEditorTokenRemoveFromGroupLabel: () => 'Remove filter from group',
    tokenEditorAddNewTokenLabel: 'Add new filter',
    tokenEditorAddTokenActionsLabel: 'Add filter actions',
    tokenEditorAddExistingTokenLabel: token =>
      `Add filter ${token.propertyLabel} ${token.operator} ${token.value} to group`,
  },
  onSubmit: () => {},
  onDismiss: () => {},
  standaloneTokens: [],
  onChangeStandalone: () => {},
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
    standaloneTokens: [
      [
        { property: dateProperty, operator: '=', value: new Date('2020-01-01') },
        { property: dateProperty, operator: '=', value: new Date('2020-01-02') },
        { property: dateProperty, operator: '=', value: new Date('2020-01-03') },
        { property: dateProperty, operator: '=', value: new Date('2020-01-04') },
        { property: dateProperty, operator: '=', value: new Date('2020-01-05') },
      ],
    ],
  },
]);

function TokenEditorStateful(props: TokenEditorProps) {
  const [tempGroup, setTempGroup] = useState(props.tempGroup);
  const [standaloneTokens, setStandaloneTokens] = useState(props.standaloneTokens);
  return (
    <TokenEditor
      {...props}
      standaloneTokens={standaloneTokens}
      onChangeStandalone={setStandaloneTokens}
      tempGroup={tempGroup}
      onChangeTempGroup={setTempGroup}
      onDismiss={() => {
        setTempGroup(props.tempGroup);
        setStandaloneTokens(props.standaloneTokens);
      }}
      onSubmit={() => {
        setTempGroup(props.tempGroup);
        setStandaloneTokens(props.standaloneTokens);
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
          <div className={styles['token-editor-container']}>
            <PermutationsView
              permutations={tokenPermutations}
              render={permutation => <TokenEditorStateful {...defaultProps} {...permutation} />}
            />
          </div>
        </ScreenshotArea>
      </I18nProvider>
    </>
  );
}
