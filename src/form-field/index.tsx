// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
'use client';
import React from 'react';

import { getAnalyticsMetadataAttribute } from '@cloudscape-design/component-toolkit/internal/analytics-metadata';

import { BasePropsWithAnalyticsMetadata, getAnalyticsMetadataProps } from '../internal/base-component/index.js';
import useBaseComponent from '../internal/hooks/use-base-component/index.js';
import { applyDisplayName } from '../internal/utils/apply-display-name.js';
import { GeneratedAnalyticsMetadataFormFieldComponent } from './analytics-metadata/interfaces.js';
import { FormFieldProps } from './interfaces.js';
import InternalFormField from './internal.js';

import analyticsSelectors from './analytics-metadata/styles.css.js';

export { FormFieldProps };

export default function FormField({ stretch = false, ...props }: FormFieldProps) {
  const analyticsMetadata = getAnalyticsMetadataProps(props as BasePropsWithAnalyticsMetadata);
  const baseComponentProps = useBaseComponent(
    'FormField',
    {
      props: {
        stretch,
      },
      metadata: {
        hasInstanceIdentifier: Boolean(analyticsMetadata?.instanceIdentifier),
        hasErrorContext: Boolean(analyticsMetadata?.errorContext),
      },
    },
    analyticsMetadata
  );

  return (
    <InternalFormField
      stretch={stretch}
      {...props}
      __hideLabel={false}
      __analyticsMetadata={analyticsMetadata}
      {...baseComponentProps}
      {...getAnalyticsMetadataAttribute({
        component: {
          name: 'awsui.FormField',
          label: `.${analyticsSelectors.label}`,
        } as GeneratedAnalyticsMetadataFormFieldComponent,
      })}
    />
  );
}

applyDisplayName(FormField, 'FormField');
