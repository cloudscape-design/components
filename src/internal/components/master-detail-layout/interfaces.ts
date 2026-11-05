// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

export interface MasterDetailLayoutProps {
  /**
   * Master pane content — typically a Table or Cards collection acting as the
   * list of items the user can select from.
   */
  master: React.ReactNode;

  /**
   * Detail pane content for the currently selected item. Only shown when
   * `hasSelection` is `true`; otherwise `detailPlaceholder` is rendered.
   */
  detail: React.ReactNode;

  /**
   * Whether an item is currently selected. This drives the responsive
   * (single-column) behavior: in the narrow layout the detail pane is shown
   * when `true`, and the master (list) pane is shown when `false`.
   */
  hasSelection: boolean;

  /**
   * Content rendered in the detail pane when nothing is selected (empty state).
   */
  detailPlaceholder?: React.ReactNode;

  /**
   * Called when the user activates the "back to list" control in the narrow
   * layout. Providing this callback renders the control.
   */
  onClearSelection?: () => void;

  /** Accessible label for the master (list) region. */
  masterAriaLabel?: string;

  /** Accessible label for the detail region. */
  detailAriaLabel?: string;

  /** Text for the "back to list" control shown in the narrow layout. Defaults to "Back". */
  backLabel?: string;

  /**
   * Container width (in px) below which the layout collapses to a single
   * column. Defaults to {@link DEFAULT_NARROW_BREAKPOINT}.
   */
  narrowBreakpoint?: number;
}

export interface MasterDetailView {
  /** Whether the master (list) pane should render. */
  showMaster: boolean;
  /** Whether the detail pane should render. */
  showDetail: boolean;
  /** Whether the "back to list" control should render inside the detail pane. */
  showBackButton: boolean;
}
