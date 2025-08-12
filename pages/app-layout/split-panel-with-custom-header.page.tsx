// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useContext, useEffect, useRef, useState } from 'react';

import AppLayout, { AppLayoutProps } from '~components/app-layout';
import Badge from '~components/badge';
import Box from '~components/box';
import Button from '~components/button';
import ColumnLayout from '~components/column-layout';
import FormField from '~components/form-field';
import Header from '~components/header';
import Input from '~components/input';
import Link from '~components/link';
import SpaceBetween from '~components/space-between';
import SplitPanel from '~components/split-panel';

import AppContext, { AppContextType } from '../app/app-context';
import ScreenshotArea from '../utils/screenshot-area';
import { Breadcrumbs, Navigation, ScrollableDrawerContent, Tools } from './utils/content-blocks';
import labels from './utils/labels';
import { splitPaneli18nStrings } from './utils/strings';
import * as toolsContent from './utils/tools-content';

type SplitPanelDemoContext = React.Context<
  AppContextType<{
    actionsAsLinks: boolean;
    ariaLabel?: string;
    description?: string;
    editableHeader: boolean;
    headerText?: string;
    renderActions: boolean;
    renderActionsBefore: boolean;
    renderBadge: boolean;
    renderInfoLink: boolean;
    splitPanelOpen: boolean;
    splitPanelPosition: AppLayoutProps.SplitPanelPreferences['position'];
  }>
>;

function EditableHeader({ onChange, value }: { onChange: (text: string) => void; value: string }) {
  const [internalValue, setInternalValue] = useState(value);
  const [editing, setEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (editing) {
      inputRef.current?.focus();
    }
  }, [editing]);

  return (
    <Box display="inline-block">
      {editing ? (
        <SpaceBetween direction="horizontal" size="xxs">
          <Input value={internalValue} onChange={({ detail }) => setInternalValue(detail.value)} ref={inputRef} />
          <Button
            variant="icon"
            iconName="check"
            onClick={() => {
              onChange(internalValue);
              setEditing(false);
            }}
          />
          <Button variant="icon" iconName="close" onClick={() => setEditing(false)} />
        </SpaceBetween>
      ) : (
        <span style={{ display: 'inline-block', marginBlockStart: 5 }}>
          <Box variant="h3" tagOverride="span" display="inline" margin={{ vertical: 'n' }} padding={{ vertical: 'n' }}>
            {value}
          </Box>{' '}
          <Button variant="inline-icon" iconName="edit" onClick={() => setEditing(true)}></Button>
        </span>
      )}
    </Box>
  );
}

export default function () {
  const { urlParams, setUrlParams } = useContext(AppContext as SplitPanelDemoContext);
  const [toolsOpen, setToolsOpen] = useState(false);

  // Initialize the header to a default value if not set.
  useEffect(() => {
    if (!urlParams.editableHeader) {
      setUrlParams({ ...urlParams, headerText: urlParams.headerText || 'Header text' });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ScreenshotArea gutters={false}>
      <AppLayout
        ariaLabels={labels}
        breadcrumbs={<Breadcrumbs />}
        navigation={<Navigation />}
        tools={<Tools>{toolsContent.long}</Tools>}
        toolsOpen={toolsOpen}
        splitPanelOpen={urlParams.splitPanelOpen}
        onSplitPanelToggle={({ detail }) => setUrlParams({ ...urlParams, splitPanelOpen: detail.open })}
        splitPanelPreferences={{
          position: urlParams.splitPanelPosition,
        }}
        onSplitPanelPreferencesChange={event => {
          const { position } = event.detail;
          setUrlParams({ splitPanelPosition: position === 'side' ? position : undefined });
        }}
        onToolsChange={({ detail }) => setToolsOpen(detail.open)}
        splitPanel={
          <SplitPanel
            header={(!urlParams.editableHeader && urlParams.headerText) || ''}
            i18nStrings={splitPaneli18nStrings}
            headerActions={
              <>
                {urlParams.renderActions && (
                  <>
                    <Button>Button</Button> <Button>Button</Button>
                  </>
                )}
                {urlParams.renderActions && urlParams.actionsAsLinks && ' '}
                {urlParams.actionsAsLinks && (
                  <>
                    <Link>Action</Link> <Link>Action</Link>
                  </>
                )}
              </>
            }
            headerBefore={
              (urlParams.renderBadge || urlParams.editableHeader || urlParams.renderActionsBefore) && (
                <>
                  {(urlParams.renderBadge || urlParams.renderActionsBefore) && (
                    <>
                      {urlParams.renderActionsBefore && (
                        <>
                          <Button>Button</Button> <Button>Button</Button>
                        </>
                      )}
                      {urlParams.renderBadge && urlParams.renderActionsBefore && ' '}
                      {urlParams.renderBadge && <Badge>Badge</Badge>}
                      {urlParams.editableHeader && ' '}
                    </>
                  )}
                  {urlParams.editableHeader && (
                    <EditableHeader
                      value={urlParams.headerText || ''}
                      onChange={value => setUrlParams({ ...urlParams, headerText: value })}
                    />
                  )}
                </>
              )
            }
            headerDescription={urlParams.description}
            headerInfo={
              urlParams.renderInfoLink && (
                <Link variant="info" onFollow={() => setToolsOpen(true)}>
                  Info
                </Link>
              )
            }
            ariaLabel={urlParams.ariaLabel}
          >
            <ScrollableDrawerContent />
          </SplitPanel>
        }
        content={
          <>
            <div style={{ marginBottom: '1rem' }}>
              <Header variant="h1">Split panel with custom header elements</Header>
            </div>
            <SpaceBetween size="l">
              <ColumnLayout columns={2}>
                <FormField label="beforeHeader slot">
                  <SpaceBetween size="xxs">
                    <label>
                      <input
                        type="checkbox"
                        checked={urlParams.renderActionsBefore}
                        onChange={({ target }) => setUrlParams({ ...urlParams, renderActionsBefore: target.checked })}
                      />{' '}
                      Buttons
                    </label>
                    <label>
                      <input
                        type="checkbox"
                        checked={urlParams.renderBadge}
                        onChange={({ target }) => setUrlParams({ ...urlParams, renderBadge: target.checked })}
                      />{' '}
                      Badge
                    </label>
                    <label>
                      <input
                        type="checkbox"
                        checked={urlParams.editableHeader}
                        onChange={({ target }) => setUrlParams({ ...urlParams, editableHeader: target.checked })}
                      />{' '}
                      Editable header text
                    </label>
                  </SpaceBetween>
                </FormField>
                <FormField label="headerActions slot">
                  <SpaceBetween size="xxs">
                    <label>
                      <input
                        type="checkbox"
                        checked={urlParams.renderActions}
                        onChange={({ target }) => setUrlParams({ ...urlParams, renderActions: target.checked })}
                      />{' '}
                      Buttons
                    </label>
                    <label>
                      <input
                        type="checkbox"
                        checked={urlParams.actionsAsLinks}
                        onChange={({ target }) => setUrlParams({ ...urlParams, actionsAsLinks: target.checked })}
                      />{' '}
                      Inline link buttons
                    </label>
                  </SpaceBetween>
                </FormField>
              </ColumnLayout>
              <FormField label="Header text">
                <input
                  value={urlParams.headerText || ''}
                  onChange={({ target }) => setUrlParams({ ...urlParams, headerText: target.value })}
                />
              </FormField>
              <FormField label="Description">
                <input
                  value={urlParams.description || ''}
                  onChange={({ target }) => setUrlParams({ ...urlParams, description: target.value })}
                />
              </FormField>
              <FormField label="ARIA label">
                <input
                  value={urlParams.ariaLabel || ''}
                  onChange={({ target }) => setUrlParams({ ...urlParams, ariaLabel: target.value })}
                />
              </FormField>
              <label>
                <input
                  type="checkbox"
                  checked={urlParams.renderInfoLink}
                  onChange={({ target }) => setUrlParams({ ...urlParams, renderInfoLink: target.checked })}
                />{' '}
                Info link
              </label>
            </SpaceBetween>
          </>
        }
      />
    </ScreenshotArea>
  );
}
