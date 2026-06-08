// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import { useState } from 'react';

import { AppLayoutProps } from '@cloudscape-design/components/app-layout';

export const useGlobalSplitPanel = () => {
  const [splitPanelSize, setSplitPanelSize] = useState(400);
  const [splitPanelOpen, setSplitPanelOpen] = useState(false);

  const onSplitPanelResize: AppLayoutProps['onSplitPanelResize'] = ({ detail: { size } }) => {
    setSplitPanelSize(size);
  };

  const onSplitPanelToggle: AppLayoutProps['onSplitPanelToggle'] = ({ detail: { open } }) => {
    setSplitPanelOpen(open);
  };

  return {
    splitPanelOpen,
    onSplitPanelToggle,
    splitPanelSize,
    onSplitPanelResize,
    splitPanelPreferences: { position: 'side' as const },
  };
};
