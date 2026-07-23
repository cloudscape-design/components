// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';

import { useContainerQuery } from '@cloudscape-design/component-toolkit';

import InternalButton from '../../../button/internal';
import { MasterDetailLayoutProps, MasterDetailView } from './interfaces';

import styles from './styles.css.js';
import testClasses from './test-classes/styles.css.js';

export { MasterDetailLayoutProps };

/**
 * Default container width (px) below which the layout collapses to a single column.
 */
export const DEFAULT_NARROW_BREAKPOINT = 688;

/**
 * Pure helper deciding which panes are visible for a given state. Extracted from
 * the component so the responsive branching can be unit tested without a DOM
 * layout engine (jsdom does not measure element widths).
 *
 * - Wide layout: master and detail render side by side.
 * - Narrow layout: a single pane renders. The detail pane is shown when an item
 *   is selected, otherwise the master (list) pane is shown. When a selection can
 *   be cleared, a "back to list" control is offered in the detail pane.
 */
export function resolveMasterDetailView({
  isNarrow,
  hasSelection,
  canClearSelection,
}: {
  isNarrow: boolean;
  hasSelection: boolean;
  canClearSelection: boolean;
}): MasterDetailView {
  if (!isNarrow) {
    return { showMaster: true, showDetail: true, showBackButton: false };
  }
  if (hasSelection) {
    return { showMaster: false, showDetail: true, showBackButton: canClearSelection };
  }
  return { showMaster: true, showDetail: false, showBackButton: false };
}

/**
 * MasterDetailLayout — an experimental, internal layout helper that composes the
 * Master/Detail pattern (a list/master pane alongside a detail pane for the
 * selected item) on top of existing Cloudscape layout primitives.
 *
 * This is a first-cut (v0) building block: it owns the two-column layout and the
 * responsive collapse to a single column, while remaining agnostic about the
 * concrete master (Table, Cards, ...) and detail content, which are provided by
 * the consumer. It is intentionally additive and not part of the public API.
 */
export default function MasterDetailLayout({
  master,
  detail,
  hasSelection,
  detailPlaceholder,
  onClearSelection,
  masterAriaLabel,
  detailAriaLabel,
  backLabel = 'Back',
  narrowBreakpoint = DEFAULT_NARROW_BREAKPOINT,
}: MasterDetailLayoutProps) {
  // Only collapse once we have a positive measurement below the breakpoint. A
  // 0-width (unmeasured / SSR / degenerate) container keeps the wide layout,
  // which avoids a flash-of-narrow before the first measurement is available.
  const [isNarrow, ref] = useContainerQuery(
    entry => entry.contentBoxWidth > 0 && entry.contentBoxWidth < narrowBreakpoint,
    [narrowBreakpoint]
  );

  const { showMaster, showDetail, showBackButton } = resolveMasterDetailView({
    isNarrow: isNarrow ?? false,
    hasSelection,
    canClearSelection: !!onClearSelection,
  });

  return (
    <div ref={ref} className={clsx(styles.root, testClasses.root, isNarrow && styles.narrow)}>
      {showMaster && (
        <section className={clsx(styles.master, testClasses.master)} aria-label={masterAriaLabel}>
          {master}
        </section>
      )}
      {showDetail && (
        <section className={clsx(styles.detail, testClasses.detail)} aria-label={detailAriaLabel}>
          {showBackButton && (
            <div className={clsx(styles['back-button'], testClasses['back-button'])}>
              <InternalButton variant="link" iconName="angle-left" onClick={() => onClearSelection?.()}>
                {backLabel}
              </InternalButton>
            </div>
          )}
          {hasSelection ? detail : detailPlaceholder}
        </section>
      )}
    </div>
  );
}
