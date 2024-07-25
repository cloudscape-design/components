// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import useBaseComponent from '../internal/hooks/use-base-component';
import { applyDisplayName } from '../internal/utils/apply-display-name';
import { CheckboxProps } from './interfaces';
import InternalCheckbox from './internal';

export { CheckboxProps };

const Checkbox = React.forwardRef(({ ...props }: CheckboxProps, ref: React.Ref<CheckboxProps.Ref>) => {
  const baseComponentProps = useBaseComponent('Checkbox');
  return <InternalCheckbox {...props} {...baseComponentProps} ref={ref} __injectAnalyticsComponentMetadata={true} />;
});

applyDisplayName(Checkbox, 'Checkbox');
export default Checkbox;
