// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { KeyValuePairs, Link } from '~components';

import { SimplePage } from '../app/templates';

import styles from './style-api-v2.scss';

export default function () {
  const brand = { styleClassNames: { root: styles['link-brand'] } };
  const inverted = { styleClassNames: { root: styles['link-inverted'] } };
  return (
    <SimplePage title="Link - Style API v2" screenshotArea={{}}>
      <KeyValuePairs
        items={[
          {
            type: 'pair',
            label: 'Primary link',
            value: (
              <Link href="#" variant="primary" {...brand}>
                Learn more
              </Link>
            ),
          },
          {
            type: 'pair',
            label: 'Secondary link',
            value: (
              <Link href="#" variant="secondary" {...brand}>
                View details
              </Link>
            ),
          },
          {
            type: 'pair',
            label: 'External link (icon follows the link color)',
            value: (
              <Link href="#" external={true} externalIconAriaLabel="Opens in a new tab" {...brand}>
                Documentation
              </Link>
            ),
          },
          {
            type: 'pair',
            label: 'Info link (button role)',
            value: (
              <Link variant="info" {...brand}>
                Info
              </Link>
            ),
          },
          {
            type: 'pair',
            label: 'Button link (no href)',
            value: (
              <Link onFollow={() => {}} {...brand}>
                Open panel
              </Link>
            ),
          },
          {
            type: 'pair',
            label: 'Large value link',
            value: (
              <Link href="#" variant="awsui-value-large" {...brand}>
                42
              </Link>
            ),
          },
          {
            type: 'pair',
            label: 'Inverted link (dedicated class)',
            value: (
              <div className={styles['container-inverted']}>
                <Link href="#" color="inverted" {...inverted}>
                  Inverted link
                </Link>{' '}
                <Link color="inverted" onFollow={() => {}} {...inverted}>
                  Inverted button link
                </Link>
              </div>
            ),
          },
        ]}
      />
    </SimplePage>
  );
}
