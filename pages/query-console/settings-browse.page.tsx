// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useRef, useState } from 'react';

import AppLayout from '~components/app-layout';
import Box from '~components/box';
import Button, { ButtonProps } from '~components/button';
import ButtonDropdown from '~components/button-dropdown';
import Container from '~components/container';
import ExpandableSection from '~components/expandable-section';
import Grid from '~components/grid';
import Header from '~components/header';
import HelpPanel from '~components/help-panel';
import PanelLayout from '~components/panel-layout';
import SideNavigation from '~components/side-navigation';
import SpaceBetween from '~components/space-between';
import ToggleButton, { ToggleButtonProps } from '~components/toggle-button';

const TIME_PERIOD_ITEMS = [
  { id: '15m', text: 'Last 15 minutes' },
  { id: '1h', text: 'Last 1 hour' },
  { id: '3h', text: 'Last 3 hours' },
  { id: '12h', text: 'Last 12 hours' },
  { id: '24h', text: 'Last 24 hours' },
  { id: '7d', text: 'Last 7 days' },
  { id: 'custom', text: 'Custom range' },
];

const TIME_ZONE_ITEMS = [
  { id: 'utc', text: 'UTC' },
  { id: 'local', text: 'Local time' },
];

interface BrowseProps {
  collapseRef: React.Ref<ButtonProps.Ref>;
  onClose: () => void;
}

function Browse({ collapseRef, onClose }: BrowseProps) {
  return (
    <Container
      header={
        <Header
          variant="h2"
          actions={
            <Button
              ref={collapseRef}
              variant="icon"
              iconName="angle-left"
              ariaLabel="Collapse browse panel"
              onClick={onClose}
            />
          }
        >
          Browse
        </Header>
      }
      fitHeight={true}
    >
      <SpaceBetween size="xs">
        <ExpandableSection headerText="Recent queries" defaultExpanded={true}>
          <Box color="text-body-secondary">Your most recent queries appear here.</Box>
        </ExpandableSection>
        <ExpandableSection headerText="Saved queries">
          <Box color="text-body-secondary">Queries you have saved appear here.</Box>
        </ExpandableSection>
        <ExpandableSection headerText="Metrics">
          <Box color="text-body-secondary">Browse metrics to query against.</Box>
        </ExpandableSection>
        <ExpandableSection headerText="Labels">
          <Box color="text-body-secondary">Filter and browse by label.</Box>
        </ExpandableSection>
      </SpaceBetween>
    </Container>
  );
}

function MainContent() {
  const [vizOpen, setVizOpen] = useState(false);
  const vizToggleRef = useRef<ToggleButtonProps.Ref>(null);
  const vizCloseRef = useRef<ButtonProps.Ref>(null);
  const vizMounted = useRef(false);

  useEffect(() => {
    if (!vizMounted.current) {
      vizMounted.current = true;
      return;
    }
    if (vizOpen) {
      vizCloseRef.current?.focus();
    } else {
      vizToggleRef.current?.focus();
    }
  }, [vizOpen]);

  const resultsHeader = (
    <Header
      variant="h2"
      actions={
        <ToggleButton
          ref={vizToggleRef}
          pressed={vizOpen}
          onChange={({ detail }) => setVizOpen(detail.pressed)}
          iconName="settings"
          pressedIconName="settings"
          ariaLabel="Toggle visualization panel"
          ariaControls="visualization-panel"
        />
      }
    >
      Results
    </Header>
  );

  const resultsWithViz = (
    <div id="visualization-panel">
      <PanelLayout
        display={vizOpen ? 'all' : 'main-only'}
        panelPosition="side-end"
        resizable={true}
        defaultPanelSize={320}
        minPanelSize={240}
        maxPanelSize={560}
        i18nStrings={{
          resizeHandleAriaLabel: 'Resize visualization panel',
          resizeHandleTooltipText: 'Drag to resize',
        }}
        mainContent={
          <Container header={resultsHeader}>
            <Box color="text-body-secondary" padding={{ vertical: 'xxl' }} textAlign="center">
              Query results appear here.
            </Box>
          </Container>
        }
        panelContent={
          <div role="region" aria-label="Visualization">
            <Box padding={{ horizontal: 's' }}>
              <SpaceBetween size="s">
                <Header
                  variant="h3"
                  actions={
                    <Button
                      ref={vizCloseRef}
                      variant="icon"
                      iconName="angle-right"
                      ariaLabel="Close visualization panel"
                      onClick={() => setVizOpen(false)}
                    />
                  }
                >
                  Visualization
                </Header>
                <Box color="text-body-secondary">Charts and visualizations of your results appear here.</Box>
              </SpaceBetween>
            </Box>
          </div>
        }
      />
    </div>
  );

  return (
    <SpaceBetween size="l">
      <Container header={<Header variant="h2">Query</Header>}>
        <Box color="text-body-secondary" padding={{ vertical: 'xxl' }} textAlign="center">
          Compose your query here.
        </Box>
      </Container>
      {resultsWithViz}
    </SpaceBetween>
  );
}

export default function QueryConsolePage() {
  const [navigationOpen, setNavigationOpen] = useState(true);
  const [toolsOpen, setToolsOpen] = useState(false);
  const [browseOpen, setBrowseOpen] = useState(false);

  const [timePeriod, setTimePeriod] = useState(TIME_PERIOD_ITEMS[1]);
  const [timeZone, setTimeZone] = useState(TIME_ZONE_ITEMS[0]);

  const toggleRef = useRef<ToggleButtonProps.Ref>(null);
  const collapseRef = useRef<ButtonProps.Ref>(null);
  // Skip the mount pass so the panel doesn't grab focus on initial render.
  const mounted = useRef(false);

  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      return;
    }
    if (browseOpen) {
      collapseRef.current?.focus();
    } else {
      toggleRef.current?.focus();
    }
  }, [browseOpen]);

  const controlsStrip = (
    <Grid gridDefinition={[{ colspan: 6 }, { colspan: 6 }]}>
      <div>
        <ToggleButton
          ref={toggleRef}
          pressed={browseOpen}
          onChange={({ detail }) => setBrowseOpen(detail.pressed)}
          iconName="settings"
          pressedIconName="settings"
          ariaLabel="Toggle browse panel"
          ariaControls="browse-panel"
        />
      </div>
      <Box float="right">
        <SpaceBetween direction="horizontal" size="xs">
          <ButtonDropdown
            items={TIME_PERIOD_ITEMS}
            onItemClick={({ detail }) => setTimePeriod(TIME_PERIOD_ITEMS.find(i => i.id === detail.id) ?? timePeriod)}
            ariaLabel="Time period"
          >
            {timePeriod.text}
          </ButtonDropdown>
          <ButtonDropdown
            items={TIME_ZONE_ITEMS}
            onItemClick={({ detail }) => setTimeZone(TIME_ZONE_ITEMS.find(i => i.id === detail.id) ?? timeZone)}
            ariaLabel="Time zone"
          >
            {timeZone.text}
          </ButtonDropdown>
          <ButtonDropdown
            items={[
              { id: 'run', text: 'Run query' },
              { id: 'save', text: 'Save query' },
              { id: 'export', text: 'Export results' },
              { id: 'clear', text: 'Clear' },
            ]}
          >
            Actions
          </ButtonDropdown>
        </SpaceBetween>
      </Box>
    </Grid>
  );

  return (
    <AppLayout
      ariaLabels={{
        navigation: 'Navigation drawer',
        navigationClose: 'Close navigation drawer',
        navigationToggle: 'Open navigation drawer',
        tools: 'Help panel',
        toolsClose: 'Close help panel',
        toolsToggle: 'Open help panel',
      }}
      navigationOpen={navigationOpen}
      onNavigationChange={({ detail }) => setNavigationOpen(detail.open)}
      toolsOpen={toolsOpen}
      onToolsChange={({ detail }) => setToolsOpen(detail.open)}
      navigation={
        <SideNavigation
          header={{ href: '#/', text: 'Query console' }}
          activeHref="#/query"
          items={[
            { type: 'link', text: 'Query', href: '#/query' },
            { type: 'link', text: 'Dashboards', href: '#/dashboards' },
            { type: 'link', text: 'Saved queries', href: '#/saved' },
            { type: 'divider' },
            { type: 'link', text: 'Settings', href: '#/settings' },
          ]}
        />
      }
      tools={
        <HelpPanel header={<h2>Help</h2>}>
          <p>Use the query editor to compose a query, then run it to see results below.</p>
        </HelpPanel>
      }
      content={
        <SpaceBetween size="l">
          <Header variant="h1">Query</Header>
          {controlsStrip}
          <div id="browse-panel">
            <PanelLayout
              display={browseOpen ? 'all' : 'main-only'}
              panelPosition="side-start"
              resizable={true}
              defaultPanelSize={280}
              minPanelSize={220}
              maxPanelSize={480}
              i18nStrings={{
                resizeHandleAriaLabel: 'Resize browse panel',
                resizeHandleTooltipText: 'Drag to resize',
              }}
              panelContent={<Browse collapseRef={collapseRef} onClose={() => setBrowseOpen(false)} />}
              mainContent={<MainContent />}
            />
          </div>
        </SpaceBetween>
      }
    />
  );
}
