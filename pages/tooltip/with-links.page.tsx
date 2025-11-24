// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Button from '~components/button';
import Link from '~components/link';
import SpaceBetween from '~components/space-between';
import Tooltip from '~components/tooltip';

export default function TooltipWithLinks() {
  return (
    <div style={{ padding: '50px' }}>
      <h1>Tooltip with Links Examples</h1>

      <SpaceBetween size="l">
        <div>
          <h2>Simple Link in Tooltip</h2>
          <Tooltip
            content={
              <>
                Visit our{' '}
                <Link href="https://cloudscape.design" external={true}>
                  documentation
                </Link>{' '}
                for more info
              </>
            }
            trigger="hover-focus"
            disableHoverableContent={false}
          >
            <Button>Hover for tooltip with link</Button>
          </Tooltip>
        </div>

        <div>
          <h2>Multiple Links</h2>
          <Tooltip
            content={
              <div>
                <div>Learn more:</div>
                <ul style={{ margin: '4px 0', paddingLeft: '20px' }}>
                  <li>
                    <Link href="https://cloudscape.design/components" external={true}>
                      Components
                    </Link>
                  </li>
                  <li>
                    <Link href="https://cloudscape.design/patterns" external={true}>
                      Patterns
                    </Link>
                  </li>
                </ul>
              </div>
            }
            trigger="hover-focus"
            disableHoverableContent={false}
          >
            <Button variant="primary">Multiple links</Button>
          </Tooltip>
        </div>

        <div>
          <h2>Rich Content with Formatting</h2>
          <Tooltip
            content={
              <div>
                <strong>Important:</strong> This feature requires additional setup.{' '}
                <Link href="#setup" variant="primary">
                  View setup guide
                </Link>
              </div>
            }
            trigger="hover-focus"
            disableHoverableContent={false}
          >
            <Button>Rich content tooltip</Button>
          </Tooltip>
        </div>
      </SpaceBetween>
    </div>
  );
}
