// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';

import InternalIcon from '../../../lib/components/icon/internal';

import styles from '../../../lib/components/icon/styles.css.js';

describe('internal icon props', () => {
  test('should prevent pointer events', () => {
    const { container } = render(<InternalIcon name="add-plus" __preventPointerEvents={true} />);
    expect(container.querySelector('span')).toHaveClass(styles['prevent-pointer-events']);
  });
});
