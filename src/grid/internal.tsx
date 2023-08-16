// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { Key } from 'react';
import clsx, { ClassValue } from 'clsx';
import flattenChildren from 'react-keyed-flatten-children';
import { getBaseProps } from '../internal/base-component';
import { Breakpoint, matchBreakpointMapping } from '../internal/breakpoints';
import { isDevelopment } from '../internal/is-development';
import { warnOnce } from '@cloudscape-design/component-toolkit/internal';
import styles from './styles.css.js';
import { GridProps } from './interfaces';
import { useContainerBreakpoints } from '../internal/hooks/container-queries';
import { InternalBaseComponentProps } from '../internal/hooks/use-base-component';
import { useMergeRefs } from '../internal/hooks/use-merge-refs';

export interface InternalGridProps extends GridProps, InternalBaseComponentProps {
  __breakpoint?: Breakpoint | null;

  /**
   * The handler that fires when the grid breakpoint changes.
   */
  __responsiveClassName?: (breakpoint: Breakpoint | null) => ClassValue;
}

const InternalGrid = React.forwardRef(
  (
    {
      __breakpoint,
      gridDefinition = [],
      disableGutters = false,
      children,
      __responsiveClassName,
      __internalRootRef = null,
      ...restProps
    }: InternalGridProps,
    ref: React.Ref<any>
  ) => {
    let [defaultBreakpoint, defaultRef]: [Breakpoint | null, React.Ref<any>] = useContainerBreakpoints(undefined);
    if (__breakpoint !== undefined) {
      defaultBreakpoint = __breakpoint;
      defaultRef = ref;
    }

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

    const mergedRef = useMergeRefs(defaultRef, __internalRootRef);

    return (
      <div
        {...baseProps}
        className={clsx(
          styles.grid,
          baseProps.className,
          { [styles['no-gutters']]: disableGutters },
          __responsiveClassName ? __responsiveClassName(defaultBreakpoint) : null
        )}
        ref={mergedRef}
      >
        {flattenedChildren.map((child, i) => {
          // If this react child is a primitive value, the key will be undefined
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const key = (child as Record<'key', Key>).key;

          return (
            <div
              key={key}
              className={clsx(
                styles['grid-column'],
                getColumnClassNames('colspan', gridDefinition[i]?.colspan, defaultBreakpoint),
                getColumnClassNames('offset', gridDefinition[i]?.offset, defaultBreakpoint),
                getColumnClassNames('pull', gridDefinition[i]?.pull, defaultBreakpoint),
                getColumnClassNames('push', gridDefinition[i]?.push, defaultBreakpoint)
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
  mapping: undefined | number | GridProps.BreakpointMapping,
  breakpoint: Breakpoint | null
): string | null {
  if (typeof mapping === 'number') {
    return styles[`${prop}-${mapping}`];
  }
  if (breakpoint === null || mapping === undefined) {
    return null;
  }
  return styles[`${prop}-${matchBreakpointMapping(mapping, breakpoint)}`];
}

export default InternalGrid;
