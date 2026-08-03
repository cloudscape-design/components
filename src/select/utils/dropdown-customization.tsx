// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

interface ComposeDropdownContentProps {
  // The filter node (already includes any custom filtering actions, composed by the Filter component).
  filter: React.ReactNode;
  customDropdownHeader: React.ReactNode;
  customDropdownFooter: React.ReactNode;
  statusFooter: React.ReactNode;
  styles: Record<string, string>;
}

/**
 * Builds the dropdown `header` and `footer` nodes shared by Select and Multiselect. When no custom header or
 * custom footer is provided, the header is just the filter and the footer is the built-in sticky status, so the
 * output is identical to the component's original behavior.
 */
export function composeDropdownContent({
  filter,
  customDropdownHeader,
  customDropdownFooter,
  statusFooter,
  styles,
}: ComposeDropdownContentProps): { header: React.ReactNode; footer: React.ReactNode } {
  // A render prop that is not provided yields undefined; one that opts out can return null. Normalize both
  // to null so presence checks below use strict equality.
  const headerNode = customDropdownHeader ?? null;
  const footerNode = customDropdownFooter ?? null;

  // Custom header renders at the top of the dropdown, above the filter (and options list).
  const header =
    headerNode !== null ? (
      <>
        <div className={styles['dropdown-header']}>{headerNode}</div>
        {filter}
      </>
    ) : (
      filter
    );

  // Only wrap the footer in a fragment when a custom footer is present; otherwise keep the original sticky-status node.
  const footer =
    footerNode !== null ? (
      <>
        {statusFooter}
        <div className={styles['dropdown-footer']}>{footerNode}</div>
      </>
    ) : (
      statusFooter
    );

  return { header, footer };
}
