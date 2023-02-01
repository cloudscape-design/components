// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import clsx from 'clsx';
import React from 'react';
import { useContainerBreakpoints } from '../internal/hooks/container-queries';
import { useContainerQuery } from '../internal/hooks/container-queries';
import { useMergeRefs } from '../internal/hooks/use-merge-refs';
import styles from './styles.css.js';
import { mobileBreakpoint } from '../internal/breakpoints';

interface ToolsHeaderProps {
  header: React.ReactNode;
  filter?: React.ReactNode;
  pagination?: React.ReactNode;
  preferences?: React.ReactNode;
}

export default function ToolsHeader({ header, filter, pagination, preferences }: ToolsHeaderProps) {
  const [overlap, setOverlap] = React.useState(false);
  const [breakpoint, ref] = useContainerBreakpoints(['xs']);
  const [toolsWidth, toolsRef] = useContainerQuery(rect => rect.width);
  const [paginationAndPreferencesWidth, paginationAndPreferencesRef] = useContainerQuery(rect => rect.width);
  const mergedRef = useMergeRefs(ref, toolsRef);
  const isSmall = breakpoint === 'default';
  const hasTools = filter || pagination || preferences;
  const FILTER_WIDTH = toolsWidth && paginationAndPreferencesWidth && toolsWidth - paginationAndPreferencesWidth;

  // This value is from the search field on the Property Filter.
  // It is the xs breakpoint, minus the table tools container padding.
  const OVERLAP_WIDTH = mobileBreakpoint - 2 * 20;

  React.useEffect(() => {
    if (FILTER_WIDTH && FILTER_WIDTH < OVERLAP_WIDTH) {
      setOverlap(true);
      return;
    }
    setOverlap(false);
  }, [FILTER_WIDTH, OVERLAP_WIDTH]);

  function isPropertyFilter(children: any) {
    const reactChildren = (
      <>
        {React.Children.map(children, child => {
          return child.type.displayName === 'PropertyFilter';
        })}
      </>
    );
    return reactChildren?.props?.children?.includes(true);
  }

  function getFilterSlotMaxWidth() {
    if (isPropertyFilter(filter)) {
      return 'none';
    }
    if (isSmall) {
      return '100%';
    }

    return `${FILTER_WIDTH}px`;
  }

  return (
    <>
      {header}
      {hasTools && (
        <div ref={mergedRef} className={clsx(styles.tools, isSmall && styles['tools-small'])}>
          {filter && (
            <div style={{ maxWidth: getFilterSlotMaxWidth() }} className={styles['tools-filtering']}>
              {filter}
            </div>
          )}
          <div
            ref={paginationAndPreferencesRef}
            className={clsx(
              styles['tools-align-right'],
              ((isPropertyFilter(filter) && overlap) || isSmall) && styles['tools-align-right-wrap']
            )}
          >
            {pagination && <div className={styles['tools-pagination']}>{pagination}</div>}
            {preferences && <div className={styles['tools-preferences']}>{preferences}</div>}
          </div>
        </div>
      )}
    </>
  );
}
