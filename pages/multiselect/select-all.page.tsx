// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useContext, useState } from 'react';

import Box from '~components/box';
import { OptionDefinition, OptionGroup } from '~components/internal/components/option/interfaces';
import Multiselect, { MultiselectProps } from '~components/multiselect';
import SpaceBetween from '~components/space-between';

import AppContext, { AppContextType } from '../app/app-context';
import { deselectAriaLabel, getInlineAriaLabel, i18nStrings } from './constants';

type DemoContext = React.Context<
  AppContextType<{
    closeAfter?: boolean;
    expandToViewport?: boolean;
    inlineTokens?: boolean;
    tokenLimit?: number;
    virtualScroll?: boolean;
    withDisabledOptions?: boolean;
    withFiltering?: boolean;
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

export default function MultiselectPage() {
  const { urlParams, setUrlParams } = useContext(AppContext as DemoContext);
  const [selectedOptions, setSelectedOptions] = useState<MultiselectProps.Options>(initialSelectedOptions);

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
    <article>
      <h1>Multiselect with &quot;Select all&quot;</h1>
      <Box padding={{ horizontal: 'l' }}>
        <SpaceBetween size="xxl">
          <SpaceBetween direction="horizontal" size="l">
            <label>
              <input
                type="checkbox"
                checked={urlParams.withGroups}
                onChange={e => setUrlParams({ withGroups: e.target.checked })}
              />{' '}
              With groups
            </label>
            <label>
              <input
                type="checkbox"
                checked={urlParams.withDisabledOptions}
                onChange={e => setUrlParams({ withDisabledOptions: e.target.checked })}
              />{' '}
              With disabled options
            </label>
            <label>
              <input
                type="checkbox"
                checked={urlParams.withFiltering}
                onChange={e => setUrlParams({ withFiltering: e.target.checked })}
              />{' '}
              With filtering
            </label>
            <label>
              <input
                type="checkbox"
                checked={urlParams.expandToViewport}
                onChange={e => setUrlParams({ expandToViewport: e.target.checked })}
              />{' '}
              Expand to viewport
            </label>
            <label>
              <input
                type="checkbox"
                checked={urlParams.inlineTokens}
                onChange={e => setUrlParams({ inlineTokens: e.target.checked })}
              />{' '}
              Inline tokens
            </label>
            <label>
              <input
                type="checkbox"
                checked={urlParams.closeAfter}
                onChange={e => setUrlParams({ closeAfter: e.target.checked })}
              />{' '}
              Close after selection
            </label>
            <label>
              <input
                type="checkbox"
                checked={urlParams.virtualScroll}
                onChange={e => setUrlParams({ virtualScroll: e.target.checked })}
              />{' '}
              Virtual scroll
            </label>
            <label>
              Token limit{' '}
              <input
                type="number"
                value={urlParams.tokenLimit}
                onChange={e => setUrlParams({ tokenLimit: parseInt(e.target.value) })}
              />
            </label>
          </SpaceBetween>

          <SpaceBetween size="xxs">
            <Box variant="awsui-key-label">Select an option</Box>
            <Multiselect
              selectedOptions={selectedOptions}
              deselectAriaLabel={deselectAriaLabel}
              filteringType={urlParams.withFiltering ? 'auto' : 'none'}
              options={options}
              i18nStrings={i18nStrings}
              enableSelectAll={true}
              placeholder={'Choose option'}
              onChange={event => {
                setSelectedOptions(event.detail.selectedOptions);
              }}
              ariaLabel={urlParams.inlineTokens ? getInlineAriaLabel(selectedOptions) : undefined}
              inlineTokens={urlParams.inlineTokens}
              tokenLimit={urlParams.tokenLimit}
              expandToViewport={urlParams.expandToViewport}
              keepOpen={!urlParams.closeAfter}
              virtualScroll={urlParams.virtualScroll}
            />
          </SpaceBetween>
        </SpaceBetween>
      </Box>
    </article>
  );
}
