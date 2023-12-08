// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect } from 'react';
import { Box, SpaceBetween } from '~components';
import LiveRegion from '~components/internal/components/live-region';

export default function LiveRegionContentTestPage() {
  useEffect(() => {
    const observer = new MutationObserver(mutationList => {
      for (const mutation of mutationList) {
        if (
          mutation.type === 'childList' &&
          mutation.target instanceof HTMLElement &&
          mutation.target.hasAttribute('aria-live') &&
          mutation.target.textContent
        ) {
          const announcementDiv = document.createElement('div');
          announcementDiv.textContent = mutation.target.textContent;
          document.querySelector('#announcements')!.append(announcementDiv);
        }
      }
    });
    observer.observe(document.body, { attributes: false, childList: true, subtree: true });
  }, []);

  return (
    <Box margin="m">
      <SpaceBetween size="m">
        <h1>Live region content test</h1>

        <div>
          <strong>Live region</strong>

          <div style={{ padding: 8, border: '1px solid black' }}>
            <LiveRegion visible={true}>
              <article>
                <div>Before list</div>
                <ul>
                  <ListItem>List item 1</ListItem>
                  <ListItem>List item 2</ListItem>
                  <ListItem isLast={true}>List item 3</ListItem>
                </ul>
                <div>After list</div>
              </article>
            </LiveRegion>
          </div>
        </div>

        <div>
          <strong>Live region announcement</strong>

          <div id="announcements" style={{ padding: 8, border: '1px solid black' }}></div>
        </div>
      </SpaceBetween>
    </Box>
  );
}

function ListItem({ children, isLast }: { children: React.ReactNode; isLast?: boolean }) {
  return (
    <li>
      {children}
      {!isLast && <span style={{ clipPath: 'circle(0)' }}>,</span>}
    </li>
  );
}
