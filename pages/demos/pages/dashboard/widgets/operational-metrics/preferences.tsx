// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React, { useState } from 'react';

import { useId } from '../../../../use-id-polyfill';
import Box from '@cloudscape-design/components/box';
import Button from '@cloudscape-design/components/button';
import ColumnLayout from '@cloudscape-design/components/column-layout';
import Modal from '@cloudscape-design/components/modal';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Toggle from '@cloudscape-design/components/toggle';

import styles from './preferences.module.scss';

export const allContent = ['status', 'running', 'monitoring', 'issues', 'breakdown'] as const;

export type Content = (typeof allContent)[number];

interface PreferencesControlProps {
  label: string;
  isGroup?: boolean;
  toggle?: (id: string) => React.ReactNode;
}

function PreferencesControl({ label, toggle, isGroup }: PreferencesControlProps) {
  const id = useId();
  return (
    <div className={styles.displayPreference}>
      <label
        htmlFor={id}
        className={`${styles.displayPreferenceLabel} ${isGroup ? styles.displayPreferenceGroup : ''}`}
      >
        {label}
      </label>
      {toggle?.(id)}
    </div>
  );
}

interface WidgetPreferencesProps {
  preferences: ReadonlyArray<Content>;
  onDismiss: () => void;
  onConfirm: (visibleContent: ReadonlyArray<Content>) => void;
}

const metricItems = ['status', 'running', 'monitoring', 'issues'] as const;

export function WidgetPreferences({ onConfirm, onDismiss, preferences }: WidgetPreferencesProps) {
  const [pendingPreferences, setPendingPreferences] = useState(preferences);
  function toggle(content: Content, checked: boolean) {
    setPendingPreferences(pendingPreferences => {
      const newState = pendingPreferences.slice();
      if (checked) {
        newState.push(content);
      } else {
        newState.splice(newState.indexOf(content), 1);
      }
      return newState;
    });
  }

  const visibleMetrics = metricItems.map(content => pendingPreferences.includes(content));
  const someCostVisible = visibleMetrics.some(visible => visible);
  const allCostsSame = visibleMetrics.every(visible => visible) || visibleMetrics.every(visible => !visible);

  return (
    <Modal
      visible={true}
      header="Preferences"
      footer={
        <Box float="right">
          <SpaceBetween direction="horizontal" size="xs">
            <Button variant="link" formAction="none" onClick={onDismiss}>
              Cancel
            </Button>
            <Button variant="primary" formAction="none" onClick={() => onConfirm(pendingPreferences)}>
              Confirm
            </Button>
          </SpaceBetween>
        </Box>
      }
      onDismiss={onDismiss}
    >
      <ColumnLayout columns={1} borders="horizontal">
        <Box variant="awsui-key-label">Select visible content</Box>
        <PreferencesControl
          label="Total monthly costs"
          isGroup={true}
          toggle={id => (
            <Toggle
              controlId={id}
              disabled={!allCostsSame}
              checked={someCostVisible}
              onChange={event => metricItems.forEach(item => toggle(item, event.detail.checked))}
            />
          )}
        />
        <PreferencesControl
          label="Status"
          toggle={id => (
            <Toggle
              controlId={id}
              checked={pendingPreferences.includes('status')}
              onChange={event => toggle('status', event.detail.checked)}
            />
          )}
        />
        <PreferencesControl
          label="Running count"
          toggle={id => (
            <Toggle
              controlId={id}
              checked={pendingPreferences.includes('running')}
              onChange={event => toggle('running', event.detail.checked)}
            />
          )}
        />
        <PreferencesControl
          label="Monitoring state"
          toggle={id => (
            <Toggle
              controlId={id}
              checked={pendingPreferences.includes('monitoring')}
              onChange={event => toggle('monitoring', event.detail.checked)}
            />
          )}
        />
        <PreferencesControl
          label="Open issues count"
          toggle={id => (
            <Toggle
              controlId={id}
              checked={pendingPreferences.includes('issues')}
              onChange={event => toggle('issues', event.detail.checked)}
            />
          )}
        />
        <PreferencesControl
          label="Issues breakdown"
          isGroup={true}
          toggle={id => (
            <Toggle
              controlId={id}
              checked={pendingPreferences.includes('breakdown')}
              onChange={event => toggle('breakdown', event.detail.checked)}
            />
          )}
        ></PreferencesControl>
      </ColumnLayout>
    </Modal>
  );
}
