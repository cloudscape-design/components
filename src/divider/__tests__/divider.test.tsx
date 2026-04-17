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

describe('decorative prop', () => {
  test('is decorative by default (role="presentation")', () => {
    expect(renderDivider(<Divider />)).toHaveAttribute('role', 'presentation');
  });

  test('decorative=true sets role="presentation" and no aria-orientation', () => {
    const el = renderDivider(<Divider decorative={true} />);
    expect(el).toHaveAttribute('role', 'presentation');
    expect(el).not.toHaveAttribute('aria-orientation');
  });

  test('decorative=false sets role="separator" and aria-orientation="horizontal"', () => {
    const el = renderDivider(<Divider decorative={false} />);
    expect(el).toHaveAttribute('role', 'separator');
    expect(el).toHaveAttribute('aria-orientation', 'horizontal');
  });
});

describe('Style API', () => {
  test('applies borderColor', () => {
    const el = renderDivider(<Divider style={{ root: { borderColor: 'rgb(255, 0, 0)' } }} />);
    expect(getComputedStyle(el).getPropertyValue('border-color')).toBe('rgb(255, 0, 0)');
  });

  test('applies borderWidth', () => {
    const el = renderDivider(<Divider style={{ root: { borderWidth: '4px' } }} />);
    expect(getComputedStyle(el).getPropertyValue('border-width')).toBe('4px');
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
