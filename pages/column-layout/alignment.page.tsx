// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';

import ColumnLayout from '~components/column-layout';

import ScreenshotArea from '../utils/screenshot-area';

export default function ColumnLayoutPage() {
  return (
    <>
      <h1>Border alignment test</h1>
      <p>
        The vertical border line drawn between items should be in the center of the component, i.e. it must line up with
        where the two coloured bars meet below.
      </p>
      <ScreenshotArea>
        <ColumnLayout variant="text-grid" columns={2} minColumnWidth={150}>
          <div>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
            dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex
            ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat
            nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit
            anim id est laborum.
          </div>
          <div>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
            dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex
            ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat
            nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit
            anim id est laborum.
          </div>
        </ColumnLayout>

        <div style={{ display: 'flex', marginTop: 10 }}>
          <div style={{ width: '50%', background: 'blue', height: '10px' }}></div>
          <div style={{ width: '50%', background: 'orange', height: '10px' }}></div>
        </div>
      </ScreenshotArea>
    </>
  );
}
