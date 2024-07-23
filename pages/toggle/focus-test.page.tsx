// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Toggle from '~components/toggle';

import ScreenshotArea from '../utils/screenshot-area';

export default function ToggleFocusScenario() {
  const [checked, setChecked] = useState(false);
  return (
    <article>
      <h1>Toggle test</h1>
      <p>Toggles should be focused using the correct highlight</p>
      <p>
        Click here to focus so we can tab to the content below{' '}
        <button type="button" id="focus-target">
          focus
        </button>
      </p>
      <ScreenshotArea>
        <Toggle checked={checked} onChange={event => setChecked(event.detail.checked)}>
          Toggle label
        </Toggle>
      </ScreenshotArea>
    </article>
  );
}
