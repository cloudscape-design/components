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

export default function HeadersLevel3Demo() {
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
        <SpaceBetween size="xs">
          <Header variant="h3" headingTagOverride="h1" overflowHeading={overflowHeading}>
            h1 override
          </Header>
          <Header
            variant="h3"
            headingTagOverride="h2"
            actions={<Button>Edit</Button>}
            overflowHeading={overflowHeading}
          >
            Wizard section header
          </Header>
          <Header
            variant="h3"
            description="Some header description"
            info={<Link variant="info">Info</Link>}
            counter="3"
            overflowHeading={overflowHeading}
          >
            Full blown header
          </Header>
        </SpaceBetween>
      </ScreenshotArea>
    </>
  );
}
