// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
'use client';
import React from 'react';

import useBaseComponent from '../internal/hooks/use-base-component';
import { applyDisplayName } from '../internal/utils/apply-display-name';
import { getExternalProps } from '../internal/utils/external-props';
import { CardProps } from './interfaces';
import InternalCard from './internal';

export { CardProps };
const Card = React.forwardRef(
  ({ disableHeaderPaddings, disableContentPaddings, disableFooterPaddings, iconName, style, ...props }: CardProps) => {
    const baseComponentProps = useBaseComponent('Card', {
      props: {
        disableHeaderPaddings,
        disableContentPaddings,
        disableFooterPaddings,
        iconName,
      },
    });

    const externalProps = getExternalProps(props);

    return (
      <InternalCard
        disableHeaderPaddings={disableHeaderPaddings}
        disableContentPaddings={disableContentPaddings}
        disableFooterPaddings={disableFooterPaddings}
        iconName={iconName}
        style={style}
        {...externalProps}
        {...baseComponentProps}
      />
    );
  }
);

applyDisplayName(Card, 'Card');
export default Card;
