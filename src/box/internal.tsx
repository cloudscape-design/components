// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';

import { getBaseProps } from '../internal/base-component';
import customCssProps from '../internal/generated/custom-css-properties';
import { InternalBaseComponentProps } from '../internal/hooks/use-base-component';
import WithNativeAttributes from '../internal/utils/with-native-attributes';
import { BoxProps } from './interfaces';

import styles from './styles.css.js';

type InternalBoxProps = BoxProps & InternalBaseComponentProps;

// Curated t-shirt size keywords mirror the Box spacing scale and are applied via CSS classes so
// they resolve to the corresponding space tokens. Any other value is treated as a raw CSS
// `border-radius` string and applied through a custom property.
const RADIUS_KEYWORDS: ReadonlyArray<string> = ['n', 'xxxs', 'xxs', 'xs', 's', 'm', 'l', 'xl', 'xxl', 'xxxl'];

export default function InternalBox({
  variant = 'div',
  tagOverride,
  margin = {},
  padding = {},
  display,
  textAlign,
  float,
  fontSize,
  fontWeight,
  color,
  visualAccent,
  children,
  nativeAttributes,
  __internalRootRef,
  ...props
}: InternalBoxProps) {
  const baseProps = getBaseProps(props);
  const marginsClassNamesSuffices = getClassNamesSuffixes(margin);
  const paddingsClassNamesSuffices = getClassNamesSuffixes(padding);

  const accentAspectRatio = visualAccent?.aspectRatio ?? 'auto';
  const accentBorderRadius = visualAccent?.borderRadius;
  const isRadiusKeyword = accentBorderRadius !== undefined && RADIUS_KEYWORDS.includes(accentBorderRadius);
  // Arbitrary (non-keyword) values are applied through a custom CSS property, which the base
  // `.visual-accent` rule reads. This keeps custom rounding CSP-safe. Keyword values are handled
  // by dedicated classes that map to the spacing tokens.
  const accentStyle =
    accentBorderRadius !== undefined && !isRadiusKeyword
      ? { [customCssProps.boxVisualAccentBorderRadius]: accentBorderRadius }
      : undefined;

  const className = clsx(
    baseProps.className,
    styles.root,
    styles.box,
    styles[`${variant.replace(/^awsui-/, '')}-variant`],
    visualAccent && styles['visual-accent'],
    visualAccent && styles[`visual-accent-${visualAccent.color}`],
    visualAccent && styles[`visual-accent-aspect-${accentAspectRatio}`],
    visualAccent && isRadiusKeyword && styles[`visual-accent-radius-${accentBorderRadius}`],
    marginsClassNamesSuffices.map(suffix => styles[`m-${suffix}`]),
    paddingsClassNamesSuffices.map(suffix => styles[`p-${suffix}`]),
    styles[`d-${display}`],
    styles[`f-${float}`],
    styles[`color-${color || 'default'}`],
    styles[`font-size-${fontSize || 'default'}`],
    styles[`font-weight-${fontWeight || 'default'}`],
    styles[`t-${textAlign}`]
  );

  // allow auto-focusing of h1 boxes from flashbar
  const tabindex = variant === 'h1' ? -1 : undefined;

  return (
    <WithNativeAttributes
      {...baseProps}
      tag={getTag(variant, tagOverride, !!visualAccent)}
      componentName="Box"
      tabIndex={tabindex}
      nativeAttributes={nativeAttributes}
      className={className}
      style={accentStyle}
      ref={__internalRootRef}
    >
      {children}
    </WithNativeAttributes>
  );
}

const getClassNamesSuffixes = (value: BoxProps.SpacingSize | BoxProps.Spacing) => {
  if (typeof value === 'string') {
    return [value];
  }
  const sides = ['top', 'right', 'bottom', 'left', 'horizontal', 'vertical'] as const;
  return sides.filter(side => !!value[side]).map(side => `${side}-${value[side]}`);
};

const getTag = (variant: BoxProps.Variant, tagOverride: BoxProps['tagOverride'], hasVisualAccent: boolean) => {
  if (tagOverride) {
    return tagOverride;
  }

  if (hasVisualAccent) {
    return 'span';
  }

  if (variant === 'awsui-value-large') {
    return 'span';
  }

  if (variant === 'awsui-key-label' || variant === 'awsui-gen-ai-label') {
    return 'div';
  }

  if (variant === 'awsui-inline-code') {
    return 'code';
  }

  return variant;
};
