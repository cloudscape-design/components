// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { getBaseProps } from '../internal/base-component';
import { applyDisplayName } from '../internal/utils/apply-display-name';
import useBaseComponent from '../internal/hooks/use-base-component';
import { KeyValuePairsProps } from './interfaces';
import InternalKeyValuePairs from './internal';

export { KeyValuePairsProps };

export default function KeyValuePairs({ columns, items, ...rest }: KeyValuePairsProps) {
  const { __internalRootRef } = useBaseComponent('KeyValuePairs');
  const baseProps = getBaseProps(rest);

  return <InternalKeyValuePairs columns={columns} items={items} {...baseProps} ref={__internalRootRef} />;
}

applyDisplayName(KeyValuePairs, 'KeyValuePairs');
