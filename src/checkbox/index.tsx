// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
'use client';
import React from 'react';

import useBaseComponent from '../internal/hooks/use-base-component/index.js';
import { applyDisplayName } from '../internal/utils/apply-display-name.js';
import { CheckboxProps } from './interfaces.js';
import InternalCheckbox from './internal.js';

export { CheckboxProps };

const Checkbox = React.forwardRef(({ ...props }: CheckboxProps, ref: React.Ref<CheckboxProps.Ref>) => {
  const baseComponentProps = useBaseComponent('Checkbox', {
    props: { readOnly: props.readOnly },
  });
  return <InternalCheckbox {...props} {...baseComponentProps} ref={ref} __injectAnalyticsComponentMetadata={true} />;
});

applyDisplayName(Checkbox, 'Checkbox');
export default Checkbox;
