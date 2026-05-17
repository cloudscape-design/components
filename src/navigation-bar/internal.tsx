// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';

import { getBaseProps } from '../internal/base-component';
import { InternalBaseComponentProps } from '../internal/hooks/use-base-component';
import { NavigationBarProps } from './interfaces';

import styles from './styles.css.js';

type InternalNavigationBarProps = NavigationBarProps & InternalBaseComponentProps;

export default function InternalNavigationBar({
  content,
  ariaLabel,
  __internalRootRef,
  ...restProps
}: InternalNavigationBarProps) {
  const baseProps = getBaseProps(restProps);

  return (
    <nav
      {...baseProps}
      ref={__internalRootRef}
      aria-label={ariaLabel}
      className={clsx(baseProps.className, styles.root)}
    >
      {content}
    </nav>
  );
}
