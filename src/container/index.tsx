// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import InternalContainer from './internal';
import { ContainerProps } from './interfaces';
import { getExternalProps } from '../internal/utils/external-props';
import { applyDisplayName } from '../internal/utils/apply-display-name';
import useBaseComponent from '../internal/hooks/use-base-component';

export { ContainerProps };

export default function Container({
  variant = 'default',
  disableHeaderPaddings = false,
  disableContentPaddings = false,
  ...props
}: ContainerProps) {
  const baseComponentProps = useBaseComponent('Container');
  const externalProps = getExternalProps(props);
  return (
    <InternalContainer
      variant={variant}
      disableHeaderPaddings={disableHeaderPaddings}
      disableContentPaddings={disableContentPaddings}
      {...externalProps}
      {...baseComponentProps}
    />
  );
}

applyDisplayName(Container, 'Container');
