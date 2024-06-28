// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { RadioGroupProps } from './interfaces';
import { applyDisplayName } from '../internal/utils/apply-display-name';
import useBaseComponent from '../internal/hooks/use-base-component';
import InternalRadioGroup from './internal';
import { getAnalyticsMetadataAttribute } from '../internal/analytics/autocapture/utils';

export { RadioGroupProps };

const componentName = 'RadioGroup';

const RadioGroup = React.forwardRef((props: RadioGroupProps, ref: React.Ref<RadioGroupProps.Ref>) => {
  const baseComponentProps = useBaseComponent(componentName);
  return (
    <InternalRadioGroup
      ref={ref}
      {...props}
      {...baseComponentProps}
      {...getAnalyticsMetadataAttribute({
        component: {
          name: componentName,
          label: '&',
        },
      })}
    />
  );
});

applyDisplayName(RadioGroup, componentName);
export default RadioGroup;
