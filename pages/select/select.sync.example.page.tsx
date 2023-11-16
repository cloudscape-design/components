// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';
import Select from '~components/select';
import { generateOptions } from './generate-options';
import Box from '~components/box';

const { options } = generateOptions(50) as any;

const onLoadItems = (e: any) => {
  console.log('onLoadItems', e);
};

const onFocus = () => {
  console.log('onFocus');
};

const onBlur = () => {
  console.log('onBlur');
};

export default function SelectPage() {
  const [selectedOption1, setSelectedOption1] = React.useState(null);
  const [selectedOption2, setSelectedOption2] = React.useState(null);

  return (
    <article>
      <Box padding="l">
        <Box padding="s">
          <Box variant="h1">Select with filteringType = none</Box>
          <Box margin={{ bottom: 'xxs' }} color="text-label">
            <label htmlFor="equipment_1">Equipment</label>
          </Box>
          <Select
            controlId="equipment_1"
            statusType="pending"
            filteringType="none"
            filteringPlaceholder="Find equipment"
            filteringAriaLabel="Filtering aria label"
            options={options}
            name="choose_equipment"
            placeholder={'Choose equipment'}
            ariaLabel="Choose equipment"
            noMatch={<b>No match</b>}
            loadingText="Fetching equipment"
            selectedAriaLabel="Selected"
            onBlur={onBlur}
            onFocus={onFocus}
            onLoadItems={onLoadItems}
            triggerVariant="option"
            selectedOption={selectedOption1}
            onChange={(e: any) => {
              setSelectedOption1(e.detail.selectedOption);
            }}
          />
        </Box>
        <Box padding="s">
          <Box variant="h1">Select with filteringType = auto</Box>
          <Box margin={{ bottom: 'xxs' }} color="text-label">
            <label htmlFor="equipment_2">Equipment</label>
          </Box>
          <Select
            controlId="equipment_2"
            statusType="pending"
            filteringType="auto"
            filteringPlaceholder="Find equipment"
            filteringAriaLabel="Filtering aria label"
            filteringResultsText={(matchesCount, totalCount) => `${matchesCount} out of ${totalCount} items`}
            options={options}
            name="choose_equipment"
            placeholder={'Choose equipment'}
            ariaLabel="Choose equipment"
            noMatch={<b>No match</b>}
            loadingText="Fetching equipment"
            selectedAriaLabel="Selected"
            onBlur={onBlur}
            onFocus={onFocus}
            onLoadItems={onLoadItems}
            triggerVariant="option"
            selectedOption={selectedOption2}
            onChange={(e: any) => {
              setSelectedOption2(e.detail.selectedOption);
            }}
          />
        </Box>
      </Box>
    </article>
  );
}
