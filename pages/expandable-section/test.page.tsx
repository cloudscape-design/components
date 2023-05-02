// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import ExpandableSection from '~components/expandable-section';

export default function ExpandableSectionTestPage() {
  return (
    <article>
      <h1>Expandable Section Test Page</h1>

      <button id="focus-target">Focus target</button>

      <ExpandableSection headerText="Static website hosting">
        After you enable your S3 bucket for static website hosting, web browsers can access your content through the
        Amazon S3 website endpoint for the bucket.
      </ExpandableSection>
    </article>
  );
}
