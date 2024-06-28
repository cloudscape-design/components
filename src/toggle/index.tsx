// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { applyDisplayName } from '../internal/utils/apply-display-name';
import useBaseComponent from '../internal/hooks/use-base-component';
import { ToggleProps } from './interfaces';
import InternalToggle from './internal';
import { getAnalyticsMetadataAttribute } from '../internal/analytics/autocapture/utils';

export { ToggleProps };

const componentName = 'Toggle';

const Toggle = React.forwardRef<ToggleProps.Ref, ToggleProps>((props, ref) => {
  const baseComponentProps = useBaseComponent(componentName);
  return (
    <InternalToggle
      {...props}
      {...baseComponentProps}
      ref={ref}
      {...getAnalyticsMetadataAttribute({
        component: {
          name: componentName,
          label: '&',
        },
      })}
    />
  );
});

applyDisplayName(Toggle, componentName);
export default Toggle;
