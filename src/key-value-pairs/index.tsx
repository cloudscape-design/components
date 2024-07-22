// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { getBaseProps } from '../internal/base-component';
import useBaseComponent from '../internal/hooks/use-base-component';
import { applyDisplayName } from '../internal/utils/apply-display-name';
import { KeyValuePairsProps } from './interfaces';
import InternalKeyValuePairs from './internal';

export { KeyValuePairsProps };

export default function KeyValuePairs({ columns = 1, items, ariaLabel, ariaLabelledby, ...rest }: KeyValuePairsProps) {
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
      {...baseProps}
      ref={__internalRootRef}
    />
  );
}

applyDisplayName(KeyValuePairs, 'KeyValuePairs');
