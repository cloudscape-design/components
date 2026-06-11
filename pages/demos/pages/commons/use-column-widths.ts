// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import { useMemo } from 'react';

import { TableProps } from '@cloudscape-design/components/table';

import { addToColumnDefinitions, mapWithColumnDefinitionIds } from '../../common/column-definitions-helper';
import { useLocalStorage } from './use-local-storage';

export function useColumnWidths<T>(storageKey: string, columnDefinitions: TableProps.ColumnDefinition<T>[]) {
  const [widths, saveWidths] =
    useLocalStorage<Pick<TableProps.ColumnDefinition<unknown>, 'width' | 'id'>[]>(storageKey);
  const handleWidthChange: TableProps['onColumnWidthsChange'] = event => {
    saveWidths(mapWithColumnDefinitionIds<T, 'width'>(columnDefinitions, 'width', event.detail.widths as number[]));
  };
  const memoDefinitions = useMemo(() => {
    return addToColumnDefinitions<T, 'width'>(columnDefinitions, 'width', widths);
  }, [widths, columnDefinitions]);

  return [memoDefinitions, handleWidthChange] as const;
}
