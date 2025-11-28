// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';

import { Multiselect, MultiselectProps } from '~components';
import Box from '~components/box';
import { SelectProps } from '~components/select';

import ScreenshotArea from '../utils/screenshot-area';
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
  { label: 'Last option', disabled: true, disabledReason: 'disabled reason' },
];

export default function SelectPage() {
  const [selectedOptions, setSelectedOptions] = React.useState<MultiselectProps.Options>([]);
  const renderOptionItem = (item: MultiselectProps.MultiselectOptionItem) => {
    return <div>{item.option.label}</div>;
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
          />
        </div>
      </Box>
    </ScreenshotArea>
  );
}
