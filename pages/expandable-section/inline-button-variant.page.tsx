// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import ExpandableSection from '~components/expandable-section';
import SpaceBetween from '~components/space-between';
import Button from '~components/button';

import ScreenshotArea from '../utils/screenshot-area';

export default function SimpleContainers() {
  const [expanded, setExpanded] = useState(false);
  return (
    <article>
      <h1>Expandable Default Variants Section with interactive elements</h1>
      <ScreenshotArea>
        <h2>Default - unchanged</h2>
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

        <h2>Default with Actions Example 1</h2>
        <SpaceBetween size="xs">
          <ExpandableSection
            headerText="Security group rule 1 (TCP, 22, 0.0.0.0/0)"
            headerActions={<Button variant="inline-link">Remove</Button>}
          >
            Configuration Form here
          </ExpandableSection>
          <ExpandableSection
            headerText="Security group rule 2 (TCP, 0)"
            headerActions={<Button variant="inline-link">Remove</Button>}
          >
            Configuration Form here
          </ExpandableSection>
          <ExpandableSection
            headerText="Security group rule 3 (TCP, 22)"
            headerActions={<Button variant="inline-link">Remove</Button>}
          >
            Configuration Form here
          </ExpandableSection>
        </SpaceBetween>

        <h2>Default with Actions Example 2</h2>
        <SpaceBetween size="xs">
          <ExpandableSection headerText="Volume 1 (AMI Root) (Custom) (8 GiB, EBS)">
            Configuration Form here
          </ExpandableSection>
          <ExpandableSection
            headerText="Volume 2 (Custom) (8 GiB, EBS)"
            headerActions={<Button variant="inline-link">Remove</Button>}
          >
            Configuration Form here
          </ExpandableSection>
          <ExpandableSection
            headerText="Volume 3 (Custom) (16 GiB, EBS)"
            headerActions={<Button variant="inline-link">Remove</Button>}
          >
            Configuration Form here
          </ExpandableSection>
          <ExpandableSection
            headerText="Volume 4 (Custom) (64 GiB, EBS, General Purpose SSD (gp3))"
            headerActions={<Button variant="inline-link">Remove</Button>}
          >
            Configuration Form here
          </ExpandableSection>
        </SpaceBetween>
      </ScreenshotArea>
    </article>
  );
}
