// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useContext } from 'react';

import { Container, FormField, Header, SegmentedControl, SpaceBetween } from '~components';
import Button from '~components/button';
import { I18nProvider } from '~components/i18n';
import messages from '~components/i18n/messages/all.en';
import SplitView, { SplitViewProps } from '~components/split-view';

import AppContext, { AppContextType } from '../app/app-context';
import ScreenshotArea from '../utils/screenshot-area';

interface NestedSplitViewProps {
  outerPanelPosition: SplitViewProps.PanelPosition;
  innerPanelPosition: SplitViewProps.PanelPosition;
  nestedLocation: 'panel' | 'main';
}
type PageContext = React.Context<AppContextType<Partial<NestedSplitViewProps>>>;

const NestedSplitViewDemo = ({ outerPanelPosition, innerPanelPosition, nestedLocation }: NestedSplitViewProps) => {
  const innerSplitView = (
    <SplitView
      panelVariant="custom"
      defaultPanelSize={250}
      minPanelSize={200}
      maxPanelSize={500}
      resizable={true}
      panelPosition={innerPanelPosition}
      panelContent={
        <Container header={<Header variant="h2">Level 2 Panel</Header>}>
          <p>This is a nested split view panel (second level).</p>
          <p>You can resize this panel independently from the outer split view.</p>
          <SpaceBetween size="xs" direction="vertical">
            <Button>Nested Action</Button>
            {Array.from({ length: 8 }, (_, i) => (
              <div key={i}>Nested panel content {i + 1}</div>
            ))}
          </SpaceBetween>
        </Container>
      }
      mainContent={
        <Container header={<Header variant="h2">Second Level Main Content</Header>}>
          <p>This is the main content area of the second split view.</p>
          <SpaceBetween size="xs" direction="vertical">
            {Array.from({ length: 5 }, (_, i) => (
              <div key={i}>Content line {i + 1}</div>
            ))}
          </SpaceBetween>
        </Container>
      }
    />
  );

  const simpleContent = (
    <Container header={<Header variant="h2">Simple Content</Header>}>
      <p>This is the {nestedLocation === 'panel' ? 'main' : 'panel'} content of the outer split view.</p>
      <p>It contains simple content without any nesting.</p>
      <SpaceBetween size="xs" direction="vertical">
        <Button>Outer Action</Button>
        {Array.from({ length: 10 }, (_, i) => (
          <div key={i}>Simple content line {i + 1}</div>
        ))}
      </SpaceBetween>
    </Container>
  );

  return (
    <div style={{ height: '100%', overflow: 'hidden' }}>
      <SplitView
        panelVariant="custom"
        defaultPanelSize={400}
        minPanelSize={300}
        maxPanelSize={800}
        resizable={true}
        panelPosition={outerPanelPosition}
        panelContent={nestedLocation === 'panel' ? innerSplitView : simpleContent}
        mainContent={nestedLocation === 'main' ? innerSplitView : simpleContent}
      />
    </div>
  );
};

export default function NestedSplitViewPage() {
  const {
    urlParams: { outerPanelPosition = 'side-start', innerPanelPosition = 'side-start', nestedLocation = 'panel' },
    setUrlParams,
  } = useContext(AppContext as PageContext);

  return (
    <I18nProvider messages={[messages]} locale="en">
      <ScreenshotArea disableAnimations={true} gutters={false}>
        <SpaceBetween size="l">
          <Container
            header={
              <Header variant="h1" description="Demonstrates how split views can be nested within each other">
                Nested Split View Demo
              </Header>
            }
          >
            <SpaceBetween size="m">
              <p>
                This page demonstrates nested split views, where one split view contains another split view in either
                its panel or main content area.
              </p>
              <p>
                Each split view maintains its own resize behavior and can be configured with different panel positions
                and constraints.
              </p>

              <SpaceBetween size="s" direction="horizontal">
                <FormField label="Outer panel position">
                  <SegmentedControl
                    options={[
                      { id: 'side-start', text: 'side-start' },
                      { id: 'side-end', text: 'side-end' },
                    ]}
                    selectedId={outerPanelPosition}
                    onChange={({ detail }) => setUrlParams({ outerPanelPosition: detail.selectedId as any })}
                  />
                </FormField>

                <FormField label="Inner panel position">
                  <SegmentedControl
                    options={[
                      { id: 'side-start', text: 'side-start' },
                      { id: 'side-end', text: 'side-end' },
                    ]}
                    selectedId={innerPanelPosition}
                    onChange={({ detail }) => setUrlParams({ innerPanelPosition: detail.selectedId as any })}
                  />
                </FormField>

                <FormField label="Nested location">
                  <SegmentedControl
                    options={[
                      { id: 'panel', text: 'In panel' },
                      { id: 'main', text: 'In main' },
                    ]}
                    selectedId={nestedLocation}
                    onChange={({ detail }) => setUrlParams({ nestedLocation: detail.selectedId as any })}
                  />
                </FormField>
              </SpaceBetween>
            </SpaceBetween>
          </Container>

          <div style={{ height: '600px' }}>
            <NestedSplitViewDemo
              outerPanelPosition={outerPanelPosition}
              innerPanelPosition={innerPanelPosition}
              nestedLocation={nestedLocation}
            />
          </div>
        </SpaceBetween>
      </ScreenshotArea>
    </I18nProvider>
  );
}
