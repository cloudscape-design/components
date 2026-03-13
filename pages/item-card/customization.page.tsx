// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useContext } from 'react';

import {
  Box,
  Checkbox,
  ColumnLayout,
  Container,
  ExpandableSection,
  FormField,
  Header,
  Input,
  Select,
  SelectProps,
  SpaceBetween,
  Toggle,
} from '~components';
import ButtonGroup from '~components/button-group';
import { IconProps } from '~components/icon/interfaces';
import ItemCard from '~components/item-card';
import PanelLayout from '~components/panel-layout';

import AppContext, { AppContextType } from '../app/app-context';
import { SimplePage } from '../app/templates';
import ScreenshotArea from '../utils/screenshot-area';

type DevPageContext = React.Context<
  AppContextType<{
    containerWidth: string;
    headerText: string;
    descriptionText: string;
    contentText: string;
    footerText: string;
    showHeader: boolean;
    showDescription: boolean;
    showContent: boolean;
    showFooter: boolean;
    showActions: boolean;
    showIcon: boolean;
    iconName: string;
    disableHeaderPaddings: boolean;
    disableContentPaddings: boolean;
    disableFooterPaddings: boolean;
    useCustomStyles: boolean;
    rootBackground: string;
    rootBorderColor: string;
    rootBorderRadius: string;
    rootBorderWidth: string;
    rootBoxShadow: string;
    contentPaddingBlock: string;
    contentPaddingInline: string;
    headerPaddingBlock: string;
    headerPaddingInline: string;
    footerRootPaddingBlock: string;
    footerRootPaddingInline: string;
    footerDividerBorderWidth: string;
    footerDividerBorderColor: string;
  }>
>;

const iconOptions: Array<SelectProps.Option> = [
  { value: 'settings', label: 'settings' },
  { value: 'edit', label: 'edit' },
  { value: 'remove', label: 'remove' },
  { value: 'add-plus', label: 'add-plus' },
  { value: 'calendar', label: 'calendar' },
  { value: 'call', label: 'call' },
  { value: 'copy', label: 'copy' },
  { value: 'delete-marker', label: 'delete-marker' },
  { value: 'download', label: 'download' },
  { value: 'envelope', label: 'envelope' },
  { value: 'external', label: 'external' },
  { value: 'file', label: 'file' },
  { value: 'folder', label: 'folder' },
  { value: 'heart', label: 'heart' },
  { value: 'key', label: 'key' },
  { value: 'lock-private', label: 'lock-private' },
  { value: 'microphone', label: 'microphone' },
  { value: 'notification', label: 'notification' },
  { value: 'search', label: 'search' },
  { value: 'share', label: 'share' },
  { value: 'star-filled', label: 'star-filled' },
  { value: 'status-positive', label: 'status-positive' },
  { value: 'status-warning', label: 'status-warning' },
  { value: 'status-negative', label: 'status-negative' },
  { value: 'status-info', label: 'status-info' },
  { value: 'upload', label: 'upload' },
  { value: 'user-profile', label: 'user-profile' },
];

const actions = (
  <ButtonGroup
    variant="icon"
    items={[
      { type: 'icon-button', id: 'edit', iconName: 'edit', text: 'Edit' },
      { type: 'icon-button', id: 'delete', iconName: 'remove', text: 'Delete' },
    ]}
  />
);

export default function ItemCardDevPage() {
  const { urlParams, setUrlParams } = useContext(AppContext as DevPageContext);

  const containerWidth = urlParams.containerWidth || '400';
  const headerText = urlParams.headerText || 'Card Header';
  const descriptionText = urlParams.descriptionText || 'A short description of the card content';
  const contentText =
    urlParams.contentText || 'This is the main content area of the item card. It can contain any text or information.';
  const footerText = urlParams.footerText || 'Card footer text';
  const showHeader = urlParams.showHeader !== false;
  const showDescription = urlParams.showDescription !== false;
  const showContent = urlParams.showContent !== false;
  const showFooter = urlParams.showFooter === true;
  const showActions = urlParams.showActions === true;
  const showIcon = urlParams.showIcon === true;
  const iconName = (urlParams.iconName || 'settings') as IconProps.Name;
  const disableHeaderPaddings = urlParams.disableHeaderPaddings === true;
  const disableContentPaddings = urlParams.disableContentPaddings === true;
  const disableFooterPaddings = urlParams.disableFooterPaddings === true;
  const useCustomStyles = urlParams.useCustomStyles === true;

  // Root styles
  const rootBackground = urlParams.rootBackground || '';
  const rootBorderColor = urlParams.rootBorderColor || '';
  const rootBorderRadius = urlParams.rootBorderRadius || '';
  const rootBorderWidth = urlParams.rootBorderWidth || '';
  const rootBoxShadow = urlParams.rootBoxShadow || '';

  // Content styles
  const contentPaddingBlock = urlParams.contentPaddingBlock || '';
  const contentPaddingInline = urlParams.contentPaddingInline || '';

  // Header styles
  const headerPaddingBlock = urlParams.headerPaddingBlock || '';
  const headerPaddingInline = urlParams.headerPaddingInline || '';

  // Footer styles
  const footerRootPaddingBlock = urlParams.footerRootPaddingBlock || '';
  const footerRootPaddingInline = urlParams.footerRootPaddingInline || '';
  const footerDividerBorderWidth = urlParams.footerDividerBorderWidth || '';
  const footerDividerBorderColor = urlParams.footerDividerBorderColor || '';

  const selectedIconOption = iconOptions.find(opt => opt.value === iconName) ?? iconOptions[0];

  const customStyle = useCustomStyles
    ? {
        root: {
          ...(rootBackground ? { background: rootBackground } : {}),
          ...(rootBorderColor ? { borderColor: rootBorderColor } : {}),
          ...(rootBorderRadius ? { borderRadius: rootBorderRadius } : {}),
          ...(rootBorderWidth ? { borderWidth: rootBorderWidth } : {}),
          ...(rootBoxShadow ? { boxShadow: rootBoxShadow } : {}),
        },
        content: {
          ...(contentPaddingBlock ? { paddingBlock: contentPaddingBlock } : {}),
          ...(contentPaddingInline ? { paddingInline: contentPaddingInline } : {}),
        },
        header: {
          ...(headerPaddingBlock ? { paddingBlock: headerPaddingBlock } : {}),
          ...(headerPaddingInline ? { paddingInline: headerPaddingInline } : {}),
        },
        footer: {
          root: {
            ...(footerRootPaddingBlock ? { paddingBlock: footerRootPaddingBlock } : {}),
            ...(footerRootPaddingInline ? { paddingInline: footerRootPaddingInline } : {}),
          },
          divider: {
            ...(footerDividerBorderWidth ? { borderWidth: footerDividerBorderWidth } : {}),
            ...(footerDividerBorderColor ? { borderColor: footerDividerBorderColor } : {}),
          },
        },
      }
    : undefined;

  const settingsPanel = (
    <Container fitHeight={true} header={<Header variant="h2">Settings</Header>}>
      <SpaceBetween size="m">
        <FormField label="Container width (px)">
          <Input
            value={containerWidth}
            onChange={({ detail }) => setUrlParams({ containerWidth: detail.value })}
            type="number"
            inputMode="numeric"
          />
        </FormField>

        <ExpandableSection headerText="Content visibility" defaultExpanded={true}>
          <SpaceBetween size="s">
            <ColumnLayout columns={2}>
              <Toggle checked={showHeader} onChange={({ detail }) => setUrlParams({ showHeader: detail.checked })}>
                Show header
              </Toggle>
              <Toggle
                checked={showDescription}
                onChange={({ detail }) => setUrlParams({ showDescription: detail.checked })}
              >
                Show description
              </Toggle>
              <Toggle checked={showContent} onChange={({ detail }) => setUrlParams({ showContent: detail.checked })}>
                Show content
              </Toggle>
              <Toggle checked={showFooter} onChange={({ detail }) => setUrlParams({ showFooter: detail.checked })}>
                Show footer
              </Toggle>
              <Toggle checked={showActions} onChange={({ detail }) => setUrlParams({ showActions: detail.checked })}>
                Show actions
              </Toggle>
              <Toggle checked={showIcon} onChange={({ detail }) => setUrlParams({ showIcon: detail.checked })}>
                Show icon
              </Toggle>
            </ColumnLayout>
          </SpaceBetween>
        </ExpandableSection>

        <ExpandableSection headerText="Text content" defaultExpanded={true}>
          <SpaceBetween size="s">
            <FormField label="Header text">
              <Input
                value={headerText}
                onChange={({ detail }) => setUrlParams({ headerText: detail.value })}
                disabled={!showHeader}
              />
            </FormField>
            <FormField label="Description text">
              <Input
                value={descriptionText}
                onChange={({ detail }) => setUrlParams({ descriptionText: detail.value })}
                disabled={!showDescription}
              />
            </FormField>
            <FormField label="Content text">
              <Input
                value={contentText}
                onChange={({ detail }) => setUrlParams({ contentText: detail.value })}
                disabled={!showContent}
              />
            </FormField>
            <FormField label="Footer text">
              <Input
                value={footerText}
                onChange={({ detail }) => setUrlParams({ footerText: detail.value })}
                disabled={!showFooter}
              />
            </FormField>
          </SpaceBetween>
        </ExpandableSection>

        <ExpandableSection headerText="Icon settings" defaultExpanded={false}>
          <SpaceBetween size="s">
            <FormField label="Icon name">
              <Select
                selectedOption={selectedIconOption}
                options={iconOptions}
                onChange={({ detail }) => setUrlParams({ iconName: detail.selectedOption.value ?? 'settings' })}
                disabled={!showIcon}
              />
            </FormField>
          </SpaceBetween>
        </ExpandableSection>

        <ExpandableSection headerText="Padding overrides" defaultExpanded={false}>
          <SpaceBetween size="s">
            <Checkbox
              checked={disableHeaderPaddings}
              onChange={({ detail }) => setUrlParams({ disableHeaderPaddings: detail.checked })}
            >
              Disable header paddings
            </Checkbox>
            <Checkbox
              checked={disableContentPaddings}
              onChange={({ detail }) => setUrlParams({ disableContentPaddings: detail.checked })}
            >
              Disable content paddings
            </Checkbox>
            <Checkbox
              checked={disableFooterPaddings}
              onChange={({ detail }) => setUrlParams({ disableFooterPaddings: detail.checked })}
            >
              Disable footer paddings
            </Checkbox>
          </SpaceBetween>
        </ExpandableSection>

        <ExpandableSection headerText="Custom styles" defaultExpanded={false}>
          <SpaceBetween size="s">
            <Toggle
              checked={useCustomStyles}
              onChange={({ detail }) => setUrlParams({ useCustomStyles: detail.checked })}
            >
              Enable custom styles
            </Toggle>

            <ExpandableSection headerText="Root" defaultExpanded={true}>
              <SpaceBetween size="s">
                <FormField label="background" description="e.g. light-dark(rgb(204, 225, 249), rgb(1, 20, 25))">
                  <Input
                    value={rootBackground}
                    onChange={({ detail }) => setUrlParams({ rootBackground: detail.value })}
                    disabled={!useCustomStyles}
                    placeholder="light-dark(rgb(204, 225, 249), rgb(1, 20, 25))"
                  />
                </FormField>
                <FormField label="borderColor" description="e.g. green, #ff0000">
                  <Input
                    value={rootBorderColor}
                    onChange={({ detail }) => setUrlParams({ rootBorderColor: detail.value })}
                    disabled={!useCustomStyles}
                    placeholder="light-dark(rgb(1, 20, 25), rgb(204, 225, 249))"
                  />
                </FormField>
                <FormField label="borderWidth" description="e.g. 1px, 4px">
                  <Input
                    value={rootBorderWidth}
                    onChange={({ detail }) => setUrlParams({ rootBorderWidth: detail.value })}
                    disabled={!useCustomStyles}
                    placeholder="4px"
                  />
                </FormField>
                <FormField label="borderRadius" description="e.g. 8px, 20px">
                  <Input
                    value={rootBorderRadius}
                    onChange={({ detail }) => setUrlParams({ rootBorderRadius: detail.value })}
                    disabled={!useCustomStyles}
                    placeholder="10px"
                  />
                </FormField>
                <FormField label="boxShadow" description="e.g. 2px 2px 6px 4px rgba(0,0,0,0.2)">
                  <Input
                    value={rootBoxShadow}
                    onChange={({ detail }) => setUrlParams({ rootBoxShadow: detail.value })}
                    disabled={!useCustomStyles}
                    placeholder="2px 2px 6px 4px rgba(0,0,0,0.2)"
                  />
                </FormField>
              </SpaceBetween>
            </ExpandableSection>

            <ExpandableSection headerText="Content" defaultExpanded={false}>
              <SpaceBetween size="s">
                <FormField label="paddingBlock" description="e.g. 0px 16px">
                  <Input
                    value={contentPaddingBlock}
                    onChange={({ detail }) => setUrlParams({ contentPaddingBlock: detail.value })}
                    disabled={!useCustomStyles}
                    placeholder="0px 16px"
                  />
                </FormField>
                <FormField label="paddingInline" description="e.g. 16px">
                  <Input
                    value={contentPaddingInline}
                    onChange={({ detail }) => setUrlParams({ contentPaddingInline: detail.value })}
                    disabled={!useCustomStyles}
                    placeholder="16px"
                  />
                </FormField>
              </SpaceBetween>
            </ExpandableSection>

            <ExpandableSection headerText="Header" defaultExpanded={false}>
              <SpaceBetween size="s">
                <FormField label="paddingBlock" description="e.g. 14px">
                  <Input
                    value={headerPaddingBlock}
                    onChange={({ detail }) => setUrlParams({ headerPaddingBlock: detail.value })}
                    disabled={!useCustomStyles}
                    placeholder="14px"
                  />
                </FormField>
                <FormField label="paddingInline" description="e.g. 16px">
                  <Input
                    value={headerPaddingInline}
                    onChange={({ detail }) => setUrlParams({ headerPaddingInline: detail.value })}
                    disabled={!useCustomStyles}
                    placeholder="16px"
                  />
                </FormField>
              </SpaceBetween>
            </ExpandableSection>

            <ExpandableSection headerText="Footer > root" defaultExpanded={false}>
              <SpaceBetween size="s">
                <FormField label="paddingBlock" description="e.g. 12px 14px">
                  <Input
                    value={footerRootPaddingBlock}
                    onChange={({ detail }) => setUrlParams({ footerRootPaddingBlock: detail.value })}
                    disabled={!useCustomStyles}
                    placeholder="12px 14px"
                  />
                </FormField>
                <FormField label="paddingInline" description="e.g. 16px">
                  <Input
                    value={footerRootPaddingInline}
                    onChange={({ detail }) => setUrlParams({ footerRootPaddingInline: detail.value })}
                    disabled={!useCustomStyles}
                    placeholder="16px"
                  />
                </FormField>
              </SpaceBetween>
            </ExpandableSection>

            <ExpandableSection headerText="Footer > divider" defaultExpanded={false}>
              <SpaceBetween size="s">
                <FormField label="borderWidth" description="e.g. 2px">
                  <Input
                    value={footerDividerBorderWidth}
                    onChange={({ detail }) => setUrlParams({ footerDividerBorderWidth: detail.value })}
                    disabled={!useCustomStyles}
                    placeholder="2px"
                  />
                </FormField>
                <FormField label="borderColor" description="e.g. light-dark(rgb(2, 62, 75), rgb(204, 225, 249))">
                  <Input
                    value={footerDividerBorderColor}
                    onChange={({ detail }) => setUrlParams({ footerDividerBorderColor: detail.value })}
                    disabled={!useCustomStyles}
                    placeholder="light-dark(rgb(2, 62, 75), rgb(204, 225, 249))"
                  />
                </FormField>
              </SpaceBetween>
            </ExpandableSection>
          </SpaceBetween>
        </ExpandableSection>
      </SpaceBetween>
    </Container>
  );

  const mainContent = (
    <Box>
      <SpaceBetween size="l">
        <div style={{ maxInlineSize: parseInt(containerWidth) }}>
          <ScreenshotArea>
            <ItemCard
              header={showHeader ? headerText : undefined}
              description={showDescription ? descriptionText : undefined}
              footer={showFooter ? footerText : undefined}
              actions={showActions ? actions : undefined}
              iconName={showIcon ? iconName : undefined}
              disableHeaderPaddings={disableHeaderPaddings}
              disableContentPaddings={disableContentPaddings}
              disableFooterPaddings={disableFooterPaddings}
              style={customStyle}
            >
              {showContent ? contentText : undefined}
            </ItemCard>
          </ScreenshotArea>
        </div>
      </SpaceBetween>
    </Box>
  );

  return (
    <SimplePage title="ItemCard - customization" subtitle="Shows how ItemCard can be configured.">
      <PanelLayout
        panelPosition="side-start"
        defaultPanelSize={400}
        minPanelSize={300}
        maxPanelSize={600}
        resizable={true}
        panelContent={settingsPanel}
        mainContent={mainContent}
        i18nStrings={{
          resizeHandleAriaLabel: 'Resize settings panel',
        }}
      />
    </SimplePage>
  );
}
