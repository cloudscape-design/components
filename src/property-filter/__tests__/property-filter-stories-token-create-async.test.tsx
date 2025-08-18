// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { KeyCode } from '@cloudscape-design/test-utils-core/utils';

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
    { propertyKey: 'id', value: 'x-4' },
    { propertyKey: 'status', value: 'Active' },
    { propertyKey: 'status', value: 'Activating' },
    { propertyKey: 'status', value: 'Inactive' },
  ],
};
const render = createRenderer(defaultProps, { async: true });

describe('Property filter stories: tokens creation, async', () => {
  test('waits and selects property, then waits and selects option', async () => {
    const { wrapper } = render({ asyncProperties: true });

    wrapper.input.focus();
    expect(wrapper.input.dropdown()).toBe(true);
    expect(wrapper.input.options()).toEqual([]);
    expect(wrapper.input.status()).toBe('Loading status');

    await new Promise(resolve => setTimeout(resolve, 1));
    expect(wrapper.input.options()).toEqual(['ID', 'Status']);
    expect(wrapper.input.status()).toBe('Finished status');

    wrapper.input.value('ID');
    expect(wrapper.input.options()).toEqual(['Use: "ID"', 'ID =Equals', 'ID !=Does not equal']);

    wrapper.input.selectByValue('ID = ');
    expect(wrapper.input.options()).toEqual(['Use: "ID = "', 'ID = x-1', 'ID = x-2', 'ID = x-3', 'ID = x-4']);
    expect(wrapper.input.status()).toBe('Loading status');

    await new Promise(resolve => setTimeout(resolve, 1));
    expect(wrapper.input.options()).toEqual(['Use: "ID = "', 'ID = x-1', 'ID = x-2', 'ID = x-3', 'ID = x-4']);
    expect(wrapper.input.status()).toBe('Finished status');

    wrapper.input.selectByValue('ID = x-2');
    expect(wrapper.input.dropdown()).toBe(false);
    expect(wrapper.tokens.list()).toEqual(['ID = x-2']);
  });

  test('searches token by value, waits and selects the matched option', async () => {
    const { wrapper } = render({ asyncProperties: false });

    wrapper.input.focus();
    expect(wrapper.input.dropdown()).toBe(true);
    expect(wrapper.input.options()).toEqual(['ID', 'Status']);
    expect(wrapper.input.status()).toBe('');

    wrapper.input.value('x-3');
    expect(wrapper.input.options()).toEqual(['Use: "x-3"']);
    expect(wrapper.input.status()).toBe('Loading status');

    await new Promise(resolve => setTimeout(resolve, 1));
    expect(wrapper.input.options()).toEqual(['Use: "x-3"', 'ID = x-3']);
    expect(wrapper.input.status()).toBe('Finished status');

    wrapper.input.keys(KeyCode.down, KeyCode.down, KeyCode.enter);
    expect(wrapper.tokens.list()).toEqual(['ID = x-3']);
  });

  test('searches enum token value, waits and selects all matched options', async () => {
    const { wrapper } = render({ asyncProperties: false });

    wrapper.input.focus();
    expect(wrapper.input.dropdown()).toBe(true);
    expect(wrapper.input.options()).toEqual(['ID', 'Status']);
    expect(wrapper.input.status()).toBe('');

    wrapper.input.value('Status = Activ');
    expect(wrapper.input.options()).toEqual([]);
    expect(wrapper.input.status()).toBe('Loading status');

    await new Promise(resolve => setTimeout(resolve, 1));
    expect(wrapper.input.options()).toEqual(['Active', 'Activating']);
    expect(wrapper.input.status()).toBe('Finished status');

    wrapper.input.selectAll();
    wrapper.input.submit();
    expect(wrapper.input.dropdown()).toBe(false);
    expect(wrapper.tokens.list()).toEqual(['Status = Active, Activating']);
  });
});
