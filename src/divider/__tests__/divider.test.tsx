// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';

import Divider from '../../../lib/components/divider';
import createWrapper from '../../../lib/components/test-utils/dom';

import styles from '../../../lib/components/divider/styles.css.js';

function renderDivider(jsx: React.ReactElement) {
  const { container } = render(jsx);
  return createWrapper(container).findDivider()!.getElement();
}

describe('Divider', () => {
  test('renders an hr element', () => {
    expect(renderDivider(<Divider />).tagName).toBe('HR');
  });

  test('applies root CSS class', () => {
    expect(renderDivider(<Divider />)).toHaveClass(styles.divider);
  });
});

describe('semantic prop', () => {
  test('is decorative by default (role="presentation")', () => {
    expect(renderDivider(<Divider />)).toHaveAttribute('role', 'presentation');
  });

  test('semantic=false sets role="presentation" and no aria-orientation', () => {
    const el = renderDivider(<Divider semantic={false} />);
    expect(el).toHaveAttribute('role', 'presentation');
    expect(el).not.toHaveAttribute('aria-orientation');
  });

  test('semantic=true sets role="separator" and aria-orientation="horizontal"', () => {
    const el = renderDivider(<Divider semantic={true} />);
    expect(el).toHaveAttribute('role', 'separator');
    expect(el).toHaveAttribute('aria-orientation', 'horizontal');
  });
});

describe('nativeAttributes', () => {
  test('adds data attributes', () => {
    const { container } = render(<Divider nativeAttributes={{ 'data-testid': 'my-divider' }} />);
    expect(container.querySelector('[data-testid="my-divider"]')).not.toBeNull();
  });

  test('concatenates className', () => {
    const { container } = render(<Divider nativeAttributes={{ className: 'custom-class' }} />);
    expect(container.firstChild).toHaveClass(styles.divider);
    expect(container.firstChild).toHaveClass('custom-class');
  });
});
