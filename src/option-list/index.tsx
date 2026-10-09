// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
'use client';
import React from 'react';

import useBaseComponent from '../internal/hooks/use-base-component';
import { applyDisplayName } from '../internal/utils/apply-display-name';
import { getExternalProps } from '../internal/utils/external-props';
import { OptionListForwardRefType, OptionListProps } from './interfaces';
import InternalOptionList from './internal';

export { OptionListProps };

const OptionList = React.forwardRef(function OptionList<T = any>(
  props: OptionListProps<T>,
  ref: React.Ref<OptionListProps.Ref>
) {
  const baseComponentProps = useBaseComponent('OptionList', {
    props: { selectionType: props.selectionType },
    metadata: { itemsCount: props.items.length },
  });
  const externalProps = getExternalProps(props);
  return <InternalOptionList {...externalProps} {...baseComponentProps} ref={ref} />;
}) as OptionListForwardRefType;

applyDisplayName(OptionList, 'OptionList');
export default OptionList;
