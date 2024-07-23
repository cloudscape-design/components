// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Button from '~components/button';

import ScreenshotArea from '../utils/screenshot-area';

import styles from './styles.scss';

export default function ButtonsScenario() {
  return (
    <article>
      <ScreenshotArea>
        <h1 className={styles.styledWrapper}>Buttons with disabled reason</h1>
        <Button variant="primary" disabled={true} disabledReason="disabled reason">
          Primary
        </Button>
        <Button disabled={true} disabledReason="disabled reason">
          Default
        </Button>
      </ScreenshotArea>
    </article>
  );
}
