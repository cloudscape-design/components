// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { render, waitFor } from '@testing-library/react';

import PortalOverlay from '../../../../../lib/components/internal/components/drag-handle-wrapper/portal-overlay.js';

import styles from '../../../../../lib/components/internal/components/drag-handle-wrapper/styles.css.js';

let isRtl = false;

jest.mock('@cloudscape-design/component-toolkit/internal', () => ({
  getIsRtl: jest.fn(() => isRtl),
  getLogicalBoundingClientRect: jest.fn().mockReturnValue({
    insetInlineStart: 2,
    insetBlockStart: 4,
    inlineSize: 10,
    blockSize: 20,
  }),
  getScrollInlineStart: jest.fn().mockReturnValue(0),
}));

afterEach(() => {
  jest.restoreAllMocks();
});

test('matches the position of the tracked element', async () => {
  const trackElement = document.createElement('span');

  render(
    <PortalOverlay track={trackElement}>
      <div id="overlay">Overlay</div>
    </PortalOverlay>
  );

  const portalOverlay = document.querySelector<HTMLElement>(`.${styles['portal-overlay']}`)!;
  await waitFor(() => {
    expect(portalOverlay.style.translate).toBe('2px 4px');
    expect(portalOverlay.style.width).toBe('10px');
    expect(portalOverlay.style.height).toBe('20px');
  });
});

test('matches the position of the tracked element in rtl', async () => {
  isRtl = true;
  const trackElement = document.createElement('span');

  render(
    <PortalOverlay track={trackElement}>
      <div id="overlay">Overlay</div>
    </PortalOverlay>
  );

  const portalOverlay = document.querySelector<HTMLElement>(`.${styles['portal-overlay']}`)!;
  await waitFor(() => {
    expect(portalOverlay.style.translate).toBe('-2px 4px');
    expect(portalOverlay.style.width).toBe('10px');
    expect(portalOverlay.style.height).toBe('20px');
  });
});
