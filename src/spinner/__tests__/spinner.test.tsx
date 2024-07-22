// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';

import Spinner from '../../../lib/components/spinner';

import styles from '../../../lib/components/spinner/styles.css.js';

describe('Spinner', () => {
  test('Renders the size correctly', function () {
    const { container } = render(<Spinner size="big" />);
    expect(container.firstChild).toHaveClass(styles['size-big']);
  });

  it('Renders the variant correctly', function () {
    const { container } = render(<Spinner variant="inverted" />);
    expect(container.firstChild).toHaveClass(styles['variant-inverted']);
  });
});
