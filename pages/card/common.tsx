// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ReactNode } from 'react';
import React from 'react';

import ScreenshotArea from '../utils/screenshot-area';

export function CardPage({ title, children }: { title: string; children: ReactNode }) {
  return (
    <article>
      <h1>{title}</h1>
      <div style={{ maxWidth: 600 }}>
        <ScreenshotArea>{children}</ScreenshotArea>
      </div>
    </article>
  );
}
