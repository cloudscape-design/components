// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
'use client';
import React from 'react';

import useBaseComponent from '../internal/hooks/use-base-component';
import { applyDisplayName } from '../internal/utils/apply-display-name';
import { getExternalProps } from '../internal/utils/external-props';
import { ItemCardProps } from './interfaces';
import InternalItemCard from './internal';

export { ItemCardProps };
const ItemCard = ({
  disableHeaderPaddings = false,
  disableContentPaddings = false,
  disableFooterPaddings = false,
  variant = 'default',
  ...props
}: ItemCardProps) => {
  const baseComponentProps = useBaseComponent('ItemCard', {
    props: {
      disableHeaderPaddings,
      disableContentPaddings,
      disableFooterPaddings,
      variant,
    },
  });

  const externalProps = getExternalProps(props);

  return (
    <InternalItemCard
      disableHeaderPaddings={disableHeaderPaddings}
      disableContentPaddings={disableContentPaddings}
      disableFooterPaddings={disableFooterPaddings}
      variant={variant}
      {...externalProps}
      {...baseComponentProps}
    />
  );
};

applyDisplayName(ItemCard, 'ItemCard');
export default ItemCard;
