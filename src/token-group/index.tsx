// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { TokenGroupProps } from './interfaces';
import { applyDisplayName } from '../internal/utils/apply-display-name';
import useBaseComponent from '../internal/hooks/use-base-component';
import InternalTokenGroup from './internal';

export { TokenGroupProps };

export default function TokenGroup({ items = [], alignment = 'horizontal', ...props }: TokenGroupProps) {
  const baseComponentProps = useBaseComponent('TokenGroup', {
    props: { alignment, disableOuterPadding: props.disableOuterPadding, limit: props.limit },
  });
  return <InternalTokenGroup items={items} alignment={alignment} {...props} {...baseComponentProps} />;
}

applyDisplayName(TokenGroup, 'TokenGroup');
