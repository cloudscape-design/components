// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useContext } from 'react';
import { Checkbox } from '~components';
import Button from '~components/button';
import Header from '~components/header';
import Link from '~components/link';
import SpaceBetween from '~components/space-between';
import AppContext, { AppContextType } from '../app/app-context';
import ScreenshotArea from '../utils/screenshot-area';

type PageHeadersContext = React.Context<
  AppContextType<{
    overflowHeading: boolean;
  }>
>;

export default function PageHeadersDemo() {
  const {
    urlParams: { overflowHeading = false },
    setUrlParams,
  } = useContext(AppContext as PageHeadersContext);

  return (
    <>
      <Checkbox checked={overflowHeading} onChange={e => setUrlParams({ overflowHeading: e.detail.checked })}>
        Overflow heading
      </Checkbox>
      <ScreenshotArea>
        <Header
          variant="h1"
          actions={
            <SpaceBetween direction="horizontal" size="xs">
              <Button>Button</Button>
              <Button>And Button</Button>
              <Button>And a third Button with very long text</Button>
            </SpaceBetween>
          }
          overflowHeading={overflowHeading}
        >
          My large and long title with buttons
        </Header>

        <Header variant="h1" actions={<Button>Button</Button>} overflowHeading={overflowHeading}>
          My large and long title with single button
        </Header>

        <Header
          variant="h1"
          actions={<Button>Button</Button>}
          info={<Link variant="info">Info</Link>}
          description="This is a page header"
          overflowHeading={overflowHeading}
        >
          Page header with description and info link
        </Header>

        <Header variant="h1" actions={<Button>Button</Button>} overflowHeading={overflowHeading}>
          LongUnbreakableTextLongUnbreakableTextLongUnbreakableTextLongUnbreakableTextLongUnbreakableTextLongUnbreakableTextLongUnbreakableTextLongUnbreakableTextLongUnbreakableText
        </Header>
      </ScreenshotArea>
    </>
  );
}
