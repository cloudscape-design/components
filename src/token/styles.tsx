// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { SYSTEM } from '../internal/environment';
import customCssProps from '../internal/generated/custom-css-properties';
import { TokenProps } from './interfaces';

export function getTokenStyles(style: TokenProps['style']) {
  if (SYSTEM !== 'core') {
    return undefined;
  }

  return {
    borderRadius: style?.root?.borderRadius,
    borderWidth: style?.root?.borderWidth,
    fontSize: style?.root?.fontSize,
    fontWeight: style?.root?.fontWeight,
    paddingBlock: style?.root?.paddingBlock,
    paddingInline: style?.root?.paddingInline,
    [customCssProps.styleBackgroundDefault]: style?.root?.backgroundColor?.default,
    [customCssProps.styleBackgroundDisabled]: style?.root?.backgroundColor?.disabled,
    [customCssProps.styleBackgroundReadonly]: style?.root?.backgroundColor?.readonly,
    [customCssProps.styleBorderColorDefault]: style?.root?.borderColor?.default,
    [customCssProps.styleBorderColorDisabled]: style?.root?.borderColor?.disabled,
    [customCssProps.styleBorderColorReadonly]: style?.root?.borderColor?.readonly,
    [customCssProps.styleColorDefault]: style?.root?.color?.default,
    [customCssProps.styleColorDisabled]: style?.root?.color?.disabled,
    [customCssProps.styleTokenDismissButtonColorDefault]: style?.dismissButton?.color?.default,
    [customCssProps.styleTokenDismissButtonColorHover]: style?.dismissButton?.color?.hover,
    [customCssProps.styleTokenDismissButtonColorDisabled]: style?.dismissButton?.color?.disabled,
  };
}
