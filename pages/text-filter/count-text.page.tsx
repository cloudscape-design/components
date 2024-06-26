// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { I18nProvider } from '~components/i18n';
import messages from '~components/i18n/messages/all.en';
import TextFilter, { TextFilterProps } from '~components/text-filter';

import { Button, SpaceBetween } from '../../lib/components-themeable/internal/template';

export default function () {
  const [filteringText, setFilteringText] = React.useState('Hello World');
  const [countText, setCountText] = React.useState('');
  const textFilterRef = React.useRef<TextFilterProps.Ref>(null);

  return (
    <I18nProvider messages={[messages]} locale="en">
      <SpaceBetween size="l">
        <h1>Demopage for countText testing</h1>
        <TextFilter
          filteringText={filteringText}
          filteringPlaceholder="Find instances"
          filteringAriaLabel="Filter instances"
          countText={countText}
          onChange={({ detail }) => setFilteringText(detail.filteringText)}
          ref={textFilterRef}
        />
        <Button onClick={() => setCountText('18 matches')}>Set count text to [18 matches]</Button>
        <Button onClick={() => setCountText('36 matches')}>Set count text to [36 matches]</Button>
        <Button onClick={() => setCountText('')}>Remove count text</Button>
        <Button onClick={() => textFilterRef.current?.renderCountTextAriaLive()}>Announce count text</Button>
      </SpaceBetween>
    </I18nProvider>
  );
}
