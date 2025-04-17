// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { render } from '@testing-library/react';

import InternalDragHandle from '../../../../../lib/components/internal/components/drag-handle/index.js';

import styles from '../../../../../lib/components/internal/components/drag-handle/styles.css.js';

test('passes ariaLabelledBy to DragHandleButton', () => {
  render(
    <div>
      <div id="label-element">custom label</div>
      <InternalDragHandle ariaLabelledBy="label-element" />
    </div>
  );

  expect(document.querySelector(`.${styles.handle}`)).toHaveAttribute('aria-labelledby', 'label-element');
  expect(document.querySelector(`.${styles.handle}`)).toHaveAccessibleName('custom label');
});
