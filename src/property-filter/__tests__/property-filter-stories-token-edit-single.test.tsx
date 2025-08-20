// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

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
          format: token => (token ? token : 'not specified'),
        },
      ],
      groupValuesLabel: 'Creation date values',
    },
  ],
  filteringOptions: [
    { propertyKey: 'id', value: 'x-1' },
    { propertyKey: 'id', value: 'x-2' },
    { propertyKey: 'id', value: 'x-3' },
    { propertyKey: 'status', value: 'Ready' },
    { propertyKey: 'status', value: 'Steady' },
    { propertyKey: 'status', value: 'Go' },
  ],
  query: {
    operation: 'and',
    tokens: [
      {
        propertyKey: 'id',
        operator: '=',
        value: 'x-2',
      },
      {
        propertyKey: 'name',
        operator: ':',
        value: 'John',
      },
      {
        propertyKey: 'status',
        operator: '=',
        value: ['Ready', 'Go'],
      },
      {
        propertyKey: 'creationDate',
        operator: '=',
        value: '2021',
      },
    ],
  },
};
const render = createRenderer(defaultProps);
const renderAsync = createRenderer(defaultProps, { async: true });

describe('Property filter stories: tokens editing, single', () => {
  test('changes text token value using available suggestions and custom input', () => {
    const { wrapper } = render({});

    wrapper.editor.open(1);
    expect(wrapper.editor.dropdown()).toBe(true);
    expect(wrapper.editor.form()).toEqual(['Property[ID] Operator[=Equals] Value[x-2]']);

    wrapper.editor.value().autosuggest().option('x-3');
    expect(wrapper.editor.form()).toEqual(['Property[ID] Operator[=Equals] Value[x-3]']);

    wrapper.editor.value().autosuggest().input('x-?');
    expect(wrapper.editor.form()).toEqual(['Property[ID] Operator[=Equals] Value[x-?]']);

    wrapper.editor.submit();
    expect(wrapper.editor.dropdown()).toBe(false);
    expect(wrapper.tokens.list()).toEqual([
      'ID = x-?',
      'and Name : John',
      'and Status = Ready, Go',
      'and Created at = 2021',
    ]);
  });

  test('edits property operator and property type then cancels the change', () => {
    const { wrapper } = render({});

    wrapper.editor.open(2);
    expect(wrapper.editor.dropdown()).toBe(true);
    expect(wrapper.editor.form()).toEqual(['Property[Name] Operator[:Contains] Value[John]']);

    wrapper.editor.operator().value('!:');
    expect(wrapper.editor.form()).toEqual(['Property[Name] Operator[!:Does not contain] Value[John]']);

    wrapper.editor.property().value(null as any);
    expect(wrapper.editor.form()).toEqual(['Property[All properties] Operator[!:Does not contain] Value[]']);

    wrapper.editor.property().value('id');
    expect(wrapper.editor.form()).toEqual(['Property[ID] Operator[=Equals] Value[]']);

    wrapper.editor.cancel();
    expect(wrapper.editor.dropdown()).toBe(false);
    expect(wrapper.tokens.list()).toEqual([
      'ID = x-2',
      'and Name : John',
      'and Status = Ready, Go',
      'and Created at = 2021',
    ]);
  });

  test('fails to edit property to free text when free text is disabled', () => {
    const { wrapper } = render({ disableFreeTextFiltering: true });

    wrapper.editor.open(2);
    expect(wrapper.editor.dropdown()).toBe(true);
    expect(wrapper.editor.form()).toEqual(['Property[Name] Operator[:Contains] Value[John]']);

    expect(wrapper.editor.property().options()).toEqual(['ID', 'Name', 'Status', 'Created at']);
  });

  test('changes enum property value', () => {
    const { wrapper } = render({});

    wrapper.editor.open(3);
    expect(wrapper.editor.dropdown()).toBe(true);
    expect(wrapper.editor.form()).toEqual(['Property[Status] Operator[=Equals] Value[Ready, Go]']);

    wrapper.editor.value().multiselect().value(['Ready', 'Steady']);
    expect(wrapper.editor.form()).toEqual(['Property[Status] Operator[=Equals] Value[Steady, Go]']);

    wrapper.editor.submit();
    expect(wrapper.editor.dropdown()).toBe(false);
    expect(wrapper.tokens.list()).toEqual([
      'ID = x-2',
      'and Name : John',
      'and Status = Go, Steady',
      'and Created at = 2021',
    ]);
  });

  test('changes date property value', () => {
    const { wrapper } = render({});

    wrapper.editor.open(4);
    expect(wrapper.editor.dropdown()).toBe(true);
    expect(wrapper.editor.form()).toEqual(['Property[Created at] Operator[=Equals] Value[2021/]']);

    wrapper.editor.value().dateInput().value('2022/03/04');
    expect(wrapper.editor.form()).toEqual(['Property[Created at] Operator[=Equals] Value[2022/03/04]']);

    wrapper.editor.submit();
    expect(wrapper.editor.dropdown()).toBe(false);
    expect(wrapper.tokens.list()).toEqual([
      'ID = x-2',
      'and Name : John',
      'and Status = Ready, Go',
      'and Created at = 2022-03-04',
    ]);
  });

  test('changes operation', () => {
    const { wrapper } = render({});

    expect(wrapper.tokens.list()).toEqual([
      'ID = x-2',
      'and Name : John',
      'and Status = Ready, Go',
      'and Created at = 2021',
    ]);

    wrapper.tokens.token(2).operation('or');
    expect(wrapper.tokens.list()).toEqual([
      'ID = x-2',
      'or Name : John',
      'or Status = Ready, Go',
      'or Created at = 2021',
    ]);
  });

  test('changes async text option', () => {
    const { wrapper } = renderAsync({});

    wrapper.editor.open(1);
    expect(wrapper.editor.dropdown()).toBe(true);
    expect(wrapper.editor.form()).toEqual(['Property[ID] Operator[=Equals] Value[x-2]']);

    wrapper.editor.value().autosuggest().input('x-');
    wrapper.editor.value().autosuggest().focus();
    expect(wrapper.editor.value().autosuggest().options()).toEqual([]);

    window.loadingComplete();
    expect(wrapper.editor.value().autosuggest().options()).toEqual(['x-1', 'x-2', 'x-3']);

    wrapper.editor.value().autosuggest().option('x-3');
    wrapper.editor.submit();
    expect(wrapper.tokens.list()).toEqual([
      'ID = x-3',
      'and Name : John',
      'and Status = Ready, Go',
      'and Created at = 2021',
    ]);
  });

  test('changes async enum option', () => {
    const { wrapper } = renderAsync({ asyncProperties: false });

    wrapper.editor.open(3);
    expect(wrapper.editor.dropdown()).toBe(true);
    expect(wrapper.editor.form()).toEqual(['Property[Status] Operator[=Equals] Value[]']);

    wrapper.editor.value().multiselect().open();
    expect(wrapper.editor.value().multiselect().options()).toEqual([]);

    window.loadingComplete();
    expect(wrapper.editor.form()).toEqual(['Property[Status] Operator[=Equals] Value[Ready, Go]']);
    expect(wrapper.editor.value().multiselect().options()).toEqual(['Ready', 'Steady', 'Go']);

    wrapper.editor.value().multiselect().filter('Go');
    expect(wrapper.editor.form()).toEqual(['Property[Status] Operator[=Equals] Value[Ready, Go]']);
    expect(wrapper.editor.value().multiselect().options()).toEqual(['Go']);

    wrapper.editor.value().multiselect().value([null]);
    expect(wrapper.editor.form()).toEqual(['Property[Status] Operator[=Equals] Value[Ready]']);

    wrapper.editor.submit();
    expect(wrapper.tokens.list()).toEqual([
      'ID = x-2',
      'and Name : John',
      'and Status = Ready',
      'and Created at = 2021',
    ]);
  });
});
