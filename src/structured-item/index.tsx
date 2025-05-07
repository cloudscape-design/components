// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import useBaseComponent from '../internal/hooks/use-base-component';
import { applyDisplayName } from '../internal/utils/apply-display-name';
import { StructuredItemProps } from './interfaces';
import InternalStructuredItem from './internal';

export { StructuredItemProps };

/**
 * @awsuiSystem core
 */
export default function StructuredItem({
  label,
  description,
  icon,
  disableTypography = false,
  ...rest
}: StructuredItemProps) {
  const baseComponentProps = useBaseComponent('StructuredItem');

  return (
    <InternalStructuredItem
      label={label}
      description={description}
      icon={icon}
      disableTypography={disableTypography}
      {...rest}
      {...baseComponentProps}
    />
  );
}

applyDisplayName(StructuredItem, 'StructuredItem');
