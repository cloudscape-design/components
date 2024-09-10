// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Box from '~components/box';
import BreadcrumbGroup from '~components/breadcrumb-group';
import SpaceBetween from '~components/space-between';

import ScreenshotArea from '../utils/screenshot-area';

let counter = 0;

export default function ResponsiveBreadcrumbsPage() {
  return (
    <ScreenshotArea disableAnimations={true}>
      <article>
        <Box padding="xl">
          <SpaceBetween size="xxl">
            <h1>Responsive breadcrumbs</h1>
            <ResponsiveBreadcrumbs
              widths={[900, 800, 700, 600, 500, 400, 300, 200]}
              items={[
                'A',
                'Longer breadrcumb',
                'ABC',
                'Another even longer breadcrumb',
                'ABCDEF',
                'ABCDEFGHIJsjbdkasbdhjabsjdhasjhdabsjd',
              ]}
            />
            <ResponsiveBreadcrumbs widths={[150]} items={['Small', 'Small', 'Small', 'Small', 'Small']} />
            <ResponsiveBreadcrumbs
              widths={[150]}
              items={[
                'Large breadcrumb',
                'Large breadcrumb',
                'Large breadcrumb',
                'Large breadcrumb',
                'Large breadcrumb',
              ]}
            />
            <ResponsiveBreadcrumbs widths={[100]} items={['Small', 'Small']} />
            <ResponsiveBreadcrumbs widths={[100]} items={['Large breadcrumb', 'Large breadcrumb']} />
            <ResponsiveBreadcrumbs widths={[100]} items={['Large breadcrumb', 'Small']} />
            <ResponsiveBreadcrumbs widths={[30]} items={['Small']} />
            <ResponsiveBreadcrumbs widths={[30]} items={['Large breadcrumb']} />
          </SpaceBetween>
        </Box>
      </article>
    </ScreenshotArea>
  );
}

interface ResponsiveBreadcrumbsProps {
  items: Array<string>;
  widths: Array<number>;
}

const ResponsiveBreadcrumbs = ({ items, widths }: ResponsiveBreadcrumbsProps) => {
  const breadcrumbs = items.map(text => ({ text, href: `#` }));
  return (
    <SpaceBetween size="xxl">
      {widths.map((width, key) => (
        <div key={key} style={{ width, borderInlineEnd: '2px solid blue' }}>
          <BreadcrumbGroup
            key={key}
            ariaLabel={`label - ${counter++}`}
            expandAriaLabel="Show path for long text"
            items={breadcrumbs}
          />
        </div>
      ))}
    </SpaceBetween>
  );
};
