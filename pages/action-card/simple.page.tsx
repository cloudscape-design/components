// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';

import { ActionCard, SpaceBetween } from '~components';

import { SimplePage } from '../app/templates';

export default function ActionCardSimplePage() {
  const [clickedCard, setClickedCard] = React.useState<string | null>(null);

  return (
    <SimplePage title="Action Card simple page" screenshotArea={{}}>
      <SpaceBetween size="l">
        <div>Last clicked: {clickedCard ?? 'None'}</div>

        <div style={{ maxInlineSize: '400px' }}>
          <SpaceBetween size="m">
            <ActionCard
              header={<b>EC2 access to S3</b>}
              description="A description of the template/icebreaker"
              iconName="angle-right"
              iconPosition="right"
              iconVerticalAlignment="top"
              onClick={() => setClickedCard('Basic')}
            ></ActionCard>
            <ActionCard
              header={<b>EC2 access to S3</b>}
              description="A description of the template/icebreaker"
              iconName="arrow-right"
              iconPosition="right"
              iconVerticalAlignment="top"
              onClick={() => setClickedCard('Basic')}
            ></ActionCard>
            <ActionCard
              header={<b>Account alias (111112222233333)</b>}
              description="Dev/john.doe@amazon.com"
              iconName="angle-right"
              iconPosition="right"
              iconVerticalAlignment="top"
              onClick={() => setClickedCard('Basic')}
            >
              Logged in 1 minute ago
            </ActionCard>
          </SpaceBetween>
        </div>
      </SpaceBetween>
    </SimplePage>
  );
}
