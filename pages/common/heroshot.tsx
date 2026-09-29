// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import {
  colorBackgroundContainerContent,
  colorBorderDividerDefault,
  colorTextBodySecondary,
  fontSizeBodyS,
} from '~design-tokens';

// Thumbnail size used by the components overview pages of the documentation website.
export const HEROSHOT_WIDTH = 346;
export const HEROSHOT_HEIGHT = 170;

interface HeroshotProps {
  /** Caption rendered above the frame, outside of the captured area. */
  label?: string;
  /** Vertical placement of the content inside the frame. Use `start` when the composition grows downwards (for example an open dropdown). */
  align?: 'center' | 'start';
  /** Inset between the frame edges and the content. Set to 0 for compositions that bleed to the edges. */
  padding?: number;
  /** Stretches the content to the full frame width. Use for block components such as alert or container. */
  stretch?: boolean;
  children: React.ReactNode;
}

/**
 * Renders its children inside a frame that matches the documentation website thumbnail size exactly.
 * The dashed guide is drawn with an outline so it sits outside of the 346x170 box and is not captured
 * when the frame is cropped to its bounding box.
 */
export function Heroshot({ label, align = 'center', padding = 16, stretch = false, children }: HeroshotProps) {
  return (
    <div>
      {label ? (
        <div style={{ color: colorTextBodySecondary, fontSize: fontSizeBodyS, marginBlockEnd: 4 }}>
          {label} — {HEROSHOT_WIDTH}×{HEROSHOT_HEIGHT}
        </div>
      ) : null}
      <div
        style={{
          inlineSize: HEROSHOT_WIDTH,
          blockSize: HEROSHOT_HEIGHT,
          boxSizing: 'border-box',
          padding,
          overflow: 'hidden',
          background: colorBackgroundContainerContent,
          outline: `1px dashed ${colorBorderDividerDefault}`,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: align === 'center' ? 'center' : 'flex-start',
          alignItems: stretch ? 'stretch' : 'center',
        }}
      >
        {children}
      </div>
    </div>
  );
}
