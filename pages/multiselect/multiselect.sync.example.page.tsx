// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';

import Box from '~components/box';
import { NonCancelableCustomEvent } from '~components/interfaces';
import { OptionDefinition, OptionGroup } from '~components/internal/components/option/interfaces';
import Multiselect, { MultiselectProps } from '~components/multiselect';
import { SelectProps } from '~components/select';

import { generateOptions } from '../select/generate-options';
import { i18nStrings } from './constants';

const deselectAriaLabel: MultiselectProps['deselectAriaLabel'] = option => {
  const label = option?.value || option?.label;
  return label ? `Deselect ${label}` : 'no label';
};

const onLoadItems = (event: NonCancelableCustomEvent<SelectProps.LoadItemsDetail>) => {
  console.log('onLoadItems', event);
};

const onFocus = () => {
  console.log('onFocus');
};

const onBlur = () => {
  console.log('onBlur');
};

const initialOptions = generateOptions(50).options;

const childOptions: OptionDefinition[] = initialOptions.reduce(
  (previous: OptionDefinition[], current: OptionDefinition | OptionGroup) => {
    if ('options' in current) {
      for (const option of current.options) {
        previous.push(option);
      }
    } else {
      previous.push(current);
    }
    return previous;
  },
  []
);

export default function MultiselectPage() {
  const selectAllOption = { label: 'Select all', value: 'all', disabled: false };
  const options = [selectAllOption, ...initialOptions];

  const selectableOptions = options.filter(o => !o.disabled && !('options' in o));
  const [selectedOptions1, setSelectedOptions1] = React.useState<MultiselectProps.Options>([
    selectableOptions[10],
    selectableOptions[15],
  ]);
  const [selectedOptions2, setSelectedOptions2] = React.useState<MultiselectProps.Options>([]);

  return (
    <article>
      <Box padding="l">
        <Box padding="s">
          <Box variant="h1">Multiselect with filteringType = none</Box>
          <Box margin={{ bottom: 'xxs' }} color="text-label">
            <label htmlFor="equipment_1">Equipment</label>
          </Box>
          <Multiselect
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
            tokenLimit={3}
            selectedOptions={selectedOptions1}
            deselectAriaLabel={deselectAriaLabel}
            i18nStrings={i18nStrings}
            onChange={event => {
              const isAllPreviouslySelected = selectedOptions1.some(option => option.value === 'all');
              const isAllCurrentlySelected = event.detail.selectedOptions.some(option => option.value === 'all');
              if (!isAllPreviouslySelected && isAllCurrentlySelected) {
                setSelectedOptions1([selectAllOption, ...childOptions]);
              } else if (isAllPreviouslySelected && !isAllCurrentlySelected) {
                setSelectedOptions1([]);
              } else {
                setSelectedOptions1(event.detail.selectedOptions);
              }
            }}
          />
        </Box>

        <Box padding="s">
          <Box variant="h1">Multiselect with filteringType = auto</Box>
          <Box margin={{ bottom: 'xxs' }} color="text-label">
            <label htmlFor="equipment_2">Equipment</label>
          </Box>
          <Multiselect
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
            tokenLimit={3}
            selectedOptions={selectedOptions2}
            i18nStrings={i18nStrings}
            onChange={event => {
              setSelectedOptions2(event.detail.selectedOptions);
            }}
          />
        </Box>
      </Box>
    </article>
  );
}
