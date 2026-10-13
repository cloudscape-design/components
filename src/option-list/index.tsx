// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
'use client';
import React from 'react';

import useBaseComponent from '../internal/hooks/use-base-component';
import { applyDisplayName } from '../internal/utils/apply-display-name';
import { getExternalProps } from '../internal/utils/external-props';
import { OptionListProps } from './interfaces';
import InternalOptionList from './internal';

export { OptionListProps };

const OptionList = React.forwardRef((props: OptionListProps, ref: React.Ref<OptionListProps.Ref>) => {
  const baseComponentProps = useBaseComponent('OptionList', {
    props: { selectionType: props.selectionType },
    metadata: {
      optionsCount: props.options.length,
    },
  });
  const externalProps = getExternalProps(props);
  return <InternalOptionList {...externalProps} {...baseComponentProps} ref={ref} />;
});

applyDisplayName(OptionList, 'OptionList');
export default OptionList;
