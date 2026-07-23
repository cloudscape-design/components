// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { act, renderHook } from '../../__tests__/render-hook';
import { TableProps } from '../interfaces';
import { useBulkEditing } from '../use-bulk-editing';

interface Item {
  id: string;
  name: string;
  size: number;
}

const items: Item[] = [
  { id: 'i-1', name: 'alpha', size: 1 },
  { id: 'i-2', name: 'beta', size: 2 },
];

const columnDefinitions: TableProps.ColumnDefinition<Item>[] = [
  { id: 'name', header: 'Name', cell: item => item.name, editConfig: { editingCell: () => null } },
  { id: 'size', header: 'Size', cell: item => item.size, editConfig: { editingCell: () => null } },
];

function setup(bulkEdit?: TableProps.BulkEditConfig<Item>) {
  return renderHook(() => useBulkEditing<Item>({ items, trackBy: 'id', columnDefinitions, bulkEdit }));
}

describe('useBulkEditing (WIP AWSUI-56121)', () => {
  test('is disabled and inactive when no bulkEdit config is provided', () => {
    const { result } = setup(undefined);
    expect(result.current.enabled).toBe(false);
    expect(result.current.isActive).toBe(false);

    act(() => result.current.startBulkEdit());
    // Cannot enter bulk-edit mode when disabled.
    expect(result.current.isActive).toBe(false);
  });

  test('enters and exits bulk-edit mode', () => {
    const { result } = setup({ onSubmit: () => {} });
    expect(result.current.isActive).toBe(false);

    act(() => result.current.startBulkEdit());
    expect(result.current.isActive).toBe(true);
    expect(result.current.hasChanges).toBe(false);

    act(() => result.current.discardBulkEdit());
    expect(result.current.isActive).toBe(false);
  });

  test('tracks dirty cells and clears them', () => {
    const { result } = setup({ onSubmit: () => {} });
    act(() => result.current.startBulkEdit());

    act(() => result.current.setCellValue('i-1', 'name', 'ALPHA'));
    act(() => result.current.setCellValue('i-2', 'size', 20));
    expect(result.current.dirtyCellCount).toBe(2);
    expect(result.current.hasChanges).toBe(true);
    expect(result.current.getCellValue('i-1', 'name')).toEqual({ isDirty: true, value: 'ALPHA' });
    expect(result.current.getCellValue('i-1', 'size')).toEqual({ isDirty: false, value: undefined });

    act(() => result.current.clearCellValue('i-1', 'name'));
    expect(result.current.dirtyCellCount).toBe(1);
    expect(result.current.getCellValue('i-1', 'name').isDirty).toBe(false);
  });

  test('collectChanges resolves row ids and column ids back to items/columns', () => {
    const { result } = setup({ onSubmit: () => {} });
    act(() => result.current.startBulkEdit());
    act(() => result.current.setCellValue('i-2', 'name', 'BETA'));

    const changes = result.current.collectChanges();
    expect(changes).toHaveLength(1);
    expect(changes[0].item).toEqual(items[1]);
    expect(changes[0].column.id).toBe('name');
    expect(changes[0].newValue).toBe('BETA');
  });

  test('submitBulkEdit calls onSubmit with all changes and exits mode', async () => {
    const onSubmit = jest.fn().mockResolvedValue(undefined);
    const { result } = setup({ onSubmit });
    act(() => result.current.startBulkEdit());
    act(() => result.current.setCellValue('i-1', 'name', 'ALPHA'));
    act(() => result.current.setCellValue('i-1', 'size', 9));

    await act(async () => {
      await result.current.submitBulkEdit();
    });

    expect(onSubmit).toHaveBeenCalledTimes(1);
    const detail = onSubmit.mock.calls[0][0];
    expect(detail.changes).toHaveLength(2);
    expect(result.current.isActive).toBe(false);
    expect(result.current.dirtyCellCount).toBe(0);
  });

  test('falls back to row index when trackBy is not provided', () => {
    const { result } = renderHook(() =>
      useBulkEditing<Item>({ items, columnDefinitions, bulkEdit: { onSubmit: () => {} } })
    );
    expect(result.current.getRowId(items[0], 0)).toBe('0');
    expect(result.current.getRowId(items[1], 1)).toBe('1');
  });
});
