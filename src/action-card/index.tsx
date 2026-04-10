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

const ActionCard = React.forwardRef(
  (
    {
      disabled = false,
      disableHeaderPaddings = false,
      disableContentPaddings = false,
      iconVerticalAlignment = 'top',
      variant = 'default',
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
      metadata: {
        hasHeader: Boolean(props.header),
        hasDescription: Boolean(props.description),
        hasContent: Boolean(props.children),
        hasIcon: Boolean(props.icon),
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
        {...externalProps}
        {...baseComponentProps}
      />
    );
  }
);

applyDisplayName(ActionCard, 'ActionCard');
export default ActionCard;
