// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';

import Box from '~components/box';
import Multiselect, { MultiselectProps } from '~components/multiselect';

import { deselectAriaLabel, getInlineAriaLabel, i18nStrings, optionGroupsLong, optionGroupsShort } from './constants';

const _selectedOptions1 = [
  {
    value: 'option3',
    label: 'option3',
    description: 'option3',
    tags: ['2-CPU', '2Gb RAM'],
  },
  {
    value: 'option4',
    label: 'option4',
    description: 'option4',
    tags: ['2-CPU', '2Gb RAM'],
  },
];
const _selectedOptions2 = [
  {
    value: 'option4',
    label: 'option4',
    description: 'option4',
    tags: ['2-CPU', '2Gb RAM'],
  },
  {
    value: 'option5',
    label: 'option5',
    description: 'option5',
    tags: ['2-CPU', '2Gb RAM', 'Stuff', 'More stuff', 'A lot'],
    disabled: true,
  },
];
const options1 = optionGroupsShort;
const options2 = optionGroupsLong;

export default function MultiselectPage() {
  const [selectedOptions1, setSelectedOptions1] = React.useState<MultiselectProps.Options>(_selectedOptions1);
  const [selectedOptions2, setSelectedOptions2] = React.useState<MultiselectProps.Options>(_selectedOptions1);
  const [selectedOptions3, setSelectedOptions3] = React.useState<MultiselectProps.Options>([]);
  const [selectedOptions4, setSelectedOptions4] = React.useState<MultiselectProps.Options>(_selectedOptions1);
  const [selectedOptions5, setSelectedOptions5] = React.useState<MultiselectProps.Options>(_selectedOptions2);
  const [selectedOptions6, setSelectedOptions6] = React.useState<MultiselectProps.Options>(_selectedOptions1);
  const [selectedOptions7, setSelectedOptions7] = React.useState<MultiselectProps.Options>(_selectedOptions1);

  return (
    <article>
      <Box padding="l">
        <Box padding="s">
          <Box variant="h1">Test: Close after</Box>
          <Multiselect
            id="close_after"
            statusType="pending"
            filteringType="none"
            options={options1}
            placeholder={'Choose option'}
            tokenLimit={3}
            keepOpen={false}
            selectedOptions={selectedOptions1}
            deselectAriaLabel={deselectAriaLabel}
            i18nStrings={i18nStrings}
            onChange={event => {
              setSelectedOptions1(event.detail.selectedOptions);
            }}
          />
        </Box>
        <Box padding="s">
          <Box variant="h1">Test: Keep open</Box>
          <Multiselect
            id="keep_open"
            statusType="pending"
            filteringType="none"
            options={options1}
            placeholder={'Choose option'}
            tokenLimit={3}
            selectedOptions={selectedOptions2}
            deselectAriaLabel={deselectAriaLabel}
            i18nStrings={i18nStrings}
            onChange={event => {
              setSelectedOptions2(event.detail.selectedOptions);
            }}
          />
        </Box>
        <Box padding="s">
          <Box variant="h1">Test: With Filtering</Box>
          <Multiselect
            id="with_filtering"
            statusType="pending"
            filteringType="auto"
            options={options1}
            placeholder={'Choose option'}
            selectedOptions={selectedOptions3}
            deselectAriaLabel={deselectAriaLabel}
            i18nStrings={i18nStrings}
            onChange={event => {
              setSelectedOptions3(event.detail.selectedOptions);
            }}
          />
        </Box>

        <Box padding="s">
          <Box variant="h1">Test: With token limit</Box>
          <Multiselect
            id="with_token_limit"
            statusType="pending"
            filteringType="none"
            options={options1}
            placeholder={'Choose option'}
            tokenLimit={1}
            selectedOptions={selectedOptions4}
            deselectAriaLabel={deselectAriaLabel}
            i18nStrings={i18nStrings}
            onChange={event => {
              setSelectedOptions4(event.detail.selectedOptions);
            }}
          />
        </Box>

        <Box padding="s">
          <Box variant="h1">Test: Group selection</Box>
          <Multiselect
            id="group_selection"
            statusType="pending"
            filteringType="auto"
            options={options2}
            placeholder={'Choose option'}
            selectedOptions={selectedOptions5}
            deselectAriaLabel={deselectAriaLabel}
            i18nStrings={i18nStrings}
            onChange={event => {
              setSelectedOptions5(event.detail.selectedOptions);
            }}
          />
        </Box>

        <Box padding="s">
          <Box variant="h1">Test: Expand to viewport</Box>
          <Multiselect
            id="expand_to_viewport"
            statusType="pending"
            filteringType="none"
            options={selectedOptions6}
            placeholder={'Choose option'}
            tokenLimit={3}
            selectedOptions={selectedOptions1}
            deselectAriaLabel={deselectAriaLabel}
            i18nStrings={i18nStrings}
            expandToViewport={true}
            onChange={event => {
              setSelectedOptions6(event.detail.selectedOptions);
            }}
          />
        </Box>

        <Box padding="s">
          <Box variant="h1">Test: Inline tokens</Box>
          <div style={{ width: 200 }}>
            <Multiselect
              inlineTokens={true}
              statusType="pending"
              filteringType="none"
              options={options1}
              placeholder={'Choose option'}
              selectedOptions={selectedOptions7}
              i18nStrings={i18nStrings}
              ariaLabel={getInlineAriaLabel(selectedOptions7)}
              onChange={event => {
                setSelectedOptions7(event.detail.selectedOptions);
              }}
            />
          </div>
        </Box>
      </Box>
    </article>
  );
}
