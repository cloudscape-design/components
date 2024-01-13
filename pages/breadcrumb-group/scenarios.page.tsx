// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';

import BreadcrumbGroup from '~components/breadcrumb-group';
import ScreenshotArea from '../utils/screenshot-area';
const testCases = [
  ['First'],
  ['First', 'Second'],
  ['First', 'Second', 'Third'],
  ['First that is quite long', 'Second', 'Third that is quite long'],
  ['First', 'Second', 'Third that is quite long'],
  ['First', 'Second', 'Third', 'Fourth', 'Fifth', 'Sixth'],
  [
    'First or rather some more text',
    'Second',
    'Third',
    'Some very very long text here to make it wrap on 1200px',
    'Even-longer-without-white-space',
    'And if it was not enough, another breadcrumb here',
  ],
];

export default function ButtonDropdownPage() {
  return (
    <ScreenshotArea>
      <article>
        <h1>BreadcrumbGroup variations</h1>
        {testCases.map((testcase, index) => (
          <BreadcrumbGroup
            key={index}
            ariaLabel={'Navigation' + index}
            expandAriaLabel="Show path"
            items={testcase.map((text, i) => ({ text, href: `#item-${index}-${i}` }))}
          />
        ))}
      </article>
    </ScreenshotArea>
  );
}
