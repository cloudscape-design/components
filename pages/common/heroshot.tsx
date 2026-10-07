// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import {
  colorBackgroundLayoutMain,
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
  /**
   * Vertical placement of the content inside the frame. Content is centered by default; use `start`
   * only when it is taller than the frame, so the crop keeps the top instead of cutting both ends.
   */
  align?: 'center' | 'start';
  /** Inset between the frame edges and the content. Set to 0 for compositions that bleed to the edges. */
  padding?: number;
  /** Stretches the content to the full frame width. Use for block components such as alert or container. */
  stretch?: boolean;
  /**
   * Lays the content out at this pixel size and scales it down to fit the frame. Use for page-level
   * layouts (app layout, wizard) that only read as themselves at a full viewport width. Pick a size
   * with the same 346:170 aspect ratio to avoid letterboxing.
   */
  contentSize?: { width: number; height: number };
  children: React.ReactNode;
}

/**
 * Renders its children inside a frame that matches the documentation website thumbnail size exactly.
 * The dashed guide is drawn with an outline so it sits outside of the 346x170 box and is not captured
 * when the frame is cropped to its bounding box.
 *
 * Animations are stopped by the `disableAnimations` screenshot area the page renders, so the frames
 * capture the same pixels every time.
 */
export function Heroshot({
  label,
  align = 'center',
  padding = 16,
  stretch = false,
  contentSize,
  children,
}: HeroshotProps) {
  // Scaled content is laid out at its own size and shrunk to fit, so it ignores the flex alignment below.
  const scaled = contentSize ? (
    <div
      style={{
        inlineSize: HEROSHOT_WIDTH - 2 * padding,
        blockSize: HEROSHOT_HEIGHT - 2 * padding,
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          inlineSize: contentSize.width,
          blockSize: contentSize.height,
          transform: `scale(${Math.min(
            (HEROSHOT_WIDTH - 2 * padding) / contentSize.width,
            (HEROSHOT_HEIGHT - 2 * padding) / contentSize.height
          )})`,
          transformOrigin: 'top left',
        }}
      >
        {children}
      </div>
    </div>
  ) : null;

  return (
    <div>
      {label ? (
        <div style={{ color: colorTextBodySecondary, fontSize: fontSizeBodyS, marginBlockEnd: 4 }}>{label}</div>
      ) : null}
      <div
        style={{
          inlineSize: HEROSHOT_WIDTH,
          blockSize: HEROSHOT_HEIGHT,
          boxSizing: 'border-box',
          padding,
          overflow: 'hidden',
          background: colorBackgroundLayoutMain,
          outline: `1px dashed ${colorBorderDividerDefault}`,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: align === 'center' ? 'center' : 'flex-start',
          alignItems: stretch ? 'stretch' : 'center',
        }}
      >
        {scaled ?? children}
      </div>
    </div>
  );
}
