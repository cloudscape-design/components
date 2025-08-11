// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
'use client';
import React from 'react';

import { getAnalyticsMetadataAttribute } from '@cloudscape-design/component-toolkit/internal/analytics-metadata';

import useBaseComponent from '../internal/hooks/use-base-component/index.js';
import { applyDisplayName } from '../internal/utils/apply-display-name.js';
import { GeneratedAnalyticsMetadataRadioGroupComponent } from './analytics-metadata/interfaces.js';
import { RadioGroupProps } from './interfaces.js';
import InternalRadioGroup from './internal.js';

export { RadioGroupProps };

const RadioGroup = React.forwardRef((props: RadioGroupProps, ref: React.Ref<RadioGroupProps.Ref>) => {
  const baseComponentProps = useBaseComponent('RadioGroup', { props: { readOnly: props.readOnly } });
  return (
    <InternalRadioGroup
      ref={ref}
      {...props}
      {...baseComponentProps}
      {...getAnalyticsMetadataAttribute({
        component: {
          name: 'awsui.RadioGroup',
          label: { root: 'self' },
          properties: {
            value: `${props.value}`,
          },
        } as GeneratedAnalyticsMetadataRadioGroupComponent,
      })}
    />
  );
});

applyDisplayName(RadioGroup, 'RadioGroup');
export default RadioGroup;
