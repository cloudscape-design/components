// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Button from '~components/button';
import ExpandableSection from '~components/expandable-section';
import InternalExpandableSection from '~components/expandable-section/internal';

export default function ExpandableSectionTestPage() {
  return (
    <article>
      <h1>Expandable Section Test Page</h1>

      <button id="focus-target">Focus target</button>

      <ExpandableSection headerText="Static website hosting">
        After you enable your S3 bucket for static website hosting, web browsers can access your content through the
        Amazon S3 website endpoint for the bucket.
      </ExpandableSection>

      <div data-testid="end-position-single-row">
        <InternalExpandableSection
          variant="default"
          headerText="End position section"
          __expandIconPosition="end"
          headerActions={<Button>Action</Button>}
        >
          Content of the end-position expandable section used for keyboard toggle and focus tests.
        </InternalExpandableSection>
      </div>

      <div data-testid="end-position-wrapping-header">
        <InternalExpandableSection
          variant="default"
          headerText="This is a long wrapping header text that is intentionally verbose and extended to ensure it wraps to multiple lines when rendered in the test viewport used by integration tests"
          __expandIconPosition="end"
          headerActions={<Button>Action</Button>}
        >
          Content of the wrapping-header end-position expandable section used for the below-caret click test.
        </InternalExpandableSection>
      </div>
    </article>
  );
}
