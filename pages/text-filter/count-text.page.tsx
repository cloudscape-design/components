// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Button from '~components/button';
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
        <TextFilter
          filteringText={filteringText}
          filteringPlaceholder="Find instances"
          filteringAriaLabel="Filter instances"
          loading={loading}
          countText={countText}
          onChange={({ detail }) => setFilteringText(detail.filteringText)}
          ref={textFilterRef}
        />
        <Button onClick={() => setCountText('18 matches')}>Set count text to [18 matches]</Button>
        <Button onClick={() => setCountText('36 matches')}>Set count text to [36 matches]</Button>
        <Button onClick={() => setCountText('')}>Remove count text</Button>
        <Button onClick={() => setLoading(prevIsLoading => !prevIsLoading)}>
          Toggle loading state (current value: [{String(loading)}])
        </Button>
      </SpaceBetween>
    </I18nProvider>
  );
}
