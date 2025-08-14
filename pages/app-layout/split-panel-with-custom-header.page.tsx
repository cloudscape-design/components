// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useContext, useEffect, useRef, useState } from 'react';

import AppLayout, { AppLayoutProps } from '~components/app-layout';
import Badge from '~components/badge';
import Box from '~components/box';
import Button from '~components/button';
import ButtonDropdown from '~components/button-dropdown';
import ColumnLayout from '~components/column-layout';
import FormField from '~components/form-field/internal';
import Header from '~components/header';
import Input from '~components/input';
import FocusLock, { FocusLockRef } from '~components/internal/components/focus-lock';
import Link from '~components/link';
import SpaceBetween from '~components/space-between';
import SplitPanel from '~components/split-panel';

import AppContext, { AppContextType } from '../app/app-context';
import ScreenshotArea from '../utils/screenshot-area';
import { Breadcrumbs, ScrollableDrawerContent, Tools } from './utils/content-blocks';
import labels from './utils/labels';
import { splitPaneli18nStrings } from './utils/strings';
import * as toolsContent from './utils/tools-content';

import styles from './styles.scss';

type SplitPanelDemoContext = React.Context<
  AppContextType<{
    description?: string;
    editableHeader: boolean;
    headerText?: string;
    linkedHeader?: boolean;
    renderActionsButtonDropdown: boolean;
    renderActionsButtonLink: boolean;
    renderBeforeButtons: boolean;
    renderBeforeBadge: boolean;
    renderInfoLink: boolean;
    splitPanelOpen: boolean;
    splitPanelPosition: AppLayoutProps.SplitPanelPreferences['position'];
  }>
>;

function EditableHeader({ onChange, value }: { onChange: (text: string) => void; value: string }) {
  const [internalValue, setInternalValue] = useState(value);
  const [editing, setEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const focusLockRef = useRef<FocusLockRef>(null);

  useEffect(() => {
    if (editing) {
      inputRef.current?.focus();
    }
  }, [editing]);

  return editing ? (
    <span role="dialog" aria-label="Edit resource name" style={{ display: 'inline-block' }}>
      <FocusLock ref={focusLockRef}>
        <form
          onSubmit={() => {
            onChange(internalValue);
            setEditing(false);
          }}
        >
          <SpaceBetween direction="horizontal" size="xxs">
            <SpaceBetween direction="horizontal" size="s" alignItems="center">
              <Box>
                <label id="edit-resource-name-label">Resource name</label>
              </Box>
              <Input
                ariaLabelledby="edit-resource-name-label"
                value={internalValue}
                onChange={({ detail }) => setInternalValue(detail.value)}
                ref={inputRef}
              />
            </SpaceBetween>
            <Button variant="icon" iconName="check" formAction="submit" ariaLabel="Submit" />
            <Button
              variant="icon"
              iconName="close"
              formAction="none"
              ariaLabel="Submit"
              onClick={() => setEditing(false)}
            />
          </SpaceBetween>
        </form>
      </FocusLock>
    </span>
  ) : (
    <span className={styles['split-panel-header-margin']}>
      <span>{value}</span>{' '}
      <Button
        variant="inline-icon"
        iconName="edit"
        ariaLabel="Edit resource name"
        onClick={() => setEditing(true)}
      ></Button>
    </span>
  );
}

export default function () {
  const { urlParams, setUrlParams } = useContext(AppContext as SplitPanelDemoContext);
  const [toolsOpen, setToolsOpen] = useState(false);

  const {
    description,
    editableHeader,
    linkedHeader,
    renderActionsButtonDropdown,
    renderActionsButtonLink,
    renderBeforeBadge,
    renderBeforeButtons,
    renderInfoLink,
    splitPanelOpen,
    splitPanelPosition,
  } = urlParams;

  // Initalize with a known header text for a11y compliance if not provided.
  const headerText = urlParams.headerText === undefined ? 'Header text' : urlParams.headerText;

  const renderHeaderTextAsLink = !editableHeader && linkedHeader && headerText;
  const renderActions = renderActionsButtonDropdown || renderActionsButtonLink;
  const renderBefore = editableHeader || linkedHeader || renderBeforeBadge || renderBeforeButtons;
  const renderHeaderTextInBeforeSlot = editableHeader || linkedHeader || renderBeforeButtons;

  return (
    <ScreenshotArea gutters={false} disableAnimations={true}>
      <AppLayout
        ariaLabels={labels}
        breadcrumbs={<Breadcrumbs />}
        navigationHide={true}
        tools={<Tools>{toolsContent.long}</Tools>}
        toolsOpen={toolsOpen}
        splitPanelOpen={splitPanelOpen}
        onSplitPanelToggle={({ detail }) => setUrlParams({ ...urlParams, splitPanelOpen: detail.open })}
        splitPanelPreferences={{
          position: splitPanelPosition,
        }}
        onSplitPanelPreferencesChange={event => {
          const { position } = event.detail;
          setUrlParams({ splitPanelPosition: position === 'side' ? position : undefined });
        }}
        onToolsChange={({ detail }) => setToolsOpen(detail.open)}
        splitPanel={
          <SplitPanel
            header={renderHeaderTextInBeforeSlot ? '' : headerText}
            i18nStrings={splitPaneli18nStrings}
            headerActions={
              renderActions && (
                <SpaceBetween direction="horizontal" size="xs" alignItems="center">
                  {renderActionsButtonLink && <Link>Action</Link>}
                  {renderActionsButtonDropdown && (
                    <ButtonDropdown
                      items={[{ id: 'settings', text: 'Settings' }]}
                      ariaLabel="Control drawer"
                      variant="icon"
                      expandToViewport={true}
                    />
                  )}
                </SpaceBetween>
              )
            }
            headerBefore={
              renderBefore && (
                <span
                  className={
                    renderBeforeButtons
                      ? styles['split-panel-header-full-width']
                      : renderHeaderTextAsLink
                        ? styles['split-panel-header-margin']
                        : undefined
                  }
                >
                  <span>
                    {renderBeforeBadge && (
                      <Box display="inline-block" margin={{ right: renderHeaderTextInBeforeSlot ? 'xs' : 'n' }}>
                        {renderBeforeBadge && <Badge>3</Badge>}
                      </Box>
                    )}
                    {editableHeader && (
                      <EditableHeader
                        value={headerText || ''}
                        onChange={value => setUrlParams({ ...urlParams, headerText: value })}
                      />
                    )}
                    {renderHeaderTextAsLink && (
                      <span className={renderBeforeButtons ? styles['split-panel-header-margin'] : undefined}>
                        <Link fontSize="inherit" href="#">
                          {headerText}
                        </Link>
                      </span>
                    )}
                    {renderHeaderTextInBeforeSlot && !editableHeader && !renderHeaderTextAsLink && (
                      <span className={styles['split-panel-header-margin']}>{headerText}</span>
                    )}
                  </span>
                  {renderBeforeButtons && (
                    <SpaceBetween direction="horizontal" size="xs">
                      <Button>Button</Button> <Button>Button</Button>
                    </SpaceBetween>
                  )}
                </span>
              )
            }
            headerDescription={description}
            headerInfo={
              renderInfoLink && (
                <Link variant="info" onFollow={() => setToolsOpen(true)}>
                  Info
                </Link>
              )
            }
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
                        checked={renderBeforeBadge}
                        onChange={({ target }) => setUrlParams({ ...urlParams, renderBeforeBadge: target.checked })}
                      />{' '}
                      Badge
                    </label>
                    <label>
                      <input
                        type="checkbox"
                        checked={renderBeforeButtons}
                        onChange={({ target }) => setUrlParams({ ...urlParams, renderBeforeButtons: target.checked })}
                      />{' '}
                      Buttons
                    </label>
                    <label>
                      <input
                        type="checkbox"
                        checked={editableHeader}
                        onChange={({ target }) => setUrlParams({ ...urlParams, editableHeader: target.checked })}
                      />{' '}
                      Editable header text
                    </label>
                    <label>
                      <input
                        type="checkbox"
                        checked={linkedHeader}
                        disabled={editableHeader}
                        onChange={({ target }) => setUrlParams({ ...urlParams, linkedHeader: target.checked })}
                      />{' '}
                      Header text as link
                    </label>
                  </SpaceBetween>
                </FormField>
                <FormField label="headerActions slot">
                  <SpaceBetween size="xxs">
                    <label>
                      <input
                        type="checkbox"
                        checked={renderActionsButtonDropdown}
                        onChange={({ target }) =>
                          setUrlParams({ ...urlParams, renderActionsButtonDropdown: target.checked })
                        }
                      />{' '}
                      Button dropdown
                    </label>
                    <label>
                      <input
                        type="checkbox"
                        checked={renderActionsButtonLink}
                        onChange={({ target }) =>
                          setUrlParams({ ...urlParams, renderActionsButtonLink: target.checked })
                        }
                      />{' '}
                      Inline link button
                    </label>
                  </SpaceBetween>
                </FormField>
              </ColumnLayout>
              <FormField label="Header text">
                <Input
                  value={headerText || ''}
                  onChange={({ detail }) => setUrlParams({ ...urlParams, headerText: detail.value })}
                />
              </FormField>
              <FormField label="Description">
                <Input
                  value={description || ''}
                  onChange={({ detail }) => setUrlParams({ ...urlParams, description: detail.value })}
                />
              </FormField>
              <FormField>
                <label>
                  <input
                    type="checkbox"
                    checked={renderInfoLink}
                    onChange={({ target }) => setUrlParams({ ...urlParams, renderInfoLink: target.checked })}
                  />{' '}
                  Info link
                </label>
              </FormField>
            </SpaceBetween>
          </>
        }
      />
    </ScreenshotArea>
  );
}
