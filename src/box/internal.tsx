// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { getBaseProps } from '../internal/base-component';
import clsx from 'clsx';
import styles from './styles.css.js';
import { BoxProps } from './interfaces';
import { InternalBaseComponentProps } from '../internal/hooks/use-base-component';
import { useVisualRefresh } from '../internal/hooks/use-visual-mode';

type InternalBoxProps = BoxProps & InternalBaseComponentProps;

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
  children,
  __internalRootRef = null,
  ...props
}: InternalBoxProps) {
  const baseProps = getBaseProps(props);
  const marginsClassNamesSuffices = getClassNamesSuffixes(margin);
  const paddingsClassNamesSuffices = getClassNamesSuffixes(padding);
  // This can be any arbitrary string if passed into tagOverride.
  // We appease the compiler with an incorrect type.
  const Tag = getTag(variant, tagOverride) as 'div';
  const isRefresh = useVisualRefresh();
  const className = clsx(
    baseProps.className,
    styles.root,
    styles.box,
    styles[`${variant.replace(/^awsui-/, '')}-variant`],
    marginsClassNamesSuffices.map(suffix => styles[`m-${suffix}`]),
    paddingsClassNamesSuffices.map(suffix => styles[`p-${suffix}`]),
    styles[`d-${display}`],
    styles[`f-${float}`],
    styles[`color-${color || 'default'}`],
    styles[`font-size-${fontSize || 'default'}`],
    styles[`font-weight-${fontWeight || 'default'}`],
    styles[`t-${textAlign}`],
    isRefresh && styles.resfresh
  );

  return (
    <Tag {...baseProps} className={className} ref={__internalRootRef}>
      {children}
    </Tag>
  );
}

const getClassNamesSuffixes = (value: BoxProps.SpacingSize | BoxProps.Spacing) => {
  if (typeof value === 'string') {
    return [value];
  }
  const sides = ['top', 'right', 'bottom', 'left', 'horizontal', 'vertical'] as const;
  return sides.filter(side => !!value[side]).map(side => `${side}-${value[side]}`);
};

const getTag = (variant: BoxProps.Variant, tagOverride: BoxProps['tagOverride']) => {
  if (tagOverride) {
    return tagOverride;
  }

  if (variant === 'awsui-value-large') {
    return 'span';
  }

  if (variant === 'awsui-key-label') {
    return 'div';
  }

  return variant;
};
