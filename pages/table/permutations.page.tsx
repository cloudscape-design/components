// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import range from 'lodash/range';
import Link from '~components/link';
import PropertyFilter from '~components/property-filter';
import Header from '~components/header';
import Table, { TableProps } from '~components/table';
import { i18nStrings } from '../property-filter/common-props';
import createPermutations from '../utils/permutations';
import PermutationsView from '../utils/permutations-view';
import ScreenshotArea from '../utils/screenshot-area';
import { ARIA_LABELS } from './shared-configs';

function createSimpleItems(count: number) {
  const texts = ['One', 'Two', 'Three', 'Four'];
  return range(count).map(number => ({ number, text: texts[number % texts.length] }));
}

const SORTABLE_COLUMNS: TableProps.ColumnDefinition<any>[] = [
  {
    id: 'sortable1',
    header: 'Sortable prop 1',
    cell: item => item.number,
    sortingField: 'number',
  },
  {
    id: 'sortable2',
    header: 'Sortable prop 2',
    cell: item => item.text,
    sortingField: 'text',
  },
  {
    id: 'nonsortable',
    header: 'Value',
    cell: item => item.text,
  },
];

const PROPERTY_COLUMNS: TableProps.ColumnDefinition<any>[] = [
  {
    id: 'variable',
    header: 'Property',
    cell: item => <Link href="#">{item.name}</Link>,
    isRowHeader: true,
  },
  {
    id: 'type',
    header: 'Type',
    cell: item => item.type,
  },
  {
    id: 'value',
    header: 'Value',
    cell: item => item.value,
  },
];

/* eslint-disable react/jsx-key */
const permutations = createPermutations<TableProps>([
  {
    wrapLines: [true, false],
    columnDefinitions: [PROPERTY_COLUMNS.map(column => ({ ...column }))],
    items: [
      [
        {
          name: 'Color Color Color Color Color Color Color Color Color Color Color Color Color Color Color Color Color Color Color Color Color Color Color Color Color Color Color Color Color Color Color Color Color Color Color Color Color Color Color Color Color Color Color Color Color Color Color Color Color Color Color Color Color Color Color Color Color Color Color Color Color Color Color Color Color Color',
          value: '#000000',
          type: 'String String String String String String String String String String String String String String String String String String String String String String String String String String String String String String String String String String String String String String String String String String String String String String String String String String String String String String String String',
        },
        {
          name: 'Width Width Width Width Width Width Width Width Width Width Width Width Width Width Width Width Width Width Width Width Width Width Width Width Width Width Width Width Width Width Width Width Width Width Width Width Width Width Width Width Width Width Width Width Width Width Width Width Width Width Width Width Width Width Width Width Width Width Width Width Width Width Width Width Width Width',
          value: '100',
          type: 'Integer Integer Integer Integer Integer Integer Integer Integer Integer Integer Integer Integer Integer Integer Integer Integer Integer Integer Integer Integer Integer Integer Integer Integer Integer Integer Integer Integer Integer Integer Integer Integer Integer Integer Integer Integer Integer Integer Integer Integer Integer Integer Integer Integer Integer Integer Integer Integer Integer Integer',
        },
        {
          name: 'Height Height Height Height Height Height Height Height Height Height Height Height Height Height Height Height Height Height Height Height Height Height Height Height Height Height Height Height',
          value: '200',
          type: 'Integer Integer Integer Integer Integer Integer Integer Integer Integer Integer Integer Integer Integer Integer Integer Integer Integer Integer Integer Integer Integer Integer Integer Integer Integer Integer Integer Integer Integer Integer Integer Integer Integer Integer Integer Integer Integer Integer Integer Integer Integer Integer Integer Integer Integer Integer Integer Integer Integer Integer',
        },
      ],
    ],
  },
  {
    wrapLines: [true],
    columnDefinitions: [
      PROPERTY_COLUMNS.map((column, index) => ({
        ...column,
        header: Array(20)
          .fill(0)
          .map(() => column.header)
          .join(index < PROPERTY_COLUMNS.length - 1 ? ' ' : ''),
      })),
    ],
    items: [
      [
        {
          name: 'Color Color Color Color Color Color Color Color Color Color Color Color Color Color Color Color Color Color Color Color Color Color Color Color Color Color Color Color Color Color Color Color Color Color Color Color Color Color Color Color Color Color Color Color Color Color Color Color Color Color Color Color Color Color Color Color Color Color Color Color Color Color Color Color Color Color',
          value: '#000000',
          type: 'String String String String String String String String String String String String String String String String String String String String String String String String String String String String String String String String String String String String String String String String String String String String String String String String String String String String String String String String',
        },
        {
          name: 'Width Width Width Width Width Width Width Width Width Width Width Width Width Width Width Width Width Width Width Width Width Width Width Width Width Width Width Width Width Width Width Width Width Width Width Width Width Width Width Width Width Width Width Width Width Width Width Width Width Width Width Width Width Width Width Width Width Width Width Width Width Width Width Width Width Width',
          value: '100',
          type: 'Integer Integer Integer Integer Integer Integer Integer Integer Integer Integer Integer Integer Integer Integer Integer Integer Integer Integer Integer Integer Integer Integer Integer Integer Integer Integer Integer Integer Integer Integer Integer Integer Integer Integer Integer Integer Integer Integer Integer Integer Integer Integer Integer Integer Integer Integer Integer Integer Integer Integer',
        },
        {
          name: 'Height Height Height Height Height Height Height Height Height Height Height Height Height Height Height Height Height Height Height Height Height Height Height Height Height Height Height Height',
          value: '200',
          type: 'Integer Integer Integer Integer Integer Integer Integer Integer Integer Integer Integer Integer Integer Integer Integer Integer Integer Integer Integer Integer Integer Integer Integer Integer Integer Integer Integer Integer Integer Integer Integer Integer Integer Integer Integer Integer Integer Integer Integer Integer Integer Integer Integer Integer Integer Integer Integer Integer Integer Integer',
        },
      ],
    ],
  },
  {
    columnDefinitions: [PROPERTY_COLUMNS],
    items: [
      [
        {
          name: 'Color',
          value: '#000000',
          type: 'String',
        },
        {
          name: 'Width',
          value: '100',
          type: 'Integer',
        },
        {
          name: 'Height',
          value: '200',
          type: 'Integer',
        },
      ],
    ],
  },
  {
    columnDefinitions: [
      [
        {
          id: 'variable',
          header: 'Property',
          cell: item => item.name,
          width: 100,
          minWidth: '300px',
        },
        {
          id: 'type',
          header: 'Type',
          cell: item => item.type,
          width: 300,
          minWidth: '100px',
        },
        {
          id: 'value',
          header: 'Value',
          cell: item => item.value,
          width: 300,
          minWidth: '300px',
        },
        {
          id: 'updatedDate',
          header: 'Updated date',
          cell: item => item.updatedDate,
          width: 150,
        },
        {
          id: 'description',
          header: 'Description',
          cell: item => item.description,
          minWidth: '100px',
          width: 150,
        },
      ],
    ],
    items: [
      [
        {
          name: 'Color',
          value: '#000000',
          type: 'String',
          updatedDate: '03.12.2018',
          description: 'First',
        },
        {
          name: 'Width',
          value: '100',
          type: 'Integer',
          updatedDate: '05.02.2019',
          description: 'Second',
        },
        {
          name: 'Height',
          value: '200',
          type: 'Integer',
          updatedDate: '01.10.2019',
          description: 'Third',
        },
      ],
    ],
  },
  {
    columnDefinitions: [SORTABLE_COLUMNS],
    items: [createSimpleItems(3)],
    sortingColumn: [SORTABLE_COLUMNS[0], undefined],
    sortingDisabled: [true, false],
  },
  {
    columnDefinitions: [SORTABLE_COLUMNS],
    items: [createSimpleItems(3)],
    sortingColumn: [SORTABLE_COLUMNS[0]],
    sortingDescending: [true],
  },
  {
    columnDefinitions: [SORTABLE_COLUMNS],
    items: [createSimpleItems(3)],
    variant: [undefined, 'full-page'],
    pagination: [undefined, 'pagination'],
    footer: [undefined, 'footer'],
  },
  {
    columnDefinitions: [SORTABLE_COLUMNS],
    header: [<Header variant="h2">Table Header</Header>],
    pagination: ['pagination'],
    filter: [
      <PropertyFilter
        filteringProperties={[
          {
            key: 'text',
            operators: ['=', '!=', ':', '!:'],
            propertyLabel: 'Text',
            groupValuesLabel: 'Text values',
          },
          {
            key: 'number',
            operators: ['=', '!=', ':', '!:'],
            propertyLabel: 'Number',
            groupValuesLabel: 'Number values',
          },
        ]}
        i18nStrings={i18nStrings}
        query={{
          operation: 'or',
          tokens: [
            {
              value: 'One',
              propertyKey: 'text',
              operator: '=',
            },
            {
              value: 'Two',
              propertyKey: 'text',
              operator: '=',
            },
            {
              value: 'Three',
              propertyKey: 'text',
              operator: '=',
            },
            {
              value: 1,
              propertyKey: 'number',
              operator: '=',
            },
            {
              value: 2,
              propertyKey: 'number',
              operator: '=',
            },
            {
              value: 3,
              propertyKey: 'number',
              operator: '=',
            },
          ],
        }}
        onChange={() => {}}
      />,
    ],
    preferences: ['preferences'],
    items: [createSimpleItems(3)],
  },
]);
/* eslint-enable react/jsx-key */

export default function () {
  return (
    <>
      <h1>Table permutations</h1>
      <ScreenshotArea disableAnimations={true}>
        <PermutationsView
          permutations={permutations}
          render={permutation => <Table {...permutation} ariaLabels={ARIA_LABELS} />}
        />
      </ScreenshotArea>
    </>
  );
}
