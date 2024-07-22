// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { act, renderHook } from '../../__tests__/render-hook';
import { useLoadItems } from '../utils/use-load-items';

const options = [
  {
    value: '1',
  },
];

describe('useLoadItems with statusType=pending and non empty options', () => {
  const onLoadItems = jest.fn();
  const hook = renderHook(useLoadItems, {
    initialProps: {
      onLoadItems,
      options,
      statusType: 'pending',
    },
  });

  const { fireLoadItems, handleLoadMore, handleRecoveryClick } = hook.result.current;

  test('should call fireLoadItems only if the filteringText is changed', () => {
    act(() => fireLoadItems(''));
    expect(onLoadItems).toHaveBeenCalledWith(
      expect.objectContaining({ detail: { firstPage: true, samePage: false, filteringText: '' } })
    );
    act(() => fireLoadItems(''));
    expect(onLoadItems).toHaveBeenCalledTimes(1);
  });

  test('should call fireLoadItems with samePage=true', () => {
    act(() => handleRecoveryClick());

    expect(onLoadItems).toHaveBeenCalledWith(
      expect.objectContaining({ detail: { firstPage: false, samePage: true, filteringText: '' } })
    );
  });

  test('should call fireLoadItems when scroll with firstPage=false', () => {
    act(() => handleLoadMore());
    expect(onLoadItems).toHaveBeenCalledWith(
      expect.objectContaining({ detail: { firstPage: false, samePage: false, filteringText: '' } })
    );
  });
});

describe('useLoadItems with statusType=pending and empty options', () => {
  const onLoadItems = jest.fn();
  const hook = renderHook(useLoadItems, {
    initialProps: {
      onLoadItems,
      options: [],
      statusType: 'pending',
    },
  });

  const { handleLoadMore } = hook.result.current;

  test('should call fireLoadItems when scroll with firstPage=true', () => {
    act(() => handleLoadMore());
    expect(onLoadItems).toHaveBeenCalledWith(
      expect.objectContaining({ detail: { firstPage: true, samePage: false, filteringText: '' } })
    );
  });
});

describe('useLoadItems with statusType=finished', () => {
  const onLoadItems = jest.fn();
  const hook = renderHook(useLoadItems, {
    initialProps: {
      onLoadItems,
      options: [],
      statusType: 'finished',
    },
  });

  const { handleLoadMore } = hook.result.current;

  test('should not call fireLoadItems', () => {
    act(() => handleLoadMore());
    expect(onLoadItems).not.toHaveBeenCalled();
  });
});
