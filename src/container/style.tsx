// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { SYSTEM } from '../internal/environment';
import { ContainerProps } from './interfaces';

export function getRootStyles(style: ContainerProps.Style | undefined) {
  if (SYSTEM !== 'core') {
    return {};
  }

  return {
    background: style?.root?.background,
    borderColor: style?.root?.borderColor,
    borderRadius: style?.root?.borderRadius,
    borderWidth: style?.root?.borderWidth,
    boxShadow: style?.root?.boxShadow,
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
    borderRadius: style?.root?.borderRadius,
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
