// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import * as tokens from '../internal/generated/styles/tokens';
import { BoxProps } from './interfaces';

// Mapping from size prop values to CSS custom property values
// Horizontal (inline) spacing - does not scale in compact mode
const horizontalSpacing: Record<BoxProps.SpacingSize, string> = {
  n: tokens.spaceNone,
  xxxs: tokens.spaceXxxs,
  xxs: tokens.spaceXxs,
  xs: tokens.spaceXs,
  s: tokens.spaceS,
  m: tokens.spaceM,
  l: tokens.spaceL,
  xl: tokens.spaceXl,
  xxl: tokens.spaceXxl,
  xxxl: tokens.spaceXxxl,
};

// Vertical (block) spacing - scales in compact mode
const verticalSpacing: Record<BoxProps.SpacingSize, string> = {
  n: tokens.spaceScaledNone,
  xxxs: tokens.spaceScaledXxxs,
  xxs: tokens.spaceScaledXxs,
  xs: tokens.spaceScaledXs,
  s: tokens.spaceScaledS,
  m: tokens.spaceScaledM,
  l: tokens.spaceScaledL,
  xl: tokens.spaceScaledXl,
  xxl: tokens.spaceScaledXxl,
  xxxl: tokens.spaceScaledXxxl,
};

interface SpacingStylesProps {
  margin: BoxProps.SpacingSize | BoxProps.Spacing;
  padding: BoxProps.SpacingSize | BoxProps.Spacing;
}

// Using Record<string, string> since CSS custom property values (var(...))
// are valid CSS but not recognized by React.CSSProperties strict typing
type SpacingStyles = Record<string, string>;

export function getSpacingStyles({ margin, padding }: SpacingStylesProps): React.CSSProperties {
  const styles: SpacingStyles = {};

  applySpacing(styles, margin, 'margin');
  applySpacing(styles, padding, 'padding');

  return styles as React.CSSProperties;
}

function applySpacing(
  styles: SpacingStyles,
  value: BoxProps.SpacingSize | BoxProps.Spacing,
  property: 'margin' | 'padding'
): void {
  if (typeof value === 'string') {
    // Single value applies to all sides
    styles[`${property}Block`] = verticalSpacing[value];
    styles[`${property}Inline`] = horizontalSpacing[value];
    return;
  }

  // Object with individual sides
  const { top, right, bottom, left, horizontal, vertical } = value;

  // Apply vertical spacing (block direction)
  if (top !== undefined) {
    styles[`${property}BlockStart`] = verticalSpacing[top];
  }
  if (bottom !== undefined) {
    styles[`${property}BlockEnd`] = verticalSpacing[bottom];
  }
  if (vertical !== undefined) {
    styles[`${property}Block`] = verticalSpacing[vertical];
  }

  // Apply horizontal spacing (inline direction)
  if (right !== undefined) {
    styles[`${property}InlineEnd`] = horizontalSpacing[right];
  }
  if (left !== undefined) {
    styles[`${property}InlineStart`] = horizontalSpacing[left];
  }
  if (horizontal !== undefined) {
    styles[`${property}Inline`] = horizontalSpacing[horizontal];
  }
}
