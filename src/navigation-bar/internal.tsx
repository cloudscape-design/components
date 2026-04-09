// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';

import { getBaseProps } from '../internal/base-component';
import { getVisualContextClassname } from '../internal/components/visual-context';
import { InternalBaseComponentProps } from '../internal/hooks/use-base-component';
import { SomeRequired } from '../internal/types';
import { NavigationBarProps } from './interfaces';

import styles from './styles.css.js';
import testStyles from './test-classes/styles.css.js';

type InternalNavigationBarProps = SomeRequired<NavigationBarProps, 'variant' | 'placement'> &
  InternalBaseComponentProps;

const InternalNavigationBar = React.forwardRef<NavigationBarProps.Ref, InternalNavigationBarProps>(
  ({ variant, placement, disableBorder, children, ariaLabel, ariaLabelledby, __internalRootRef, ...props }, ref) => {
    const baseProps = getBaseProps(props);
    const rootRef = React.useRef<HTMLElement>(null);

    React.useImperativeHandle(ref, () => ({ focus: () => rootRef.current?.focus() }), []);

    const mergedRef = (node: HTMLElement | null) => {
      (rootRef as React.MutableRefObject<HTMLElement | null>).current = node;
      if (__internalRootRef) {
        (__internalRootRef as React.MutableRefObject<HTMLElement | null>).current = node;
      }
    };

    const isNav = variant === 'primary';
    const Tag = isNav ? 'nav' : 'div';

    return (
      <Tag
        {...baseProps}
        ref={mergedRef as React.Ref<HTMLElement & HTMLDivElement>}
        className={clsx(
          baseProps.className,
          styles.root,
          testStyles.root,
          styles[`variant-${variant}`],
          styles[`placement-${placement}`],
          !disableBorder && styles['with-border'],
          isNav && getVisualContextClassname('top-navigation')
        )}
        role={isNav ? undefined : 'toolbar'}
        aria-orientation={placement === 'vertical' ? 'vertical' : undefined}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledby}
      >
        {children}
      </Tag>
    );
  }
);

export default InternalNavigationBar;
