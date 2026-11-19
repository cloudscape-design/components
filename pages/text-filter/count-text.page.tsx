// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { I18nProvider } from '~components/i18n';
import messages from '~components/i18n/messages/all.en';
import SpaceBetween from '~components/space-between';
import TextFilter, { TextFilterProps } from '~components/text-filter';

export default function () {
  const [filteringText, setFilteringText] = React.useState('Hello World');
  const [countText, setCountText] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const textFilterRef = React.useRef<TextFilterProps.Ref>(null);

  return (
    <I18nProvider messages={[messages]} locale="en">
      <h1>Demo page for countText live announcement testing</h1>
      <SpaceBetween size="l">
        <SpaceBetween direction="horizontal" size="s" key="settings">
          <span>Count Text:</span>
          {['18 matches', '36 matches', ''].map((countText, index) => (
            <label key={index}>
              <input type="radio" name="count-text" value={countText} onChange={() => setCountText(countText)} />{' '}
              {countText !== '' ? countText : '[Empty]'}
            </label>
          ))}
        </SpaceBetween>
        <label htmlFor="loading-state-toggle" key="loadingStateToggle">
          <input id="loading-state-toggle" type="checkbox" onChange={event => setLoading(event.target.checked)} />{' '}
          Loading
        </label>
        <TextFilter
          filteringText={filteringText}
          filteringPlaceholder="Find instances"
          filteringAriaLabel="Filter instances"
          loading={loading}
          countText={countText}
          onChange={({ detail }) => setFilteringText(detail.filteringText)}
          ref={textFilterRef}
        />
      </SpaceBetween>
    </I18nProvider>
  );
}
