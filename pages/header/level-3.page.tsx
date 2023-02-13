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
    truncateHeading: boolean;
  }>
>;

export default function HeadersLevel3Demo() {
  const {
    urlParams: { truncateHeading = false },
    setUrlParams,
  } = useContext(AppContext as PageHeadersContext);

  return (
    <>
      <Checkbox checked={truncateHeading} onChange={e => setUrlParams({ truncateHeading: e.detail.checked })}>
        Truncate heading
      </Checkbox>
      <ScreenshotArea>
        <SpaceBetween size="xs">
          <Header variant="h3" headingTagOverride="h1" truncateHeading={truncateHeading}>
            h1 override
          </Header>
          <Header
            variant="h3"
            headingTagOverride="h2"
            actions={<Button>Edit</Button>}
            truncateHeading={truncateHeading}
          >
            Wizard section header
          </Header>
          <Header
            variant="h3"
            description="Some header description"
            info={<Link variant="info">Info</Link>}
            counter="3"
            truncateHeading={truncateHeading}
          >
            Full blown header
          </Header>
        </SpaceBetween>
      </ScreenshotArea>
    </>
  );
}
