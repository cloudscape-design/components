// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
'use client';
import React from 'react';

import { applyDisplayName } from '../internal/utils/apply-display-name';
import { CardProps } from './interfaces';
import InternalCard from './internal';

export { CardProps };
const Card = React.forwardRef((props: CardProps) => {
  return <InternalCard {...props} />;
});

applyDisplayName(Card, 'Card');
export default Card;
