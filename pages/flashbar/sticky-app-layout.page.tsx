// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';
import { range } from 'lodash';

import { AppLayout, Flashbar, SpaceBetween } from '~components';

import appLayoutLabels from '../app-layout/utils/labels';
import { generateItem, i18nStrings } from './common';

export default function StickyFlashbar() {
  const items = [
    ...range(10).map(index =>
      generateItem({ type: 'info', dismiss: () => null, hasHeader: false, initial: true, id: index.toString() })
    ),
  ];
  return (
    <AppLayout
      ariaLabels={appLayoutLabels}
      stickyNotifications={true}
      navigationOpen={false}
      notifications={<Flashbar items={items} stackItems={true} i18nStrings={i18nStrings} />}
      content={
        <>
          <h1>Sticky Flashbar test</h1>
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
        </>
      }
    />
  );
}
