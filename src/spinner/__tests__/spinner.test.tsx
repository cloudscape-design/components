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

  describe('native attributes', () => {
    it('adds native attributes', () => {
      const { container } = render(<Spinner nativeAttributes={{ 'data-testid': 'my-test-id' }} />);
      expect(container.querySelector('[data-testid="my-test-id"]')).not.toBeNull();
    });
    it('concatenates class names', () => {
      const { container } = render(<Spinner nativeAttributes={{ className: 'additional-class' }} />);
      expect(container.firstChild).toHaveClass(styles.root);
      expect(container.firstChild).toHaveClass('additional-class');
    });
  });
});
