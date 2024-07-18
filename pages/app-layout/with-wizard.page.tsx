// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';

import AppLayout from '~components/app-layout';

import ScreenshotArea from '../utils/screenshot-area';
import labels from './utils/labels';

import styles from './styles.scss';

export default function () {
  return (
    <ScreenshotArea gutters={false}>
      <AppLayout
        contentType="wizard"
        ariaLabels={labels}
        content={
          <div className={styles.wizard}>
            <div className={clsx(styles['wizard-steps'], styles.highlightBorder)} />
            <div className={clsx(styles['wizard-form'], styles.highlightBorder)}>
              <h1>Title</h1>a very long text to fill the entire available space here otherwise we wouldn&apos;t be able
              to test this properly a very long text to fill the entire available space here otherwise we wouldn&apos;t
              be able to test this properly a very long text to fill the entire available space here otherwise we
              wouldn&apos;t be able to test this properly
            </div>
          </div>
        }
      />
    </ScreenshotArea>
  );
}
