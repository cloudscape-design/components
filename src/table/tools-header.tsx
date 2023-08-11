// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import clsx from 'clsx';
import React, { useContext } from 'react';
import { useContainerBreakpoints } from '../internal/hooks/container-queries';
import styles from './styles.css.js';
import { CollectionLabelContext } from '../internal/context/collection-label-context';
import { useUniqueId } from '../internal/hooks/use-unique-id';

interface ToolsHeaderProps {
  header: React.ReactNode;
  filter?: React.ReactNode;
  pagination?: React.ReactNode;
  preferences?: React.ReactNode;
}

export default function ToolsHeader({ header, filter, pagination, preferences }: ToolsHeaderProps) {
  const [breakpoint, ref] = useContainerBreakpoints(['xs']);
  const isHeaderString = typeof header === 'string';
  const assignHeaderId = useContext(CollectionLabelContext).assignId;
  const headingId = useUniqueId('heading');
  if (assignHeaderId !== undefined && isHeaderString) {
    assignHeaderId(headingId);
  }
  const isSmall = breakpoint === 'default';
  const hasTools = filter || pagination || preferences;
  return (
    <>
      {isHeaderString ? <span id={headingId}>{header}</span> : header}
      {hasTools && (
        <div ref={ref} className={clsx(styles.tools, isSmall && styles['tools-small'])}>
          {filter && <div className={styles['tools-filtering']}>{filter}</div>}
          <div className={styles['tools-align-right']}>
            {pagination && <div className={styles['tools-pagination']}>{pagination}</div>}
            {preferences && <div className={styles['tools-preferences']}>{preferences}</div>}
          </div>
        </div>
      )}
    </>
  );
}
