// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { applyDisplayName } from '../internal/utils/apply-display-name';
import { FormProps } from './interfaces';
import InternalForm from './internal';
import useBaseComponent from '../internal/hooks/use-base-component';

import { useTrackComponentLifecycle, WithContext } from '../internal/context/analytics-context';
export { FormProps };

export default function Form({ variant = 'full-page', ...props }: FormProps) {
  const baseComponentProps = useBaseComponent('Form');

  const funnel = (props as any)['data-analytics-funnel'] || props.id || 'csa_funnel'; // Get funnel name from breadcrumb
  useTrackComponentLifecycle({ componentName: 'Form', funnel });

  return (
    <WithContext value={{ componentName: 'Form', funnel }}>
      <InternalForm variant={variant} {...props} {...baseComponentProps} />
    </WithContext>
  );
}

applyDisplayName(Form, 'Form');
