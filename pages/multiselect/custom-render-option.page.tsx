// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';

import { Badge, Multiselect, MultiselectProps, SpaceBetween } from '~components';
import Box from '~components/box';
import { SelectProps } from '~components/select';

import ScreenshotArea from '../utils/screenshot-area';

const extraOptions = [...Array(10).keys()].map(n => {
  const numberToDisplay = (n + 5).toString();
  return {
    value: numberToDisplay,
    label: `Option ${n + 5}`,
  };
});

const options: SelectProps.Options = [
  { value: 'first', label: 'Simple' },
  { value: 'second', label: 'With small icon', iconName: 'folder' },
  {
    value: 'third',
    label: 'With big icon icon',
    description: 'Very big option',
    iconName: 'heart',
    disabled: true,
    disabledReason: 'disabled reason',
    tags: ['Cool', 'Intelligent', 'Cat'],
  },
  {
    label: 'Option group',
    options: [{ value: 'forth', label: 'Nested option' }],
    disabledReason: 'disabled reason',
  },
  {
    label: 'Option group',
    options: [{ value: 'forth2', label: 'Nested option' }],
    disabledReason: 'disabled reason',
  },
  ...extraOptions,
  { label: 'Last option', disabled: true, disabledReason: 'disabled reason' },
];

console.log(options);

export default function SelectPage() {
  const [selectedOptions, setSelectedOptions] = React.useState<MultiselectProps.Options>([]);
  const renderOptionItem = (item: SelectProps.SelectOptionItem) => {
    return (
      <SpaceBetween size={'xs'} direction={'vertical'}>
        <span>Test: {item.option.label}</span>
        <SpaceBetween size={'xs'} direction={'horizontal'}>
          {item.option.tags?.map((tag, index) => (
            <Badge key={index} color={item.disabled ? 'grey' : 'green'}>
              {tag}
            </Badge>
          ))}
        </SpaceBetween>
        <div style={{ fontSize: '10px' }}>{item.option.disabledReason}</div>
      </SpaceBetween>
    );
  };

  return (
    <ScreenshotArea>
      <Box variant="h1">Select with custom item renderer</Box>
      <Box padding="l">
        <div style={{ width: '400px' }}>
          <Multiselect
            renderOption={renderOptionItem}
            placeholder="Choose option"
            selectedOptions={selectedOptions}
            onChange={event => {
              setSelectedOptions(event.detail.selectedOptions);
            }}
            options={options}
          />{' '}
          <Multiselect
            renderOption={renderOptionItem}
            selectedOptions={selectedOptions}
            onChange={event => {
              setSelectedOptions(event.detail.selectedOptions);
            }}
            options={options}
            virtualScroll={true}
          />
        </div>
      </Box>
    </ScreenshotArea>
  );
}
