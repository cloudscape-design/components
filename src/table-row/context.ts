// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { createContext, useContext } from 'react';

import { TableRowProps } from './interfaces';

// A row→cell channel so a `TableCell` learns its row's visual state and paints selection via its own
// module class, avoiding a `data-*` styling hook. A cell rendered outside a `TableRow` reads `'default'`.
const RowVariantContext = createContext<TableRowProps.Variant>('default');

export const RowVariantContextProvider = RowVariantContext.Provider;

export function useRowVariant(): TableRowProps.Variant {
  return useContext(RowVariantContext);
}
