// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Toggle from '~components/toggle';

import ScreenshotArea from '../utils/screenshot-area';

import styles from './styles.scss';

export default function ToggleLabelWidthScenario() {
  return (
    <div>
      <h1>Labels width check</h1>
      <p>Labels (green) should not take 100% of parent width, but only space needed for its content</p>
      <ScreenshotArea className={styles.highlightLabels}>
        <Toggle checked={false} onChange={() => {}}>
          Sample toggle
        </Toggle>
        <Toggle checked={true} onChange={() => {}}>
          Checked toggle
        </Toggle>
      </ScreenshotArea>
    </div>
  );
}
