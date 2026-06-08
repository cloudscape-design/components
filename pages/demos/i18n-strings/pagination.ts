// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import { TableProps } from '@cloudscape-design/components/table';

export const renderAriaLive: TableProps['renderAriaLive'] = ({ firstIndex, lastIndex, totalItemsCount }) => {
  return totalItemsCount !== undefined
    ? `Displaying items ${firstIndex} to ${lastIndex} of ${totalItemsCount}`
    : `Displaying items ${firstIndex} to ${lastIndex}`;
};
