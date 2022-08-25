// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';
import ScreenshotArea from './utils/screenshot-area';
import SpaceBetween from '~components/space-between';
import Container from '~components/container';
import Button from '~components/button';
import Link from '~components/link';
import Input from '~components/input';

import FocusPortal from '~components/internal/components/focus-portal';

export default function FocusProxyPage() {
  const [container, setContainer] = React.useState<HTMLDivElement | null>(null);

  return (
    <>
      <h1>Focus proxy demo</h1>
      <ScreenshotArea>
        <SpaceBetween size="s" direction="vertical">
          <Container>
            Some text for demonstration. <Button>Before portal</Button>
          </Container>

          {container && (
            <FocusPortal container={container}>
              <Container>
                <SpaceBetween size="xs">
                  <Button>Inside portal</Button>
                  <div>
                    Arbitrary content goes here, no refs needed. <Link external={true}>Hello!</Link>
                  </div>
                  <Input value="input" readOnly={true} />
                </SpaceBetween>
              </Container>
            </FocusPortal>
          )}

          <Container>
            <Button>After portal</Button> <Link>Final tabbable content</Link>
          </Container>

          <div ref={setContainer} />
        </SpaceBetween>
      </ScreenshotArea>
    </>
  );
}
