// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useState } from 'react';

import { TokenGroup, TokenGroupProps } from '~components';

import { SimplePage } from '../app/templates';

import styles from './style-v2.scss';

const initialTokens: TokenGroupProps.Item[] = [
  { label: 'us-east-1' },
  { label: 'eu-west-1' },
  { label: 'ap-southeast-1' },
  { label: 'us-west-2' },
];

export default function StyleV2TokenPage() {
  const [pillTokens, setPillTokens] = useState<TokenGroupProps.Item[]>(initialTokens);
  const [outlineTokens, setOutlineTokens] = useState<TokenGroupProps.Item[]>([
    { label: 'Production' },
    { label: 'Staging' },
    { label: 'Development' },
  ]);
  return (
    <SimplePage title="Token with Style API v2" screenshotArea={{}}>
      <TokenGroup
        items={pillTokens}
        onDismiss={({ detail }) => setPillTokens(items => items.filter((_, i) => i !== detail.itemIndex))}
        classNames={{ root: styles['token-pill'] }}
      />

      <TokenGroup
        items={outlineTokens}
        onDismiss={({ detail }) => setOutlineTokens(items => items.filter((_, i) => i !== detail.itemIndex))}
        classNames={{ root: styles['token-outline'] }}
      />
    </SimplePage>
  );
}
