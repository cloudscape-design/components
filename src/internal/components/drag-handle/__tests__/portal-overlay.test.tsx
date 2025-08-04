// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { createRef } from 'react';
import { render, waitFor } from '@testing-library/react';

import PortalOverlay from '../../../../../lib/components/internal/components/drag-handle/components/portal-overlay.js';

import styles from '../../../../../lib/components/internal/components/drag-handle/styles.css.js';

let isRtl = false;

jest.mock('@cloudscape-design/component-toolkit/internal', () => ({
  ...jest.requireActual('@cloudscape-design/component-toolkit/internal'),
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
  isRtl = false;
  jest.restoreAllMocks();
});

function createMockRef() {
  const ref = createRef<HTMLElement>();
  render(<span ref={ref} />);

  return ref;
}

test('matches the position of the tracked element', async () => {
  const mockRef = createMockRef();
  render(
    <PortalOverlay track={mockRef} isDisabled={false}>
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
  const mockRef = createMockRef();

  render(
    <PortalOverlay track={mockRef} isDisabled={false}>
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

test('does not update position when disabled', async () => {
  const mockRef = createMockRef();

  render(
    <PortalOverlay track={mockRef} isDisabled={true}>
      <div id="overlay">Overlay</div>
    </PortalOverlay>
  );

  const portalOverlay = document.querySelector<HTMLElement>(`.${styles['portal-overlay']}`)!;
  await waitFor(() => {
    expect(portalOverlay.style.translate).toBeUndefined();
    expect(portalOverlay.style.width).toBe('');
    expect(portalOverlay.style.height).toBe('');
  });
});

test('resumes position updates when enabled after being disabled', async () => {
  const mockRef = createMockRef();

  const PortalOverlayWrapper = ({ isDisabled }: { isDisabled: boolean }) => (
    <PortalOverlay track={mockRef} isDisabled={isDisabled}>
      <div id="overlay">Overlay</div>
    </PortalOverlay>
  );

  const { rerender } = render(<PortalOverlayWrapper isDisabled={true} />);
  const portalOverlay = document.querySelector<HTMLElement>(`.${styles['portal-overlay']}`)!;
  await waitFor(() => {
    expect(portalOverlay.style.translate).toBeUndefined();
    expect(portalOverlay.style.width).toBe('');
    expect(portalOverlay.style.height).toBe('');
  });

  rerender(<PortalOverlayWrapper isDisabled={false} />);
  await waitFor(() => {
    expect(portalOverlay.style.translate).toBe('2px 4px');
    expect(portalOverlay.style.width).toBe('10px');
    expect(portalOverlay.style.height).toBe('20px');
  });
});
