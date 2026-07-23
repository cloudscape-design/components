// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Button from '~components/button';
import ExpandableSection from '~components/expandable-section';
import SpaceBetween from '~components/space-between';

import ScreenshotArea from '../utils/screenshot-area';

// AWSUI-60837: On narrow containers the header actions should stay inline and let the
// header text wrap first, only dropping underneath the title when there is genuinely
// not enough room — instead of overflowing or clipping the content.

const actions = (
  <SpaceBetween direction="horizontal" size="xs">
    <Button variant="inline-link" ariaLabel="Edit">
      Edit
    </Button>
    <Button variant="inline-link" ariaLabel="Remove">
      Remove
    </Button>
  </SpaceBetween>
);

const widths = [640, 360, 240, 160];

export default function HeaderActionsWrapPage() {
  return (
    <article>
      <h1>Expandable section header actions wrapping (AWSUI-60837)</h1>
      <p>
        Each block below renders the same expandable sections at a progressively narrower width. The header text should
        wrap while the actions stay inline; the actions should only drop underneath the title on the very narrow widths
        rather than clipping.
      </p>
      <ScreenshotArea>
        <SpaceBetween size="l">
          {widths.map(width => (
            <div key={width} data-testid={`width-${width}`}>
              <h2>Container width: {width}px</h2>
              <div style={{ inlineSize: width, border: '1px dashed #879596', padding: 8 }}>
                <SpaceBetween size="s">
                  <ExpandableSection
                    variant="default"
                    headerText="Volume 4 (Custom) (64 GiB, EBS, General Purpose SSD (gp3))"
                    headerActions={actions}
                    defaultExpanded={true}
                  >
                    Configuration form here.
                  </ExpandableSection>

                  <ExpandableSection
                    variant="default"
                    headerText="Advanced network configuration"
                    headerActions={
                      <Button variant="inline-link" ariaLabel="Manage">
                        Manage
                      </Button>
                    }
                  >
                    Single action, medium-length header text.
                  </ExpandableSection>

                  <ExpandableSection
                    variant="inline"
                    headerText="Supercalifragilisticexpialidocious-configuration-identifier-name"
                    headerActions={actions}
                  >
                    Inline variant with an intentionally long unbreakable token in the header text.
                  </ExpandableSection>
                </SpaceBetween>
              </div>
            </div>
          ))}
        </SpaceBetween>
      </ScreenshotArea>
    </article>
  );
}
