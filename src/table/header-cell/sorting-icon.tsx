// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { useInternalComponentIcons } from '../../icon-provider/use-component-icons';
import { CustomizableIcon } from '../../internal/components/customizable-icon';
import { getSortingIconName, SortingStatus } from './utils';

// The sort indicator shared by the Table's column headers and TableSortButton, including any custom icon set
// through IconProvider.
export function SortingIcon({ sortingStatus }: { sortingStatus: SortingStatus }) {
  const icons = useInternalComponentIcons('table');
  return (
    <CustomizableIcon
      customIcon={icons?.sortingIndicator?.({ sortingState: sortingStatus })}
      fallback={{ name: getSortingIconName(sortingStatus), nativeAttributes: { 'data-awsui-motion-target': '' } }}
    />
  );
}
