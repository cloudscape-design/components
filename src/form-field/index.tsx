// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import InternalFormField from './internal';
import { applyDisplayName } from '../internal/utils/apply-display-name';
import useBaseComponent from '../internal/hooks/use-base-component';
import { BasePropsWithAnalyticsMetadata, getAnalyticsMetadataProps } from '../internal/base-component';

import { FormFieldProps } from './interfaces';

export { FormFieldProps };

export default function FormField({ stretch = false, ...props }: FormFieldProps) {
  const analyticsMetadata = getAnalyticsMetadataProps(props as BasePropsWithAnalyticsMetadata);
  const baseComponentProps = useBaseComponent('FormField', { props: { stretch } }, analyticsMetadata);

  return (
    <InternalFormField
      stretch={stretch}
      {...props}
      __hideLabel={false}
      __analyticsMetadata={analyticsMetadata}
      {...baseComponentProps}
    />
  );
}

applyDisplayName(FormField, 'FormField');
