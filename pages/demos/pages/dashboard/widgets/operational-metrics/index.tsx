// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React, { createContext, useContext, useState } from 'react';

import Button from '@cloudscape-design/components/button';
import FormField from '@cloudscape-design/components/form-field';
import Header from '@cloudscape-design/components/header';
import KeyValuePairs from '@cloudscape-design/components/key-value-pairs';
import Select from '@cloudscape-design/components/select';
import SpaceBetween from '@cloudscape-design/components/space-between';
import StatusIndicator from '@cloudscape-design/components/status-indicator';

import { EmptyState } from '../../components/empty-state';
import { ResponsiveLayout } from '../../components/responsive-layout';
import { WidgetConfig } from '../interfaces';
import { BreakdownChart } from './chart';
import { allContent, Content, WidgetPreferences } from './preferences';

interface OperationalWidgetContextType {
  visibleContent: ReadonlyArray<Content>;
  openPreferences: () => void;
}

const OperationalWidgetContext = createContext<OperationalWidgetContextType>({
  visibleContent: [],
  openPreferences: () => {
    // do nothing
  },
});

function OperationalMetricsProvider({ children }: { children: React.ReactElement }) {
  const [preferencesVisible, setPreferencesVisible] = useState(false);
  const [visibleContent, setVisibleContent] = useState<ReadonlyArray<Content>>(allContent);
  return (
    <OperationalWidgetContext.Provider value={{ visibleContent, openPreferences: () => setPreferencesVisible(true) }}>
      {React.cloneElement(React.Children.only(children), {
        removeConfirmationText: 'Operational metrics',
        actions: [{ text: 'Preferences', onClick: () => setPreferencesVisible(true) }],
      })}
      {preferencesVisible && (
        <WidgetPreferences
          preferences={visibleContent}
          onConfirm={visibleContent => {
            setVisibleContent(visibleContent);
            setPreferencesVisible(false);
          }}
          onDismiss={() => setPreferencesVisible(false)}
        />
      )}
    </OperationalWidgetContext.Provider>
  );
}

function OperationalMetricsHeader() {
  return (
    <Header
      actions={
        <Button href="#" iconName="external" iconAlign="right" target="_blank">
          View in Cloudwatch
        </Button>
      }
    >
      Operational metrics
    </Header>
  );
}

function OperationalMetricsContent() {
  const { visibleContent, openPreferences } = useContext(OperationalWidgetContext);
  const someCostVisible = (['status', 'running', 'monitoring', 'issues'] as const).some(content =>
    visibleContent.includes(content)
  );
  if (visibleContent.length <= 0) {
    return (
      <EmptyState
        title="No data to display"
        description="Open widget preferences to choose some operational data to be displayed."
        verticalCenter={true}
        action={<Button onClick={openPreferences}>Open preferences</Button>}
      />
    );
  }
  return (
    <ResponsiveLayout
      filters={
        <FormField label="Filter displayed data">
          <Select
            selectedOption={{ label: 'December 2022' }}
            placeholder="Filter data"
            empty="Not supported in the demo"
            onChange={() => {
              /*noop*/
            }}
          />
        </FormField>
      }
    >
      {someCostVisible && (
        <ResponsiveLayout.Column header={<Header variant="h3">Overview</Header>}>
          <SpaceBetween size="s">
            <KeyValuePairs
              items={[
                ...(visibleContent.includes('status')
                  ? [
                      {
                        label: 'Status',
                        value: <StatusIndicator type="success">Running</StatusIndicator>,
                      },
                    ]
                  : []),
                ...(visibleContent.includes('running')
                  ? [
                      {
                        label: 'Running resources',
                        value: '120',
                      },
                    ]
                  : []),
                ...(visibleContent.includes('monitoring')
                  ? [
                      {
                        label: 'Monitoring',
                        value: 'Enabled',
                      },
                    ]
                  : []),
                ...(visibleContent.includes('issues')
                  ? [
                      {
                        label: 'Open issues',
                        value: '0',
                      },
                    ]
                  : []),
              ]}
            />
          </SpaceBetween>
        </ResponsiveLayout.Column>
      )}
      {visibleContent.includes('breakdown') && (
        <ResponsiveLayout.Column header={<Header variant="h3">Breakdown</Header>}>
          <BreakdownChart />
        </ResponsiveLayout.Column>
      )}
    </ResponsiveLayout>
  );
}

export const operationalMetrics: WidgetConfig = {
  definition: { defaultRowSpan: 4, defaultColumnSpan: 3 },
  data: {
    icon: 'mixedContent',
    title: 'Operational metrics',
    description: 'Operational metrics of your service',
    provider: OperationalMetricsProvider,
    header: OperationalMetricsHeader,
    content: OperationalMetricsContent,
  },
};
