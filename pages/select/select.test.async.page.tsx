// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import range from 'lodash/range';

import { DropdownStatusProps } from '~components/internal/components/dropdown-status';
import Select, { SelectProps } from '~components/select';

interface APIResponse {
  items: NonNullable<SelectProps['options']>;
  hasNextPage: boolean;
}
interface PendingRequest {
  resolve: (value: APIResponse) => void;
  reject: (reason: any) => void;
  params: {
    filteringText: string;
    pageNumber: number;
  };
}
interface ExtendedWindow extends Window {
  __pendingRequests: Array<PendingRequest>;
}
declare const window: ExtendedWindow;
const pendingRequests: Array<PendingRequest> = (window.__pendingRequests = []);

const ITEMS_PER_PAGE = 25;
const MAX_PAGES = 3;

const generateFakeItems = (pageNumber: number): SelectProps.Options => {
  return range(ITEMS_PER_PAGE).map(i => ({ value: `Option #${pageNumber * ITEMS_PER_PAGE + i}` }));
};

export default class App extends React.Component {
  state: {
    selectedOption: SelectProps['selectedOption'];
    status: DropdownStatusProps.StatusType;
    filteringText: string;
    options: SelectProps.Options;
    randomErrors: boolean;
    showFinishedText: boolean;
    fakeResponses: boolean;
    virtualScroll: boolean;
    expandToViewport: boolean;
  } = {
    selectedOption: null,
    status: 'pending',
    filteringText: '',
    options: [],
    randomErrors: false,
    showFinishedText: true,
    fakeResponses: false,
    virtualScroll: false,
    expandToViewport: false,
  };
  pageNumber = 0;

  fetchSecurityGroups = () => {
    return new Promise<APIResponse>((resolve, reject) => {
      if (this.state.randomErrors && Math.random() < 0.3) {
        reject();
      }
      setTimeout(() => {
        resolve({
          items: generateFakeItems(this.pageNumber),
          hasNextPage: this.pageNumber < MAX_PAGES,
        });
      }, 1000);
    });
  };

  fetchData = async () => {
    const { filteringText } = this.state;
    try {
      let response;

      if (this.state.fakeResponses) {
        response = await this.fetchSecurityGroups();
      } else {
        response = await new Promise<APIResponse>((resolve, reject) => {
          pendingRequests.push({
            resolve,
            reject,
            params: {
              filteringText,
              pageNumber: this.pageNumber,
            },
          });
        });
      }

      this.pageNumber++;
      const { items, hasNextPage } = response;

      if (this.state.filteringText !== filteringText) {
        // there is another request in progress, discard the result of this one
        return;
      }

      this.setState({
        status: hasNextPage ? 'pending' : 'finished',
        options: this.pageNumber === 0 ? items : this.state.options.concat(items),
      });
    } catch (error) {
      this.setState({
        status: 'error',
      });
    }
  };

  handleLoadItems: SelectProps['onLoadItems'] = ({ detail: { filteringText, firstPage } }) => {
    const options = firstPage ? [] : this.state.options;
    this.setState({ filteringText, options, status: 'loading' }, () => {
      if (firstPage) {
        this.pageNumber = 0;
      }
      this.fetchData();
    });
  };

  handleChange: SelectProps['onChange'] = event => this.setState({ value: event.detail.selectedOption });

  render() {
    return (
      <div className="awsui-util-p-l">
        <h1>Select async</h1>
        <section className="awsui-util-mb-l">
          <label>
            <input
              type="checkbox"
              checked={this.state.fakeResponses}
              onChange={e => this.setState({ fakeResponses: !!e.target.checked })}
            />
            Fake API responses
          </label>
          <label>
            <input
              type="checkbox"
              checked={this.state.randomErrors}
              onChange={e => this.setState({ randomErrors: !!e.target.checked })}
            />
            Cause random API errors
          </label>
          <label>
            <input
              type="checkbox"
              checked={this.state.showFinishedText}
              onChange={e => this.setState({ showFinishedText: !!e.target.checked })}
            />
            Show end-of-list text
          </label>
          <label>
            <input
              id="virtual"
              type="checkbox"
              checked={this.state.virtualScroll}
              onChange={e => this.setState({ virtualScroll: !!e.target.checked })}
            />
            Enable virtualization
          </label>
          <label>
            <input
              id="expand-to-viewport"
              type="checkbox"
              checked={this.state.expandToViewport}
              onChange={e => this.setState({ expandToViewport: !!e.target.checked })}
            />
            Expand to viewport
          </label>
        </section>
        <Select
          selectedOption={this.state.selectedOption}
          options={this.state.options}
          empty={<span>Nothing found</span>}
          filteringType="manual"
          statusType={this.state.status}
          loadingText="Fetching items"
          errorText="Error fetching results."
          recoveryText="Retry"
          finishedText={this.state.showFinishedText ? 'End of all results' : undefined}
          onChange={this.handleChange}
          onLoadItems={this.handleLoadItems}
          ariaLabel="async autosuggest"
          virtualScroll={this.state.virtualScroll}
          expandToViewport={this.state.expandToViewport}
        />
        <input id="to-blur" aria-label="input to blur to" />
      </div>
    );
  }
}
