// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { SYSTEM } from '../internal/environment';
import customCssProps from '../internal/generated/custom-css-properties';
import { FlashbarProps } from './interfaces';
import { getStylePropertyKey } from './utils';

export function getCollapsibleFlashStyles(style: FlashbarProps['style'], type: string = 'info') {
  if (SYSTEM !== 'core' || !style) {
    return undefined;
  }
  const background =
    style?.item?.root?.background &&
    style?.item?.root?.background[
      getStylePropertyKey(type as FlashbarProps.Type) as keyof typeof style.item.root.background
    ];

  const borderColor =
    style?.item?.root?.borderColor &&
    style?.item?.root?.borderColor[
      getStylePropertyKey(type as FlashbarProps.Type) as keyof typeof style.item.root.borderColor
    ];

  const borderRadius = style?.item?.root?.borderRadius;

  const borderWidth = style?.item?.root?.borderWidth;

  const borderStyle = style?.item?.root?.borderWidth && 'solid';

  const color =
    style?.item?.root?.color &&
    style?.item?.root?.color[getStylePropertyKey(type as FlashbarProps.Type) as keyof typeof style.item.root.color];

  return {
    background,
    borderColor,
    borderRadius,
    borderStyle,
    borderWidth,
    color,
  };
}

export function getFlashStyles(style: FlashbarProps['style'] | undefined, type: string = 'info') {
  if (SYSTEM !== 'core' || !style) {
    return undefined;
  }
  const focusRingBorderColor =
    style?.item?.root?.focusRing?.borderColor &&
    style.item.root.focusRing.borderColor[
      getStylePropertyKey(type as FlashbarProps.Type) as keyof typeof style.item.root.focusRing.borderColor
    ];

  return {
    ...getCollapsibleFlashStyles(style, type),
    ...(style?.item?.root?.focusRing && {
      [customCssProps.styleFocusRingBorderColor]: focusRingBorderColor,
      [customCssProps.styleFocusRingBorderRadius]: style.item.root.focusRing?.borderRadius,
      [customCssProps.styleFocusRingBorderWidth]: style.item.root.focusRing?.borderWidth,
    }),
    ...(style?.item?.root?.focusRing?.borderRadius && {
      [customCssProps.styleFocusRingBorderRadius]: style.item.root.focusRing.borderRadius,
    }),
  };
}

export function getDismissButtonStyles(style: FlashbarProps['style'], type: string = 'info') {
  if (SYSTEM !== 'core' || !style) {
    return undefined;
  }
  const activeColor =
    style?.item?.dismissButton?.color?.active &&
    style.item.dismissButton.color.active[
      getStylePropertyKey(type as FlashbarProps.Type) as keyof typeof style.item.dismissButton.color.active
    ];

  const defaultColor =
    style?.item?.dismissButton?.color?.default &&
    style.item.dismissButton.color.default[
      getStylePropertyKey(type as FlashbarProps.Type) as keyof typeof style.item.dismissButton.color.default
    ];

  const hoverColor =
    style?.item?.dismissButton?.color?.hover &&
    style.item.dismissButton.color.hover[
      getStylePropertyKey(type as FlashbarProps.Type) as keyof typeof style.item.dismissButton.color.hover
    ];

  const focusRingBorderColor =
    style?.item?.dismissButton?.focusRing?.borderColor &&
    style.item.dismissButton.focusRing.borderColor[
      getStylePropertyKey(type as FlashbarProps.Type) as keyof typeof style.item.dismissButton.focusRing.borderColor
    ];

  return {
    root: {
      color: {
        active: activeColor,
        default: defaultColor,
        hover: hoverColor,
      },
      focusRing: {
        borderColor: focusRingBorderColor,
        borderRadius: style?.item?.dismissButton?.focusRing?.borderRadius,
        borderWidth: style?.item?.dismissButton?.focusRing?.borderWidth,
      },
    },
  };
}

export function getNotificationBarStyles(style: FlashbarProps['style']) {
  if (SYSTEM !== 'core' || !style) {
    return undefined;
  }
  return {
    borderRadius: style?.notificationBar?.root?.borderRadius,
    borderWidth: style?.notificationBar?.root?.borderWidth,
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
    ...(style?.notificationBar?.expandButton?.focusRing && {
      [customCssProps.styleFocusRingBorderColor]: style?.notificationBar?.expandButton?.focusRing?.borderColor,
      [customCssProps.styleFocusRingBorderRadius]: style?.notificationBar?.expandButton?.focusRing?.borderRadius,
      [customCssProps.styleFocusRingBorderWidth]: style?.notificationBar?.expandButton?.focusRing?.borderWidth,
    }),
    ...(style?.notificationBar?.expandButton?.focusRing?.borderRadius && {
      [customCssProps.styleFocusRingBorderRadius]: style.notificationBar.expandButton.focusRing.borderRadius,
    }),
  };
}
