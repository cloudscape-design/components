// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';
import Multiselect, { MultiselectProps } from '~components/multiselect';
import Box from '~components/box';
import { i18nStrings, deselectAriaLabel } from './constants';

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
const options1 = [
  {
    label: 'First category',
    options: [
      {
        value: 'option1',
        label: 'option1',
      },
      {
        value: 'option2',
        label: 'option2',
        description: 'option2',
        tags: ['2-CPU', '2Gb RAM', 'Stuff', 'More stuff', 'A lot'],
        disabled: true,
      },
      {
        value: 'option3',
        label: 'option3',
        description: 'option3',
        tags: ['2-CPU', '2Gb RAM'],
      },
    ],
  },
  {
    label: 'Second category',
    options: [
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
      {
        value: 'option6',
        label: 'option6',
        description: 'option6',
        tags: ['2-CPU', '2Gb RAM'],
      },
    ],
  },
];
const options2 = [
  ...options1,
  {
    label: 'Third category',
    options: [
      {
        value: 'option7',
        label: 'option7',
        description: 'option7',
        tags: ['2-CPU', '2Gb RAM'],
        disabled: true,
      },
      {
        value: 'option8',
        label: 'option8',
        description: 'option8',
        tags: ['2-CPU', '2Gb RAM', 'Stuff', 'More stuff', 'A lot'],
        disabled: true,
      },
      {
        value: 'option9',
        label: 'option9',
        description: 'option9',
        tags: ['2-CPU', '2Gb RAM'],
        disabled: true,
      },
    ],
  },
];
export default function MultiselectPage() {
  const [selectedOptions1, setSelectedOptions1] = React.useState<MultiselectProps.Options>(_selectedOptions1);
  const [selectedOptions2, setSelectedOptions2] = React.useState<MultiselectProps.Options>(_selectedOptions1);
  const [selectedOptions3, setSelectedOptions3] = React.useState<MultiselectProps.Options>([]);
  const [selectedOptions4, setSelectedOptions4] = React.useState<MultiselectProps.Options>(_selectedOptions1);
  const [selectedOptions5, setSelectedOptions5] = React.useState<MultiselectProps.Options>(_selectedOptions2);
  const [selectedOptions6, setSelectedOptions6] = React.useState<MultiselectProps.Options>(_selectedOptions1);

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
            triggerVariant="tokens"
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
      </Box>
    </article>
  );
}
