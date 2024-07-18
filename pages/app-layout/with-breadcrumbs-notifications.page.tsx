// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import AppLayout from '~components/app-layout';
import Flashbar from '~components/flashbar';

import ScreenshotArea from '../utils/screenshot-area';
import { Breadcrumbs } from './utils/content-blocks';
import label from './utils/labels';

import styles from './styles.scss';

export default function () {
  return (
    <ScreenshotArea gutters={false}>
      <AppLayout
        ariaLabels={label}
        breadcrumbs={<Breadcrumbs />}
        content={
          <div className={styles.highlightBorder}>
            <div>
              <h1>Distribution details</h1>
            </div>
            <div className={styles.longContent}>Some very long content</div>
          </div>
        }
        notifications={
          <Flashbar
            items={[
              {
                type: 'success',
                statusIconAriaLabel: 'success',
                header: (
                  <div>
                    This is a very very very long flash message that will cause the notifications to wrap over multiple
                    lines. I hope it wont overlap with the breadcrumbs, that would be awkward. This is a very very very
                    long flash message that will cause the notifications to wrap over multiple lines. I hope it wont
                    overlap with the breadcrumbs, that would be awkward.
                  </div>
                ),
              },
            ]}
          />
        }
      />
    </ScreenshotArea>
  );
}
