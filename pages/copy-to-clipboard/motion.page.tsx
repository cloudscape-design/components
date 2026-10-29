// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useContext, useEffect } from 'react';

import { CopyToClipboard, SpaceBetween, Toggle } from '~components';

import AppContext, { AppContextType } from '../app/app-context';
import { SimplePage } from '../app/templates';

type PageContext = React.Context<AppContextType<{ copyFails?: boolean }>>;

// The error state has no prop; it is only reached when `navigator.clipboard.writeText` rejects.
// Replace it while the toggle is on so the failure path can be exercised by clicking.
function useFailingClipboard(copyFails: boolean) {
  useEffect(() => {
    if (!copyFails || !navigator.clipboard) {
      return;
    }
    const originalWriteText = navigator.clipboard.writeText.bind(navigator.clipboard);
    navigator.clipboard.writeText = () => Promise.reject(new Error('Copy failed'));
    return () => {
      navigator.clipboard.writeText = originalWriteText;
    };
  }, [copyFails]);
}

export default function CopyToClipboardMotionPage() {
  const { urlParams, setUrlParams } = useContext(AppContext as PageContext);
  const copyFails = urlParams.copyFails ?? false;
  useFailingClipboard(copyFails);

  return (
    <SimplePage
      title="Copy to clipboard motion"
      i18n={{}}
      settings={
        <Toggle checked={copyFails} onChange={({ detail }) => setUrlParams({ copyFails: detail.checked })}>
          Copy fails
        </Toggle>
      }
      // Extra space so the popovers around the first triggers are inside the screenshot area.
      screenshotArea={{ style: { paddingBlockStart: 60, paddingInlineStart: 60 } }}
    >
      <SpaceBetween size="m">
        <CopyToClipboard
          data-testid="copy-button"
          copyButtonText="Copy"
          textToCopy="Lorem ipsum dolor sit amet."
          copySuccessText="Text copied"
          copyErrorText="Failed to copy"
        />
        <CopyToClipboard
          data-testid="copy-icon"
          variant="icon"
          copyButtonAriaLabel="Copy"
          textToCopy="Lorem ipsum dolor sit amet."
          copySuccessText="Text copied"
          copyErrorText="Failed to copy"
        />
        <CopyToClipboard
          data-testid="copy-inline"
          variant="inline"
          copyButtonAriaLabel="Copy"
          textToCopy="Lorem ipsum dolor sit amet."
          copySuccessText="Text copied"
          copyErrorText="Failed to copy"
        />
      </SpaceBetween>
    </SimplePage>
  );
}
