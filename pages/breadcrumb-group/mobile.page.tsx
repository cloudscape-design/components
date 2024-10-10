// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';

import BreadcrumbGroup from '~components/breadcrumb-group';

import ScreenshotArea from '../utils/screenshot-area';

export default function ButtonDropdownPage() {
  return (
    <ScreenshotArea disableAnimations={true}>
      <article>
        <h1>BreadcrumbGroup mobile</h1>
        <BreadcrumbGroup
          ariaLabel={'Navigation'}
          expandAriaLabel="Show path"
          items={[
            { text: 'Service home', href: '#' },
            { text: 'Another page', href: '#' },
            { text: 'A long page title for a media folder', href: '#' },
            { text: 'Resource bucket 123456789', href: '#' },
            { text: 'CODETEST-Cluster-CodeTest Entities-32697437621-ae 2dd 98c1cfb97f2a1bb842671fba9fb', href: '#' },
          ]}
        />
      </article>
    </ScreenshotArea>
  );
}
