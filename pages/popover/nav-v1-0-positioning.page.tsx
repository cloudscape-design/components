// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Popover from '~components/popover';

import ScreenshotArea from '../utils/screenshot-area';

import styles from './nav-v1-0-positioning.scss';

export default function () {
  return (
    <>
      <h1>Popover positioning with navigation v1.0</h1>

      <ScreenshotArea gutters={false} className={styles.grid}>
        <Popover
          id="popover"
          className={styles.popover}
          size="medium"
          header="Memory error"
          content={
            <>
              This instance contains insufficient memory. Stop the instance, choose a different instance type with more
              memory, and restart it.
            </>
          }
          dismissAriaLabel="Close"
        >
          trigger
        </Popover>
      </ScreenshotArea>
    </>
  );
}
