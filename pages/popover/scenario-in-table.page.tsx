// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Popover from '~components/popover';
import Table from '~components/table';

import ScreenshotArea from '../utils/screenshot-area';

export default function () {
  const [renderWithPortal, setRenderWithPortal] = React.useState(false);
  return (
    <article>
      <h1>Popover inside table</h1>
      <section>
        <label>
          <input
            id="renderWithPortal"
            type="checkbox"
            checked={renderWithPortal}
            onChange={e => setRenderWithPortal(e.target.checked)}
          />
          renderWithPortal
        </label>
      </section>
      <ScreenshotArea style={{ maxWidth: 300 }}>
        <Table
          columnDefinitions={[
            {
              header: 'Column one',
              cell: () => 'Some text here',
            },
            {
              header: 'Column two',
              cell: t => t,
            },
            { header: 'Column three', cell: () => '5000' },
          ]}
          items={[
            // eslint-disable-next-line react/jsx-key
            <Popover
              size="small"
              position="top"
              header="id-123456"
              content="Clicked!"
              renderWithPortal={renderWithPortal}
            >
              id-123456
            </Popover>,
            'id-123456',
            'id-123456',
          ]}
        />
      </ScreenshotArea>
    </article>
  );
}
