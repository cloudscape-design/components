// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
'use client';
import React from 'react';

import { getAnalyticsMetadataAttribute } from '@cloudscape-design/component-toolkit/internal/analytics-metadata';

import { getBaseProps } from '../internal/base-component';
import useBaseComponent from '../internal/hooks/use-base-component';
import { applyDisplayName } from '../internal/utils/apply-display-name';
import { GeneratedAnalyticsMetadataControlGroupComponent } from './analytics-metadata/interfaces';
import { ControlGroupProps } from './interfaces';
import InternalControlGroup from './internal';

export { ControlGroupProps };

const ControlGroup = React.forwardRef((props: ControlGroupProps, ref: React.Ref<HTMLDivElement>) => {
  const baseProps = getBaseProps(props);
  const baseComponentProps = useBaseComponent('ControlGroup');

  const componentMetadata: GeneratedAnalyticsMetadataControlGroupComponent = {
    name: 'awsui.ControlGroup',
    label: { root: 'self' },
  };

  return (
    <InternalControlGroup
      {...baseProps}
      {...baseComponentProps}
      {...props}
      ref={ref}
      {...getAnalyticsMetadataAttribute({ component: componentMetadata })}
    />
  );
});

applyDisplayName(ControlGroup, 'ControlGroup');
export default ControlGroup;
