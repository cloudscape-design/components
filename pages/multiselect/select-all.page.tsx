// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useContext, useState } from 'react';

import Box from '~components/box';
import { OptionGroup } from '~components/internal/components/option/interfaces';
import Multiselect, { MultiselectProps } from '~components/multiselect';
import SpaceBetween from '~components/space-between';

import AppContext, { AppContextType } from '../app/app-context';
import ScreenshotArea from '../utils/screenshot-area';
import { deselectAriaLabel, getInlineAriaLabel, groupedOptions, i18nStrings } from './constants';

type DemoContext = React.Context<
  AppContextType<{
    closeAfter?: boolean;
    expandToViewport?: boolean;
    inlineTokens?: boolean;
    manyOptions?: boolean;
    virtualScroll?: boolean;
    withDisabledOptions?: boolean;
    withFiltering?: boolean;
    withGroups?: boolean;
  }>
>;

// Mix of grouped and top-level options
const groupedOptionsWithDisabledOptions: MultiselectProps.Options = [
  ...groupedOptions.slice(0, 2), // First 2 groups
  ...groupedOptions[2].options, // children of the 2rd group
];

const initialSelectedOptions = [
  (groupedOptionsWithDisabledOptions[0] as OptionGroup).options[2],
  (groupedOptionsWithDisabledOptions[1] as OptionGroup).options[0],
  (groupedOptionsWithDisabledOptions[1] as OptionGroup).options[1],
];

export default function MultiselectPage() {
  const { urlParams, setUrlParams } = useContext(AppContext as DemoContext);
  const [selectedOptions, setSelectedOptions] = useState<MultiselectProps.Options>(initialSelectedOptions);

  const groupedOptions: MultiselectProps.Options = urlParams.withDisabledOptions
    ? groupedOptionsWithDisabledOptions
    : groupedOptionsWithDisabledOptions.map(option => ({
        ...option,
        disabled: false,
        options:
          'options' in option && option.options.length
            ? option.options.map(childOption => ({ ...childOption, disabled: false }))
            : undefined,
      }));

  const baseOptions: MultiselectProps.Options = urlParams.withGroups
    ? groupedOptions
    : groupedOptions.reduce(
        (previousValue: MultiselectProps.Options, currentValue: MultiselectProps.Option) =>
          'options' in currentValue && (currentValue as OptionGroup).options?.length
            ? [...previousValue, ...(currentValue as OptionGroup).options]
            : [...previousValue, currentValue],
        []
      );

  const options = urlParams.manyOptions
    ? [
        ...baseOptions,
        ...Array(100)
          .fill(undefined)
          .map((_, index) => ({
            value: `option${index + baseOptions.length + 1}`,
            label: `option${index + baseOptions.length + 1}`,
            description: `option${index + baseOptions.length + 1}`,
            tags: ['2-CPU', '2Gb RAM'],
          })),
      ]
    : baseOptions;

  return (
    <article>
      <h1>Multiselect with &quot;Select all&quot;</h1>
      <Box padding={{ horizontal: 'l' }}>
        <SpaceBetween size="xxl">
          <SpaceBetween direction="horizontal" size="l">
            <label>
              <input
                type="checkbox"
                checked={!!urlParams.withGroups}
                onChange={e => setUrlParams({ withGroups: e.target.checked })}
              />{' '}
              With groups
            </label>
            <label>
              <input
                type="checkbox"
                checked={!!urlParams.withDisabledOptions}
                onChange={e => setUrlParams({ withDisabledOptions: e.target.checked })}
              />{' '}
              With disabled options
            </label>
            <label>
              <input
                type="checkbox"
                checked={!!urlParams.withFiltering}
                onChange={e => setUrlParams({ withFiltering: e.target.checked })}
              />{' '}
              With filtering
            </label>
            <label>
              <input
                type="checkbox"
                checked={!!urlParams.expandToViewport}
                onChange={e => setUrlParams({ expandToViewport: e.target.checked })}
              />{' '}
              Expand to viewport
            </label>
            <label>
              <input
                type="checkbox"
                checked={!!urlParams.inlineTokens}
                onChange={e => setUrlParams({ inlineTokens: e.target.checked })}
              />{' '}
              Inline tokens
            </label>
            <label>
              <input
                type="checkbox"
                checked={!!urlParams.closeAfter}
                onChange={e => setUrlParams({ closeAfter: e.target.checked })}
              />{' '}
              Close after selection
            </label>
            <label>
              <input
                type="checkbox"
                checked={!!urlParams.virtualScroll}
                onChange={e => setUrlParams({ virtualScroll: e.target.checked })}
              />{' '}
              Virtual scroll
            </label>
            <label>
              <input
                type="checkbox"
                checked={!!urlParams.manyOptions}
                onChange={e => setUrlParams({ manyOptions: e.target.checked })}
              />{' '}
              Many options
            </label>
          </SpaceBetween>

          <ScreenshotArea>
            <Multiselect
              selectedOptions={selectedOptions}
              deselectAriaLabel={deselectAriaLabel}
              filteringType={urlParams.withFiltering ? 'auto' : 'none'}
              options={options}
              i18nStrings={{ ...i18nStrings, selectAllText: 'Select all' }}
              enableSelectAll={true}
              placeholder={'Choose options'}
              onChange={event => {
                setSelectedOptions(event.detail.selectedOptions);
              }}
              ariaLabel={urlParams.inlineTokens ? getInlineAriaLabel(selectedOptions) : undefined}
              inlineTokens={urlParams.inlineTokens}
              expandToViewport={urlParams.expandToViewport}
              keepOpen={!urlParams.closeAfter}
              virtualScroll={urlParams.virtualScroll}
            />
          </ScreenshotArea>
        </SpaceBetween>
      </Box>
    </article>
  );
}
