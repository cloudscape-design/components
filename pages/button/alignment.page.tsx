// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Button from '~components/button';

import ScreenshotArea from '../utils/screenshot-area';

import styles from './styles.scss';

export default function ButtonsScenario() {
  return (
    <article>
      <ul>
        <li>Buttons should not inherit font styles from parent component</li>
        <li>Buttons should have margins when placed next to each other</li>
      </ul>
      <ScreenshotArea>
        <h1 className={styles.styledWrapper}>
          Text for comparison
          <Button variant="link">Link</Button> <Button>Default</Button>{' '}
          <Button id="btnTest" variant="primary">
            Primary
          </Button>{' '}
          {/*TODO: uncomment when we add ButtonDropdown component */}
          {/*<ButtonDropdown text="Dropdown" />*/}
        </h1>
      </ScreenshotArea>
    </article>
  );
}
