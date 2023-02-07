// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';
import { range } from 'lodash';
import { SpaceBetween, Flashbar, AppLayout } from '~components';
import { generateItem, i18nStrings } from './common';

export default function StickyFlashbar() {
  const items = [...range(10).map(() => generateItem('info', () => null, false, true))];
  return (
    <AppLayout
      stickyNotifications={true}
      navigationOpen={false}
      notifications={<Flashbar items={items} stackItems={true} i18nStrings={i18nStrings} />}
      content={
        <SpaceBetween size="xxl" direction="vertical">
          <p>Content</p>
          <p>Content</p>
          <p>Content</p>
          <p>Content</p>
          <p>Content</p>
          <p>Content</p>
          <p>Content</p>
          <p>Content</p>
          <p>Content</p>
          <p>Content</p>
        </SpaceBetween>
      }
    />
  );
}
