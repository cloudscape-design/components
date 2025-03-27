// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render, screen } from '@testing-library/react';

import { clearVisualRefreshState } from '@cloudscape-design/component-toolkit/internal/testing';

import VisualContext from '../../../../../lib/components/internal/components/visual-context';
import { RenderTest } from './helpers';

const globalWithFlags = globalThis as any;

describe('usePortalModeClasses', () => {
  afterEach(() => {
    jest.clearAllMocks();
    delete globalWithFlags[Symbol.for('awsui-visual-refresh-flag')];
    clearVisualRefreshState();
  });

  test('should not add any classes by default', () => {
    render(<RenderTest refClasses="" />);
    expect(screen.getByTestId('subject')).toHaveClass('', {
      exact: true,
    });
  });

  test('should detect dark mode', () => {
    render(<RenderTest refClasses="awsui-polaris-dark-mode" />);
    expect(screen.getByTestId('subject')).toHaveClass('awsui-polaris-dark-mode awsui-dark-mode', { exact: true });
  });

  test('should detect compact mode', () => {
    render(<RenderTest refClasses="awsui-polaris-compact-mode" />);
    expect(screen.getByTestId('subject')).toHaveClass('awsui-polaris-compact-mode awsui-compact-mode', { exact: true });
  });

  test('should detect visual refresh mode', () => {
    globalWithFlags[Symbol.for('awsui-visual-refresh-flag')] = () => true;

    render(<RenderTest refClasses="" />);
    expect(document.body).toHaveClass('awsui-visual-refresh', { exact: true });
    expect(screen.getByTestId('subject')).toHaveClass('awsui-visual-refresh', { exact: true });
  });

  test('should detect contexts', () => {
    render(
      <VisualContext contextName="content-header">
        <RenderTest refClasses="" />
      </VisualContext>
    );
    expect(screen.getByTestId('subject')).toHaveClass('awsui-context-content-header', { exact: true });
  });

  test('should detect multiple modes and contexts', () => {
    render(
      <VisualContext contextName="content-header">
        <RenderTest refClasses="awsui-polaris-dark-mode awsui-polaris-compact-mode" />
      </VisualContext>
    );
    expect(screen.getByTestId('subject')).toHaveClass(
      'awsui-polaris-dark-mode awsui-polaris-compact-mode awsui-dark-mode awsui-compact-mode awsui-context-content-header',
      {
        exact: true,
      }
    );
  });
});
