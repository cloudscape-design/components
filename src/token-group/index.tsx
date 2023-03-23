// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { forwardRef, Ref } from 'react';
import { TokenGroupProps } from './interfaces';
import { applyDisplayName } from '../internal/utils/apply-display-name';
import useBaseComponent from '../internal/hooks/use-base-component';
import InternalTokenGroup from './internal';

export { TokenGroupProps };

const TokenGroup = forwardRef(
  ({ items = [], alignment = 'horizontal', ...props }: TokenGroupProps, ref: Ref<TokenGroupProps.Ref>) => {
    const baseComponentProps = useBaseComponent('TokenGroup');
    return <InternalTokenGroup ref={ref} items={items} alignment={alignment} {...props} {...baseComponentProps} />;
  }
);

applyDisplayName(TokenGroup, 'TokenGroup');
export default TokenGroup;
