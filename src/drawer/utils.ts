// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

import { warnOnce } from '@cloudscape-design/component-toolkit/internal';

import { NextDrawerProps } from './interfaces';

import styles from './styles.css.js';

type PositionProps = Pick<NextDrawerProps, 'position' | 'placement' | 'offset' | 'stickyOffset' | 'zIndex'>;

export function getPositionStyles({ position, zIndex, ...props }: PositionProps): {
  className: string;
  style: React.CSSProperties;
} {
  if (position === 'sticky' && (props.placement === 'start' || props.placement === 'end')) {
    warnOnce(
      'Drawer',
      `position="sticky" is not supported with placement="${props.placement}" and falls back to position="static".`
    );
    position = 'static';
  }
  switch (position) {
    case 'absolute':
      return getStyles(position, { position: 'absolute', zIndex, ...computeAbsoluteOffsets(props) });
    case 'sticky':
      return getStyles(position, { position: 'sticky', zIndex, ...computeStickyOffsets(props) });
    case 'fixed':
      return getStyles(position, { position: 'fixed', zIndex, ...computeAbsoluteOffsets(props) });
    case 'static':
    default:
      return getStyles(position);
  }
}

function getStyles(position: NextDrawerProps.Position = 'static', style: React.CSSProperties = {}) {
  return { className: styles[`position-${position}`], style };
}

function computeAbsoluteOffsets({
  placement,
  offset: { top, bottom, start, end } = {},
}: Pick<NextDrawerProps, 'placement' | 'offset'>) {
  const style: React.CSSProperties = {};
  const offset = { top: top ?? 0, bottom: bottom ?? 0, start: start ?? 0, end: end ?? 0 };
  switch (placement) {
    case 'top':
      style.insetBlockStart = offset.top;
      style.insetInlineStart = offset.start;
      style.insetInlineEnd = offset.end;
      break;
    case 'bottom':
      style.insetBlockEnd = offset.bottom;
      style.insetInlineStart = offset.start;
      style.insetInlineEnd = offset.end;
      break;
    case 'start':
      style.insetInlineStart = offset.start;
      style.insetBlockStart = offset.top;
      style.insetBlockEnd = offset.bottom;
      break;
    case 'end':
      style.insetInlineEnd = offset.end;
      style.insetBlockStart = offset.top;
      style.insetBlockEnd = offset.bottom;
      break;
  }
  return style;
}

function computeStickyOffsets({
  placement,
  offset: { top, bottom, start, end } = {},
  stickyOffset: { top: stickyTop, bottom: stickyBottom } = {},
}: Pick<NextDrawerProps, 'placement' | 'offset' | 'stickyOffset'>) {
  const style: React.CSSProperties = {};
  const offset = { top: top ?? 0, bottom: bottom ?? 0, start: start ?? 0, end: end ?? 0 };
  const stickyOffset = { top: stickyTop ?? 0, bottom: stickyBottom ?? 0 };
  switch (placement) {
    case 'top':
      style.insetBlockStart = stickyOffset.top;
      style.marginBlockStart = offset.top;
      style.marginInlineStart = offset.start;
      style.marginInlineEnd = offset.end;
      style.inlineSize = `calc(100% - ${offset.start + offset.end}px)`;
      break;
    case 'bottom':
      style.insetBlockEnd = stickyOffset.bottom;
      style.marginBlockEnd = offset.bottom;
      style.marginInlineStart = offset.start;
      style.marginInlineEnd = offset.end;
      style.inlineSize = `calc(100% - ${offset.start + offset.end}px)`;
      break;
  }
  return style;
}
