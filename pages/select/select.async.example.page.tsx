// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useContext, useState } from 'react';
import Select, { SelectProps } from '~components/select';
import Box from '~components/box';
import AppContext, { AppContextType } from '../app/app-context';
import { useOptionsLoader } from '../common/options-loader';
import { groupsRaw } from './mock/data';

const allOptions = JSON.parse(JSON.stringify(groupsRaw)) as unknown as SelectProps.OptionGroup[];

type PageContext = React.Context<
  AppContextType<{
    showFinishedText?: boolean;
    fakeResponses?: boolean;
    randomErrors?: boolean;
    virtualScroll?: boolean;
    expandToViewport?: boolean;
  }>
>;

export default function Page() {
  const [selectedOption, setSelectedOption] = useState<null | SelectProps.Option>(null);
  const {
    urlParams: { fakeResponses = true, randomErrors = true },
  } = useContext(AppContext as PageContext);

  const { items, status, filteringText, fetchItems } = useOptionsLoader<SelectProps.Option>({
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

  return (
    <Box padding="l">
      <Box variant="h1">Select: asynchronously fetched options</Box>
      <Box margin={{ bottom: 'xxs' }} color="text-label">
        <label htmlFor="select_security_group">Security group</label>
      </Box>
      <Select
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
        selectedOption={selectedOption}
        onChange={event => setSelectedOption(event.detail.selectedOption)}
        onLoadItems={({ detail: { firstPage, filteringText } }) => {
          const filteredOptions = allOptions
            .filter(group => group.label!.indexOf(filteringText) > -1)
            .map(group => ({ ...group, value: group.label }));
          fetchItems({ firstPage, filteringText, sourceItems: fakeResponses ? filteredOptions : undefined });
        }}
      />
    </Box>
  );
}
