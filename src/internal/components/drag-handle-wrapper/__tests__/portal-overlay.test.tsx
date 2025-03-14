// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { render, waitFor } from '@testing-library/react';

import PortalOverlay from '../../../../../lib/components/internal/components/drag-handle-wrapper/portal-overlay.js';

import styles from '../../../../../lib/components/internal/components/drag-handle-wrapper/styles.css.js';

afterEach(() => {
  jest.restoreAllMocks();
});

test('matches the position of the tracked element', async () => {
  const trackElement = document.createElement('span');
  jest.spyOn(trackElement, 'getBoundingClientRect').mockReturnValue({ x: 2, y: 4, width: 10, height: 20 } as DOMRect);

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
