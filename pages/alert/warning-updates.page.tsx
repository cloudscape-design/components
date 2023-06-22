// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import Alert from '~components/alert';
import ScreenshotArea from '../utils/screenshot-area';
import SpaceBetween from '~components/space-between';

import { I18nProvider } from '~components/internal/i18n';
import messages from '~components/i18n/messages/all.all';
import { Flashbar, StatusIndicator, Link, Button } from '~components';

export default function AlertScenario() {
  return (
    <I18nProvider messages={[messages]} locale="en">
      <article>
        <h1>Warning color updates</h1>
        <ScreenshotArea>
          <SpaceBetween size="xl">
            <StatusIndicator type="warning" iconAriaLabel="Warning">
              Warning status indicator
            </StatusIndicator>

            <Alert statusIconAriaLabel="Warning" dismissible={true} dismissAriaLabel="Dismiss" type="warning">
              Alert description
            </Alert>
            <Alert statusIconAriaLabel="Warning" dismissible={true} dismissAriaLabel="Dismiss" type="warning">
              Alert description with a <Link href="#">normal link</Link>.
            </Alert>
            <Alert
              statusIconAriaLabel="Warning"
              dismissible={true}
              type="warning"
              action={<Button>Do something!</Button>}
            >
              Alert description with an action
            </Alert>

            <Alert
              statusIconAriaLabel="Success"
              dismissible={true}
              dismissAriaLabel="Dismiss"
              type="success"
              action={<Button>Do something!</Button>}
            >
              Reference success alert <Link href="#">with a link</Link> and some action
            </Alert>

            <Flashbar
              items={[
                { id: '1', type: 'warning', content: 'Flash description' },
                {
                  id: '3',
                  type: 'warning',
                  dismissible: true,
                  dismissLabel: 'Dismiss',
                  content: (
                    <div>
                      Flash description{' '}
                      <Link href="#" color="inverted">
                        with an inverted link
                      </Link>
                    </div>
                  ),
                },
                {
                  id: '4',
                  type: 'warning',
                  header: 'Header message',
                  action: <Button>Do something!</Button>,
                  content: <div>Flash description with a button</div>,
                },
                {
                  id: '5',
                  type: 'success',
                  dismissible: true,
                  dismissLabel: 'Dismiss',
                  content: (
                    <div>
                      Success flash with{' '}
                      <Link href="#" color="inverted">
                        with an inverted link
                      </Link>
                    </div>
                  ),
                  action: <Button>Action</Button>,
                },
                {
                  id: '6',
                  type: 'error',
                  dismissible: true,
                  dismissLabel: 'Dismiss',
                  content: (
                    <div>
                      Error flash with{' '}
                      <Link href="#" color="inverted">
                        with an inverted link
                      </Link>
                    </div>
                  ),
                  action: <Button>Action</Button>,
                },
                { id: '7', type: 'warning', content: 'Flash description' },
              ]}
            />
          </SpaceBetween>
        </ScreenshotArea>
      </article>
    </I18nProvider>
  );
}
