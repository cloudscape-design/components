// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import * as Themes from './themes';

import '@cloudscape-design/global-styles/index.css';

export default function FrameComponent({ theme, children }: { theme: string; children: React.ReactNode }) {
  const [isVisualRefresh, setVisualRefresh] = useState(false);
  if (theme === Themes.VisualRefresh && !isVisualRefresh) {
    document.body.classList.add('awsui-visual-refresh');
    setVisualRefresh(true);
  } else if (theme !== Themes.VisualRefresh && isVisualRefresh) {
    document.body.classList.remove('awsui-visual-refresh');
    setVisualRefresh(false);
  }

  return <React.Fragment key={`visual-refresh-${isVisualRefresh}`}>{children}</React.Fragment>;
}
