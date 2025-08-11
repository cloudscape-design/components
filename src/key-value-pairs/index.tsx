// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
'use client';
import React from 'react';

import { getBaseProps } from '../internal/base-component/index.js';
import useBaseComponent from '../internal/hooks/use-base-component/index.js';
import { applyDisplayName } from '../internal/utils/apply-display-name.js';
import { KeyValuePairsProps } from './interfaces.js';
import InternalKeyValuePairs from './internal.js';

export { KeyValuePairsProps };

export default function KeyValuePairs({
  columns = 1,
  items,
  ariaLabel,
  ariaLabelledby,
  minColumnWidth = 150,
  ...rest
}: KeyValuePairsProps) {
  const { __internalRootRef } = useBaseComponent('KeyValuePairs', {
    props: { columns },
  });
  const baseProps = getBaseProps(rest);

  return (
    <InternalKeyValuePairs
      columns={columns}
      items={items}
      ariaLabel={ariaLabel}
      ariaLabelledby={ariaLabelledby}
      minColumnWidth={minColumnWidth}
      {...baseProps}
      ref={__internalRootRef}
    />
  );
}

applyDisplayName(KeyValuePairs, 'KeyValuePairs');
