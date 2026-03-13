// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
'use client';
import React from 'react';

import useBaseComponent from '../internal/hooks/use-base-component';
import { applyDisplayName } from '../internal/utils/apply-display-name';
import { getExternalProps } from '../internal/utils/external-props';
import { type ActionCardProps } from './interfaces';
import InternalActionCard from './internal';

export { ActionCardProps };

const ActionCard = React.forwardRef((props: ActionCardProps, ref: React.Ref<ActionCardProps.Ref>) => {
  const baseComponentProps = useBaseComponent('ActionCard');
  const externalProps = getExternalProps(props);

  return <InternalActionCard ref={ref} {...externalProps} {...baseComponentProps} />;
});

applyDisplayName(ActionCard, 'ActionCard');
export default ActionCard;
