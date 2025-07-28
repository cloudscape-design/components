// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { SYSTEM } from '../internal/environment';
import { ContainerProps } from './interfaces';

export function getRootStyles(style: ContainerProps.Style | undefined) {
  let properties = {};

  if (SYSTEM === 'core' && style?.root) {
    properties = {
      background: style.root?.background,
      borderColor: style.root?.borderColor,
      borderRadius: style.root?.borderRadius,
      borderWidth: style.root?.borderWidth,
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
      borderColor: style.footer?.borderColor,
      borderWidth: style.footer?.borderWidth,
      paddingBlock: style.footer?.paddingBlock,
      paddingInline: style.footer?.paddingInline,
    };
  }

  return properties;
}

export function getMediaStyles(style: ContainerProps.Style | undefined) {
  let properties = {};

  if (SYSTEM === 'core' && style?.root?.borderRadius) {
    properties = {
      borderRadius: style?.root?.borderRadius,
    };
  }

  return properties;
}
