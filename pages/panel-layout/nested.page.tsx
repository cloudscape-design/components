// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useContext } from 'react';

import { Container, FormField, Header, SegmentedControl, SpaceBetween } from '~components';
import Button from '~components/button';
import PanelLayout, { PanelLayoutProps } from '~components/panel-layout';

import AppContext, { AppContextType } from '../app/app-context';
import { SimplePage } from '../app/templates';

interface NestedPanelLayoutProps {
  outerPanelPosition: PanelLayoutProps.PanelPosition;
  innerPanelPosition: PanelLayoutProps.PanelPosition;
  nestedLocation: 'panel' | 'main';
}
type PageContext = React.Context<AppContextType<Partial<NestedPanelLayoutProps>>>;

const NestedPanelLayoutDemo = ({ outerPanelPosition, innerPanelPosition, nestedLocation }: NestedPanelLayoutProps) => {
  const innerPanelLayout = (
    <PanelLayout
      defaultPanelSize={250}
      minPanelSize={200}
      maxPanelSize={500}
      resizable={true}
      panelPosition={innerPanelPosition}
      panelContent={
        <Container header={<Header variant="h2">Level 2 Panel</Header>}>
          <p>This is a nested panel layout panel (second level).</p>
          <p>You can resize this panel independently from the outer panel layout.</p>
          <SpaceBetween size="xs" direction="vertical">
            <Button>Nested Action</Button>
            {Array.from({ length: 18 }, (_, i) => (
              <div key={i}>Nested panel content {i + 1}</div>
            ))}
          </SpaceBetween>
        </Container>
      }
      mainContent={
        <Container header={<Header variant="h2">Second Level Main Content</Header>}>
          <p>This is the main content area of the second panel layout.</p>
          <SpaceBetween size="xs" direction="vertical">
            {Array.from({ length: 15 }, (_, i) => (
              <div key={i}>Content line {i + 1}</div>
            ))}
          </SpaceBetween>
        </Container>
      }
      mainFocusable={{ ariaLabel: 'Level 2 main' }}
    />
  );

  const simpleContent = (
    <Container header={<Header variant="h2">Simple Content</Header>}>
      <p>This is the {nestedLocation === 'panel' ? 'main' : 'panel'} content of the outer panel layout.</p>
      <p>It contains simple content without any nesting.</p>
      <SpaceBetween size="xs" direction="vertical">
        <Button>Outer Action</Button>
        {Array.from({ length: 20 }, (_, i) => (
          <div key={i}>Simple content line {i + 1}</div>
        ))}
      </SpaceBetween>
    </Container>
  );

  return (
    <div style={{ height: '100%', overflow: 'hidden' }}>
      <PanelLayout
        defaultPanelSize={400}
        minPanelSize={300}
        maxPanelSize={800}
        resizable={true}
        panelPosition={outerPanelPosition}
        panelContent={nestedLocation === 'panel' ? innerPanelLayout : simpleContent}
        mainContent={nestedLocation === 'main' ? innerPanelLayout : simpleContent}
      />
    </div>
  );
};

export default function NestedPanelLayoutPage() {
  const {
    urlParams: { outerPanelPosition = 'side-start', innerPanelPosition = 'side-start', nestedLocation = 'panel' },
    setUrlParams,
  } = useContext(AppContext as PageContext);

  return (
    <SimplePage title="Nested Panel Layout Demo" i18n={{}} screenshotArea={{}}>
      <SpaceBetween size="l">
        <Container>
          <p>
            This page demonstrates nested panel layouts, where one panel layout contains another panel layout in either
            its panel or main content area.
          </p>
          <p>
            Each panel layout maintains its own resize behavior and can be configured with different panel positions and
            constraints.
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
        </Container>

        <div style={{ maxHeight: '600px' }}>
          <NestedPanelLayoutDemo
            outerPanelPosition={outerPanelPosition}
            innerPanelPosition={innerPanelPosition}
            nestedLocation={nestedLocation}
          />
        </div>
      </SpaceBetween>
    </SimplePage>
  );
}
