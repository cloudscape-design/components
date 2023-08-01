// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { applyDisplayName } from '../internal/utils/apply-display-name';
import useBaseComponent from '../internal/hooks/use-base-component';
import { TextFilterProps } from './interfaces';
import InternalTextFilter from './internal';

export { TextFilterProps };

const TextFilter = React.forwardRef((props: TextFilterProps, ref: React.Ref<TextFilterProps.Ref>) => {
  const baseComponentProps = useBaseComponent('TextFilter', { disabled: props.disabled });
  return <InternalTextFilter {...props} {...baseComponentProps} ref={ref} />;
});

applyDisplayName(TextFilter, 'TextFilter');
export default TextFilter;
