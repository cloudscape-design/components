// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useRef } from 'react';
import { render, screen } from '@testing-library/react';
import { usePortalModeClasses } from '../../../../../lib/components/internal/hooks/use-portal-mode-classes';
import { useVisualRefresh } from '../../../../../lib/components/internal/hooks/use-visual-mode';

jest.mock('../../../../../lib/components/internal/hooks/use-visual-mode', () => {
  const original = jest.requireActual('../../../../../lib/components/internal/hooks/use-visual-mode');
  return { ...original, useVisualRefresh: jest.fn() };
});
jest.mock('../../../../../lib/components/internal/environment', () => {
  const original = jest.requireActual('../../../../../lib/components/internal/environment');
  return { ...original, ALWAYS_VISUAL_REFRESH: true };
});

afterEach(() => {
  (useVisualRefresh as jest.Mock).mockReset();
});

describe('usePortalModeClasses in "always visual refresh" mode', () => {
  function RenderTest() {
    const ref = useRef(null);
    const classes = usePortalModeClasses(ref);
    return (
      <>
        <div ref={ref} />
        <div data-testid="subject" className={classes} />
      </>
    );
  }

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('visual refresh class name has no effect', () => {
    (useVisualRefresh as jest.Mock).mockImplementation(() => true);

    const { rerender } = render(<RenderTest />);
    expect(screen.getByTestId('subject')).not.toHaveClass('awsui-visual-refresh', { exact: true });

    (useVisualRefresh as jest.Mock).mockImplementation(() => false);
    rerender(<RenderTest />);
    expect(screen.getByTestId('subject')).not.toHaveClass('awsui-visual-refresh', { exact: true });
  });
});
