// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import AppLayout from '~components/app-layout';

import ScreenshotArea from '../utils/screenshot-area';
import { Notifications } from './utils/content-blocks';
import labels from './utils/labels';

import styles from './styles.scss';

export default function () {
  return (
    <ScreenshotArea gutters={false}>
      <AppLayout
        ariaLabels={labels}
        // Note: Rendering flashbar here directly does not work. It has to be a separate component to reproduce
        // the case when `notifications` slot is not falsy, but eventually it renders no HTML
        notifications={<Notifications />}
        content={
          <div className={styles.highlightBorder}>
            <h1>Distribution details</h1>
            <p>Some information</p>
          </div>
        }
      />
    </ScreenshotArea>
  );
}
