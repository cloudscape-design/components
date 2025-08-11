// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
'use client';
import React from 'react';

import { getAnalyticsMetadataAttribute } from '@cloudscape-design/component-toolkit/internal/analytics-metadata';

import useBaseComponent from '../internal/hooks/use-base-component';
import { applyDisplayName } from '../internal/utils/apply-display-name.js';
import { GeneratedAnalyticsMetadataTextFilterComponent } from './analytics-metadata/interfaces.js';
import { TextFilterProps } from './interfaces.js';
import InternalTextFilter from './internal.js';

export { TextFilterProps };

const TextFilter = React.forwardRef((props: TextFilterProps, ref: React.Ref<TextFilterProps.Ref>) => {
  const baseComponentProps = useBaseComponent('TextFilter', {
    props: { disabled: props.disabled, disableBrowserAutocorrect: props.disableBrowserAutocorrect },
  });

  const componentAnalyticsMetadata: GeneratedAnalyticsMetadataTextFilterComponent = {
    name: 'awsui.TextFilter',
    label: 'input',
    properties: {
      disabled: `${!!props.disabled}`,
      filteringText: props.filteringText || '',
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
