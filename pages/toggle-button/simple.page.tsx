// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import ToggleButton from '~components/toggle-button';

export default function ToggleButtonSimpleScenario() {
  const [pressed, setPressed] = useState(false);

  return (
    <>
      <h1>Toggle button demo</h1>
      <ToggleButton
        pressed={pressed}
        iconName="star"
        pressedIconName="star-filled"
        onChange={event => {
          setPressed(event.detail.pressed);
        }}
      >
        Toggle button
      </ToggleButton>
    </>
  );
}
