// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { getBaseProps } from '../internal/base-component';
import { applyDisplayName } from '../internal/utils/apply-display-name';
import useBaseComponent from '../internal/hooks/use-base-component';
import { KeyValuePairProps } from './interfaces';
import InternalKeyValuePair from './internal';

export { KeyValuePairProps };

export default function KeyValuePair({ columns, ...rest }: KeyValuePairProps) {
  const { __internalRootRef } = useBaseComponent('KeyValuePair');
  const baseProps = getBaseProps(rest);

  return <InternalKeyValuePair columns={columns} {...baseProps} ref={__internalRootRef} />;
}

applyDisplayName(KeyValuePair, 'KeyValuePair');
