// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render, screen } from '@testing-library/react';

import { RenderTest } from './helpers';

jest.mock('../../../../../lib/components/internal/environment', () => ({
  ...jest.requireActual('../../../../../lib/components/internal/environment'),
  ALWAYS_VISUAL_REFRESH: true,
}));

const globalWithFlags = globalThis as any;

describe('usePortalModeClasses (vr-only mode)', () => {
  test('should not add any classes by default', () => {
    render(<RenderTest refClasses="" />);
    expect(screen.getByTestId('subject')).toHaveClass('', { exact: true });
  });

  test('should detect dark mode', () => {
    render(<RenderTest refClasses="awsui-polaris-dark-mode" />);
    expect(screen.getByTestId('subject')).toHaveClass('awsui-polaris-dark-mode awsui-dark-mode', { exact: true });
  });

  test('should not render awsui-visual-refresh class', () => {
    globalWithFlags[Symbol.for('awsui-visual-refresh-flag')] = () => true;

    render(<RenderTest refClasses="" />);
    expect(document.body).not.toHaveClass('awsui-visual-refresh', { exact: true });
    expect(screen.getByTestId('subject')).not.toHaveClass('awsui-visual-refresh', { exact: true });
  });
});
