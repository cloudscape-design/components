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
    ...(style?.root?.background && { [customCssProps.styleItemCardBackgroundDefault]: style.root.background }),
    ...(style?.root?.borderRadius && {
      [customCssProps.styleItemCardBorderRadius]: style.root.borderRadius,
      borderRadius: style.root.borderRadius,
    }),
    ...(style?.root?.borderColor && { [customCssProps.styleItemCardBorderColorDefault]: style.root.borderColor }),
    ...(style?.root?.borderWidth && { [customCssProps.styleItemCardBorderWidthDefault]: style.root.borderWidth }),
    ...(style?.root?.boxShadow && { [customCssProps.styleItemCardBoxShadowDefault]: style.root.boxShadow }),
  };
}

export function getContentStyles(style: ItemCardProps.Style | undefined) {
  if (SYSTEM !== 'core') {
    return {};
  }

  return {
    ...(style?.content?.paddingBlock && { paddingBlock: style.content.paddingBlock }),
    ...(style?.content?.paddingInline && { paddingInline: style.content.paddingInline }),
  };
}

export function getHeaderStyles(style: ItemCardProps.Style | undefined) {
  if (SYSTEM !== 'core') {
    return {};
  }

  return {
    ...(style?.header?.paddingBlock && { paddingBlock: style.header.paddingBlock }),
    ...(style?.header?.paddingInline && { paddingInline: style.header.paddingInline }),
  };
}

export function getFooterStyles(style: ItemCardProps.Style | undefined) {
  if (SYSTEM !== 'core') {
    return {};
  }

  const hasDivider = style?.footer?.divider?.borderColor || style?.footer?.divider?.borderWidth;

  return {
    ...(hasDivider && { borderBlockStartStyle: 'solid' as const }),
    ...(style?.footer?.divider?.borderColor && { borderBlockStartColor: style.footer.divider.borderColor }),
    ...(style?.footer?.divider?.borderWidth && { borderBlockStartWidth: style.footer.divider.borderWidth }),
    ...(style?.footer?.root?.paddingBlock && { paddingBlock: style.footer.root.paddingBlock }),
    ...(style?.footer?.root?.paddingInline && { paddingInline: style.footer.root.paddingInline }),
  };
}
