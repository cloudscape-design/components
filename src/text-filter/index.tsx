// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { getAnalyticsMetadataAttribute } from '@cloudscape-design/component-toolkit/internal/analytics-metadata';

import useBaseComponent from '../internal/hooks/use-base-component';
import { applyDisplayName } from '../internal/utils/apply-display-name';
import { GeneratedAnalyticsMetadataTextFilterComponent } from './analytics-metadata/interfaces';
import { TextFilterProps } from './interfaces';
import InternalTextFilter from './internal';

export { TextFilterProps };

const TextFilter = React.forwardRef((props: TextFilterProps, ref: React.Ref<TextFilterProps.Ref>) => {
  const baseComponentProps = useBaseComponent('TextFilter');

  const componentAnalyticsMetadata: GeneratedAnalyticsMetadataTextFilterComponent = {
    name: 'awsui.TextFilter',
    label: 'input',
    properties: {
      disabled: `${!!props.disabled}`,
    },
  };
  return (
    <InternalTextFilter
      {...props}
      {...baseComponentProps}
      ref={ref}
      {...getAnalyticsMetadataAttribute({ component: componentAnalyticsMetadata })}
    />
  );
});

applyDisplayName(TextFilter, 'TextFilter');
export default TextFilter;
