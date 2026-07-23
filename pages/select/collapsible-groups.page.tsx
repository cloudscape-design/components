// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';

import Box from '~components/box';
import Multiselect, { MultiselectProps } from '~components/multiselect';
import Select, { SelectProps } from '~components/select';
import SpaceBetween from '~components/space-between';

const options: Array<SelectProps.Option | SelectProps.OptionGroup> = [
  {
    label: 'Fruits',
    options: [
      { value: 'apple', label: 'Apple' },
      { value: 'banana', label: 'Banana' },
      { value: 'orange', label: 'Orange' },
    ],
  },
  {
    label: 'Vegetables',
    options: [
      { value: 'carrot', label: 'Carrot' },
      { value: 'potato', label: 'Potato' },
      { value: 'onion', label: 'Onion', disabled: true },
    ],
  },
  { value: 'other', label: 'Other (ungrouped)' },
  {
    label: 'Dairy',
    options: [
      { value: 'milk', label: 'Milk' },
      { value: 'cheese', label: 'Cheese' },
    ],
  },
];

export default function CollapsibleGroupsPage() {
  const [selectedOption, setSelectedOption] = React.useState<SelectProps.Option | null>(null);
  const [selectedOptions, setSelectedOptions] = React.useState<ReadonlyArray<MultiselectProps.Option>>([]);

  return (
    <article>
      <Box padding="l">
        <h1>Select / Multiselect collapsible groups</h1>
        <SpaceBetween size="l">
          <div>
            <Box variant="h2">Select with collapsibleGroups</Box>
            <Box margin={{ bottom: 'xxs' }} color="text-label">
              <label htmlFor="collapsible-select">Choose item</label>
            </Box>
            <Select
              controlId="collapsible-select"
              collapsibleGroups={true}
              filteringType="auto"
              filteringPlaceholder="Find item"
              filteringAriaLabel="Find item"
              options={options}
              selectedOption={selectedOption}
              placeholder="Choose an item"
              ariaLabel="Choose item"
              selectedAriaLabel="Selected"
              onChange={({ detail }) => setSelectedOption(detail.selectedOption)}
            />
          </div>

          <div>
            <Box variant="h2">Multiselect with collapsibleGroups</Box>
            <Box margin={{ bottom: 'xxs' }} color="text-label">
              <label htmlFor="collapsible-multiselect">Choose items</label>
            </Box>
            <Multiselect
              controlId="collapsible-multiselect"
              collapsibleGroups={true}
              options={options}
              selectedOptions={selectedOptions}
              placeholder="Choose items"
              ariaLabel="Choose items"
              deselectAriaLabel={option => `Remove ${option.label}`}
              onChange={({ detail }) => setSelectedOptions(detail.selectedOptions)}
            />
          </div>
        </SpaceBetween>
      </Box>
    </article>
  );
}
