// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import ExpandableSection from '~components/expandable-section';
import Link from '~components/link';
import SpaceBetween from '~components/space-between';

import ScreenshotArea from '../utils/screenshot-area';

export default function DescriptionLinksPage() {
  return (
    <article>
      <h1>ExpandableSection — headerDescription with links</h1>
      <ScreenshotArea>
        <SpaceBetween size="l">
          <h2>Container variant — description with inline link</h2>
          <ExpandableSection
            variant="container"
            headerText="Bucket versioning"
            headerDescription={
              <>
                Enable versioning to keep multiple versions of an object. <Link href="#learn-more">Learn more</Link>
              </>
            }
            defaultExpanded={true}
          >
            Versioning content here.
          </ExpandableSection>

          <h2>Default variant — description with inline link</h2>
          <ExpandableSection
            variant="default"
            headerText="Advanced settings"
            headerDescription={
              <>
                These settings affect billing. <Link href="#pricing">See pricing</Link>
              </>
            }
          >
            Advanced settings content here.
          </ExpandableSection>

          <h2>Footer variant — description with inline link</h2>
          <ExpandableSection
            variant="footer"
            headerText="Additional options"
            headerDescription={
              <>
                Optional configuration. <Link href="#docs">Read the docs</Link>
              </>
            }
          >
            Footer content here.
          </ExpandableSection>

          <h2>Stacked variant — description with inline link</h2>
          <ExpandableSection
            variant="stacked"
            headerText="Network settings"
            headerDescription={
              <>
                Configure VPC and subnets. <Link href="#vpc-docs">VPC documentation</Link>
              </>
            }
          >
            Network settings content here.
          </ExpandableSection>

          <h2>String description (backward-compatible)</h2>
          <ExpandableSection
            variant="container"
            headerText="Tags"
            headerDescription="A tag is a label that you assign to an AWS resource."
          >
            Tags content here.
          </ExpandableSection>
        </SpaceBetween>
      </ScreenshotArea>
    </article>
  );
}
