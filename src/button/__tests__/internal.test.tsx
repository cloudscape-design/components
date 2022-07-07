// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';
import { InternalButton } from '../../../lib/components/button/internal';
import styles from '../../../lib/components/button/styles.css.js';

test('specific properties take precedence over nativeAttributes', () => {
  const { container } = render(
    <InternalButton ariaLabel="property" __nativeAttributes={{ 'aria-label': 'native attribute' }} />
  );
  expect(container.querySelector('button')).toHaveAttribute('aria-label', 'property');
});

test('supports providing custom attributes', () => {
  const { container } = render(<InternalButton __nativeAttributes={{ 'aria-hidden': 'true' }} />);
  expect(container.querySelector('button')).toHaveAttribute('aria-hidden', 'true');
});

test('supports __iconClass property', () => {
  const { container } = render(
    <InternalButton __iconClass="example-class" iconName="settings" __nativeAttributes={{ 'aria-expanded': 'true' }} />
  );
  expect(container.querySelector(`button .${styles.icon}`)).toHaveClass('example-class');
});
