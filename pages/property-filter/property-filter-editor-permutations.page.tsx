// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useState } from 'react';
import { format } from 'date-fns';

import { Calendar, CalendarProps, DatePicker, FormField, TimeInput } from '~components';
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
  getValueFormatter: () => (value: Date) => format(value, 'yyyy-MM-dd'),
  getValueFormRenderer:
    () =>
    ({ value, filter }) => {
      const props: CalendarProps = {
        value: value ? format(value, 'yyyy-MM-dd') : '',
        onChange: () => {},
        locale: 'en-GB',
        ariaLabel: 'Scheduled launch date, calendar',
        i18nStrings: {
          previousMonthAriaLabel: 'Previous month',
          nextMonthAriaLabel: 'Next month',
          todayAriaLabel: 'Today',
        },
      };
      return typeof filter === 'string' ? <Calendar {...props} /> : <DatePicker {...props} />;
    },
  externalProperty,
};

const dateTimeProperty: InternalFilteringProperty = {
  propertyKey: 'date',
  propertyLabel: 'Date time',
  groupValuesLabel: 'Date time values',
  operators: ['=', '!='],
  defaultOperator: '=',
  getValueFormatter: () => (value: Date) => format(value, 'yyyy-MM-dd hh:mm'),
  getValueFormRenderer:
    () =>
    ({ value }) => {
      const props: CalendarProps = {
        value: value ? format(value, 'yyyy-MM-dd') : '',
        onChange: () => {},
        locale: 'en-GB',
        ariaLabel: 'Scheduled launch date, calendar',
        i18nStrings: {
          previousMonthAriaLabel: 'Previous month',
          nextMonthAriaLabel: 'Next month',
          todayAriaLabel: 'Today',
        },
      };
      return (
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          <FormField description="Date">
            <DatePicker {...props} />
          </FormField>
          <FormField description="Time">
            <TimeInput value={value ? format(value, 'hh:mm:ss') : ''} />
          </FormField>
        </div>
      );
    },
  externalProperty,
};

const defaultProps: TokenEditorProps = {
  asyncProps: {},
  customGroupsText: [],
  freeTextFiltering: {
    disabled: false,
    operators: [':', '!:'],
    defaultOperator: ':',
  },
  filteringProperties: [nameProperty, dateProperty],
  filteringOptions: [],
  i18nStrings,
  i18nStringsExt: {
    tokenEditorTokenGroupLabel: token => `"${token.property ?? 'All properties'} ${token.operator} ${token.value}"`,
    tokenEditorRemoveFilterLabel: 'Remove', // TODO: include index or token?
    tokenEditorRemoveFromGroupFilterLabel: 'Remove from group', // TODO: include index or token?
    tokenEditorRemoveMoreFilterLabel: 'More actions', // TODO: include index or token?
    tokenEditorAddNewFilterLabel: 'Add new filter',
    tokenEditorAddExistingFilterLabel: token =>
      `Add "${token.property ?? 'All properties'} ${token.operator} ${token.value}" to group`,
    tokenEditorAddFilterMoreLabel: 'More actions',
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
      <h1>Property filter editor permutations</h1>
      <ScreenshotArea disableAnimations={true}>
        <div className={styles['token-editor-container']}>
          <PermutationsView
            permutations={tokenPermutations}
            render={permutation => <TokenEditorStateful {...defaultProps} {...permutation} />}
          />
        </div>
      </ScreenshotArea>
    </>
  );
}
