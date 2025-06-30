// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import customCssProps from '../internal/generated/custom-css-properties';
import { FlashbarProps } from './interfaces';

export function getCollapsibleFlashStyles(style: FlashbarProps.Style, type: string = 'info') {
  const background =
    style?.item?.root?.background &&
    (type === 'in-progress'
      ? style?.item?.root?.background.inProgress
      : style?.item?.root?.background[type as keyof typeof style.item.root.background]);

  const borderColor =
    style?.item?.root?.borderColor &&
    (type === 'in-progress'
      ? style?.item?.root?.borderColor.inProgress
      : style?.item?.root?.borderColor[type as keyof typeof style.item.root.borderColor]);

  const borderRadius = style?.item?.root?.borderRadius;

  const borderWidth = style?.item?.root?.borderWidth;

  const borderStyle = style?.item?.root?.borderWidth && 'solid';

  const color =
    style?.item?.root?.color &&
    (type === 'in-progress'
      ? style?.item?.root?.color.inProgress
      : style?.item?.root?.color[type as keyof typeof style.item.root.color]);

  return {
    background,
    borderColor,
    borderRadius,
    borderStyle,
    borderWidth,
    color,
  };
}

export function getFlashStyles(style: FlashbarProps.Style, type: string = 'info') {
  return {
    ...(style && getCollapsibleFlashStyles(style, type)),
    ...(style?.item?.root?.focusRing && {
      [customCssProps.styleFocusRingBorderColor]: style.item.root.focusRing?.borderColor,
      [customCssProps.styleFocusRingBorderRadius]: style.item.root.focusRing?.borderRadius,
      [customCssProps.styleFocusRingBorderWidth]: style.item.root.focusRing?.borderWidth,
    }),
    ...(style?.item?.root?.focusRing?.borderRadius && {
      [customCssProps.styleFocusRingBorderRadius]: style.item.root.focusRing.borderRadius,
    }),
  };
}

export function getNotificationBarStyles(style: FlashbarProps.Style) {
  return {
    borderRadius: style?.notificationBar?.root.borderRadius,
    borderWidth: style?.notificationBar?.root.borderWidth,
    ...(style?.notificationBar?.root?.background?.active && {
      [customCssProps.styleBackgroundActive]: style.notificationBar.root.background.active,
    }),
    ...(style?.notificationBar?.root?.background?.default && {
      [customCssProps.styleBackgroundDefault]: style.notificationBar.root.background.default,
    }),
    ...(style?.notificationBar?.root?.background?.hover && {
      [customCssProps.styleBackgroundHover]: style.notificationBar.root.background.hover,
    }),
    ...(style?.notificationBar?.root?.borderColor?.active && {
      [customCssProps.styleBorderColorActive]: style.notificationBar.root.borderColor.active,
    }),
    ...(style?.notificationBar?.root?.borderColor?.default && {
      [customCssProps.styleBorderColorDefault]: style.notificationBar.root.borderColor.default,
    }),
    ...(style?.notificationBar?.root?.borderColor?.hover && {
      [customCssProps.styleBorderColorHover]: style.notificationBar.root.borderColor.hover,
    }),
    ...(style?.notificationBar?.root?.color?.active && {
      [customCssProps.styleColorActive]: style.notificationBar.root.color.active,
    }),
    ...(style?.notificationBar?.root?.color?.default && {
      [customCssProps.styleColorDefault]: style.notificationBar.root.color.default,
    }),
    ...(style?.notificationBar?.root?.color?.hover && {
      [customCssProps.styleColorHover]: style.notificationBar.root.color.hover,
    }),
  };
}
