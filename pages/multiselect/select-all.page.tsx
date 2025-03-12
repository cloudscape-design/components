// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useContext, useState } from 'react';

import Box from '~components/box';
import { OptionDefinition, OptionGroup } from '~components/internal/components/option/interfaces';
import Multiselect, { MultiselectProps } from '~components/multiselect';

import AppContext, { AppContextType } from '../app/app-context';
import { deselectAriaLabel, getInlineAriaLabel, i18nStrings } from './constants';

type DemoContext = React.Context<
  AppContextType<{
    withDisabledOptions?: boolean;
    withGroups?: boolean;
  }>
>;

const groupedOptionsWithDisabledOptions: OptionGroup[] = [
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

const initialSelectedOptions = [
  groupedOptionsWithDisabledOptions[0].options[2],
  groupedOptionsWithDisabledOptions[1].options[0],
];

function InternalMultiselect(props: Partial<MultiselectProps>) {
  const [selectedOptions, setSelectedOptions] = useState<MultiselectProps.Options>(initialSelectedOptions);
  const { urlParams } = useContext(AppContext as DemoContext);

  const groupedOptions = urlParams.withDisabledOptions
    ? groupedOptionsWithDisabledOptions
    : groupedOptionsWithDisabledOptions.map(group => ({
        ...group,
        options: group.options.map(option => ({ ...option, disabled: false })),
      }));

  const options: OptionDefinition[] = urlParams.withGroups
    ? groupedOptions
    : groupedOptions.reduce(
        (previousValue: OptionDefinition[], currentValue: OptionGroup) => [...previousValue, ...currentValue.options],
        []
      );

  return (
    <Multiselect
      selectedOptions={selectedOptions}
      deselectAriaLabel={deselectAriaLabel}
      statusType="pending"
      filteringType="none"
      options={options}
      i18nStrings={i18nStrings}
      enableSelectAll={true}
      placeholder={'Choose option'}
      onChange={event => {
        setSelectedOptions(event.detail.selectedOptions);
      }}
      ariaLabel={props.inlineTokens ? getInlineAriaLabel(selectedOptions) : undefined}
      {...props}
    />
  );
}

export default function MultiselectPage() {
  return (
    <article>
      <Box padding="l">
        <Box padding="s">
          <Box variant="h1">Test: Close after</Box>
          <InternalMultiselect id="close_after" tokenLimit={3} keepOpen={false} enableSelectAll={true} />
        </Box>
        <Box padding="s">
          <Box variant="h1">Test: Keep open</Box>
          <InternalMultiselect id="keep_open" tokenLimit={3} enableSelectAll={true} />
        </Box>
        <Box padding="s">
          <Box variant="h1">Test: With Filtering</Box>
          <InternalMultiselect id="with_filtering" filteringType="auto" />
        </Box>

        <Box padding="s">
          <Box variant="h1">Test: With token limit</Box>
          <InternalMultiselect id="with_token_limit" placeholder={'Choose option'} tokenLimit={1} />
        </Box>

        <Box padding="s">
          <Box variant="h1">Test: Group selection</Box>
          <InternalMultiselect id="group_selection" />
        </Box>

        <Box padding="s">
          <Box variant="h1">Test: Expand to viewport</Box>
          <InternalMultiselect id="expand_to_viewport" expandToViewport={true} />
        </Box>

        <Box padding="s">
          <Box variant="h1">Test: Inline tokens</Box>
          <div style={{ width: 200 }}>
            <InternalMultiselect inlineTokens={true} enableSelectAll={true} />
          </div>
        </Box>
      </Box>
    </article>
  );
}
