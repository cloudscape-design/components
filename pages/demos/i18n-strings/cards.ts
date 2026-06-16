// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import { CardsProps } from '@cloudscape-design/components/cards';

import { Distribution } from '../fake-server/types';

export const distributionCardsAriaLabels: CardsProps.AriaLabels<Distribution> = {
  itemSelectionLabel: (data, row) => `select ${row.id}`,
  selectionGroupLabel: 'Distribution selection',
  cardsLabel: 'Cards',
};

export const renderDistributionCardsAriaLive: CardsProps['renderAriaLive'] = ({
  firstIndex,
  lastIndex,
  totalItemsCount,
}) => {
  return totalItemsCount !== undefined
    ? `Displaying items ${firstIndex} to ${lastIndex} of ${totalItemsCount}`
    : `Displaying items ${firstIndex} to ${lastIndex}`;
};
