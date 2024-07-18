// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import RadioGroup, { RadioGroupProps } from '~components/radio-group';

import ScreenshotArea from '../utils/screenshot-area';

import styles from './styles.scss';

const items: RadioGroupProps.RadioButtonDefinition[] = [
  { value: 'radio1', label: 'Radio button label' },
  { value: 'radio2', label: 'Radio button label 2', description: 'Some description' },
  { value: 'radio3', label: 'Radio button label 3', description: 'Description that is longer that the label' },
];

export default function RadioButtonScenario() {
  return (
    <article className={styles.highlightLabels}>
      <h1>Labels width check</h1>
      <p>Labels (green) should not take 100% of parent width, but only space needed for its content</p>
      <ScreenshotArea>
        <RadioGroup
          value={null}
          items={items}
          onChange={() => {
            /*empty handler to suppress react controlled property warning*/
          }}
        />
      </ScreenshotArea>
    </article>
  );
}
