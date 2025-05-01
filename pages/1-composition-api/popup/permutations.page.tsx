// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';
import { useState } from 'react';

import { Badge, Box, ColumnLayout, Link, SpaceBetween, TextContent } from '~components';
import Button from '~components/button';
import Dropdown from '~components/internal/components/dropdown';

import ScreenshotArea from '../../utils/screenshot-area';
import { ListContent, NotificationList } from './list-content';

export default function DropdownScenario() {
  const [open1, setOpen1] = useState(false);
  const [open2, setOpen2] = useState(false);
  return (
    <ScreenshotArea>
      <TextContent>
        <h1>Popup/dropdown demo</h1>
        <p>
          This example shows how making more lower level components available through composition, you can build new
          patterns.
        </p>
        <ol>
          <li>
            The first example creates a notifications center by combining a dropdown component with a custom list item
          </li>
          <li>The second example shows how a dropdown can be used to build a megamenu</li>
        </ol>
        <br />
      </TextContent>

      <SpaceBetween size="l">
        {/* 1st example */}
        <div id="notifications">
          <Box>Notifications</Box>
          <Dropdown
            trigger={<Button variant="icon" iconName="notification" onClick={() => setOpen1(!open1)} />}
            open={open1}
            onDropdownClose={() => setOpen1(false)}
            header={
              <span style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 20px' }}>
                <SpaceBetween size="xs" direction="horizontal" alignItems="center">
                  <Box variant="h4">Notifications</Box>
                  <Badge color="blue">10</Badge>
                </SpaceBetween>
                <Link href="#" variant="primary">
                  See all
                </Link>
              </span>
            }
            minWidth={300}
            stretchWidth={false}
          >
            <NotificationList n={10} />
          </Dropdown>
        </div>

        {/* 2nd example */}
        <div id="largeDropDown">
          <Box>Megamenu</Box>
          <Dropdown
            trigger={
              <Button
                variant="link"
                iconAlign="right"
                iconName={open2 ? 'angle-up' : 'angle-down'}
                onClick={() => setOpen2(!open2)}
              >
                Build
              </Button>
            }
            open={open2}
            onDropdownClose={() => setOpen2(false)}
            minWidth={500}
            stretchBeyondTriggerWidth={true}
          >
            <Box padding="m">
              <ColumnLayout columns={3} variant="text-grid">
                <SpaceBetween size="s">
                  <div>
                    <Box variant="h4">IDE & Applications</Box>
                    <ListContent n={2} />
                  </div>
                  <div>
                    <Box variant="h4">Data Analysis & Prep</Box>
                    <ListContent n={4} />
                  </div>
                </SpaceBetween>
                <div>
                  <Box variant="h4">Machine Learning Studio</Box>
                  <ListContent n={7} />
                </div>
                <div>
                  <Box variant="h4">Gen AI Studio</Box>
                  <ListContent n={4} />
                </div>
              </ColumnLayout>
            </Box>
          </Dropdown>
        </div>
      </SpaceBetween>
    </ScreenshotArea>
  );
}
