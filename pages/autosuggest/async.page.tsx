// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useContext, useState } from 'react';
import Autosuggest from '~components/autosuggest';
import { useOptionsLoader } from '../common/options-loader';
import AppContext, { AppContextType } from '../app/app-context';
import { range } from 'lodash';
import { AutosuggestProps } from '~components/autosuggest/interfaces';

const sourceItems = range(0, 100).map(index => ({ value: `Option #${index}` }));

type PageContext = React.Context<
  AppContextType<{
    showFinishedText?: boolean;
    fakeResponses?: boolean;
    randomErrors?: boolean;
    virtualScroll?: boolean;
    expandToViewport?: boolean;
  }>
>;

const enteredTextLabel = (value: string) => `Use: ${value}`;

export default function Page() {
  const [value, setValue] = useState('');
  const {
    urlParams: {
      showFinishedText = true,
      fakeResponses = false,
      randomErrors = false,
      virtualScroll = false,
      expandToViewport = false,
    },
    setUrlParams,
  } = useContext(AppContext as PageContext);
  const { items, status, fetchItems } = useOptionsLoader<AutosuggestProps.Option>({ randomErrors });
  return (
    <div className="awsui-util-p-l">
      <h1>Autosuggest async</h1>
      <section className="awsui-util-mb-l">
        <label>
          <input
            type="checkbox"
            checked={fakeResponses}
            onChange={e => setUrlParams({ fakeResponses: !!e.target.checked })}
          />
          Fake API responses
        </label>
        <label>
          <input
            type="checkbox"
            checked={randomErrors}
            onChange={e => setUrlParams({ randomErrors: !!e.target.checked })}
          />
          Cause random API errors
        </label>
        <label>
          <input
            type="checkbox"
            checked={showFinishedText}
            onChange={e => setUrlParams({ showFinishedText: !!e.target.checked })}
          />
          Show end-of-list text
        </label>
        <label>
          <input
            id="virtual"
            type="checkbox"
            checked={virtualScroll}
            onChange={e => setUrlParams({ virtualScroll: !!e.target.checked })}
          />
          Enable virtualization
        </label>
        <label>
          <input
            id="expand-to-viewport"
            type="checkbox"
            checked={expandToViewport}
            onChange={e => setUrlParams({ expandToViewport: !!e.target.checked })}
          />
          Expand to viewport
        </label>
      </section>
      <Autosuggest
        value={value}
        options={items}
        empty={<span>Nothing found</span>}
        filteringType="manual"
        statusType={status}
        loadingText="Fetching items"
        errorText="Error fetching results."
        recoveryText="Retry"
        finishedText={showFinishedText ? 'End of all results' : undefined}
        onChange={event => setValue(event.detail.value)}
        onLoadItems={({ detail: { firstPage, filteringText } }) =>
          fetchItems({ firstPage, filteringText, sourceItems: fakeResponses ? sourceItems : undefined })
        }
        enteredTextLabel={enteredTextLabel}
        ariaLabel="async autosuggest"
        selectedAriaLabel="Selected"
        virtualScroll={virtualScroll}
        expandToViewport={expandToViewport}
      />
      <input id="to-blur" aria-label="input to blur to" />
    </div>
  );
}
