// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { KeyCode, KeyCodeA, KeyCodeDelete } from '../../keycode';
import handleKey, { EventLike } from '../handle-key';

function makeEvent(keyCode: number, opts: Partial<EventLike> = {}): EventLike {
  const el = document.createElement('div');
  return { keyCode, currentTarget: el, ...opts };
}

describe('handleKey fallback to onDefault', () => {
  test('backspace calls onBackspace when provided', () => {
    const onBackspace = jest.fn();
    const onDefault = jest.fn();
    handleKey(makeEvent(KeyCode.backspace), { onBackspace, onDefault });
    expect(onBackspace).toHaveBeenCalled();
    expect(onDefault).not.toHaveBeenCalled();
  });

  test('backspace falls back to onDefault when onBackspace not provided', () => {
    const onDefault = jest.fn();
    handleKey(makeEvent(KeyCode.backspace), { onDefault });
    expect(onDefault).toHaveBeenCalled();
  });

  test('delete calls onDelete when provided', () => {
    const onDelete = jest.fn();
    const onDefault = jest.fn();
    handleKey(makeEvent(KeyCodeDelete), { onDelete, onDefault });
    expect(onDelete).toHaveBeenCalled();
    expect(onDefault).not.toHaveBeenCalled();
  });

  test('delete falls back to onDefault when onDelete not provided', () => {
    const onDefault = jest.fn();
    handleKey(makeEvent(KeyCodeDelete), { onDefault });
    expect(onDefault).toHaveBeenCalled();
  });

  test('tab calls onTab when provided', () => {
    const onTab = jest.fn();
    const onDefault = jest.fn();
    handleKey(makeEvent(KeyCode.tab), { onTab, onDefault });
    expect(onTab).toHaveBeenCalled();
    expect(onDefault).not.toHaveBeenCalled();
  });

  test('tab falls back to onDefault when onTab not provided', () => {
    const onDefault = jest.fn();
    handleKey(makeEvent(KeyCode.tab), { onDefault });
    expect(onDefault).toHaveBeenCalled();
  });
});

describe('handleKey enter and space split', () => {
  test('enter calls onEnter when provided', () => {
    const onEnter = jest.fn();
    const onActivate = jest.fn();
    handleKey(makeEvent(KeyCode.enter), { onEnter, onActivate });
    expect(onEnter).toHaveBeenCalled();
    expect(onActivate).not.toHaveBeenCalled();
  });

  test('enter falls back to onActivate when onEnter not provided', () => {
    const onActivate = jest.fn();
    handleKey(makeEvent(KeyCode.enter), { onActivate });
    expect(onActivate).toHaveBeenCalled();
  });

  test('shift+enter calls onShiftEnter when provided', () => {
    const onShiftEnter = jest.fn();
    const onEnter = jest.fn();
    handleKey(makeEvent(KeyCode.enter, { shiftKey: true }), { onShiftEnter, onEnter });
    expect(onShiftEnter).toHaveBeenCalled();
    expect(onEnter).not.toHaveBeenCalled();
  });

  test('shift+enter falls back to onEnter when onShiftEnter not provided', () => {
    const onEnter = jest.fn();
    handleKey(makeEvent(KeyCode.enter, { shiftKey: true }), { onEnter });
    expect(onEnter).toHaveBeenCalled();
  });

  test('space calls onSpace when provided', () => {
    const onSpace = jest.fn();
    const onActivate = jest.fn();
    handleKey(makeEvent(KeyCode.space), { onSpace, onActivate });
    expect(onSpace).toHaveBeenCalled();
    expect(onActivate).not.toHaveBeenCalled();
  });

  test('space falls back to onActivate when onSpace not provided', () => {
    const onActivate = jest.fn();
    handleKey(makeEvent(KeyCode.space), { onActivate });
    expect(onActivate).toHaveBeenCalled();
  });
});

describe('handleKey Ctrl+A / Cmd+A', () => {
  test('ctrl+A calls onSelectAll when provided', () => {
    const onSelectAll = jest.fn();
    const onDefault = jest.fn();
    handleKey(makeEvent(KeyCodeA, { ctrlKey: true }), { onSelectAll, onDefault });
    expect(onSelectAll).toHaveBeenCalled();
    expect(onDefault).not.toHaveBeenCalled();
  });

  test('meta+A calls onSelectAll when provided', () => {
    const onSelectAll = jest.fn();
    handleKey(makeEvent(KeyCodeA, { metaKey: true }), { onSelectAll });
    expect(onSelectAll).toHaveBeenCalled();
  });

  test('A without modifier falls back to onDefault', () => {
    const onSelectAll = jest.fn();
    const onDefault = jest.fn();
    handleKey(makeEvent(KeyCodeA), { onSelectAll, onDefault });
    expect(onSelectAll).not.toHaveBeenCalled();
    expect(onDefault).toHaveBeenCalled();
  });
});

describe('handleKey shift+arrow', () => {
  test('shift+left calls onShiftInlineStart in LTR', () => {
    const onShiftInlineStart = jest.fn();
    const onInlineStart = jest.fn();
    handleKey(makeEvent(KeyCode.left, { shiftKey: true }), { onShiftInlineStart, onInlineStart });
    expect(onShiftInlineStart).toHaveBeenCalled();
    expect(onInlineStart).not.toHaveBeenCalled();
  });

  test('shift+left falls through to onInlineStart when shift handlers not provided', () => {
    const onInlineStart = jest.fn();
    handleKey(makeEvent(KeyCode.left, { shiftKey: true }), { onInlineStart });
    expect(onInlineStart).toHaveBeenCalled();
  });

  test('shift+right calls onShiftInlineEnd in LTR', () => {
    const onShiftInlineEnd = jest.fn();
    const onInlineEnd = jest.fn();
    handleKey(makeEvent(KeyCode.right, { shiftKey: true }), { onShiftInlineEnd, onInlineEnd });
    expect(onShiftInlineEnd).toHaveBeenCalled();
    expect(onInlineEnd).not.toHaveBeenCalled();
  });

  test('shift+right falls through to onInlineEnd when shift handlers not provided', () => {
    const onInlineEnd = jest.fn();
    handleKey(makeEvent(KeyCode.right, { shiftKey: true }), { onInlineEnd });
    expect(onInlineEnd).toHaveBeenCalled();
  });
});
