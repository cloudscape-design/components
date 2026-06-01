// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

import { Box, ColumnLayout, ItemCard } from '~components';

import { SimplePage } from '../app/templates';

import styles from './style-v2.scss';

export default function StyleV2ItemCardPage() {
  const cards = [
    { id: '1', header: 'Lambda Function', description: 'Serverless compute', cls: styles['card-one'] },
    { id: '2', header: 'DynamoDB Table', description: 'NoSQL database', cls: styles['card-two'] },
    { id: '3', header: 'S3 Bucket', description: 'Object storage', cls: styles['card-three'] },
  ];

  return (
    <SimplePage title="ItemCard with Style API v2" screenshotArea={{}}>
      <ColumnLayout columns={3}>
        {cards.map(card => (
          <ItemCard key={card.id} header={card.header} footer="View details" classNames={{ root: card.cls }}>
            <Box color="text-body-secondary">{card.description}</Box>
            <div className={styles['image-placeholder']} />
          </ItemCard>
        ))}
      </ColumnLayout>
    </SimplePage>
  );
}
