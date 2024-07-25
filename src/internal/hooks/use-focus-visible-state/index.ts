// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { useEffect, useState } from 'react';

import { isModifierKey } from '@cloudscape-design/component-toolkit/internal';

export function useFocusVisibleState() {
  const [focusVisible, setFocusVisible] = useState(false);
  useEffect(() => {
    function handleMousedown() {
      return setFocusVisible(false);
    }

    function handleKeydown(event: KeyboardEvent) {
      // we do not want to highlight focused element
      // when special keys are pressed
      if (!isModifierKey(event)) {
        setFocusVisible(true);
      }
    }

    document.addEventListener('mousedown', handleMousedown);
    document.addEventListener('keydown', handleKeydown);
    return () => {
      document.removeEventListener('mousedown', handleMousedown);
      document.removeEventListener('keydown', handleKeydown);
    };
  });

  return focusVisible;
}
