// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';

import { ButtonDropdownProps } from '../../../lib/components/button-dropdown';
import { useLoadItems } from '../../../lib/components/button-dropdown/utils/use-load-items';

const items: ButtonDropdownProps.Items = [
  { id: 'i1', text: 'Item 1' },
  { id: 'i2', text: 'Item 2' },
];

// Minimal component to expose hook functions for testing
function HookHarness({
  onLoadItems,
  hookItems,
  statusType,
  onRender,
}: {
  onLoadItems: ButtonDropdownProps['onLoadItems'];
  hookItems: ButtonDropdownProps.Items;
  statusType: ButtonDropdownProps.AsyncLoadingStatusType;
  onRender: (fns: ReturnType<typeof useLoadItems>) => void;
}) {
  const fns = useLoadItems({ onLoadItems, items: hookItems, statusType });
  onRender(fns);
  return null;
}

function renderHook(
  onLoadItems: jest.Mock,
  hookItems: ButtonDropdownProps.Items,
  statusType: ButtonDropdownProps.AsyncLoadingStatusType
) {
  let fns!: ReturnType<typeof useLoadItems>;
  render(
    <HookHarness
      onLoadItems={event => onLoadItems(event.detail)}
      hookItems={hookItems}
      statusType={statusType}
      onRender={f => {
        fns = f;
      }}
    />
  );
  return fns;
}

describe('useLoadItems', () => {
  test('fireLoadItems fires onLoadItems with firstPage=true', () => {
    const onLoadItems = jest.fn();
    const fns = renderHook(onLoadItems, items, 'pending');
    fns.fireLoadItems('test');
    expect(onLoadItems).toHaveBeenCalledWith({ filteringText: 'test', firstPage: true, samePage: false });
  });

  test('fireLoadItems deduplicates identical filteringText', () => {
    const onLoadItems = jest.fn();
    const fns = renderHook(onLoadItems, items, 'pending');
    fns.fireLoadItems('test');
    fns.fireLoadItems('test');
    expect(onLoadItems).toHaveBeenCalledTimes(1);
  });

  test('handleLoadMore fires when statusType is "pending" and items exist (firstPage=false)', () => {
    const onLoadItems = jest.fn();
    const fns = renderHook(onLoadItems, items, 'pending');
    // prime prevFilteringText
    fns.fireLoadItems('query');
    onLoadItems.mockClear();
    fns.handleLoadMore();
    expect(onLoadItems).toHaveBeenCalledWith({ filteringText: 'query', firstPage: false, samePage: false });
  });

  test('handleLoadMore fires with firstPage=true when items are empty', () => {
    const onLoadItems = jest.fn();
    const fns = renderHook(onLoadItems, [], 'pending');
    fns.handleLoadMore();
    expect(onLoadItems).toHaveBeenCalledWith({ filteringText: '', firstPage: true, samePage: false });
  });

  test('handleLoadMore does not fire when statusType is not "pending"', () => {
    const onLoadItems = jest.fn();
    const fns = renderHook(onLoadItems, items, 'finished');
    fns.handleLoadMore();
    expect(onLoadItems).not.toHaveBeenCalled();
  });

  test('handleRecoveryClick fires onLoadItems with samePage=true', () => {
    const onLoadItems = jest.fn();
    const fns = renderHook(onLoadItems, items, 'error');
    fns.fireLoadItems('search');
    onLoadItems.mockClear();
    fns.handleRecoveryClick();
    expect(onLoadItems).toHaveBeenCalledWith({ filteringText: 'search', firstPage: false, samePage: true });
  });

  test('handleRecoveryClick passes expandedGroupId when provided', () => {
    const onLoadItems = jest.fn();
    const fns = renderHook(onLoadItems, items, 'error');
    fns.handleRecoveryClick('group-1');
    expect(onLoadItems).toHaveBeenCalledWith(expect.objectContaining({ expandedGroupId: 'group-1', samePage: true }));
  });
});
