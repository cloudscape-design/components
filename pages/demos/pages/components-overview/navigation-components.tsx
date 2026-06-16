// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React, { useState } from 'react';

import AnchorNavigation from '@cloudscape-design/components/anchor-navigation';
import BreadcrumbGroup from '@cloudscape-design/components/breadcrumb-group';
import Grid from '@cloudscape-design/components/grid';
import Link from '@cloudscape-design/components/link';
import SideNavigation from '@cloudscape-design/components/side-navigation';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Tabs from '@cloudscape-design/components/tabs';

import { Section } from './utils';

export default function NavigationComponents() {
  const [activeTabId, setActiveTabId] = useState('tab1');
  const [activeHref, setActiveHref] = useState('#/parent-page/child-page1');

  return (
    <Section header="Navigation components">
      <Grid
        gridDefinition={[
          { colspan: { default: 2, s: 2 } },
          { colspan: { default: 4, m: 2 } },
          { colspan: { default: 4, m: 4 } },
          { colspan: { default: 6, m: 4 } },
        ]}
      >
        <AnchorNavigation
          activeHref="#section2"
          anchors={[
            {
              text: 'Section 1',
              href: '#playground',
              level: 1,
            },
            {
              text: 'Section 2',
              href: '#section2',
              level: 1,
            },
            {
              text: 'Section 3',
              href: '#section3',
              level: 1,
            },
            { text: 'Section 4', href: '#section4', level: 1 },
          ]}
        />

        <SideNavigation
          activeHref={activeHref}
          header={{ href: '#/', text: 'Side navigation' }}
          onFollow={event => {
            if (!event.detail.external) {
              event.preventDefault();
              setActiveHref(event.detail.href);
            }
          }}
          items={[
            { type: 'link', text: 'Page 1', href: '#/page1' },
            {
              type: 'expandable-link-group',
              text: 'Parent page',
              href: '#/parent-page',
              items: [
                {
                  type: 'link',
                  text: 'Child page 1',
                  href: '#/parent-page/child-page1',
                },
                {
                  type: 'link',
                  text: 'Child page 2',
                  href: '#/parent-page/child-page2',
                },
              ],
            },
            { type: 'link', text: 'Page 2', href: '#/page2' },
            { type: 'link', text: 'Page 3', href: '#/page3' },
          ]}
        />

        <Tabs
          activeTabId={activeTabId}
          onChange={({ detail }) => setActiveTabId(detail.activeTabId)}
          tabs={[
            { id: 'tab1', label: 'Tab 1', content: 'Tab 1 Content' },
            { id: 'tab2', label: 'Tab 2', content: 'Tab 2 Content' },
            { id: 'tab3', label: 'Tab 3', content: 'Tab 3 Content', disabled: true },
          ]}
        />

        <SpaceBetween size="s">
          <BreadcrumbGroup
            items={[
              { text: 'Home', href: '#' },
              { text: 'Another page', href: '#' },
              { text: 'Testing', href: '#' },
            ]}
          />

          <Link href="#" variant="primary">
            Primary anchor link
          </Link>
          <Link href="#" variant="secondary" className="secondary-link">
            Secondary anchor link
          </Link>
          <Link onFollow={() => alert('You clicked the button link!')}>Button link</Link>
        </SpaceBetween>
      </Grid>
    </Section>
  );
}
