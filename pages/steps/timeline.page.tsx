// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Link from '~components/link';
import SpaceBetween from '~components/space-between';
import Steps, { StepsProps } from '~components/steps';

import ScreenshotArea from '../utils/screenshot-area';

const timelineWithLinks: ReadonlyArray<StepsProps.Step> = [
  {
    headerStart: <time dateTime="2024-05-01T15:01:23Z">3:01:23 PM</time>,
    header: <Link href="#m1">Provided preferences</Link>,
  },
  {
    headerStart: <time dateTime="2024-05-01T15:03:10Z">3:03:10 PM</time>,
    header: <Link href="#m2">Created environment: CloudAppConfig</Link>,
  },
  {
    headerStart: <time dateTime="2024-05-01T15:04:45Z">3:04:45 PM</time>,
    header: 'Waiting for approval',
  },
];

const timelineWithStatuses: ReadonlyArray<StepsProps.Step> = [
  {
    headerStart: <time dateTime="2024-05-01T15:01:23Z">3:01:23 PM</time>,
    status: 'success',
    statusIconAriaLabel: 'Success',
    header: 'Created environment',
  },
  {
    headerStart: <time dateTime="2024-05-01T15:03:10Z">3:03:10 PM</time>,
    status: 'loading',
    statusIconAriaLabel: 'Loading',
    header: 'Checking EKS clusters',
  },
  {
    headerStart: <time dateTime="2024-05-01T15:04:45Z">3:04:45 PM</time>,
    status: 'error',
    statusIconAriaLabel: 'Error',
    header: 'Validation failed',
    details: 'One or more resources could not be validated.',
  },
];

const mixedTimeline: ReadonlyArray<StepsProps.Step> = [
  {
    headerStart: <time dateTime="2024-05-01T15:01:23Z">3:01:23 PM</time>,
    status: 'success',
    statusIconAriaLabel: 'Success',
    header: 'Created environment',
  },
  {
    // No headerStart: the leading column is still reserved so the dots stay aligned.
    header: <Link href="#m2">Provided preferences</Link>,
  },
  {
    headerStart: <time dateTime="2024-05-01T15:06:02Z">3:06:02 PM</time>,
    header: 'Waiting for approval',
  },
];

// Values of very different lengths, to verify the fixed-width column keeps the dots/rail aligned
// and long values wrap (rather than truncate or push the content column around). The long value is
// placed in the middle to check that a wrapping value only grows its own row and keeps its dot on
// the first line.
const varyingWidthTimeline: ReadonlyArray<StepsProps.Step> = [
  {
    headerStart: <time dateTime="2024-05-01T09:00:00Z">9:00 AM</time>,
    status: 'success',
    statusIconAriaLabel: 'Success',
    header: 'Short timestamp',
  },
  {
    headerStart: (
      <time dateTime="2024-12-31T23:59:59+14:00" title="December 31, 2024, 11:59:59 PM (UTC+14:00)">
        December 31, 2024, 11:59:59 PM (UTC+14:00)
      </time>
    ),
    status: 'error',
    statusIconAriaLabel: 'Error',
    header: 'Long absolute timestamp that wraps inside the fixed-width column',
    details: 'The leading column width stays constant; this long value wraps and only grows this row.',
  },
  {
    headerStart: '2 hr ago',
    header: 'Relative, short',
  },
];

export default function StepsTimelinePage() {
  return (
    <ScreenshotArea disableAnimations={true}>
      <h1>Steps — timeline</h1>
      <SpaceBetween size="xxl">
        <div>
          <h2>Timeline (timestamps + neutral dots, anchor-link labels)</h2>
          <Steps ariaLabel="Conversation overview" steps={timelineWithLinks} />
        </div>

        <div>
          <h2>Timeline combined with status icons</h2>
          <Steps ariaLabel="Deployment timeline" steps={timelineWithStatuses} />
        </div>

        <div>
          <h2>Mixed steps (some without a timestamp)</h2>
          <Steps ariaLabel="Mixed timeline" steps={mixedTimeline} />
        </div>

        <div>
          <h2>Varying widths (short vs. long timestamps)</h2>
          <Steps ariaLabel="Varying width timeline" steps={varyingWidthTimeline} />
        </div>
      </SpaceBetween>
    </ScreenshotArea>
  );
}
