// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
// Dev page for AWSUI-58428: Alert/Flashbar secondary action
import React, { useState } from 'react';

import Alert from '~components/alert';
import Button from '~components/button';
import Flashbar, { FlashbarProps } from '~components/flashbar';
import SpaceBetween from '~components/space-between';

import ScreenshotArea from '../utils/screenshot-area';
import { i18nStrings } from './common';

export default function SecondaryActionPage() {
  const [alertVisible, setAlertVisible] = useState(true);
  const [flashItems, setFlashItems] = useState<FlashbarProps.MessageDefinition[]>([
    {
      id: 'flash-1',
      type: 'info',
      header: 'Flashbar with secondary action',
      content: 'This flash message has both a primary and a secondary action button.',
      action: <Button>Primary action</Button>,
      secondaryAction: <Button>Secondary action</Button>,
    },
    {
      id: 'flash-2',
      type: 'error',
      header: 'Error — secondary action only',
      content: 'This flash message only has a secondary action.',
      secondaryAction: <Button>Learn more</Button>,
      dismissible: true,
      dismissLabel: 'Dismiss',
      onDismiss: () => setFlashItems(items => items.filter(i => i.id !== 'flash-2')),
    },
    {
      id: 'flash-3',
      type: 'success',
      content: 'Success with both actions and dismiss.',
      action: <Button>View details</Button>,
      secondaryAction: <Button>Dismiss all</Button>,
      dismissible: true,
      dismissLabel: 'Dismiss',
      onDismiss: () => setFlashItems(items => items.filter(i => i.id !== 'flash-3')),
    },
  ]);

  return (
    <article>
      <h1>Alert / Flashbar — secondary action (AWSUI-58428)</h1>
      <ScreenshotArea>
        <SpaceBetween size="l">
          <h2>Alert</h2>
          <SpaceBetween size="s">
            {alertVisible && (
              <Alert
                type="info"
                header="Alert with primary and secondary action"
                i18nStrings={i18nStrings}
                dismissible={true}
                onDismiss={() => setAlertVisible(false)}
                action={<Button>Primary action</Button>}
                secondaryAction={<Button>Secondary action</Button>}
              >
                This alert demonstrates the new <code>secondaryAction</code> prop alongside the existing{' '}
                <code>action</code> prop.
              </Alert>
            )}
            <Alert
              type="warning"
              header="Warning — secondary action only"
              i18nStrings={i18nStrings}
              secondaryAction={<Button>Learn more</Button>}
            >
              This alert only has a secondary action and no primary action.
            </Alert>
            <Alert
              type="error"
              header="Error — both actions"
              i18nStrings={i18nStrings}
              action={<Button variant="primary">Retry</Button>}
              secondaryAction={<Button>View logs</Button>}
            >
              Both primary and secondary actions are present.
            </Alert>
            <Alert
              type="success"
              header="Success — no secondary action"
              i18nStrings={i18nStrings}
              action={<Button>Continue</Button>}
            >
              This alert only has the primary action (baseline — no regression).
            </Alert>
          </SpaceBetween>

          <h2>Flashbar</h2>
          <Flashbar items={flashItems} />
        </SpaceBetween>
      </ScreenshotArea>
    </article>
  );
}
