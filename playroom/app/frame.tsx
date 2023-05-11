// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import '@cloudscape-design/global-styles/index.css';

export default function FrameComponent({ theme, children }: { theme: string; children: React.ReactNode }) {
  if (theme === 'visual-refresh') {
    document.body.classList.add('awsui-visual-refresh');
  }

  if (theme === 'classic-dark') {
    document.body.classList.add('awsui-dark-mode');
  }

  if (theme === 'visual-refresh-dark') {
    document.body.classList.add('awsui-visual-refresh', 'awsui-dark-mode');
  }

  if (theme !== 'visual-refresh' && theme !== 'visual-refresh-dark') {
    document.body.classList.remove('awsui-visual-refresh');
  }

  if (theme !== 'visual-refresh-dark' && theme !== 'classic-dark') {
    document.body.classList.remove('awsui-dark-mode');
  }

  return <React.Fragment>{children}</React.Fragment>;
}
