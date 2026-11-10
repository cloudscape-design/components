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
  /**
   * Identifies the frame for screenshot specs, which select it by `[data-testid="heroshot-<id>"]`.
   * Required so that specs don't have to rely on the position of a frame in the gallery.
   */
  id: string;
  /** Caption rendered above the frame, outside of the captured area. */
  label?: string;
  /**
   * Vertical placement of the content inside the frame. Content is centered by default, and content
   * taller than the frame is already top-aligned automatically, so `start` is only needed to anchor
   * content that fits — for example a trigger whose dropdown hangs below it and needs the room.
   */
  align?: 'center' | 'start';
  /** Inset between the frame edges and the content. Set to 0 for compositions that bleed to the edges. */
  padding?: number;
  /**
   * Drops the inset on the bottom edge, so the content runs to it. Use for content that needs every
   * pixel of height it can get and is cropped at the bottom anyway — a chart filling a dashboard item.
   */
  bleedBlockEnd?: boolean;
  /** Stretches the content to the full frame width. Use for block components such as alert or container. */
  stretch?: boolean;
  /**
   * Lays the content out at this pixel size and scales it down to fit the frame. Use for page-level
   * layouts (app layout, wizard) that only read as themselves at a full viewport width. Pick a size
   * with the same aspect ratio as the padded content box to avoid letterboxing.
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
  id,
  label,
  align = 'center',
  padding = 16,
  bleedBlockEnd = false,
  stretch = false,
  contentSize,
  children,
}: HeroshotProps) {
  const paddingBlockEnd = bleedBlockEnd ? 0 : padding;
  const contentInlineSize = HEROSHOT_WIDTH - 2 * padding;
  const contentBlockSize = HEROSHOT_HEIGHT - padding - paddingBlockEnd;

  // Scaled content is laid out at its own size and shrunk to fit, so it ignores the flex alignment below.
  const scaled = contentSize ? (
    <div style={{ inlineSize: contentInlineSize, blockSize: contentBlockSize, overflow: 'hidden' }}>
      <div
        style={{
          inlineSize: contentSize.width,
          blockSize: contentSize.height,
          transform: `scale(${Math.min(contentInlineSize / contentSize.width, contentBlockSize / contentSize.height)})`,
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
        // Sits on the frame rather than the wrapper, so that specs cropping to this element capture
        // the 346x170 box alone and not the caption above it.
        data-testid={`heroshot-${id}`}
        style={{
          inlineSize: HEROSHOT_WIDTH,
          blockSize: HEROSHOT_HEIGHT,
          boxSizing: 'border-box',
          paddingBlock: `${padding}px ${paddingBlockEnd}px`,
          paddingInline: padding,
          overflow: 'hidden',
          background: colorBackgroundLayoutMain,
          outline: `1px dashed ${colorBorderDividerDefault}`,
          display: 'flex',
          flexDirection: 'column',
          // `safe` makes the centering degrade to `start` as soon as the content is taller than the
          // frame, so an overflowing preview keeps its top (and the frame's top padding) and is
          // cropped at the bottom only, instead of being clipped at both ends.
          justifyContent: align === 'center' ? 'safe center' : 'flex-start',
          alignItems: stretch ? 'stretch' : 'center',
        }}
      >
        {scaled ?? children}
      </div>
    </div>
  );
}
