// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import CodeView from '@cloudscape-design/code-view/code-view';

import { Section } from './utils';

const codeSnippet = `import { applyTheme } from '@cloudscape-design/components/theming';

applyTheme({
  theme: {
    tokens: {
      colorBackgroundLayoutMain: '#f5f5f5',
      borderRadiusContainer: '8px',
    },
  },
});`;

export default function CodeViewSection() {
  return (
    <Section header="Code view" level="h2" description="Imported from @cloudscape-design/code-view">
      <CodeView content={codeSnippet} lineNumbers={true} />
    </Section>
  );
}
