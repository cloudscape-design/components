// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import Button from '~components/button';
import ScreenshotArea from '../utils/screenshot-area';
import { SpaceBetween } from '~components';

export default function DisabledTooltipsPage() {
  return (
    <ScreenshotArea>
      <h1>Introducing buttons with disabled reason (and loading text) tooltips</h1>
      <SpaceBetween size="l">
        <div>
          <h2>Regular buttons with no tooltips</h2>
          <SpaceBetween direction="horizontal" size="xs">
            <Button>View details</Button>
            <Button disabled={true}>Edit</Button>
            <Button disabled={true}>Delete</Button>
            <Button variant="primary">Create distribution</Button>
          </SpaceBetween>
        </div>

        <div>
          <h2>Button with disabled reason</h2>
          <SpaceBetween direction="horizontal" size="xs">
            <Button>View details</Button>
            <Button disabled={true}>Edit</Button>
            <Button disabled={true} disabledReason="You don't have permissions to delete this resource">
              Delete
            </Button>
            <Button variant="primary">Create distribution</Button>
          </SpaceBetween>
        </div>

        <div>
          <h2>Button with loading text</h2>
          <SpaceBetween direction="horizontal" size="xs">
            <Button>Cancel</Button>
            <Button loading={true} loadingText="Loading next step...">
              Next
            </Button>
          </SpaceBetween>
        </div>
      </SpaceBetween>
    </ScreenshotArea>
  );
}
