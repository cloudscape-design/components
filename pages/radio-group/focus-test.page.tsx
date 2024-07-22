// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import RadioGroup from '~components/radio-group';

import ScreenshotArea from '../utils/screenshot-area';

export default function RadioButtonScenario() {
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
        <RadioGroup
          value="radio1"
          items={[{ value: 'radio1', label: 'Radio button label' }]}
          onChange={() => {
            /*empty handler to suppress react controlled property warning*/
          }}
        />
      </ScreenshotArea>
    </article>
  );
}
