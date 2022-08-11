// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx, { ClassValue } from 'clsx';
import flattenChildren from 'react-keyed-flatten-children';
import { getBaseProps } from '../internal/base-component';
import { Breakpoint, matchBreakpointMapping } from '../internal/breakpoints';
import { isDevelopment } from '../internal/is-development';
import * as logging from '../internal/logging';
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
    let [defaultBreakpoint, defaultRef]: [Breakpoint | null, React.Ref<any>] = useContainerBreakpoints();
    if (__breakpoint !== undefined) {
      defaultBreakpoint = __breakpoint;
      defaultRef = ref;
    }

    const baseProps = getBaseProps(restProps);

    // Flattening the children allows us to "see through" React Fragments and nested arrays.
    const flattenedChildren = flattenChildren(children);

    if (isDevelopment) {
      const columnCount = gridDefinition.length;
      const childCount = flattenedChildren.length;
      if (columnCount !== childCount) {
        logging.warnOnce(
          'Grid',
          `The number of children (${childCount}) does not match the number of columns defined (${columnCount}).`
        );
      }
    }

    const mergedRef = useMergeRefs(defaultRef, __internalRootRef);

    return (
      <div
        {...baseProps}
        ref={mergedRef}
        className={clsx(
          styles.grid,
          baseProps.className,
          !!disableGutters && styles['no-gutters'],
          __responsiveClassName ? __responsiveClassName(defaultBreakpoint) : null
        )}
      >
        {flattenedChildren.map((child, i) => {
          const key = typeof child !== 'string' && typeof child !== 'number' ? child.key : undefined;
          const colspan = getColumnsFromDefinition(gridDefinition[i]?.colspan, defaultBreakpoint) ?? 0;
          const offset = getColumnsFromDefinition(gridDefinition[i]?.offset, defaultBreakpoint) ?? 0;

          return (
            <div
              key={key}
              className={clsx(
                styles['grid-column'],
                styles[`colspan-${colspan + offset}`],
                getColumnClassNames('offset', gridDefinition[i]?.offset, defaultBreakpoint),
                getColumnClassNames('pull', gridDefinition[i]?.pull, defaultBreakpoint),
                getColumnClassNames('push', gridDefinition[i]?.push, defaultBreakpoint)
              )}
            >
              {child}
            </div>
          );
        })}
      </div>
    );
  }
);

function getColumnsFromDefinition(
  mapping: undefined | number | GridProps.BreakpointMapping,
  breakpoint: Breakpoint | null
): number | null {
  if (typeof mapping === 'number') {
    return mapping;
  }
  if (breakpoint === null || mapping === undefined) {
    return null;
  }
  return matchBreakpointMapping(mapping, breakpoint);
}

function getColumnClassNames(
  prop: string,
  mapping: undefined | number | GridProps.BreakpointMapping,
  breakpoint: Breakpoint | null
): string | null {
  const columns = getColumnsFromDefinition(mapping, breakpoint);
  if (columns === null) {
    return null;
  }
  return styles[`${prop}-${columns}`];
}

export default InternalGrid;
