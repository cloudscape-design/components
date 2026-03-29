// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
'use client';
import React from 'react';

import InternalIcon from '../icon/internal';
import useBaseComponent from '../internal/hooks/use-base-component';
import { applyDisplayName } from '../internal/utils/apply-display-name';
import { getExternalProps } from '../internal/utils/external-props';
import { type ActionCardProps } from './interfaces';
import InternalActionCard from './internal';

export { ActionCardProps };

const ActionCard = React.forwardRef(
  (
    {
      disabled = false,
      disableHeaderPaddings = false,
      disableContentPaddings = false,
      iconVerticalAlignment = 'top',
      variant = 'default',
      icon = <InternalIcon name="angle-right" />,
      ...props
    }: ActionCardProps,
    ref: React.Ref<ActionCardProps.Ref>
  ) => {
    const baseComponentProps = useBaseComponent('ActionCard', {
      props: {
        disabled,
        disableHeaderPaddings,
        disableContentPaddings,
        iconVerticalAlignment,
        variant,
      },
    });

    const externalProps = getExternalProps(props);

    return (
      <InternalActionCard
        ref={ref}
        disabled={disabled}
        disableHeaderPaddings={disableHeaderPaddings}
        disableContentPaddings={disableContentPaddings}
        iconVerticalAlignment={iconVerticalAlignment}
        variant={variant}
        icon={icon}
        {...externalProps}
        {...baseComponentProps}
      />
    );
  }
);

applyDisplayName(ActionCard, 'ActionCard');
export default ActionCard;
