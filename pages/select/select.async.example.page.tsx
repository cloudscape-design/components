// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';
import Select from '~components/select';
import { fetchSecurityGroups } from './mock/security-groups-provider';
import Box from '~components/box';

class SecurityGroupSingleSelect extends React.Component {
  pageNumber: any = null;
  filteringText = '';
  state = {
    selectedOption: null,
    options: [],
    status: 'pending',
  };

  fetchData = async () => {
    try {
      const { filteringText, pageNumber } = this;
      const { items, hasNext } = await fetchSecurityGroups({
        filteringText,
        pageNumber,
      });
      if (this.filteringText !== filteringText) {
        // there is another request in progress, discard the result of this one
        return;
      }
      this.setState({
        status: hasNext ? 'pending' : 'finished',
        options: this.pageNumber === 1 ? items : this.state.options.concat(items as any),
      });
    } catch (error) {
      this.setState({
        status: 'error',
      });
    }
  };

  handleLoadItems = ({ detail: { filteringText, firstPage, samePage } }: any) => {
    let { options } = this.state;
    this.filteringText = filteringText;
    if (firstPage) {
      this.pageNumber = 0;
      options = [];
    }
    if (!samePage) {
      this.pageNumber++;
    }
    this.setState({
      options,
      status: 'loading',
    });
    this.fetchData();
  };

  handleChange = (event: any) => {
    this.setState({
      selectedOption: event.detail.selectedOption,
    });
  };

  showFilteredText = (matchesCount: number, totalCount: number) => {
    if (this.state.status === 'pending') {
      return `${matchesCount}+ results`;
    }

    if (this.state.status === 'finished') {
      return `${matchesCount} out of ${totalCount} results`;
    }
    return '';
  };

  render() {
    const { status, options, selectedOption } = this.state;
    return (
      <>
        <Box margin={{ bottom: 'xxs' }} color="text-label">
          <label htmlFor="select_security_group">Security group</label>
        </Box>
        <Select
          controlId="select_security_group"
          filteringType="manual"
          filteringPlaceholder="Find security group"
          filteringAriaLabel="Filtering aria label"
          filteringResultsText={this.showFilteredText}
          statusType={status as any}
          placeholder="Choose a security group"
          loadingText="Loading security groups"
          errorText="Error fetching results."
          recoveryText="Retry"
          finishedText={this.filteringText ? `End of "${this.filteringText}" results` : 'End of all results'}
          empty="No security groups found"
          options={options}
          selectedOption={selectedOption}
          onChange={this.handleChange}
          onLoadItems={this.handleLoadItems}
        />
      </>
    );
  }
}
export default function SelectPage() {
  return (
    <Box padding="l">
      <Box variant="h1">Select: asynchronously fetched options</Box>
      <SecurityGroupSingleSelect />
    </Box>
  );
}
