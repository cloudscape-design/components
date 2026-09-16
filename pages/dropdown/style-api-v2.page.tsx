// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import { Button, Dropdown, KeyValuePairs } from '~components';

import { SimplePage } from '../app/templates';
import ListContent from './list-content';

import styles from './style-api-v2.scss';

function StyledDropdown({
  styleClassName,
  expandToViewport,
  content,
}: {
  styleClassName: string;
  expandToViewport?: boolean;
  content?: React.ReactNode;
}) {
  // Starts closed when portaled: the panel would render outside all landmarks (a11y).
  const [open, setOpen] = useState(!expandToViewport);
  return (
    <Dropdown
      trigger={<Button onClick={() => setOpen(!open)}>Open dropdown</Button>}
      open={open}
      onOutsideClick={() => setOpen(false)}
      expandToViewport={expandToViewport}
      minWidth={240}
      content={content ?? <ListContent n={4} />}
      {...{ styleClassNames: { dropdown: styleClassName } }}
    />
  );
}

export default function () {
  return (
    <SimplePage title="Dropdown - Style API v2" screenshotArea={{}}>
      <div className={styles['dropdown-row']}>
        <KeyValuePairs
          columns={4}
          items={[
            {
              type: 'pair',
              label: 'Brand panel',
              value: <StyledDropdown styleClassName={styles['dropdown-brand']} />,
            },
            {
              type: 'pair',
              label: 'Borderless panel',
              value: <StyledDropdown styleClassName={styles['dropdown-borderless']} />,
            },
            {
              type: 'pair',
              label: 'Brand panel with expandToViewport (portal)',
              value: <StyledDropdown styleClassName={styles['dropdown-brand']} expandToViewport={true} />,
            },
            {
              type: 'pair',
              label: 'Border color on :focus-within',
              value: (
                <StyledDropdown
                  styleClassName={styles['dropdown-focus-within']}
                  content={
                    <div className={styles['dropdown-actions']}>
                      <Button variant="inline-link">Focus me</Button>
                    </div>
                  }
                />
              ),
            },
          ]}
        />
      </div>
    </SimplePage>
  );
}
