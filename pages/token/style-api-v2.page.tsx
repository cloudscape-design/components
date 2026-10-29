// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';

import { KeyValuePairs, Token } from '~components';

import { SimplePage } from '../app/templates';

import styles from './style-api-v2.scss';

const themed = { root: styles.root, dismissButton: styles.dismiss };
const muted = {
  root: clsx(styles.root, styles['root-muted']),
  dismissButton: clsx(styles.dismiss, styles['dismiss-muted']),
};

export default function () {
  const shared = { dismissLabel: 'Remove', onDismiss: () => {} };
  return (
    <SimplePage title="Token - Style API v2" screenshotArea={{}}>
      <KeyValuePairs
        items={[
          {
            type: 'pair',
            label: 'Default',
            value: (
              <Token label="Generated" description="From your prompt" {...shared} {...{ styleClassNames: themed }} />
            ),
          },
          {
            type: 'pair',
            label: 'Inline variant',
            value: <Token label="Inline" variant="inline" {...shared} {...{ styleClassNames: themed }} />,
          },
          {
            type: 'pair',
            label: 'Disabled',
            value: <Token label="Disabled" disabled={true} {...shared} {...{ styleClassNames: muted }} />,
          },
          {
            type: 'pair',
            label: 'Read-only',
            value: <Token label="Read-only" readOnly={true} {...shared} {...{ styleClassNames: muted }} />,
          },
        ]}
      />
    </SimplePage>
  );
}
