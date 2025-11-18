// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import RadioButton from '~components/radio-button';

import ScreenshotArea from '../utils/screenshot-area';

export default function RadioButtonScenario() {
  const [checked, setChecked] = useState(false);
  return (
    <article>
      <h1>Radio buttons should be focused using the correct highlight</h1>
      <p>
        Click here to focus so we can tab to the content below{' '}
        <button type="button" id="focus-target">
          focus
        </button>
      </p>
      <ScreenshotArea>
        <RadioButton name="radio-button-group" checked={checked} onChange={({ detail }) => setChecked(detail.checked)}>
          Radio button label
        </RadioButton>
      </ScreenshotArea>
    </article>
  );
}
