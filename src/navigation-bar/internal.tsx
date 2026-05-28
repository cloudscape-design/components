// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';

import { getBaseProps } from '../internal/base-component';
import { getVisualContextClassname } from '../internal/components/visual-context';
import { InternalBaseComponentProps } from '../internal/hooks/use-base-component';
import { SomeRequired } from '../internal/types';
import { NavigationBarProps } from './interfaces';

import '../visual-contexts/navigation-bar.scoped.css';
import styles from './styles.css.js';
import testStyles from './test-classes/styles.css.js';

type InternalNavigationBarProps = SomeRequired<NavigationBarProps, 'variant' | 'placement' | 'role'> &
  InternalBaseComponentProps;

const ROLE_ELEMENT_MAP = {
  navigation: 'nav',
  banner: 'header',
  region: 'section',
} as const;

export default function InternalNavigationBar({
  variant,
  placement,
  role,
  content,
  ariaLabel,
  ariaLabelledBy,
  i18nStrings,
  __internalRootRef,
  ...restProps
}: InternalNavigationBarProps) {
  const baseProps = getBaseProps(restProps);
  const resolvedAriaLabel = i18nStrings?.ariaLabel ?? ariaLabel;
  const appliesVisualContext = variant === 'primary-accent';
  const Element = ROLE_ELEMENT_MAP[role];

  return (
    <Element
      {...baseProps}
      ref={__internalRootRef}
      role={role === 'region' ? 'region' : undefined}
      aria-label={resolvedAriaLabel}
      aria-labelledby={!resolvedAriaLabel ? ariaLabelledBy : undefined}
      className={clsx(
        baseProps.className,
        styles.root,
        styles[`variant-${variant}`],
        styles[`placement-${placement}`],
        testStyles.root,
        appliesVisualContext && getVisualContextClassname('navigation-bar')
      )}
    >
      {content && <div className={clsx(styles.content, testStyles.content)}>{content}</div>}
    </Element>
  );
}
