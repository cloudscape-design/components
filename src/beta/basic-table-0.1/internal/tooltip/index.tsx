// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useLayoutEffect, useState } from 'react';

import { Portal } from '@cloudscape-design/component-toolkit/internal';

export interface TooltipProps {
  value: React.ReactNode;
  trackRef: React.RefObject<HTMLElement | SVGElement>;
  onDismiss?: () => void;
}

// A portaled text bubble positioned above the tracked element, dismissing on Escape.
// Used by the drag handle wrapper to label its drag/resize affordance.
export default function Tooltip({ value, trackRef, onDismiss }: TooltipProps) {
  const [position, setPosition] = useState<{ top: number; left: number } | null>(null);

  useLayoutEffect(() => {
    const track = trackRef.current;
    if (!track) {
      return;
    }
    const rect = track.getBoundingClientRect();
    setPosition({ top: rect.top, left: rect.left + rect.width / 2 });
  }, [trackRef]);

  useEffect(() => {
    const controller = new AbortController();
    window.addEventListener(
      'keydown',
      (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
          // Prevent any surrounding modals or dialogs from acting on this Esc.
          event.stopPropagation();
          onDismiss?.();
        }
      },
      // Capture so this runs before wrapping modals/dialogs, since focus can be elsewhere.
      { capture: true, signal: controller.signal }
    );
    return () => controller.abort();
  }, [onDismiss]);

  if (!position) {
    return null;
  }

  return (
    <Portal>
      <div
        role="tooltip"
        style={{
          position: 'fixed',
          top: position.top,
          left: position.left,
          transform: 'translate(-50%, -100%)',
          zIndex: 7000,
          pointerEvents: 'none',
        }}
      >
        {value}
      </div>
    </Portal>
  );
}
