// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { applyDisplayName } from '../internal/utils/apply-display-name';
import { getExternalProps } from '../internal/utils/external-props';
import useBaseComponent from '../internal/hooks/use-base-component';
// type definitions
import { ButtonGroupProps } from './interfaces';
// internal instance
import InternalButtonGroup from './internal';

// export type definitions for public use
export { ButtonGroupProps };

export default function ButtonGroup(props: ButtonGroupProps) {
  const baseComponentProps = useBaseComponent('ButtonGroup');
  const filteredProps = getExternalProps(props);
  return <InternalButtonGroup {...baseComponentProps} {...filteredProps} />;
}

applyDisplayName(ButtonGroup, 'ButtonGroup');
