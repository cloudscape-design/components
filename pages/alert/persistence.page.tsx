// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';
import { useState } from 'react';

import Alert, { AlertProps } from '~components/alert';
import Button from '~components/button';
import { setPersistenceFunctionsForTesting } from '~components/internal/persistence';
import SpaceBetween from '~components/space-between';

import ScreenshotArea from '../utils/screenshot-area';
import { i18nStrings } from './common';

const params = new URLSearchParams(window.location.hash.split('?')[1] || '');
setPersistenceFunctionsForTesting({
  retrieveAlertDismiss: async (persistenceConfig: AlertProps.PersistenceConfig) => {
    const dismissed = Boolean(params.get('dismissedKeys')?.includes(persistenceConfig.uniqueKey));
    const result = await new Promise<boolean>(resolve =>
      setTimeout(() => resolve(dismissed), Math.min(parseInt(params.get('mockRetrieveDelay') || '0'), 150))
    );
    return result;
  },
});

export default function AlertPersistenceTest() {
  const [alerts, setAlerts] = useState<{ id: string; alert: React.ReactElement }[]>([
    {
      id: 'alert_1',
      alert: (
        <Alert
          type="success"
          dismissible={true}
          i18nStrings={i18nStrings}
          onDismiss={() => setAlerts(alerts => alerts.filter(item => item.id !== 'alert_1'))}
        >
          Success alert without persistence
        </Alert>
      ),
    },
    {
      id: 'alert_2',
      alert: (
        <Alert
          type="warning"
          dismissible={true}
          i18nStrings={i18nStrings}
          onDismiss={() => setAlerts(alerts => alerts.filter(item => item.id !== 'alert_2'))}
        >
          Warning alert without persistence
        </Alert>
      ),
    },
    {
      id: 'alert_3',
      alert: (
        <Alert
          data-testid={`alert-${3}`}
          type="info"
          dismissible={true}
          i18nStrings={i18nStrings}
          onDismiss={() => setAlerts(alerts => alerts.filter(item => item.id !== 'alert_3'))}
          persistenceConfig={{ uniqueKey: 'persistence_1' }}
        >
          Info alert with persistence with uniqueKey persistence_1
        </Alert>
      ),
    },
    {
      id: 'alert_4',
      alert: (
        <Alert
          type="warning"
          dismissible={true}
          i18nStrings={i18nStrings}
          onDismiss={() => setAlerts(alerts => alerts.filter(item => item.id !== 'alert_4'))}
          persistenceConfig={{ uniqueKey: 'persistence_2' }}
        >
          Warning alert with persistence with uniqueKey persistence_2
        </Alert>
      ),
    },
  ]);

  const addAlert = (withPersistence: boolean) => {
    const id = `alert_${Date.now()}`;
    const newAlert = {
      id,
      alert: (
        <Alert
          type="info"
          dismissible={true}
          i18nStrings={i18nStrings}
          onDismiss={() => setAlerts(alerts => alerts.filter(item => item.id !== id))}
          {...(withPersistence && { persistenceConfig: { uniqueKey: `new_${id}` } })}
        >
          New alert {withPersistence ? 'with' : 'without'} persistence
        </Alert>
      ),
    };
    setAlerts(alerts => [...alerts, newAlert]);
  };

  return (
    <>
      <h1>Alert test with Persistence</h1>
      <SpaceBetween size="xs">
        <div>This page is to test Alert Persistence with retrieval delay (the maximum possible delay is 150ms)</div>
        <SpaceBetween direction="horizontal" size="xs">
          <Button data-id="add-no-persistence-item" onClick={() => addAlert(false)}>
            Add without persistence
          </Button>
          <Button data-id="add-persistence-item" onClick={() => addAlert(true)}>
            Add with persistence
          </Button>
        </SpaceBetween>
      </SpaceBetween>
      <ScreenshotArea>
        <SpaceBetween size="xs">
          {alerts.map(({ id, alert }) => (
            <div key={id}>{alert}</div>
          ))}
        </SpaceBetween>
      </ScreenshotArea>
    </>
  );
}
