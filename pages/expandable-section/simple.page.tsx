// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import ExpandableSection from '~components/expandable-section';
import SpaceBetween from '~components/space-between';
import Button from '~components/button';
import StatusIndicator from '~components/status-indicator';

import ScreenshotArea from '../utils/screenshot-area';

export default function SimpleContainers() {
  const [expanded, setExpanded] = useState(false);
  return (
    <article>
      <h1>Simple Expandable Section</h1>
      <ScreenshotArea>
        <h2>Default</h2>
        <SpaceBetween size="xs">
          <ExpandableSection headerText="Static website hosting">
            After you enable your S3 bucket for static website hosting, web browsers can access your content through the
            Amazon S3 website endpoint for the bucket.
          </ExpandableSection>
          <ExpandableSection
            headerText="Static website hosting (controlled)"
            expanded={expanded}
            onChange={({ detail }) => setExpanded(detail.expanded)}
          >
            After you enable your S3 bucket for static website hosting, web browsers can access your content through the
            Amazon S3 website endpoint for the bucket.
          </ExpandableSection>
          <ExpandableSection headerText="Static website hosting" defaultExpanded={true}>
            After you enable your S3 bucket for static website hosting, web browsers can access your content through the
            Amazon S3 website endpoint for the bucket.
          </ExpandableSection>
        </SpaceBetween>

        <h2>Footer</h2>
        <SpaceBetween size="xs">
          <ExpandableSection headerText="Versioning" variant="footer">
            Versioning provides an additional level of protection by providing a way to recover from accidental
            overwrites or expirations.
          </ExpandableSection>

          <h2>Navigation</h2>
          <ExpandableSection headerText="Versioning" variant="navigation" defaultExpanded={true}>
            Versioning provides an additional level of protection by providing a way to recover from accidental
            overwrites or expirations.
          </ExpandableSection>
        </SpaceBetween>

        <h2>Container</h2>
        <SpaceBetween size="xs">
          <ExpandableSection
            headerText={'Header component'}
            headerCounter={'(5)'}
            variant="container"
            defaultExpanded={true}
          >
            Verify or edit the settings below.
          </ExpandableSection>

          <ExpandableSection
            headerText={'Header component'}
            headerCounter={'(5)'}
            variant="container"
            defaultExpanded={false}
            headerActions={<StatusIndicator>Warning</StatusIndicator>}
          >
            Verify or edit the settings below.
          </ExpandableSection>
          <ExpandableSection
            headerText={'Header component'}
            headerCounter={'(5)'}
            variant="container"
            defaultExpanded={false}
            headerActions={<Button>Action</Button>}
          >
            Verify or edit the settings below.
          </ExpandableSection>
        </SpaceBetween>
      </ScreenshotArea>
    </article>
  );
}
