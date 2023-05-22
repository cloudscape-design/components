// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';
import Multiselect, { MultiselectProps } from '~components/multiselect';
import { fetchSecurityGroups } from '../select/mock/security-groups-provider';
import Box from '~components/box';
import { i18nStrings } from './constants';

const deselectAriaLabel: MultiselectProps['deselectAriaLabel'] = option => {
  const label = option?.value || option?.label;
  return label ? `Deselect ${label}` : 'no label';
};

class SecurityGroupMultiselect extends React.Component {
  pageNumber: any = null;
  filteringText = '';
  state = {
    selectedOptions: [],
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
      selectedOptions: event.detail.selectedOptions,
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
    const { status, options, selectedOptions } = this.state;
    return (
      <>
        <Box margin={{ bottom: 'xxs' }} color="text-label">
          <label htmlFor="select_security_group">Security group</label>
        </Box>
        <Multiselect
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
          selectedOptions={selectedOptions}
          onChange={this.handleChange}
          onLoadItems={this.handleLoadItems}
          tokenLimit={3}
          deselectAriaLabel={deselectAriaLabel}
          i18nStrings={i18nStrings}
        />
      </>
    );
  }
}
export default function MultiselectPage() {
  return (
    <Box padding="l">
      <Box variant="h1">Multiselect: asynchronously fetched options</Box>
      <SecurityGroupMultiselect />
    </Box>
  );
}
