// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { createContext } from 'react';

interface CollectionPreferencesMetadataInterface {
  tableHasStripedRows?: boolean;
  tableHasHiddenColumns?: boolean;
  tableHasStickyColumns?: boolean;
  tableContentDensity?: string;
}

export const CollectionPreferencesMetadata = createContext<CollectionPreferencesMetadataInterface>({});
