// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';

import { Multiselect, MultiselectProps, Toggle } from '~components';
import { SelectProps } from '~components/select';

import AppContext, { AppContextType } from '../app/app-context';
import { SimplePage } from '../app/templates';
import { i18nStrings } from './constants';
const lotsOfOptions: SelectProps.Options = [...Array(50)].map((_, index) => ({
  value: `Option ${index}`,
  label: `Option ${index}`,
}));
const options: SelectProps.Options = [
  { value: 'first', label: 'Simple' },
  { value: 'second', label: 'With small icon', iconName: 'folder' },
  {
    value: 'third',
    label: 'With big icon icon',
    description: 'Very big option',
    iconName: 'heart',
    disabled: false,
    disabledReason: 'disabled reason',
    tags: ['Cool', 'Intelligent', 'Cat'],
  },
  {
    label: 'Option group',
    options: [{ value: 'forth', label: 'Nested option' }],
    disabledReason: 'disabled reason',
  },
  ...lotsOfOptions,
  { label: 'Last option', disabled: false, disabledReason: 'disabled reason' },
];
type PageContext = React.Context<
  AppContextType<{
    virtualScroll?: boolean;
  }>
>;

export default function SelectPage() {
  const { urlParams, setUrlParams } = React.useContext(AppContext as PageContext);
  const virtualScroll = urlParams.virtualScroll ?? false;

  const [selectedOptions, setSelectedOptions] = React.useState<MultiselectProps.Options>([]);
  const renderOptionItem: MultiselectProps.MultiselectOptionItemRenderer = ({ item }) => {
    if (item.type === 'select-all') {
      return <div>Select all? {item.selected ? 'Yes' : 'No'}</div>;
    } else if (item.type === 'group') {
      return <div>Group: {item.option.label}</div>;
    } else if (item.type === 'item') {
      return <div>Item: {item.option.label}</div>;
    }

    return null;
  };

  return (
    <SimplePage
      title="Multiselect with custom item renderer"
      settings={
        <Toggle
          checked={urlParams.virtualScroll === true}
          onChange={({ detail }) => setUrlParams({ virtualScroll: detail.checked })}
        >
          Virtual Scroll
        </Toggle>
      }
      screenshotArea={{
        style: {
          padding: 10,
        },
      }}
    >
      <div style={{ maxInlineSize: '400px', blockSize: '650px' }}>
        <Multiselect
          virtualScroll={virtualScroll}
          enableSelectAll={true}
          i18nStrings={{ ...i18nStrings, selectAllText: 'Select all' }}
          filteringType={'auto'}
          renderOption={renderOptionItem}
          placeholder={`Choose option ${virtualScroll ? '(virtual)' : ''}`}
          selectedOptions={selectedOptions}
          onChange={event => {
            setSelectedOptions(event.detail.selectedOptions);
          }}
          options={options}
        />
      </div>
    </SimplePage>
  );
}
