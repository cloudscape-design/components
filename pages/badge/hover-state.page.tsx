// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';

import Badge from '~components/badge';
import Button from '~components/button';
import Link from '~components/link';
import SpaceBetween from '~components/space-between';
import Tabs from '~components/tabs';

import ScreenshotArea from '../utils/screenshot-area';

export default function BadgeHoverStatePage() {
  return (
    <ScreenshotArea>
      <h1>Badge: hover state in interactive containers</h1>
      <p>
        Hover over each interactive element below to verify the Badge responds visually (subtle brightness shift).
        Implements <a href="https://github.com/cloudscape-design/components/issues/4536">#4536</a>.
      </p>
      <SpaceBetween direction="vertical" size="l">
        <section>
          <h2>Inside Button</h2>
          <SpaceBetween direction="horizontal" size="s">
            <Button>
              Notifications <Badge color="red">3</Badge>
            </Button>
            <Button variant="primary">
              Alerts <Badge color="blue">12</Badge>
            </Button>
            <Button variant="link">
              Items <Badge color="grey">5</Badge>
            </Button>
          </SpaceBetween>
        </section>

        <section>
          <h2>Inside Link</h2>
          <SpaceBetween direction="horizontal" size="s">
            <Link href="#">
              Messages <Badge color="red">7</Badge>
            </Link>
            <Link href="#">
              Updates <Badge color="green">2</Badge>
            </Link>
          </SpaceBetween>
        </section>

        <section>
          <h2>Inside Tabs</h2>
          <Tabs
            tabs={[
              {
                label: (
                  <span>
                    Active <Badge color="blue">4</Badge>
                  </span>
                ),
                id: 'tab1',
                content: <p>Tab 1 content</p>,
              },
              {
                label: (
                  <span>
                    Errors <Badge color="red">2</Badge>
                  </span>
                ),
                id: 'tab2',
                content: <p>Tab 2 content</p>,
              },
              {
                label: (
                  <span>
                    Warnings <Badge color="grey">9</Badge>
                  </span>
                ),
                id: 'tab3',
                content: <p>Tab 3 content</p>,
              },
            ]}
          />
        </section>

        <section>
          <h2>All badge colors in a Button</h2>
          <SpaceBetween direction="horizontal" size="s">
            {(['grey', 'green', 'blue', 'red'] as const).map(color => (
              <Button key={color}>
                {color} <Badge color={color}>99</Badge>
              </Button>
            ))}
          </SpaceBetween>
        </section>
      </SpaceBetween>
    </ScreenshotArea>
  );
}
