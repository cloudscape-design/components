// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import RadioButton from '~components/radio-button';

import FocusTarget from '../common/focus-target';
import ScreenshotArea from '../utils/screenshot-area';

export default function RadioButtonScenario() {
  const [checked, setChecked] = useState(false);
  return (
    <article>
      <h1>Radio buttons should be focused using the correct highlight</h1>
      <FocusTarget />
      <ScreenshotArea>
        <RadioButton name="radio-button-group" checked={checked} onSelect={() => setChecked(true)}>
          Radio button label
        </RadioButton>
      </ScreenshotArea>
    </article>
  );
}
