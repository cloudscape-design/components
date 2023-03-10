// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { applyDisplayName } from '../internal/utils/apply-display-name';
import { AlertProps } from './interfaces';
import InternalAlert from './internal';
import useBaseComponent from '../internal/hooks/use-base-component';
import { useI18nStrings } from '../internal/i18n/use-i18n-strings';

export { AlertProps };

export default function Alert({ type = 'info', visible = true, ...props }: AlertProps) {
  const baseComponentProps = useBaseComponent('Alert');
  const propsWithI18n = useI18nStrings('alert', props);
  return <InternalAlert type={type} visible={visible} {...propsWithI18n} {...baseComponentProps} />;
}

applyDisplayName(Alert, 'Alert');
