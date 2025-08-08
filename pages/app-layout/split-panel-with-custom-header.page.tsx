// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useContext, useEffect, useRef, useState } from 'react';

import AppLayout, { AppLayoutProps } from '~components/app-layout';
import Badge from '~components/badge';
import Box from '~components/box';
import Button from '~components/button';
import FormField from '~components/form-field';
import Header from '~components/header';
import Input from '~components/input';
import Link from '~components/link';
import SpaceBetween from '~components/space-between';
import SplitPanel from '~components/split-panel';
import Toggle from '~components/toggle';

import AppContext, { AppContextType } from '../app/app-context';
import ScreenshotArea from '../utils/screenshot-area';
import { Breadcrumbs, Containers, Navigation, ScrollableDrawerContent, Tools } from './utils/content-blocks';
import labels from './utils/labels';
import { splitPaneli18nStrings } from './utils/strings';
import * as toolsContent from './utils/tools-content';

type SplitPanelDemoContext = React.Context<
  AppContextType<{
    ariaLabel?: string;
    description?: string;
    editableHeader: boolean;
    headerText?: string;
    renderActions: boolean;
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
      <SpaceBetween direction="horizontal" size="xxs" alignItems="center">
        {editing ? (
          <>
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
          </>
        ) : (
          <>
            <Box variant="h3" tagOverride="h2" display="inline" margin={{ vertical: 'n' }} padding={{ vertical: 'n' }}>
              {value}
            </Box>
            <Button variant="icon" iconName="edit" onClick={() => setEditing(true)}></Button>
          </>
        )}
      </SpaceBetween>
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
              urlParams.renderActions && (
                <SpaceBetween direction="horizontal" size="xs">
                  <Button>Button</Button>
                  <Button>Button</Button>
                </SpaceBetween>
              )
            }
            headerBefore={
              (urlParams.renderBadge || urlParams.editableHeader) && (
                <>
                  {urlParams.renderBadge && <Badge>Badge</Badge>}
                  {urlParams.editableHeader && (
                    <Box display="inline-block" margin={{ left: urlParams.renderBadge ? 'xs' : 'n' }}>
                      <EditableHeader
                        value={urlParams.headerText || ''}
                        onChange={value => setUrlParams({ ...urlParams, headerText: value })}
                      />
                    </Box>
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
              <Header variant="h1" description="Basic demo with split panel">
                Demo page
              </Header>
            </div>
            <SpaceBetween size="l">
              <SpaceBetween direction="horizontal" size="xl">
                <Toggle
                  checked={urlParams.renderBadge}
                  onChange={({ detail }) => setUrlParams({ ...urlParams, renderBadge: detail.checked })}
                >
                  With badge
                </Toggle>
                <Toggle
                  checked={urlParams.editableHeader}
                  onChange={({ detail }) => setUrlParams({ ...urlParams, editableHeader: detail.checked })}
                >
                  Editable header text
                </Toggle>
                <Toggle
                  checked={urlParams.renderInfoLink}
                  onChange={({ detail }) => setUrlParams({ ...urlParams, renderInfoLink: detail.checked })}
                >
                  With info link
                </Toggle>
                <Toggle
                  checked={urlParams.renderActions}
                  onChange={({ detail }) => setUrlParams({ ...urlParams, renderActions: detail.checked })}
                >
                  With action buttons
                </Toggle>
              </SpaceBetween>
              <FormField label="Header text">
                <Input
                  value={urlParams.headerText || ''}
                  onChange={({ detail }) => setUrlParams({ ...urlParams, headerText: detail.value })}
                />
              </FormField>
              <FormField label="Description">
                <Input
                  value={urlParams.description || ''}
                  onChange={({ detail }) => setUrlParams({ ...urlParams, description: detail.value })}
                />
              </FormField>
              <FormField label="ARIA label">
                <Input
                  value={urlParams.ariaLabel || ''}
                  onChange={({ detail }) => setUrlParams({ ...urlParams, ariaLabel: detail.value })}
                />
              </FormField>
              <Containers />
            </SpaceBetween>
          </>
        }
      />
    </ScreenshotArea>
  );
}
