// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useContext, useState } from 'react';

import { SpaceBetween, TextFilter } from '~components';
import Box from '~components/box';
import { fireNonCancelableEvent } from '~components/internal/events';
import Multiselect, { MultiselectProps } from '~components/multiselect';
import EmbeddedMultiselect, { EmbeddedMultiselectProps } from '~components/multiselect/embedded';

import AppContext, { AppContextType } from '../app/app-context';
import { useOptionsLoader } from '../common/options-loader';
import { groupsRaw } from '../select/mock/data';
import { i18nStrings } from './constants';

const allOptions = JSON.parse(JSON.stringify(groupsRaw)) as unknown as MultiselectProps.OptionGroup[];

type PageContext = React.Context<
  AppContextType<{
    showFinishedText?: boolean;
    fakeResponses?: boolean;
    randomErrors?: boolean;
    virtualScroll?: boolean;
    expandToViewport?: boolean;
    embedded?: boolean;
  }>
>;

const deselectAriaLabel: MultiselectProps['deselectAriaLabel'] = option => {
  const label = option?.value || option?.label;
  return label ? `Deselect ${label}` : 'no label';
};

export default function Page() {
  const [selectedOptions, setSelectedOptions] = useState<readonly MultiselectProps.Option[]>([]);
  const {
    urlParams: { fakeResponses = true, randomErrors = true, embedded = false },
  } = useContext(AppContext as PageContext);

  const { items, status, filteringText, fetchItems } = useOptionsLoader<MultiselectProps.Option>({
    pageSize: 10,
    randomErrors: randomErrors,
  });

  function showFilteredText(matchesCount: number, totalCount: number) {
    if (status === 'pending') {
      return `${matchesCount}+ results`;
    }

    if (status === 'finished') {
      return `${matchesCount} out of ${totalCount} results`;
    }
    return '';
  }

  const Component = embedded ? EmbeddedMultiselectIntegration : Multiselect;

  return (
    <Box padding="l">
      <Box variant="h1">Multiselect: asynchronously fetched options</Box>
      <Box margin={{ bottom: 'xxs' }} color="text-label">
        <label htmlFor="select_security_group">Security group</label>
      </Box>

      <Component
        controlId="select_security_group"
        filteringType="manual"
        filteringPlaceholder="Find security group"
        filteringAriaLabel="Filtering aria label"
        filteringResultsText={showFilteredText}
        statusType={status as any}
        placeholder="Choose a security group"
        loadingText="Loading security groups"
        errorText="Error fetching results."
        recoveryText="Retry"
        finishedText={filteringText ? `End of "${filteringText}" results` : 'End of all results'}
        empty="No security groups found"
        options={items}
        selectedOptions={selectedOptions}
        onChange={event => setSelectedOptions(event.detail.selectedOptions)}
        onLoadItems={({ detail: { firstPage, filteringText } }) => {
          const filteredOptions = allOptions
            .filter(group => group.label!.indexOf(filteringText) > -1)
            .map(group => ({ ...group, value: group.label }));
          fetchItems({ firstPage, filteringText, sourceItems: fakeResponses ? filteredOptions : undefined });
        }}
        tokenLimit={3}
        deselectAriaLabel={deselectAriaLabel}
        i18nStrings={i18nStrings}
      />
    </Box>
  );
}

function EmbeddedMultiselectIntegration(props: EmbeddedMultiselectProps) {
  const [filteringText, setFilteringText] = useState('');
  const onChangeFilter = (filteringText: string) => {
    setFilteringText(filteringText);
    fireNonCancelableEvent(props.onLoadItems, { filteringText, firstPage: true, samePage: false });
  };
  return (
    <SpaceBetween size="s">
      <TextFilter
        filteringText={filteringText}
        onChange={({ detail }) => onChangeFilter(detail.filteringText)}
        filteringPlaceholder="Find security group"
      />

      <div style={{ maxBlockSize: 400, display: 'flex', flexDirection: 'column' }}>
        <EmbeddedMultiselect {...props} filteringText={filteringText} />
      </div>
    </SpaceBetween>
  );
}
