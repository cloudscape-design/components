// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Container from '~components/container';
import Header from '~components/header';

export function DialogDemo({ children, minBlockSize = 440 }: { children: React.ReactNode; minBlockSize?: number }) {
  return (
    <div style={{ maxInlineSize: 520 }}>
      <Container header={<Header variant="h2">Generative AI assistant</Header>}>
        <div style={{ minBlockSize, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
          {children}
        </div>
      </Container>
    </div>
  );
}
