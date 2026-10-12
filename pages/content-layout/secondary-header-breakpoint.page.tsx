// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Box from '~components/box';
import Button from '~components/button';
import ContentLayout, { ContentLayoutProps } from '~components/content-layout';
import FormField from '~components/form-field';
import Header from '~components/header';
import Select from '~components/select';
import SpaceBetween from '~components/space-between';

import { Containers } from '../app-layout/utils/content-blocks';
import ScreenshotArea from '../utils/screenshot-area';

const breakpointOptions: ReadonlyArray<{ value: ContentLayoutProps.SecondaryHeaderBreakpoint }> = [
  { value: 'xxs' },
  { value: 'xs' },
  { value: 's' },
  { value: 'm' },
  { value: 'l' },
  { value: 'xl' },
];

function QuickLaunch() {
  return (
    <Box padding="m">
      <SpaceBetween size="s">
        <Box variant="h3" padding="n">
          Quick launch
        </Box>
        <SpaceBetween size="xs">
          <Button fullWidth={true}>Launch instance</Button>
          <Button fullWidth={true}>Create volume</Button>
          <Button fullWidth={true}>View documentation</Button>
        </SpaceBetween>
      </SpaceBetween>
    </Box>
  );
}

export default function () {
  const [breakpoint, setBreakpoint] = useState<ContentLayoutProps.SecondaryHeaderBreakpoint>('xs');

  return (
    <main>
      <Box padding="m">
        <FormField label="secondaryHeaderBreakpoint">
          <Select
            selectedOption={{ value: breakpoint }}
            options={breakpointOptions}
            onChange={({ detail }) =>
              setBreakpoint(detail.selectedOption.value as ContentLayoutProps.SecondaryHeaderBreakpoint)
            }
          />
        </FormField>
      </Box>
      <ScreenshotArea gutters={false}>
        <ContentLayout
          secondaryHeaderBreakpoint={breakpoint}
          header={
            <div style={{ padding: '20px 40px 0' }}>
              <Header
                variant="h1"
                description="Adjust the breakpoint above to control when the secondary header stacks underneath the header."
              >
                Service homepage
              </Header>
            </div>
          }
          secondaryHeader={
            <div style={{ padding: '20px 40px 0' }}>
              <QuickLaunch />
            </div>
          }
        >
          <div style={{ padding: '0 40px 20px' }}>
            <Containers />
          </div>
        </ContentLayout>
      </ScreenshotArea>
    </main>
  );
}
