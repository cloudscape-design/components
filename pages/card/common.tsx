// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ReactNode } from 'react';
import React from 'react';

import SpaceBetween from '~components/space-between';

import ScreenshotArea from '../utils/screenshot-area';

export function CardPage({ title, children, settings }: { title: string; children: ReactNode; settings?: ReactNode }) {
  return (
    <article>
      <h1>{title}</h1>
      {settings && (
        <SpaceBetween size="s">
          <div>{settings}</div>
          <hr />
        </SpaceBetween>
      )}
      <div style={{ maxWidth: 600 }}>
        <ScreenshotArea>{children}</ScreenshotArea>
      </div>
    </article>
  );
}
