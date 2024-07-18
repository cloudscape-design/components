// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Button from '~components/button';

import ScreenshotArea from '../utils/screenshot-area';

import styles from './styles.scss';

export default function WrappingButtonScenario() {
  return (
    <article>
      <h1>Icon wrap examples</h1>
      <ul>
        <li>Buttons should wrap by default</li>
        <li>Buttons can be specified to not wrap</li>
      </ul>
      <ScreenshotArea>
        <h2>Left icon</h2>
        <div className={styles.buttonWrapper}>
          <Button iconName="add-plus">Icon wrap, and so I do</Button>
          <Button iconName="add-plus" wrapText={false}>
            I control my own space
          </Button>
        </div>

        <h2>Right icon</h2>
        <div className={styles.buttonWrapper}>
          <Button iconName="add-plus" iconAlign="right">
            <u>Icon</u> wrap, and so I do
          </Button>
          <Button iconName="add-plus" iconAlign="right" wrapText={false}>
            <u>I con</u>trol my own space
          </Button>
        </div>
      </ScreenshotArea>
    </article>
  );
}
