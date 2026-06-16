// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
// @cloudscape-design/code-view not available — replaced with <pre>
import React from 'react';

import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import Tabs from '@cloudscape-design/components/tabs';

import { codeSnippets } from '../details-code-snippets';

export const DistributionDetails = () => {
  return (
    <Container header={<Header variant="h2">Distribution configuration details</Header>}>
      <Tabs
        tabs={[
          {
            label: 'JSON',
            id: 'json',
            content: <pre style={{ overflow: 'auto', fontSize: '13px' }}>{codeSnippets.json}</pre>,
          },
          {
            label: 'YAML',
            id: 'yaml',
            content: <pre style={{ overflow: 'auto', fontSize: '13px' }}>{codeSnippets.yaml}</pre>,
          },
          {
            label: 'XML',
            id: 'xml',
            content: <pre style={{ overflow: 'auto', fontSize: '13px' }}>{codeSnippets.xml}</pre>,
          },
        ]}
      />
    </Container>
  );
};
