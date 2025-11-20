// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
'use client';
import React from 'react';

import { getAnalyticsMetadataAttribute } from '@cloudscape-design/component-toolkit/internal/analytics-metadata';

import useBaseComponent from '../internal/hooks/use-base-component';
import { applyDisplayName } from '../internal/utils/apply-display-name';
import { GeneratedAnalyticsMetadataRadioGroupComponent } from './analytics-metadata/interfaces';
import { RadioGroupProps } from './interfaces';
import InternalRadioGroup from './internal';

import analyticsSelectors from './analytics-metadata/styles.css.js';

export { RadioGroupProps };

const RadioGroup = React.forwardRef(
  ({ direction = 'vertical', ...rest }: RadioGroupProps, ref: React.Ref<RadioGroupProps.Ref>) => {
    const baseComponentProps = useBaseComponent('RadioGroup', {
      props: { readOnly: rest.readOnly, direction: direction ?? 'vertical' },
    });
    return (
      <InternalRadioGroup
        ref={ref}
        direction={direction}
        {...rest}
        {...baseComponentProps}
        {...getAnalyticsMetadataAttribute({
          component: {
            name: 'awsui.RadioGroup',
            label: { root: 'self' },
            properties: {
              value: `${rest.value}`,
              valueLabel: `.${analyticsSelectors.selected}`,
            },
          } as GeneratedAnalyticsMetadataRadioGroupComponent,
        })}
      />
    );
  }
);

applyDisplayName(RadioGroup, 'RadioGroup');
export default RadioGroup;
