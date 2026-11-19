// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

import { KeyCode } from '@cloudscape-design/test-utils-core/utils';

import DateInput from '../../../lib/components/date-input';
import { PropertyFilterProps } from '../interfaces';
import { createRenderer } from './stories-components';

const defaultProps: Partial<PropertyFilterProps> = {
  filteringProperties: [
    {
      key: 'id',
      propertyLabel: 'ID',
      operators: ['=', '!='],
      groupValuesLabel: 'ID values',
    },
    {
      key: 'name',
      propertyLabel: 'Name',
      operators: [':', '!:'],
      groupValuesLabel: 'Name values',
      defaultOperator: ':',
    },
    {
      key: 'active',
      propertyLabel: 'Active',
      operators: ['='],
      groupValuesLabel: 'Active values',
    },
    {
      key: 'status',
      propertyLabel: 'Status',
      operators: [
        { operator: '=', tokenType: 'enum' },
        { operator: '!=', tokenType: 'enum' },
      ],
      groupValuesLabel: 'Status values',
    },
    {
      key: 'creationDate',
      propertyLabel: 'Created at',
      operators: [
        {
          operator: '=',
          form: props => <DateInput value={props.value} onChange={({ detail }) => props.onChange(detail.value)} />,
          format: token => (token ? `[${token}]` : 'not specified'),
        },
      ],
      groupValuesLabel: 'Creation date values',
    },
  ],
  filteringOptions: [
    { propertyKey: 'id', value: 'x-1' },
    { propertyKey: 'id', value: 'x-2' },
    { propertyKey: 'id', value: 'x-3' },
    { propertyKey: 'name', value: 'John' },
    { propertyKey: 'active', value: 'Yes' },
    { propertyKey: 'active', value: 'No' },
    { propertyKey: 'status', value: 'Active' },
    { propertyKey: 'status', value: 'Activating' },
    { propertyKey: 'status', value: 'Inactive' },
  ],
};
const render = createRenderer(defaultProps);

describe('Property filter stories: tokens creation, sync', () => {
  test('creates token with 3 clicks', () => {
    const { wrapper } = render({});

    wrapper.input.focus();
    expect(wrapper.input.dropdown()).toBe(true);
    expect(wrapper.input.options()).toEqual(['ID', 'Name', 'Active', 'Status', 'Created at']);

    wrapper.input.selectByValue('ID');
    expect(wrapper.input.options()).toEqual(['Use: "ID"', 'ID =Equals', 'ID !=Does not equal']);

    wrapper.input.selectByValue('ID = ');
    expect(wrapper.input.options()).toEqual(['Use: "ID = "', 'ID = x-1', 'ID = x-2', 'ID = x-3']);

    wrapper.input.selectByValue('ID = x-1');
    expect(wrapper.input.dropdown()).toBe(false);
    expect(wrapper.tokens.list()).toEqual(['ID = x-1']);
  });

  test('creates token with 2 clicks (for single-operator property)', () => {
    const { wrapper } = render({});

    wrapper.input.focus();
    expect(wrapper.input.dropdown()).toBe(true);
    expect(wrapper.input.options()).toEqual(['ID', 'Name', 'Active', 'Status', 'Created at']);

    wrapper.input.selectByValue('Active');
    expect(wrapper.input.options()).toEqual(['Use: "Active = "', 'Active = Yes', 'Active = No']);

    wrapper.input.selectByValue('Active = No');
    expect(wrapper.input.dropdown()).toBe(false);
    expect(wrapper.tokens.list()).toEqual(['Active = No']);
  });

  test('creates token with search and keyboard select', () => {
    const { wrapper } = render({});

    wrapper.input.focus();
    expect(wrapper.input.dropdown()).toBe(true);
    expect(wrapper.input.options()).toEqual(['ID', 'Name', 'Active', 'Status', 'Created at']);

    wrapper.input.value('Na');
    expect(wrapper.input.options()).toEqual(['Use: "Na"', 'Name', 'Status = Inactive']);

    wrapper.input.keys(KeyCode.down, KeyCode.down, KeyCode.enter);
    expect(wrapper.input.options()).toEqual(['Use: "Name"', 'Name :Contains', 'Name !:Does not contain']);

    wrapper.input.value('Name !');
    expect(wrapper.input.options()).toEqual(['Use: "Name !"', 'Name !:Does not contain']);

    wrapper.input.value('Name !: Jo');
    expect(wrapper.input.options()).toEqual(['Use: "Name !: Jo"', 'Name !: John']);

    wrapper.input.keys(KeyCode.down, KeyCode.down, KeyCode.enter);
    expect(wrapper.input.dropdown()).toBe(false);
    expect(wrapper.tokens.list()).toEqual(['Name !: John']);
  });

  test('creates token with value search', () => {
    const { wrapper } = render({});

    wrapper.input.focus();
    expect(wrapper.input.dropdown()).toBe(true);
    expect(wrapper.input.options()).toEqual(['ID', 'Name', 'Active', 'Status', 'Created at']);

    wrapper.input.value('x-2');
    expect(wrapper.input.options()).toEqual(['Use: "x-2"', 'ID = x-2']);

    wrapper.input.keys(KeyCode.down, KeyCode.down, KeyCode.enter);
    expect(wrapper.input.dropdown()).toBe(false);
    expect(wrapper.tokens.list()).toEqual(['ID = x-2']);
  });

  test('creates free-text token with by pressing enter', () => {
    const { wrapper } = render({});

    wrapper.input.focus();
    expect(wrapper.input.dropdown()).toBe(true);
    expect(wrapper.input.options()).toEqual(['ID', 'Name', 'Active', 'Status', 'Created at']);

    wrapper.input.value('x-2');
    expect(wrapper.input.options()).toEqual(['Use: "x-2"', 'ID = x-2']);

    wrapper.input.keys(KeyCode.enter);
    expect(wrapper.input.dropdown()).toBe(false);
    expect(wrapper.tokens.list()).toEqual(['x-2']);
  });

  test('creates free-text token by selecting "use" option', () => {
    const { wrapper } = render({});

    wrapper.input.focus();
    expect(wrapper.input.dropdown()).toBe(true);
    expect(wrapper.input.options()).toEqual(['ID', 'Name', 'Active', 'Status', 'Created at']);

    wrapper.input.value('x-2');
    expect(wrapper.input.options()).toEqual(['Use: "x-2"', 'ID = x-2']);

    wrapper.input.keys(KeyCode.down, KeyCode.enter);
    expect(wrapper.input.dropdown()).toBe(false);
    expect(wrapper.tokens.list()).toEqual(['x-2']);
  });

  test('creates token with 3 clicks with disallowed free-text selection', () => {
    const { wrapper } = render({ disableFreeTextFiltering: true });

    wrapper.input.focus();
    expect(wrapper.input.dropdown()).toBe(true);
    expect(wrapper.input.options()).toEqual(['ID', 'Name', 'Active', 'Status', 'Created at']);

    wrapper.input.selectByValue('ID');
    expect(wrapper.input.options()).toEqual(['ID =Equals', 'ID !=Does not equal']);

    wrapper.input.selectByValue('ID = ');
    expect(wrapper.input.options()).toEqual(['Use: "ID = "', 'ID = x-1', 'ID = x-2', 'ID = x-3']);

    wrapper.input.selectByValue('ID = x-1');
    expect(wrapper.input.dropdown()).toBe(false);
    expect(wrapper.tokens.list()).toEqual(['ID = x-1']);
  });

  test('fails to create free-text token when pressing enter when free-text selection is disallowed', () => {
    const { wrapper } = render({ disableFreeTextFiltering: true });

    wrapper.input.focus();
    expect(wrapper.input.dropdown()).toBe(true);
    expect(wrapper.input.options()).toEqual(['ID', 'Name', 'Active', 'Status', 'Created at']);

    wrapper.input.value('x-2');
    expect(wrapper.input.options()).toEqual(['ID = x-2']);

    wrapper.input.keys(KeyCode.enter);
    expect(wrapper.input.dropdown()).toBe(false);
    expect(wrapper.tokens.list()).toEqual([]);
  });

  test('fails to create token with non-matched operator when free-text selection is disallowed', () => {
    const { wrapper } = render({ disableFreeTextFiltering: true });

    wrapper.input.focus();
    expect(wrapper.input.dropdown()).toBe(true);
    expect(wrapper.input.options()).toEqual(['ID', 'Name', 'Active', 'Status', 'Created at']);

    wrapper.input.value('ID > 2');
    expect(wrapper.input.options()).toEqual([]);

    wrapper.input.keys(KeyCode.enter);
    expect(wrapper.input.dropdown()).toBe(false);
    expect(wrapper.tokens.list()).toEqual([]);
  });

  test('creates token with non-matched value when free-text selection is disallowed', () => {
    const { wrapper } = render({ disableFreeTextFiltering: true });

    wrapper.input.focus();
    expect(wrapper.input.dropdown()).toBe(true);
    expect(wrapper.input.options()).toEqual(['ID', 'Name', 'Active', 'Status', 'Created at']);

    wrapper.input.value('ID = x-?');
    expect(wrapper.input.options()).toEqual(['Use: "ID = x-?"']);

    wrapper.input.keys(KeyCode.enter);
    expect(wrapper.input.dropdown()).toBe(false);
    expect(wrapper.tokens.list()).toEqual(['ID = x-?']);
  });

  test('creates empty enum token', () => {
    const { wrapper } = render({ disableFreeTextFiltering: Math.random() > 0.5 });

    wrapper.input.focus();
    wrapper.input.value('Status = ');
    expect(wrapper.input.dropdown()).toBe(true);
    expect(wrapper.input.options()).toEqual(['Active', 'Activating', 'Inactive']);

    wrapper.input.submit();
    expect(wrapper.input.dropdown()).toBe(false);
    expect(wrapper.tokens.list()).toEqual(['Status = ']);
  });

  test('creates enum token with two options', () => {
    const { wrapper } = render({ disableFreeTextFiltering: Math.random() > 0.5 });

    wrapper.input.focus();
    wrapper.input.value('Status = ');
    expect(wrapper.input.dropdown()).toBe(true);
    expect(wrapper.input.options()).toEqual(['Active', 'Activating', 'Inactive']);

    wrapper.input.selectByValue('Active');
    wrapper.input.selectByValue('Inactive');

    wrapper.input.submit();
    expect(wrapper.input.dropdown()).toBe(false);
    expect(wrapper.tokens.list()).toEqual(['Status = Active, Inactive']);
  });

  test('creates enum token with two options using filter', () => {
    const { wrapper } = render({ disableFreeTextFiltering: Math.random() > 0.5 });

    wrapper.input.focus();
    wrapper.input.value('Status = tive');
    expect(wrapper.input.dropdown()).toBe(true);
    expect(wrapper.input.options()).toEqual(['Active', 'Inactive']);

    wrapper.input.selectByValue(null);

    wrapper.input.submit();
    expect(wrapper.input.dropdown()).toBe(false);
    expect(wrapper.tokens.list()).toEqual(['Status = Active, Inactive']);
  });

  test('creates empty date token', () => {
    const { wrapper } = render({ disableFreeTextFiltering: Math.random() > 0.5 });

    wrapper.input.focus();
    wrapper.input.value('Created at = ');
    expect(wrapper.input.dropdown()).toBe(true);

    wrapper.input.submit();
    expect(wrapper.input.dropdown()).toBe(false);
    expect(wrapper.tokens.list()).toEqual(['Created at = not specified']);
  });

  test('creates filled date token using custom input', () => {
    const { wrapper } = render({ disableFreeTextFiltering: Math.random() > 0.5 });

    wrapper.input.focus();
    wrapper.input.value('Created at = ');
    expect(wrapper.input.dropdown()).toBe(true);

    wrapper.input.date('2021/02/03');

    wrapper.input.submit();
    expect(wrapper.input.dropdown()).toBe(false);
    expect(wrapper.tokens.list()).toEqual(['Created at = [2021-02-03]']);
  });

  test('creates filled date token using enter', () => {
    const { wrapper } = render({ disableFreeTextFiltering: Math.random() > 0.5 });

    wrapper.input.focus();
    wrapper.input.value('Created at = 2021/02/03');
    expect(wrapper.input.dropdown()).toBe(true);

    wrapper.input.keys(KeyCode.enter);

    expect(wrapper.input.dropdown()).toBe(false);
    expect(wrapper.tokens.list()).toEqual(['Created at = [2021/02/03]']);
  });
});
