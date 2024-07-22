// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Checkbox from '~components/checkbox';

import ScreenshotArea from '../utils/screenshot-area';

import styles from './styles.scss';

export default function CheckboxLabelWidthScenario() {
  return (
    <div>
      <h1>Labels width check</h1>
      <p>Labels (green) should not take 100% of parent width, but only space needed for its content</p>
      <ScreenshotArea className={styles.highlightLabels}>
        <Checkbox checked={false}>Sample checkbox</Checkbox>
        <Checkbox checked={true} indeterminate={true}>
          Indeterminate
        </Checkbox>
        <Checkbox checked={false} disabled={true}>
          Disabled
        </Checkbox>
      </ScreenshotArea>
    </div>
  );
}
