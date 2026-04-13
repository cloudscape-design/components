// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';

import { useMergeRefs, warnOnce } from '@cloudscape-design/component-toolkit/internal';

import { getBaseProps } from '../internal/base-component';
import { getVisualContextClassname } from '../internal/components/visual-context';
import { useContainerBreakpoints } from '../internal/hooks/container-queries';
import { InternalBaseComponentProps } from '../internal/hooks/use-base-component';
import { isDevelopment } from '../internal/is-development';
import { SomeRequired } from '../internal/types';
import { NavigationBarProps } from './interfaces';

import styles from './styles.css.js';
import testStyles from './test-classes/styles.css.js';

type InternalNavigationBarProps = SomeRequired<NavigationBarProps, 'variant' | 'placement' | 'sticky'> &
  InternalBaseComponentProps;

export default function InternalNavigationBar({
  variant,
  placement,
  sticky,
  startContent,
  centerContent,
  endContent,
  ariaLabel,
  i18nStrings,
  __internalRootRef,
  ...restProps
}: InternalNavigationBarProps) {
  const baseProps = getBaseProps(restProps);
  const isHorizontal = placement === 'block-start' || placement === 'block-end';
  const resolvedAriaLabel = i18nStrings?.ariaLabel ?? ariaLabel;
  const [breakpoint, breakpointRef] = useContainerBreakpoints(['xxs', 's']);
  const mergedRef = useMergeRefs(__internalRootRef, breakpointRef);

  if (isDevelopment) {
    if (centerContent && !isHorizontal) {
      warnOnce('NavigationBar', '`centerContent` is only rendered in horizontal placements. It will be ignored.');
    }
  }

  return (
    <nav
      {...baseProps}
      ref={mergedRef}
      aria-label={resolvedAriaLabel}
      className={clsx(
        baseProps.className,
        styles.root,
        styles[`variant-${variant}`],
        styles[`placement-${placement}`],
        testStyles.root,
        variant === 'primary' && getVisualContextClassname('top-navigation'),
        variant === 'secondary' && getVisualContextClassname('app-layout-toolbar'),
        breakpoint === 'default' && styles['breakpoint-narrow'],
        breakpoint === 'xxs' && styles['breakpoint-medium'],
        sticky && styles.sticky
      )}
    >
      {startContent && <div className={clsx(styles.start, testStyles.start)}>{startContent}</div>}
      {isHorizontal && centerContent && <div className={clsx(styles.center, testStyles.center)}>{centerContent}</div>}
      {endContent && <div className={clsx(styles.end, testStyles.end)}>{endContent}</div>}
    </nav>
  );
}
