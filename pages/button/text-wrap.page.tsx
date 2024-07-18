// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Button from '~components/button';

import ScreenshotArea from '../utils/screenshot-area';

import styles from './styles.scss';

export default function WrappingButtonScenario() {
  return (
    <article>
      <h1>Text wrapping examples</h1>
      <ul>
        <li>Buttons should wrap by default</li>
        <li>Buttons can be specified to not wrap</li>
      </ul>
      <ScreenshotArea>
        <div className={styles.buttonWrapper}>
          <Button>I adapt, ergo I wrap</Button>
        </div>
        <div className={styles.buttonWrapper}>
          <Button wrapText={false}>Too shy to wrap!</Button>
        </div>
      </ScreenshotArea>
    </article>
  );
}
