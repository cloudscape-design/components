// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { SYSTEM } from '../internal/environment';
import customCssProps from '../internal/generated/custom-css-properties';
import { ContainerProps } from './interfaces';

export function getRootStyles(style: ContainerProps.Style | undefined) {
  if (SYSTEM !== 'core') {
    return {};
  }

  return {
    background: style?.root?.background,
    borderColor: style?.root?.borderColor,
    // Set as a custom property, not inline `border-radius`, so stacked containers can still
    // flatten their adjacent corners in CSS.
    ...(style?.root?.borderRadius && { [customCssProps.containerStyleBorderRadius]: style.root.borderRadius }),
    borderWidth: style?.root?.borderWidth,
    boxShadow: style?.root?.boxShadow,
    color: style?.root?.color,
  };
}

export function getContentStyles(style: ContainerProps.Style | undefined) {
  if (SYSTEM !== 'core') {
    return {};
  }

  return {
    paddingBlock: style?.content?.paddingBlock,
    paddingInline: style?.content?.paddingInline,
  };
}

export function getHeaderStyles(style: ContainerProps.Style | undefined) {
  if (SYSTEM !== 'core') {
    return {};
  }

  return {
    ...(style?.root?.background && { background: 'transparent' }), // Fix for AWSUI-61442
    // Same as the root: use a custom property so stacked headers can still flatten corners in CSS.
    ...(style?.root?.borderRadius && { [customCssProps.containerStyleBorderRadius]: style.root.borderRadius }),
    paddingBlock: style?.header?.paddingBlock,
    paddingInline: style?.header?.paddingInline,
  };
}

export function getFooterStyles(style: ContainerProps.Style | undefined) {
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

export function getMediaStyles(mediaPosition: string, style: ContainerProps.Style | undefined) {
  if (SYSTEM !== 'core') {
    return {};
  }

  return {
    borderRadius: style?.root?.borderRadius,
    ...(mediaPosition === 'top' && { borderEndStartRadius: '0px', borderEndEndRadius: '0px' }),
    ...(mediaPosition === 'side' && { borderStartEndRadius: '0px', borderEndEndRadius: '0px' }),
  };
}
