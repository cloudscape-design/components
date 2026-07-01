// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';

import { ActionCard, Icon, SpaceBetween } from '~components';

import { SimplePage } from '../app/templates';

export default function ActionCardLinkPage() {
  const [lastFollowed, setLastFollowed] = React.useState<string | null>(null);

  return (
    <SimplePage title="Action Card link page" screenshotArea={{}}>
      <SpaceBetween size="l">
        <div>Last followed: {lastFollowed ?? 'None'}</div>

        <div style={{ maxInlineSize: '400px' }}>
          <SpaceBetween size="m">
            <ActionCard
              header={<b>Navigates with href</b>}
              description="Renders as an anchor element"
              href="#in-page"
              icon={<Icon name="angle-right" />}
              onFollow={event => {
                event.preventDefault();
                setLastFollowed('Header card');
              }}
            />

            <ActionCard
              ariaLabel="Standalone link card"
              href="#standalone"
              icon={<Icon name="angle-right" />}
              iconVerticalAlignment="center"
              onFollow={event => {
                event.preventDefault();
                setLastFollowed('Standalone card');
              }}
            >
              Standalone link card
            </ActionCard>

            <ActionCard
              header={<b>External link (new tab)</b>}
              description="Opens in a new tab"
              href="https://cloudscape.design/"
              target="_blank"
              icon={<Icon name="external" />}
            />

            <ActionCard
              header={<b>Disabled link</b>}
              description="href is removed when disabled"
              href="#disabled"
              disabled={true}
            />
          </SpaceBetween>
        </div>
      </SpaceBetween>
    </SimplePage>
  );
}
