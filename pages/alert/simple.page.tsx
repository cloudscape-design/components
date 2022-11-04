// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import Alert from '~components/alert';
import Link from '~components/link';
import ScreenshotArea from '../utils/screenshot-area';
import SpaceBetween from '~components/space-between';
import styles from './styles.scss';

export default function AlertScenario() {
  const [visible, setVisible] = useState(true);
  return (
    <article>
      <h1>Simple alert</h1>
      <ScreenshotArea>
        <SpaceBetween size="s">
          <div className={styles['alert-container']}>
            <Alert
              header="This is going to be an extremely long title for an alert not sure whether it makes any sense but whatever"
              visible={visible}
              statusIconAriaLabel="Warning"
              dismissAriaLabel="Close alert"
              dismissible={true}
              buttonText="Button text"
              type="warning"
              onDismiss={() => setVisible(false)}
            >
              Content
              <br />
              <Link>This is a button link</Link>
              <br />
              <Link href="#">This is a secondary link</Link>
            </Alert>
          </div>
          <Alert header="Info" statusIconAriaLabel="Info">
            This is a test for the dev page
          </Alert>
        </SpaceBetween>
      </ScreenshotArea>
    </article>
  );
}
