// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { SYSTEM } from '../internal/environment.js';
import { ContainerProps } from './interfaces.js';

export function getRootStyles(style: ContainerProps.Style | undefined) {
  let properties = {};

  if (SYSTEM === 'core' && style?.root) {
    properties = {
      background: style.root?.background,
      borderColor: style.root?.borderColor,
      borderRadius: style.root?.borderRadius,
      borderWidth: style.root?.borderWidth,
      boxShadow: style.root?.boxShadow,
    };
  }

  return properties;
}

export function getContentStyles(style: ContainerProps.Style | undefined) {
  let properties = {};

  if (SYSTEM === 'core' && style?.content) {
    properties = {
      paddingBlock: style.content?.paddingBlock,
      paddingInline: style.content?.paddingInline,
    };
  }

  return properties;
}

export function getHeaderStyles(style: ContainerProps.Style | undefined) {
  let properties = {};

  if (SYSTEM === 'core' && style?.header) {
    properties = {
      ...(style?.root?.background && { background: style?.root?.background }),
      ...(style?.root?.borderRadius && { background: style?.root?.borderRadius }),
      paddingBlock: style.header?.paddingBlock,
      paddingInline: style.header?.paddingInline,
    };
  }

  return properties;
}

export function getFooterStyles(style: ContainerProps.Style | undefined) {
  let properties = {};

  if (SYSTEM === 'core' && style?.footer) {
    properties = {
      borderColor: style.footer?.divider?.borderColor,
      borderWidth: style.footer?.divider?.borderWidth,
      paddingBlock: style.footer?.root?.paddingBlock,
      paddingInline: style.footer?.root?.paddingInline,
    };
  }

  return properties;
}

export function getMediaStyles(mediaPosition: string, style: ContainerProps.Style | undefined) {
  let properties = {};

  if (SYSTEM === 'core' && style?.root?.borderRadius) {
    properties = {
      borderRadius: style?.root?.borderRadius,
      ...(mediaPosition === 'top' && { borderEndStartRadius: '0px', borderEndEndRadius: '0px' }),
      ...(mediaPosition === 'side' && { borderStartEndRadius: '0px', borderEndEndRadius: '0px' }),
    };
  }

  return properties;
}
