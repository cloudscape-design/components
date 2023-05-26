// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { render } from '@testing-library/react';
import createWrapper from '../../../lib/components/test-utils/dom';
import PropertyFilter, { PropertyFilterProps } from '../../../lib/components/property-filter';
import { warnOnce } from '@cloudscape-design/component-toolkit/internal';
import { i18nStrings } from './common';

jest.mock('@cloudscape-design/component-toolkit/internal', () => ({
  ...jest.requireActual('@cloudscape-design/component-toolkit/internal'),
  warnOnce: jest.fn(),
}));

afterEach(() => {
  (warnOnce as jest.Mock).mockReset();
});

const renderComponent = (props?: Partial<PropertyFilterProps>) => {
  const { container } = render(
    <PropertyFilter
      filteringProperties={[]}
      filteringOptions={[]}
      onChange={() => undefined}
      query={{ tokens: [], operation: 'and' }}
      i18nStrings={i18nStrings}
      {...props}
    />
  );
  return { wrapper: createWrapper(container).findPropertyFilter()! };
};

describe('property filter with property definitions', () => {
  test('propertyLabel, groupValuesLabel and group are taken from definition when available', () => {
    const { wrapper } = renderComponent({
      filteringProperties: [
        {
          key: 'property-1',
          propertyLabel: 'deprecated',
          groupValuesLabel: 'deprecated',
          group: 'deprecated',
          operators: ['=', '!='],
        },
      ],
      propertyDefinitions: {
        'property-1': {
          propertyLabel: 'propertyLabel-1',
          groupValuesLabel: 'groupValuesLabel-1',
          group: 'group-1',
        },
      },
      customGroupsText: [
        {
          group: 'deprecated',
          properties: 'deprecated',
          values: 'deprecated',
        },
        {
          group: 'group-1',
          properties: 'group-1:properties',
          values: 'group-1:values',
        },
      ],
      filteringOptions: [
        {
          propertyKey: 'property-1',
          value: 'value 1',
        },
        {
          propertyKey: 'property-1',
          value: 'value 2',
        },
      ],
    });

    wrapper.setInputValue('property');

    expect(wrapper.findDropdown().getElement().textContent).toContain('group-1:properties');
    expect(wrapper.findDropdown().getElement().textContent).toContain('propertyLabel-1');

    wrapper.setInputValue('value');

    expect(wrapper.findDropdown().getElement().textContent).toContain('group-1:values');

    wrapper.setInputValue('propertyLabel-1 =');

    expect(wrapper.findDropdown().getElement().textContent).toContain('groupValuesLabel-1');
  });

  test('dev warnings are issues when propertyLabel or groupValuesLabel are missing', () => {
    renderComponent({
      filteringProperties: [
        {
          key: 'property-1',
          operators: ['=', '!='],
        },
      ],
    });

    expect(warnOnce).toHaveBeenCalledTimes(2);
    expect(warnOnce).toHaveBeenCalledWith('PropertyFilter', `Property "property-1" does not have a label.`);
    expect(warnOnce).toHaveBeenCalledWith(
      'PropertyFilter',
      `Property "property-1" does not have a group values label.`
    );
  });

  test('by-operator formatValue and renderForm are taken from operator definition when available', () => {
    const formatValue = jest.fn();
    const renderForm = jest.fn();
    const formatValueDeprecated = jest.fn();
    const renderFormDeprecated = jest.fn();

    const { wrapper } = renderComponent({
      filteringProperties: [
        {
          key: 'property-1',
          operators: [
            {
              operator: '=',
              format: formatValueDeprecated,
              form: renderFormDeprecated,
            },
          ],
        },
      ],
      propertyDefinitions: {
        'property-1': {
          propertyLabel: 'propertyLabel-1',
          groupValuesLabel: 'groupValuesLabel-1',
          operators: {
            '=': { formatValue, renderForm },
          },
        },
      },
      filteringOptions: [
        {
          propertyKey: 'property-1',
          value: 'value 1',
        },
        {
          propertyKey: 'property-1',
          value: 'value 2',
        },
      ],
      query: { tokens: [{ propertyKey: 'property-1', operator: '=', value: 'value 1' }], operation: 'and' },
    });

    expect(formatValueDeprecated).not.toHaveBeenCalled();
    expect(formatValue).toHaveBeenCalledTimes(1);
    expect(formatValue).toHaveBeenCalledWith('value 1');

    wrapper.setInputValue('propertyLabel-1 =');

    expect(renderFormDeprecated).not.toHaveBeenCalled();
    expect(renderForm).toHaveBeenCalledTimes(1);
    expect(renderForm).toHaveBeenCalledWith({
      value: null,
      onChange: expect.any(Function),
      filter: '',
      operator: '=',
    });
  });

  test('by-operator formatValue and renderForm are taken from extended operator if missing in definition', () => {
    const formatValueDeprecated = jest.fn();
    const renderFormDeprecated = jest.fn();

    const { wrapper } = renderComponent({
      filteringProperties: [
        {
          key: 'property-1',
          operators: [
            {
              operator: '=',
              format: formatValueDeprecated,
              form: renderFormDeprecated,
            },
          ],
        },
      ],
      propertyDefinitions: {
        'property-1': {
          propertyLabel: 'propertyLabel-1',
          groupValuesLabel: 'groupValuesLabel-1',
        },
      },
      filteringOptions: [
        {
          propertyKey: 'property-1',
          value: 'value 1',
        },
        {
          propertyKey: 'property-1',
          value: 'value 2',
        },
      ],
      query: { tokens: [{ propertyKey: 'property-1', operator: '=', value: 'value 1' }], operation: 'and' },
    });

    expect(formatValueDeprecated).toHaveBeenCalledTimes(1);
    expect(formatValueDeprecated).toHaveBeenCalledWith('value 1');

    wrapper.setInputValue('propertyLabel-1 =');

    expect(renderFormDeprecated).toHaveBeenCalledTimes(1);
    expect(renderFormDeprecated).toHaveBeenCalledWith({
      value: null,
      onChange: expect.any(Function),
      filter: '',
      operator: '=',
    });
  });

  test('by-operator formatValue and renderForm are taken from property definition if missing in operator definition and extended operator', () => {
    const formatValue = jest.fn();
    const renderForm = jest.fn();

    const { wrapper } = renderComponent({
      filteringProperties: [
        {
          key: 'property-1',
          operators: ['='],
        },
      ],
      propertyDefinitions: {
        'property-1': {
          propertyLabel: 'propertyLabel-1',
          groupValuesLabel: 'groupValuesLabel-1',
          formatValue,
          renderForm,
        },
      },
      filteringOptions: [
        {
          propertyKey: 'property-1',
          value: 'value 1',
        },
        {
          propertyKey: 'property-1',
          value: 'value 2',
        },
      ],
      query: { tokens: [{ propertyKey: 'property-1', operator: '=', value: 'value 1' }], operation: 'and' },
    });

    expect(formatValue).toHaveBeenCalled();
    expect(formatValue).toHaveBeenCalledWith('value 1');

    wrapper.setInputValue('propertyLabel-1 =');

    expect(renderForm).toHaveBeenCalledTimes(1);
    expect(renderForm).toHaveBeenCalledWith({
      value: null,
      onChange: expect.any(Function),
      filter: '',
      operator: '=',
    });
  });

  test('by-property formatValue is used to format filtering options', () => {
    const { wrapper } = renderComponent({
      filteringProperties: [
        {
          key: 'property-1',
          operators: ['='],
        },
      ],
      propertyDefinitions: {
        'property-1': {
          propertyLabel: 'propertyLabel-1',
          groupValuesLabel: 'groupValuesLabel-1',
          formatValue: (value: string) => value.toUpperCase(),
        },
      },
      filteringOptions: [
        {
          propertyKey: 'property-1',
          value: 'value 1',
        },
        {
          propertyKey: 'property-1',
          value: 'value 2',
        },
      ],
      query: { tokens: [{ propertyKey: 'property-1', operator: '=', value: 'value 1' }], operation: 'and' },
    });

    expect(wrapper.findTokens()[0].getElement().textContent).toEqual('propertyLabel-1 = VALUE 1');

    wrapper.setInputValue('propertyLabel-1 =');

    expect(
      wrapper
        .findDropdown()
        .findOptions()!
        .map(optionWrapper => optionWrapper.getElement().textContent)
    ).toEqual(['propertyLabel-1 = VALUE 1', 'propertyLabel-1 = VALUE 2']);
  });
});
