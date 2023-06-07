// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { isValidElement } from 'react';
import { SplitButtonProps } from './interfaces';
import styles from './styles.css.js';
import { InternalBaseComponentProps } from '../internal/hooks/use-base-component';
import { getBaseProps } from '../internal/base-component';
import clsx from 'clsx';
import flattenChildren from 'react-keyed-flatten-children';

// eslint-disable-next-line @cloudscape-design/ban-files
import Button from '../button';
// eslint-disable-next-line @cloudscape-design/ban-files
import ButtonDropdown from '../button-dropdown';
import { warnOnce } from '../internal/logging';

interface InternalSplitButtonProps extends SplitButtonProps, InternalBaseComponentProps {}

export default function InternalSplitButton({ children, __internalRootRef, ...props }: InternalSplitButtonProps) {
  const baseProps = getBaseProps(props);

  const flattenedChildren = flattenChildren(children);
  const variants = new Set<string>();

  if (flattenedChildren.length < 2) {
    warnOnce('SplitButton', 'The component requires at least 2 children.');
  }

  return (
    <div ref={__internalRootRef} {...baseProps} className={clsx(baseProps.className, styles.root)}>
      {flattenedChildren.map(child => {
        if (!isValidElement(child) || (child.type !== Button && child.type !== ButtonDropdown)) {
          warnOnce('SplitButton', 'Only Button and ButtonDropdown are allowed as component children.');
          return null;
        }

        variants.add(getVariant(child));
        if (variants.size > 1) {
          warnOnce('SplitButton', 'All children must be of the same variant.');
          return null;
        }

        return (
          <div key={child.key} className={styles.item}>
            {child}
          </div>
        );
      })}
    </div>
  );
}

function getVariant(element: React.ReactElement) {
  if (!element.props || typeof element.props !== 'object') {
    throw new Error('Invariant violation: missing element props.');
  }
  return 'variant' in element.props && typeof element.props.variant === 'string' ? element.props.variant : 'normal';
}
