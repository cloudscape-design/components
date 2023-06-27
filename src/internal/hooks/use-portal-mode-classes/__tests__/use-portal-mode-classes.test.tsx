// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useRef } from 'react';
import { render, screen } from '@testing-library/react';
import {
  isInsidePortal,
  usePortalModeClasses,
} from '../../../../../lib/components/internal/hooks/use-portal-mode-classes';
import VisualContext from '../../../../../lib/components/internal/components/visual-context';
import { useVisualRefresh } from '../../../../../lib/components/internal/hooks/use-visual-mode';
import styles from '../../../../../lib/components/internal/hooks/use-portal-mode-classes/styles.css.js';

jest.mock('../../../../../lib/components/internal/hooks/use-visual-mode', () => {
  const original = jest.requireActual('../../../../../lib/components/internal/hooks/use-visual-mode');
  return { ...original, useVisualRefresh: jest.fn() };
});

afterEach(() => {
  (useVisualRefresh as jest.Mock).mockReset();
});

describe('usePortalModeClasses', () => {
  function RenderTest({ refClasses }: { refClasses: string }) {
    const ref = useRef(null);
    const classes = usePortalModeClasses(ref);
    return (
      <div>
        <div ref={ref} className={refClasses} />
        <div data-testid="subject" className={classes} />
      </div>
    );
  }

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should only add portal class by default', () => {
    render(<RenderTest refClasses="" />);
    expect(screen.getByTestId('subject')).toHaveClass(styles.portal, {
      exact: true,
    });
  });

  test('should detect dark mode', () => {
    render(<RenderTest refClasses="awsui-polaris-dark-mode" />);
    expect(screen.getByTestId('subject')).toHaveClass(`${styles.portal} awsui-polaris-dark-mode awsui-dark-mode`, {
      exact: true,
    });
  });

  test('should detect compact mode', () => {
    render(<RenderTest refClasses="awsui-polaris-compact-mode" />);
    expect(screen.getByTestId('subject')).toHaveClass(
      `${styles.portal} awsui-polaris-compact-mode awsui-compact-mode`,
      { exact: true }
    );
  });

  test('should detect visual refresh mode', () => {
    // This assumes implementation details about the implementation of useVisualRefresh hook. It works
    // as an integration test.
    window.CSS.supports = jest.fn(() => true);

    (useVisualRefresh as jest.Mock).mockImplementation(() => true);

    render(<RenderTest refClasses="" />);
    expect(screen.getByTestId('subject')).toHaveClass(`${styles.portal} awsui-visual-refresh`, { exact: true });
  });

  test('should detect contexts', () => {
    render(
      <VisualContext contextName="content-header">
        <RenderTest refClasses="" />
      </VisualContext>
    );
    expect(screen.getByTestId('subject')).toHaveClass(`${styles.portal} awsui-context-content-header`, { exact: true });
  });

  test('should detect multiple modes and contexts', () => {
    render(
      <VisualContext contextName="content-header">
        <RenderTest refClasses="awsui-polaris-dark-mode awsui-polaris-compact-mode" />
      </VisualContext>
    );
    expect(screen.getByTestId('subject')).toHaveClass(
      `${styles.portal} awsui-polaris-dark-mode awsui-polaris-compact-mode awsui-dark-mode awsui-compact-mode awsui-context-content-header`,
      {
        exact: true,
      }
    );
  });
});

describe('isInsidePortal', () => {
  function RenderTest() {
    const ref = useRef(null);
    const classes = usePortalModeClasses(ref);
    return (
      <div>
        <div data-testid="outside" />
        <div data-testid="portal" ref={ref}>
          <div data-testid="inside" className={classes}>
            Inside the portal
          </div>
        </div>
      </div>
    );
  }

  it('identifies elements inside and outside of portals', () => {
    const { getByTestId } = render(<RenderTest />);

    const outside = getByTestId('outside');
    const inside = getByTestId('inside');

    expect(isInsidePortal(outside)).toBe(false);
    expect(isInsidePortal(inside)).toBe(true);
  });
});
