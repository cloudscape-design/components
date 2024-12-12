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
      <SpaceBetween size="l">
        <h1>Demo page for countText live announcement testing</h1>
        <SpaceBetween direction="horizontal" size="s">
          Count Text:
          <label>
            <input type="radio" name="count-text" value="18 matches" onChange={() => setCountText('18 matches')} /> 18
            matches
          </label>
          <label>
            <input type="radio" name="count-text" value="36 matches" onChange={() => setCountText('36 matches')} /> 36
            matches
          </label>
          <label>
            <input type="radio" name="count-text" value="" onChange={() => setCountText('')} /> [Empty]
          </label>
        </SpaceBetween>
        <label>
          <input id="density-toggle" type="checkbox" onChange={event => setLoading(event.target.checked)} /> Loading
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
