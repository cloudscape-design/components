// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';

import { Multiselect, MultiselectProps } from '~components';
import Box from '~components/box';
import { SelectProps } from '~components/select';

import ScreenshotArea from '../utils/screenshot-area';
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

export default function SelectPage() {
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
    <ScreenshotArea>
      <Box variant="h1">Multiselect with custom item renderer</Box>
      <Box padding="l">
        <div style={{ width: '400px' }}>
          <Multiselect
            enableSelectAll={true}
            i18nStrings={{ ...i18nStrings, selectAllText: 'Select all' }}
            filteringType={'auto'}
            renderOption={renderOptionItem}
            placeholder="Choose option"
            selectedOptions={selectedOptions}
            onChange={event => {
              setSelectedOptions(event.detail.selectedOptions);
            }}
            options={options}
          />
        </div>
      </Box>
    </ScreenshotArea>
  );
}
