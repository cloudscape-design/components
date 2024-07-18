// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { ExpandableSection } from '~components';
import AnchorNavigation from '~components/anchor-navigation';
import SpaceBetween from '~components/space-between';

import ScreenshotArea from '../utils/screenshot-area';
import { navigateToItem, TextSample } from './utils';

import styles from './styles.scss';

const TextContent = () => {
  return (
    <SpaceBetween size="l">
      <div style={{ padding: '40px' }}>
        <h2 id="section-1">Section 1</h2>
        <TextSample />
        <h3 id="section-1-1">Section 1.1</h3>
        <TextSample />
        <h4 id="section-1-1-1">Section 1.1.1</h4>
        <TextSample />
        <h4 id="section-1-1-2">Section 1.1.2</h4>
        <TextSample />
        <h3 id="section-1-2">Section 1.2</h3>
        <TextSample />
        <h4 id="section-1-2-1">Section 1.2.1</h4>
        <TextSample />
        <h5 id="section-1-2-1-1">Section 1.2.1.1</h5>
        <TextSample />
      </div>
    </SpaceBetween>
  );
};

export default function ExpandableAnchorNavigation() {
  return (
    <article>
      <h1>Anchor navigation in expandable section</h1>
      <ScreenshotArea>
        <SpaceBetween size="l">
          <div className={styles['content-grid']}>
            <TextContent />
            <div>
              <div className={styles['anchor-navigation']}>
                <ExpandableSection variant="footer" headerText="On this page">
                  <AnchorNavigation
                    ariaLabelledby="anchor-nav-heading"
                    onFollow={e => {
                      e.preventDefault();
                      navigateToItem(e.detail.href);
                    }}
                    anchors={[
                      { href: '#section-1', text: 'Section 1', level: 1 },
                      { href: '#section-1-1', text: 'Section 1.1', level: 2 },
                      { href: '#section-1-1-1', text: 'Section 1.1.1', level: 3 },
                      { href: '#section-1-1-2', text: 'Section 1.1.2', level: 3 },
                      { href: '#section-1-2', text: 'Section 1.2', level: 2 },
                      { href: '#section-1-2-1', text: 'Section 1.2.1', level: 3 },
                      { href: '#section-1-2-1-1', text: 'Section 1.2.1.1', level: 4 },
                    ]}
                  />
                </ExpandableSection>
              </div>
            </div>
          </div>
        </SpaceBetween>
      </ScreenshotArea>
    </article>
  );
}
