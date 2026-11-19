// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

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
  ],
  filteringOptions: [
    { propertyKey: 'id', value: 'x-1' },
    { propertyKey: 'id', value: 'x-2' },
    { propertyKey: 'id', value: 'x-3' },
    { propertyKey: 'status', value: 'Ready' },
    { propertyKey: 'status', value: 'Steady' },
    { propertyKey: 'status', value: 'Go' },
  ],
  enableTokenGroups: true,
  query: {
    operation: 'and',
    tokens: [],
    tokenGroups: [
      {
        operation: 'or',
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
        ],
      },
      {
        propertyKey: 'status',
        operator: '=',
        value: ['Ready', 'Go'],
      },
    ],
  },
};

const render = createRenderer(defaultProps);

describe('Property filter stories: tokens editing, group', () => {
  test('changes operation', () => {
    const { wrapper } = render();

    expect(wrapper.tokens.list()).toEqual(['ID = x-2 or Name : John', 'and Status = Ready, Go']);

    wrapper.tokens.token(2).operation('or');
    expect(wrapper.tokens.list()).toEqual(['ID = x-2 or Name : John', 'or Status = Ready, Go']);

    wrapper.tokens.token(1).nested(2).operation('and');
    expect(wrapper.tokens.list()).toEqual(['ID = x-2 and Name : John', 'or Status = Ready, Go']);
  });

  test('changes second token to a group of two', () => {
    const { wrapper } = render();

    expect(wrapper.tokens.list()).toEqual(['ID = x-2 or Name : John', 'and Status = Ready, Go']);

    wrapper.editor.open(2);
    expect(wrapper.editor.dropdown()).toBe(true);
    expect(wrapper.editor.form()).toEqual(['Property[Status] Operator[=] Value[Ready, Go]']);

    wrapper.editor.addFilter();
    expect(wrapper.editor.form()).toEqual([
      'Property[Status] Operator[=] Value[Ready, Go]',
      'Property[Status] Operator[=] Value[]',
    ]);

    wrapper.editor.property(2).value('name');
    wrapper.editor.operator(2).value(':');
    wrapper.editor.value(2).autosuggest().input('Jane');
    wrapper.editor.submit();
    expect(wrapper.editor.dropdown()).toBe(false);
    expect(wrapper.tokens.list()).toEqual(['ID = x-2 or Name : John', 'and Status = Ready, Go or Name : Jane']);
  });

  test('changes first token from a group of two to single', () => {
    const { wrapper } = render();

    expect(wrapper.tokens.list()).toEqual(['ID = x-2 or Name : John', 'and Status = Ready, Go']);

    wrapper.editor.open(1);
    expect(wrapper.editor.dropdown()).toBe(true);
    expect(wrapper.editor.form()).toEqual([
      'Property[ID] Operator[=] Value[x-2]',
      'Property[Name] Operator[:] Value[John]',
    ]);

    wrapper.editor.remove(2);
    expect(wrapper.editor.form()).toEqual(['Property[ID] Operator[=] Value[x-2]']);

    wrapper.editor.submit();
    expect(wrapper.editor.dropdown()).toBe(false);
    expect(wrapper.tokens.list()).toEqual(['ID = x-2', 'and Status = Ready, Go']);
  });
});
