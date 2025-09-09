// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useContext, useState } from 'react';

import {
  AppLayout,
  Box,
  Button,
  Checkbox,
  Container,
  Drawer,
  ExpandableSection,
  Header,
  Link,
  Modal,
  Popover,
  SpaceBetween,
  SplitPanel,
  Table,
} from '~components';
import { ErrorBoundariesProvider } from '~components/error-boundary/context';
import I18nProvider from '~components/i18n';
import messages from '~components/i18n/messages/all.en';

import AppContext, { AppContextType } from '../app/app-context';
import ScreenshotArea from '../utils/screenshot-area';

type PageContext = React.Context<AppContextType<{ errorBoundariesActive: boolean }>>;

export default function () {
  const {
    urlParams: { errorBoundariesActive = true },
    setUrlParams,
  } = useContext(AppContext as PageContext);
  const [splitPanelOpen, setSplitPanelOpen] = useState(true);
  const [activeDrawerId, setActiveDrawerId] = useState<null | string>('d1');
  const [modalOpen, setModalOpen] = useState(false);
  return (
    <ScreenshotArea gutters={false}>
      <I18nProvider messages={[messages]} locale="en">
        <ErrorBoundariesProvider active={errorBoundariesActive} value={{ feedbackLink: '/#' }}>
          <AppLayout
            navigationHide={true}
            activeDrawerId={activeDrawerId}
            onDrawerChange={({ detail }) => setActiveDrawerId(detail.activeDrawerId)}
            splitPanel={
              <SplitPanel header="Split panel">
                <BrokenButton />
              </SplitPanel>
            }
            splitPanelOpen={splitPanelOpen}
            onSplitPanelToggle={({ detail }) => setSplitPanelOpen(detail.open)}
            drawers={[
              {
                id: 'd1',
                content: (
                  <Drawer header={<Header variant="h2">Drawer 1</Header>}>
                    <BrokenButton />
                  </Drawer>
                ),
                trigger: { iconName: 'bug' },
                ariaLabels: { drawerName: 'Drawer 1', triggerButton: 'Open drawer 1', closeButton: 'Close drawer 1' },
              },
              {
                id: 'd2',
                content: (
                  <Drawer header={<Header variant="h2">Drawer 2</Header>}>
                    <BrokenButton />
                  </Drawer>
                ),
                trigger: { iconName: 'call' },
                ariaLabels: { drawerName: 'Drawer 2', triggerButton: 'Open drawer 2', closeButton: 'Close drawer 2' },
              },
            ]}
            content={
              <Box>
                <h1>Error boundary demo: components</h1>
                <Box margin={{ bottom: 'm' }}>
                  <Checkbox
                    checked={errorBoundariesActive}
                    onChange={({ detail }) => setUrlParams({ errorBoundariesActive: detail.checked })}
                  >
                    Error boundaries on
                  </Checkbox>
                </Box>

                <SpaceBetween size="m">
                  <SpaceBetween size="m" direction="horizontal">
                    <BrokenButton />

                    <Box>
                      <Button onClick={() => setModalOpen(true)}>Show modal</Button>
                      <Modal visible={modalOpen} header="Modal" onDismiss={() => setModalOpen(false)}>
                        <BrokenButton />
                      </Modal>
                    </Box>

                    <Popover header="Header" content={<BrokenButton />} triggerType="custom">
                      <Button>Show popover</Button>
                    </Popover>
                  </SpaceBetween>

                  <Container header={<Header>Container 1</Header>}>
                    <BrokenButton />
                  </Container>

                  <Container header={<Header>Container 2</Header>}>
                    <BrokenButton />
                  </Container>

                  <ExpandableSection
                    variant="container"
                    headerText="Expandable section"
                    headerActions={<BrokenButton />}
                    defaultExpanded={true}
                  >
                    <BrokenButton />
                  </ExpandableSection>

                  <Table
                    header={<Header>Table</Header>}
                    columnDefinitions={[
                      {
                        header: 'Column 1',
                        cell: item => <Link href="/#/light/error-boundary/demo-async-load">{item}</Link>,
                      },
                      { header: 'Column 2', cell: item => `Content 2:${item}` },
                      { header: 'Column 3', cell: item => `Content 3:${item}` },
                      { header: 'Actions', cell: () => <BrokenButton /> },
                    ]}
                    items={[1, 2, 3]}
                  ></Table>
                </SpaceBetween>
              </Box>
            }
          />
        </ErrorBoundariesProvider>
      </I18nProvider>
    </ScreenshotArea>
  );
}

function BrokenButton() {
  const [errorState, setErrorState] = useState(false);
  return <Button onClick={() => setErrorState(true)}>Broken button {errorState ? {} : ''}</Button>;
}
