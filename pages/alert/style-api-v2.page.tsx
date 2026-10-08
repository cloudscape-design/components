// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { Alert, Button, Icon, IconProvider } from '~components';

import { SimplePage } from '../app/templates';

import styles from './style-api-v2.scss';

export default function () {
  return (
    <IconProvider icons={{ 'status-positive': <Icon name="gen-ai" size="inherit" /> }}>
      <SimplePage title="Alert - Style API v2" screenshotArea={{}} i18n={{}}>
        <Alert
          type="success"
          dismissible={true}
          action={<Button {...{ styleClassNames: { button: styles['alert-genai-action'] } }}>Generate again</Button>}
          {...{
            styleClassNames: {
              root: styles['alert-genai'],
              icon: styles['alert-genai-icon'],
              dismissButton: styles['alert-genai-dismiss'],
            },
          }}
        >
          Your changes are ready
        </Alert>
      </SimplePage>
    </IconProvider>
  );
}
