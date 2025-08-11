// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { useEffect, useMemo } from 'react';

import { parseCountValue } from '../../internal/analytics/utils/parse-count-text.js';
import { useTableComponentsContext } from '../../internal/context/table-component-context.js';

/**
 * Custom hook that integrates table counter values with table component context.
 *
 * The extracted count value is automatically synchronized with the table header
 * component through the table context, updating the countText property.
 */
export const useTableIntegration = (countText: string | undefined) => {
  const tableComponentContext = useTableComponentsContext();
  const countValue = useMemo(() => parseCountValue(countText), [countText]);

  useEffect(() => {
    if (tableComponentContext?.headerRef?.current && countValue !== undefined) {
      tableComponentContext.headerRef.current.totalCount = countValue;

      return () => {
        delete tableComponentContext.headerRef.current?.totalCount;
      };
    }
  }, [tableComponentContext?.headerRef, countValue]);
};
