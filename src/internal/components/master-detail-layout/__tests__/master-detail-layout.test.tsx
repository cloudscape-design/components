// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';

import MasterDetailLayout, {
  DEFAULT_NARROW_BREAKPOINT,
  resolveMasterDetailView,
} from '../../../../../lib/components/internal/components/master-detail-layout';

describe('resolveMasterDetailView', () => {
  test('wide layout shows both panes and no back button', () => {
    expect(resolveMasterDetailView({ isNarrow: false, hasSelection: false, canClearSelection: true })).toEqual({
      showMaster: true,
      showDetail: true,
      showBackButton: false,
    });
    expect(resolveMasterDetailView({ isNarrow: false, hasSelection: true, canClearSelection: true })).toEqual({
      showMaster: true,
      showDetail: true,
      showBackButton: false,
    });
  });

  test('narrow layout without selection shows only the master pane', () => {
    expect(resolveMasterDetailView({ isNarrow: true, hasSelection: false, canClearSelection: true })).toEqual({
      showMaster: true,
      showDetail: false,
      showBackButton: false,
    });
  });

  test('narrow layout with selection shows only the detail pane', () => {
    expect(resolveMasterDetailView({ isNarrow: true, hasSelection: true, canClearSelection: true })).toEqual({
      showMaster: false,
      showDetail: true,
      showBackButton: true,
    });
  });

  test('narrow layout with selection hides the back button when selection cannot be cleared', () => {
    expect(resolveMasterDetailView({ isNarrow: true, hasSelection: true, canClearSelection: false })).toEqual({
      showMaster: false,
      showDetail: true,
      showBackButton: false,
    });
  });
});

describe('MasterDetailLayout', () => {
  const renderLayout = (props: Partial<React.ComponentProps<typeof MasterDetailLayout>> = {}) =>
    render(
      <MasterDetailLayout
        master={<div>MASTER</div>}
        detail={<div>DETAIL</div>}
        detailPlaceholder={<div>PLACEHOLDER</div>}
        hasSelection={false}
        masterAriaLabel="Items"
        detailAriaLabel="Item details"
        {...props}
      />
    );

  test('exposes a sensible default breakpoint', () => {
    expect(DEFAULT_NARROW_BREAKPOINT).toBeGreaterThan(0);
  });

  test('renders both regions in the default (wide) layout', () => {
    renderLayout({ hasSelection: true });
    expect(screen.getByLabelText('Items')).toBeInTheDocument();
    expect(screen.getByLabelText('Item details')).toBeInTheDocument();
    expect(screen.getByText('MASTER')).toBeInTheDocument();
    expect(screen.getByText('DETAIL')).toBeInTheDocument();
  });

  test('renders the placeholder in the detail pane when nothing is selected', () => {
    renderLayout({ hasSelection: false });
    expect(screen.getByText('PLACEHOLDER')).toBeInTheDocument();
    expect(screen.queryByText('DETAIL')).not.toBeInTheDocument();
  });

  test('does not render a back control in the wide layout even when clearable', () => {
    const onClearSelection = jest.fn();
    renderLayout({ hasSelection: true, onClearSelection, backLabel: 'Back to list' });
    expect(screen.queryByText('Back to list')).not.toBeInTheDocument();
    expect(onClearSelection).not.toHaveBeenCalled();
    // sanity: detail content is still visible in the wide layout
    expect(screen.getByText('DETAIL')).toBeInTheDocument();
    fireEvent.resize(window);
  });
});
