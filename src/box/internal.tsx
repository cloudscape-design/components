// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';

import { getBaseProps } from '../internal/base-component';
import { InternalBaseComponentProps } from '../internal/hooks/use-base-component';
import WithNativeAttributes from '../internal/utils/with-native-attributes';
import { BoxProps } from './interfaces';

import styles from './styles.css.js';

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
  nativeAttributes,
  __internalRootRef,
  ...props
}: InternalBoxProps) {
  const baseProps = getBaseProps(props);
  const marginsClassNamesSuffices = getClassNamesSuffixes(margin);
  const paddingsClassNamesSuffices = getClassNamesSuffixes(padding);

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
    styles[`t-${textAlign}`]
  );

  // allow auto-focusing of h1 boxes from flashbar
  const tabindex = variant === 'h1' ? -1 : undefined;

  return (
    <WithNativeAttributes
      {...baseProps}
      tag={getTag(variant, tagOverride)}
      componentName="Box"
      tabIndex={tabindex}
      nativeAttributes={nativeAttributes}
      className={className}
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

const getTag = (variant: BoxProps.Variant, tagOverride: BoxProps['tagOverride']) => {
  if (tagOverride) {
    return tagOverride;
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
