// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useContext, useState } from 'react';

import {
  Alert,
  AppLayout,
  Box,
  Button,
  Container,
  Drawer,
  ErrorBoundary,
  ErrorBoundaryProps,
  ExpandableSection,
  Form,
  FormField,
  Header,
  Link,
  Modal,
  Popover,
  Select,
  SpaceBetween,
  Spinner,
  SplitPanel,
  Table,
  Tabs,
} from '~components';
import I18nProvider from '~components/i18n';
import messages from '~components/i18n/messages/all.en';
import * as tokens from '~design-tokens';

import AppContext, { AppContextType } from '../app/app-context';
import ScreenshotArea from '../utils/screenshot-area';

type ErrorBoundaryState = 'active' | 'inactive' | 'suppressed';

type PageContext = React.Context<
  AppContextType<{
    rootBoundary: ErrorBoundaryState;
    appLayoutBoundary: ErrorBoundaryState;
    sectionBoundary: ErrorBoundaryState;
  }>
>;

export default function () {
  const {
    urlParams: { rootBoundary = 'active', appLayoutBoundary = 'inactive', sectionBoundary = 'active' },
    setUrlParams,
  } = useContext(AppContext as PageContext);
  const [splitPanelOpen, setSplitPanelOpen] = useState(false);
  const [activeDrawerId, setActiveDrawerId] = useState<null | string>('d1');
  const [sectionUpdateKey, setSectionUpdateKey] = useState(0);
  const [sectionRecovering, setSectionRecovering] = useState<null | number>(null);
  return (
    <ScreenshotArea gutters={false}>
      <I18nProvider messages={[messages]} locale="en">
        <WithErrorBoundary name="Root" state={rootBoundary}>
          <AppLayout
            navigationHide={true}
            activeDrawerId={activeDrawerId}
            onDrawerChange={({ detail }) => setActiveDrawerId(detail.activeDrawerId)}
            splitPanel={
              <SplitPanel
                header="Split panel"
                headerDescription="The split panel has a built-in error boundary in the content slot"
              >
                <SpaceBetween size="m" direction="horizontal">
                  <BrokenButton />
                  <BrokenPopover />
                </SpaceBetween>
              </SplitPanel>
            }
            splitPanelOpen={splitPanelOpen}
            onSplitPanelToggle={({ detail }) => setSplitPanelOpen(detail.open)}
            drawers={[
              {
                id: 'd1',
                content: (
                  <>
                    <BrokenButton />
                    <Drawer
                      header={
                        <Header variant="h2">
                          Drawer 1 <BrokenButton />
                        </Header>
                      }
                    >
                      <SpaceBetween size="s">
                        <Box variant="p">
                          The drawers have built-in error boundary in the content slot. An error in one drawer does not
                          affect other drawers.
                        </Box>
                        <BrokenButton />
                      </SpaceBetween>
                    </Drawer>
                  </>
                ),
                trigger: { iconName: 'bug' },
                ariaLabels: { drawerName: 'Drawer 1', triggerButton: 'Open drawer 1', closeButton: 'Close drawer 1' },
              },
              {
                id: 'd2',
                content: (
                  <Drawer header={<Header variant="h2">Drawer 2</Header>}>
                    <SpaceBetween size="s">
                      <Box variant="p">
                        The drawers have built-in error boundary in the content slot. An error in one drawer does not
                        affect other drawers.
                      </Box>
                      <BrokenButton />
                    </SpaceBetween>
                  </Drawer>
                ),
                trigger: { iconName: 'call' },
                ariaLabels: { drawerName: 'Drawer 2', triggerButton: 'Open drawer 2', closeButton: 'Close drawer 2' },
              },
              {
                id: 'd3',
                content: (
                  <Drawer header={<Header variant="h2">Drawer 3</Header>}>
                    <SpaceBetween size="s">
                      <Box variant="p">This drawer has a custom standalone error boundary that wraps its content.</Box>
                      <WithErrorBoundary name="Drawer" state="active">
                        <BrokenButton />
                      </WithErrorBoundary>
                    </SpaceBetween>
                  </Drawer>
                ),
                trigger: { iconName: 'command-prompt' },
                ariaLabels: { drawerName: 'Drawer 2', triggerButton: 'Open drawer 2', closeButton: 'Close drawer 2' },
              },
            ]}
            content={
              <WithErrorBoundary name="App layout content" state={appLayoutBoundary}>
                <Box>
                  <h1>Error boundary demo</h1>

                  <Box margin={{ vertical: 'xs' }}>
                    <SpaceBetween direction="horizontal" size="m">
                      <FormField label="Root boundary (above app layout)">
                        <ErrorBoundaryStateSelector
                          state={rootBoundary}
                          onChange={rootBoundary => setUrlParams({ rootBoundary })}
                        />
                      </FormField>
                      <FormField label="Custom app layout content boundary">
                        <ErrorBoundaryStateSelector
                          state={appLayoutBoundary}
                          onChange={appLayoutBoundary => setUrlParams({ appLayoutBoundary })}
                        />
                      </FormField>
                      <FormField label="Custom section boundary">
                        <ErrorBoundaryStateSelector
                          state={sectionBoundary}
                          onChange={sectionBoundary => setUrlParams({ sectionBoundary })}
                        />
                      </FormField>
                    </SpaceBetween>
                  </Box>

                  <SpaceBetween size="m">
                    <hr />

                    <Section
                      description={`This button is rendered directly to the app layout content. The error is captured by the
                      built-in app layout error boundary (uses Root boundary settings), or by the custom app layout content error
                      boundary when it is active.`}
                    >
                      <BrokenButton />
                    </Section>

                    <Section
                      description={`Some Cloudscape components (popover, modal, container, and other) define their own built-in
                        error boundaries. Unless suppressed with suppressNested, these error boundaries will capture the error
                        before it propagates further up in the hierarchy. The fallback message will use the settings of the closest
                        defined error boundary (custom app layout content or root).`}
                    >
                      <SpaceBetween direction="horizontal" size="m">
                        <BrokenModal />
                        <BrokenPopover />
                      </SpaceBetween>
                    </Section>

                    <Section
                      description={`The below elements are rendered in a custom container that uses a standalone (custom section) error boundary.
                        The errors from inside are captured by this boundary or by the closest built-in error boundary, unless nested boundaries
                        are suppressed.`}
                    >
                      <CustomContainer>
                        <WithErrorBoundary name="Section" state={sectionBoundary}>
                          <SpaceBetween size="m" direction="horizontal">
                            <BrokenButton />
                            <BrokenPopover />
                          </SpaceBetween>
                        </WithErrorBoundary>
                      </CustomContainer>
                    </Section>

                    <Section
                      description={`Containers have two built-in error boundaries: one wraps the content, and another wraps the entire container body,
                        so to capture errors that might originate in the header or footer.`}
                    >
                      <Container
                        header={<Header actions={<BrokenButton />}>Container</Header>}
                        footer={<BrokenButton />}
                      >
                        <SpaceBetween size="m" direction="horizontal">
                          <BrokenButton />
                          <BrokenPopover />
                        </SpaceBetween>
                      </Container>
                    </Section>

                    <Section
                      description={`Components that use the container internally also receive the built-in error boundary. That includes the container
                        variant of expandable section, all table variants, cards, container variant of tabs.`}
                    >
                      <ExpandableSection
                        variant="stacked"
                        headerText="Expandable section"
                        headerActions={<BrokenButton />}
                        defaultExpanded={true}
                      >
                        <BrokenButton />
                      </ExpandableSection>

                      <Table
                        variant="stacked"
                        header={<Header actions={<BrokenButton />}>Table</Header>}
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

                      <Tabs
                        variant="stacked"
                        tabs={[
                          { id: 'id1', label: 'Tab 1 - button', content: <BrokenButton /> },
                          { id: 'id2', label: 'Tab 2 - popover', content: <BrokenPopover /> },
                          {
                            id: 'id3',
                            label: 'Tab 3 - expandable section',
                            content: (
                              <ExpandableSection
                                headerText="Expandable section (non-container variant)"
                                headerActions={<BrokenButton />}
                                defaultExpanded={true}
                              >
                                <BrokenButton />
                              </ExpandableSection>
                            ),
                          },
                        ]}
                      />
                    </Section>

                    <Section
                      description={`The below elements are wrapped with a Form component. The form suppresses all nested error boundaries,
                      so an error makes the entire form fail (with a fallback message).`}
                    >
                      <Form actions={<BrokenButton />}>
                        <SpaceBetween size="m">
                          <SpaceBetween size="m" direction="horizontal">
                            <BrokenButton />
                            <BrokenPopover />
                          </SpaceBetween>

                          <Container header={<Header>Container</Header>}>
                            <BrokenButton />
                          </Container>
                        </SpaceBetween>
                      </Form>
                    </Section>

                    <Section
                      description={`In some cases, it might be possible to recover from a section-level error boundary by reloading that section alone,
                        in that case the respective section can be re-rendered with a different React key to reset the error boundary state.`}
                    >
                      <WithErrorBoundary
                        name="Recoverable section boundary"
                        state="active"
                        key={sectionUpdateKey}
                        renderFallback={({ header, description }) => (
                          <Alert
                            type="error"
                            header={header}
                            action={
                              <Button
                                iconName="refresh"
                                onClick={() => {
                                  if (sectionRecovering !== null) {
                                    clearTimeout(sectionRecovering);
                                  }
                                  setSectionUpdateKey(k => k + 1);
                                  setSectionRecovering(
                                    setTimeout(() => setSectionRecovering(null), 1000) as unknown as number
                                  );
                                }}
                              >
                                Reload section
                              </Button>
                            }
                          >
                            {description}
                          </Alert>
                        )}
                      >
                        <Container header={<Header>Container</Header>}>
                          {sectionRecovering === null ? (
                            <SpaceBetween size="m" direction="horizontal">
                              <BrokenButton />
                              <BrokenPopover />
                            </SpaceBetween>
                          ) : (
                            <Spinner />
                          )}
                        </Container>
                      </WithErrorBoundary>
                    </Section>
                  </SpaceBetween>
                </Box>
              </WithErrorBoundary>
            }
          />
        </WithErrorBoundary>
      </I18nProvider>
    </ScreenshotArea>
  );
}

function Section({ description, children }: { description?: string; children: React.ReactNode }) {
  return (
    <div>
      {description && <Box variant="p">{description}</Box>}
      <Box margin={{ top: 's' }}>{children}</Box>
    </div>
  );
}

function WithErrorBoundary({
  children,
  state,
  name,
  renderFallback,
}: {
  children: React.ReactNode;
  state: ErrorBoundaryState;
  name: string;
  renderFallback?: ErrorBoundaryProps['renderFallback'];
}) {
  return state !== 'inactive' ? (
    <ErrorBoundary
      onError={({ error }) => console.log(`Error "${error.message.slice(0, 20)}… reported."`)}
      suppressNested={state === 'suppressed'}
      renderFallback={renderFallback}
      errorBoundaryId={name}
    >
      {children}
    </ErrorBoundary>
  ) : (
    <>{children}</>
  );
}

function ErrorBoundaryStateSelector({
  state,
  onChange,
}: {
  state: ErrorBoundaryState;
  onChange: (state: ErrorBoundaryState) => void;
}) {
  const options = [
    { value: 'active', label: 'Active' },
    { value: 'suppressed', label: 'Active, suppress nested' },
    { value: 'inactive', label: 'Inactive' },
  ];
  return (
    <Select
      options={options}
      selectedOption={options.find(o => o.value === state) ?? options[0]}
      onChange={({ detail }) => onChange(detail.selectedOption.value as unknown as ErrorBoundaryState)}
    />
  );
}

function BrokenButton() {
  const [errorState, setErrorState] = useState(false);
  return <Button onClick={() => setErrorState(true)}>Broken button {errorState ? {} : ''}</Button>;
}

function BrokenModal() {
  const [modalOpen, setModalOpen] = useState(false);
  return (
    <Box>
      <Button onClick={() => setModalOpen(true)}>Show modal</Button>
      <Modal visible={modalOpen} header="Modal" onDismiss={() => setModalOpen(false)}>
        <BrokenButton />
      </Modal>
    </Box>
  );
}

function BrokenPopover() {
  return (
    <Popover header="Header" content={<BrokenButton />} triggerType="custom">
      <Button>Show popover</Button>
    </Popover>
  );
}

function CustomContainer({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        border: `1px solid ${tokens.colorBorderDividerDefault}`,
        padding: tokens.spaceContainerHorizontal,
        borderRadius: tokens.borderRadiusContainer,
        backgroundColor: tokens.colorBackgroundCellShaded,
      }}
    >
      {children}
    </div>
  );
}
