// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Checkbox from '~components/checkbox';

import ScreenshotArea from '../utils/screenshot-area';

export default function CheckboxFocusScenario() {
  const [checked, setChecked] = useState(false);
  return (
    <article>
      <h1>Checkbox test</h1>
      <p>Checkboxes should be focused using the correct highlight</p>
      <p>
        Click here to focus so we can tab to the content below{' '}
        <button type="button" id="focus-target">
          focus
        </button>
      </p>
      <ScreenshotArea>
        <Checkbox checked={checked} onChange={event => setChecked(event.detail.checked)}>
          Checkbox label
        </Checkbox>
      </ScreenshotArea>
    </article>
  );
}
