// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { AppLayout, BreadcrumbGroup } from '~components';

function App() {
  return (
    <AppLayout
      contentType="wizard"
      breadcrumbs={
        <BreadcrumbGroup
          items={[
            { text: 'System', href: '#' },
            { text: 'Components', href: '#components' },
            { text: 'Create component', href: '#components/create' },
          ]}
          ariaLabel="Breadcrumbs"
        />
      }
      content={<>Hello</>}
    />
  );
}

export default App;
