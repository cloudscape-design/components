// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { SYSTEM } from '../internal/environment';
import customCssProps from '../internal/generated/custom-css-properties';
import { ItemCardProps } from './interfaces';

export function getRootStyles(style: ItemCardProps.Style | undefined) {
  if (SYSTEM !== 'core') {
    return {};
  }

  return {
    borderRadius: style?.root?.borderRadius,
    ...(style?.root?.background && { [customCssProps.styleBackgroundDefault]: style.root.background }),
    ...(style?.root?.borderRadius && { [customCssProps.styleBorderRadius]: style.root.borderRadius }),
    ...(style?.root?.borderColor && { [customCssProps.styleBorderColorDefault]: style.root.borderColor }),
    ...(style?.root?.borderWidth && { [customCssProps.styleBorderWidthDefault]: style.root.borderWidth }),
    ...(style?.root?.boxShadow && { [customCssProps.styleBoxShadowDefault]: style.root.boxShadow }),
  };
}

export function getContentStyles(style: ItemCardProps.Style | undefined) {
  if (SYSTEM !== 'core') {
    return {};
  }

  return {
    paddingBlock: style?.content?.paddingBlock,
    paddingInline: style?.content?.paddingInline,
  };
}

export function getHeaderStyles(style: ItemCardProps.Style | undefined) {
  if (SYSTEM !== 'core') {
    return {};
  }

  return {
    paddingBlock: style?.header?.paddingBlock,
    paddingInline: style?.header?.paddingInline,
  };
}

export function getFooterStyles(style: ItemCardProps.Style | undefined) {
  if (SYSTEM !== 'core') {
    return {};
  }

  return {
    borderColor: style?.footer?.divider?.borderColor,
    borderWidth: style?.footer?.divider?.borderWidth,
    paddingBlock: style?.footer?.root?.paddingBlock,
    paddingInline: style?.footer?.root?.paddingInline,
  };
}
