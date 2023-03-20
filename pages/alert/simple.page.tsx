// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import Alert from '~components/alert';
import Link from '~components/link';
import ScreenshotArea from '../utils/screenshot-area';
import SpaceBetween from '~components/space-between';
import styles from './styles.scss';

import { I18nProvider } from '~components/internal/i18n';
import messages from '~components/internal/i18n/messages/all.all';

export default function AlertScenario() {
  const [visible, setVisible] = useState(true);
  return (
    <I18nProvider messages={[messages]} locale="en">
      <article>
        <h1>Simple alert</h1>
        <ScreenshotArea>
          <SpaceBetween size="s">
            <div className={styles['alert-container']}>
              <Alert
                header="This is going to be an extremely long title for an alert not sure whether it makes any sense but whatever"
                visible={visible}
                statusIconAriaLabel="Warning"
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
              Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et
              dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex
              ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu
              fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt
              mollit anim id est laborum.
            </Alert>
          </SpaceBetween>
        </ScreenshotArea>
      </article>
    </I18nProvider>
  );
}
