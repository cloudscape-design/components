// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';
import flattenChildren from 'react-keyed-flatten-children';
import { getBaseProps } from '../internal/base-component';
import { Breakpoint } from '../internal/breakpoints';
import { isDevelopment } from '../internal/is-development';
import { warnOnce } from '@cloudscape-design/component-toolkit/internal';
import styles from './styles.css.js';
import { GridProps } from './interfaces';
import { InternalBaseComponentProps } from '../internal/hooks/use-base-component';
import { useMergeRefs } from '../internal/hooks/use-merge-refs';

export interface InternalGridProps extends GridProps, InternalBaseComponentProps {
  /**
   * Does not mark this element as a named grid container. Use this when wrapping
   * this with another component and you want to use the parent container as the
   * query container.
   */
  __noQueryContainer?: boolean;
}

const InternalGrid = React.forwardRef(
  (
    {
      gridDefinition = [],
      disableGutters = false,
      children,
      __internalRootRef = null,
      __noQueryContainer = false,
      ...restProps
    }: InternalGridProps,
    ref: React.Ref<HTMLDivElement>
  ) => {
    const baseProps = getBaseProps(restProps);
    /*
   Flattening the children allows us to "see through" React Fragments and nested arrays.
   */
    const flattenedChildren = flattenChildren(children);

    if (isDevelopment) {
      const columnCount = gridDefinition.length;
      const childCount = flattenedChildren.length;
      if (columnCount !== childCount) {
        warnOnce(
          'Grid',
          `The number of children (${childCount}) does not match the number of columns defined (${columnCount}).`
        );
      }
    }

    const mergedRef = useMergeRefs(ref, __internalRootRef);

    return (
      <div
        {...baseProps}
        className={clsx(styles.grid, baseProps.className, {
          [styles['no-gutters']]: disableGutters,
          [styles['query-container']]: !__noQueryContainer,
        })}
        ref={mergedRef}
      >
        {flattenedChildren.map((child, i) => {
          // If this react child is a primitive value, the key will be undefined
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const key = (child as Record<'key', unknown>).key;

          return (
            <div
              key={key ? String(key) : undefined}
              className={clsx(
                styles['grid-column'],
                getColumnClassNames('colspan', gridDefinition[i]?.colspan),
                getColumnClassNames('offset', gridDefinition[i]?.offset),
                getColumnClassNames('pull', gridDefinition[i]?.pull),
                getColumnClassNames('push', gridDefinition[i]?.push)
              )}
            >
              <div className={styles['restore-pointer-events']}>{child}</div>
            </div>
          );
        })}
      </div>
    );
  }
);

function getColumnClassNames(
  prop: string,
  mapping: undefined | number | GridProps.BreakpointMapping
): string | string[] | null {
  if (typeof mapping === 'number') {
    return styles[`${prop}-default-${mapping}`];
  }
  if (mapping === undefined) {
    return null;
  }
  return Object.keys(mapping).map(breakpoint => styles[`${prop}-${breakpoint}-${mapping[breakpoint as Breakpoint]}`]);
}

export default InternalGrid;
