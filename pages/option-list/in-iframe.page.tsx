// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Box from '~components/box';
import Header from '~components/header';
import OptionList, { OptionListProps } from '~components/option-list';
import SpaceBetween from '~components/space-between';

import { SimplePage } from '../app/templates';
import { IframeWrapper } from '../utils/iframe-wrapper';

/**
 * Option List rendered inside an iframe, for checking behavior that depends on the document the component lives in.
 *
 * Home and End: on a focused list, they move the highlight and prevent the browser's native action, so neither
 * the iframe document nor the host page scrolls. The iframe and the host page both have content above and below
 * the list, so a native Home or End would visibly scroll one of them.
 */

const options: OptionListProps.Option[] = Array.from({ length: 30 }, (_, index) => ({
  value: `option-${index + 1}`,
  label: `Option ${index + 1}`,
}));

function Spacer({ label }: { label: string }) {
  return (
    <div style={{ blockSize: 600 }}>
      <Box color="text-body-secondary">{label}</Box>
    </div>
  );
}

function IframeContent() {
  const [selectedOptions, setSelectedOptions] = useState<ReadonlyArray<OptionListProps.Option>>([]);

  return (
    <Box padding="l">
      <Spacer label="Top of the iframe document" />
      <SpaceBetween size="xs">
        <Header variant="h2" id="option-list-heading">
          Option list
        </Header>
        <OptionList
          data-testid="option-list"
          ariaLabelledby="option-list-heading"
          selectionType="multi"
          options={options}
          selectedOptions={selectedOptions}
          onChange={({ detail }) => setSelectedOptions(detail.selectedOptions)}
        />
      </SpaceBetween>
      <Spacer label="Bottom of the iframe document" />
    </Box>
  );
}

export default function OptionListInIframePage() {
  return (
    <SimplePage
      title="Option list in iframe"
      subtitle="Home and End: focus the list, scroll the iframe and the page partway, then press Home and End. Only the highlight should move."
      screenshotArea={{}}
    >
      <Spacer label="Top of the host page" />
      <IframeWrapper id="option-list-iframe" AppComponent={IframeContent} size={{ width: 600, height: 400 }} />
      <Spacer label="Bottom of the host page" />
    </SimplePage>
  );
}
