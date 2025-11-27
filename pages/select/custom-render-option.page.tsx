// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';
import { useState } from 'react';

import Box from '~components/box';
import Select, { SelectProps } from '~components/select';

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

export default function SelectPage() {
  const [selectedOption, setSelectedOption] = useState<SelectProps.Option | null>(null);
  const renderOptionItem = (item: SelectProps.SelectOptionItem) => {
    return <div>{item.option.label}</div>;
  };

  return (
    <ScreenshotArea>
      <Box variant="h1">Select with custom item renderer</Box>
      <Box padding="l">
        <div style={{ width: '400px' }}>
          <Select
            renderOption={renderOptionItem}
            placeholder="Choose option"
            selectedOption={selectedOption}
            onChange={({ detail }) => setSelectedOption(detail.selectedOption)}
            options={options}
          />
        </div>
      </Box>
    </ScreenshotArea>
  );
}
