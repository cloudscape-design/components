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
  Grid,
  Header,
  Input,
  Select,
  SelectProps,
  SpaceBetween,
  Toggle,
} from '~components';
import ActionCard, { ActionCardProps } from '~components/action-card';
import Icon from '~components/icon';
import { IconProps } from '~components/icon/interfaces';
import PanelLayout from '~components/panel-layout';

import AppContext, { AppContextType } from '../app/app-context';
import { SimplePage } from '../app/templates';

type DevPageContext = React.Context<
  AppContextType<{
    containerWidth: string;
    headerText: string;
    descriptionText: string;
    contentText: string;
    showHeader: boolean;
    showDescription: boolean;
    showContent: boolean;
    showIcon: boolean;
    iconName: string;
    iconPosition: string;
    iconVerticalAlignment: string;
    disabled: boolean;
    disableHeaderPaddings: boolean;
    disableContentPaddings: boolean;
    variant: 'embedded' | 'default';
    useCustomStyles: boolean;
    rootBackgroundDefault: string;
    rootBackgroundHover: string;
    rootBackgroundActive: string;
    rootBackgroundDisabled: string;
    rootBorderColorDefault: string;
    rootBorderColorHover: string;
    rootBorderColorActive: string;
    rootBorderColorDisabled: string;
    rootBorderRadiusDefault: string;
    rootBorderRadiusHover: string;
    rootBorderRadiusActive: string;
    rootBorderRadiusDisabled: string;
    rootBorderWidthDefault: string;
    rootBorderWidthHover: string;
    rootBorderWidthActive: string;
    rootBorderWidthDisabled: string;
    rootBoxShadowDefault: string;
    rootBoxShadowHover: string;
    rootBoxShadowActive: string;
    rootBoxShadowDisabled: string;
    rootFocusRingBorderColor: string;
    rootFocusRingBorderRadius: string;
    rootFocusRingBorderWidth: string;
    contentPaddingBlock: string;
    contentPaddingInline: string;
    headerPaddingBlock: string;
    headerPaddingInline: string;
    containerType: string;
    cardCount: string;
    containerHeight: string;
  }>
>;

const iconOptions: Array<SelectProps.Option> = [
  { value: 'angle-right', label: 'angle-right' },
  { value: 'arrow-right', label: 'arrow-right' },
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

const variantOptions: Array<SelectProps.Option> = [
  { value: 'default', label: 'Default' },
  { value: 'embedded', label: 'Embedded' },
];

const iconVerticalAlignmentOptions: Array<SelectProps.Option> = [
  { value: 'top', label: 'Top' },
  { value: 'center', label: 'Center' },
];

const containerTypeOptions: Array<SelectProps.Option> = [
  { value: 'div', label: 'div (block)', description: 'Plain <div> wrapper' },
  { value: 'flexbox', label: 'Flexbox', description: 'display: flex' },
  { value: 'css-grid', label: 'CSS Grid', description: 'display: grid' },
  { value: 'grid-component', label: 'Grid component', description: 'Cloudscape Grid (2 columns)' },
  { value: 'container-component', label: 'Container component', description: 'Cloudscape Container' },
  { value: 'none', label: 'None', description: 'No wrapper' },
];

export default function ActionCardCustomizationPage() {
  const { urlParams, setUrlParams } = useContext(AppContext as DevPageContext);

  const containerWidth = urlParams.containerWidth || '400';
  const headerText = urlParams.headerText || 'Action Card Header';
  const descriptionText = urlParams.descriptionText || 'A short description of the action card';
  const contentText =
    urlParams.contentText ||
    'This is the main content area of the action card. It can contain any text or information.';
  const showHeader = urlParams.showHeader !== false;
  const showDescription = urlParams.showDescription !== false;
  const showContent = urlParams.showContent !== false;
  const showIcon = urlParams.showIcon !== false;
  const iconName = (urlParams.iconName || 'angle-right') as IconProps.Name;
  const iconVerticalAlignment = (urlParams.iconVerticalAlignment || 'top') as ActionCardProps.IconVerticalAlignment;
  const disabled = urlParams.disabled === true;
  const disableHeaderPaddings = urlParams.disableHeaderPaddings === true;
  const disableContentPaddings = urlParams.disableContentPaddings === true;
  const useCustomStyles = urlParams.useCustomStyles === true;
  const variant = urlParams.variant || undefined;

  // Root styles - background (state-based)
  const rootBackgroundDefault = urlParams.rootBackgroundDefault || '';
  const rootBackgroundHover = urlParams.rootBackgroundHover || '';
  const rootBackgroundActive = urlParams.rootBackgroundActive || '';
  const rootBackgroundDisabled = urlParams.rootBackgroundDisabled || '';

  // Root styles - borderColor (state-based)
  const rootBorderColorDefault = urlParams.rootBorderColorDefault || '';
  const rootBorderColorHover = urlParams.rootBorderColorHover || '';
  const rootBorderColorActive = urlParams.rootBorderColorActive || '';
  const rootBorderColorDisabled = urlParams.rootBorderColorDisabled || '';

  // Root styles - borderRadius (state-based)
  const rootBorderRadiusDefault = urlParams.rootBorderRadiusDefault || '';
  const rootBorderRadiusHover = urlParams.rootBorderRadiusHover || '';
  const rootBorderRadiusActive = urlParams.rootBorderRadiusActive || '';
  const rootBorderRadiusDisabled = urlParams.rootBorderRadiusDisabled || '';

  // Root styles - borderWidth (state-based)
  const rootBorderWidthDefault = urlParams.rootBorderWidthDefault || '';
  const rootBorderWidthHover = urlParams.rootBorderWidthHover || '';
  const rootBorderWidthActive = urlParams.rootBorderWidthActive || '';
  const rootBorderWidthDisabled = urlParams.rootBorderWidthDisabled || '';

  // Root styles - boxShadow (state-based)
  const rootBoxShadowDefault = urlParams.rootBoxShadowDefault || '';
  const rootBoxShadowHover = urlParams.rootBoxShadowHover || '';
  const rootBoxShadowActive = urlParams.rootBoxShadowActive || '';
  const rootBoxShadowDisabled = urlParams.rootBoxShadowDisabled || '';

  // Root styles - focusRing
  const rootFocusRingBorderColor = urlParams.rootFocusRingBorderColor || '';
  const rootFocusRingBorderRadius = urlParams.rootFocusRingBorderRadius || '';
  const rootFocusRingBorderWidth = urlParams.rootFocusRingBorderWidth || '';

  // Content styles
  const contentPaddingBlock = urlParams.contentPaddingBlock || '';
  const contentPaddingInline = urlParams.contentPaddingInline || '';

  // Header styles
  const headerPaddingBlock = urlParams.headerPaddingBlock || '';
  const headerPaddingInline = urlParams.headerPaddingInline || '';

  const containerType = urlParams.containerType || 'div';
  const cardCount = Math.max(1, parseInt(urlParams.cardCount || '1', 10) || 1);
  const containerHeight = urlParams.containerHeight || '';

  const selectedIconOption = iconOptions.find(opt => opt.value === iconName) ?? iconOptions[0];
  const selectedVariantOption = variantOptions.find(opt => opt.value === variant) ?? variantOptions[0];
  const selectedIconVerticalAlignmentOption =
    iconVerticalAlignmentOptions.find(opt => opt.value === iconVerticalAlignment) ?? iconVerticalAlignmentOptions[0];
  const selectedContainerTypeOption =
    containerTypeOptions.find(opt => opt.value === containerType) ?? containerTypeOptions[0];

  const hasRootBackground =
    rootBackgroundDefault || rootBackgroundHover || rootBackgroundActive || rootBackgroundDisabled;
  const hasRootBorderColor =
    rootBorderColorDefault || rootBorderColorHover || rootBorderColorActive || rootBorderColorDisabled;
  const hasRootBorderRadius =
    rootBorderRadiusDefault || rootBorderRadiusHover || rootBorderRadiusActive || rootBorderRadiusDisabled;
  const hasRootBorderWidth =
    rootBorderWidthDefault || rootBorderWidthHover || rootBorderWidthActive || rootBorderWidthDisabled;
  const hasRootBoxShadow = rootBoxShadowDefault || rootBoxShadowHover || rootBoxShadowActive || rootBoxShadowDisabled;
  const hasRootFocusRing = rootFocusRingBorderColor || rootFocusRingBorderRadius || rootFocusRingBorderWidth;

  const customStyle: ActionCardProps.Style | undefined = useCustomStyles
    ? {
        root: {
          ...(hasRootBackground
            ? {
                background: {
                  ...(rootBackgroundDefault ? { default: rootBackgroundDefault } : {}),
                  ...(rootBackgroundHover ? { hover: rootBackgroundHover } : {}),
                  ...(rootBackgroundActive ? { active: rootBackgroundActive } : {}),
                  ...(rootBackgroundDisabled ? { disabled: rootBackgroundDisabled } : {}),
                },
              }
            : {}),
          ...(hasRootBorderColor
            ? {
                borderColor: {
                  ...(rootBorderColorDefault ? { default: rootBorderColorDefault } : {}),
                  ...(rootBorderColorHover ? { hover: rootBorderColorHover } : {}),
                  ...(rootBorderColorActive ? { active: rootBorderColorActive } : {}),
                  ...(rootBorderColorDisabled ? { disabled: rootBorderColorDisabled } : {}),
                },
              }
            : {}),
          ...(hasRootBorderRadius
            ? {
                borderRadius: {
                  ...(rootBorderRadiusDefault ? { default: rootBorderRadiusDefault } : {}),
                  ...(rootBorderRadiusHover ? { hover: rootBorderRadiusHover } : {}),
                  ...(rootBorderRadiusActive ? { active: rootBorderRadiusActive } : {}),
                  ...(rootBorderRadiusDisabled ? { disabled: rootBorderRadiusDisabled } : {}),
                },
              }
            : {}),
          ...(hasRootBorderWidth
            ? {
                borderWidth: {
                  ...(rootBorderWidthDefault ? { default: rootBorderWidthDefault } : {}),
                  ...(rootBorderWidthHover ? { hover: rootBorderWidthHover } : {}),
                  ...(rootBorderWidthActive ? { active: rootBorderWidthActive } : {}),
                  ...(rootBorderWidthDisabled ? { disabled: rootBorderWidthDisabled } : {}),
                },
              }
            : {}),
          ...(hasRootBoxShadow
            ? {
                boxShadow: {
                  ...(rootBoxShadowDefault ? { default: rootBoxShadowDefault } : {}),
                  ...(rootBoxShadowHover ? { hover: rootBoxShadowHover } : {}),
                  ...(rootBoxShadowActive ? { active: rootBoxShadowActive } : {}),
                  ...(rootBoxShadowDisabled ? { disabled: rootBoxShadowDisabled } : {}),
                },
              }
            : {}),
          ...(hasRootFocusRing
            ? {
                focusRing: {
                  ...(rootFocusRingBorderColor ? { borderColor: rootFocusRingBorderColor } : {}),
                  ...(rootFocusRingBorderRadius ? { borderRadius: rootFocusRingBorderRadius } : {}),
                  ...(rootFocusRingBorderWidth ? { borderWidth: rootFocusRingBorderWidth } : {}),
                },
              }
            : {}),
        },
        content: {
          ...(contentPaddingBlock ? { paddingBlock: contentPaddingBlock } : {}),
          ...(contentPaddingInline ? { paddingInline: contentPaddingInline } : {}),
        },
        header: {
          ...(headerPaddingBlock ? { paddingBlock: headerPaddingBlock } : {}),
          ...(headerPaddingInline ? { paddingInline: headerPaddingInline } : {}),
        },
      }
    : undefined;

  const [lastClicked, setLastClicked] = React.useState<string | null>(null);

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

        <FormField label="Container height (px)" description="Leave empty for auto height">
          <Input
            value={containerHeight}
            onChange={({ detail }) => setUrlParams({ containerHeight: detail.value })}
            type="number"
            inputMode="numeric"
            placeholder="auto"
          />
        </FormField>

        <FormField label="Number of action cards">
          <Input
            value={String(cardCount)}
            onChange={({ detail }) => setUrlParams({ cardCount: detail.value })}
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
              <Toggle checked={showIcon} onChange={({ detail }) => setUrlParams({ showIcon: detail.checked })}>
                Show icon
              </Toggle>
              <Toggle checked={disabled} onChange={({ detail }) => setUrlParams({ disabled: detail.checked })}>
                Disabled
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
            <FormField label="Variant">
              <Select
                selectedOption={selectedVariantOption}
                options={variantOptions}
                onChange={({ detail }) =>
                  setUrlParams({ variant: (detail.selectedOption.value ?? 'default') as ActionCardProps.Variant })
                }
              />
            </FormField>
            <FormField label="Container type" description="Changes the wrapper around the action card">
              <Select
                selectedOption={selectedContainerTypeOption}
                options={containerTypeOptions}
                onChange={({ detail }) => setUrlParams({ containerType: detail.selectedOption.value ?? 'div' })}
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
                onChange={({ detail }) => setUrlParams({ iconName: detail.selectedOption.value ?? 'angle-right' })}
                disabled={!showIcon}
              />
            </FormField>
            <FormField label="Icon vertical alignment">
              <Select
                selectedOption={selectedIconVerticalAlignmentOption}
                options={iconVerticalAlignmentOptions}
                onChange={({ detail }) => setUrlParams({ iconVerticalAlignment: detail.selectedOption.value ?? 'top' })}
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

            <ExpandableSection headerText="Root > background" defaultExpanded={false}>
              <SpaceBetween size="s">
                <FormField label="default" description="Background color in default state">
                  <Input
                    value={rootBackgroundDefault}
                    onChange={({ detail }) => setUrlParams({ rootBackgroundDefault: detail.value })}
                    disabled={!useCustomStyles}
                    placeholder="light-dark(rgb(204, 225, 249), rgb(1, 20, 25))"
                  />
                </FormField>
                <FormField label="hover" description="Background color on hover">
                  <Input
                    value={rootBackgroundHover}
                    onChange={({ detail }) => setUrlParams({ rootBackgroundHover: detail.value })}
                    disabled={!useCustomStyles}
                    placeholder="light-dark(rgb(180, 210, 245), rgb(10, 35, 45))"
                  />
                </FormField>
                <FormField label="active" description="Background color when active/pressed">
                  <Input
                    value={rootBackgroundActive}
                    onChange={({ detail }) => setUrlParams({ rootBackgroundActive: detail.value })}
                    disabled={!useCustomStyles}
                    placeholder="light-dark(rgb(160, 195, 240), rgb(15, 45, 55))"
                  />
                </FormField>
                <FormField label="disabled" description="Background color when disabled">
                  <Input
                    value={rootBackgroundDisabled}
                    onChange={({ detail }) => setUrlParams({ rootBackgroundDisabled: detail.value })}
                    disabled={!useCustomStyles}
                    placeholder="light-dark(rgb(235, 235, 235), rgb(30, 30, 30))"
                  />
                </FormField>
              </SpaceBetween>
            </ExpandableSection>

            <ExpandableSection headerText="Root > borderColor" defaultExpanded={false}>
              <SpaceBetween size="s">
                <FormField label="default">
                  <Input
                    value={rootBorderColorDefault}
                    onChange={({ detail }) => setUrlParams({ rootBorderColorDefault: detail.value })}
                    disabled={!useCustomStyles}
                    placeholder="light-dark(rgb(1, 20, 25), rgb(204, 225, 249))"
                  />
                </FormField>
                <FormField label="hover">
                  <Input
                    value={rootBorderColorHover}
                    onChange={({ detail }) => setUrlParams({ rootBorderColorHover: detail.value })}
                    disabled={!useCustomStyles}
                    placeholder="light-dark(rgb(0, 100, 200), rgb(100, 180, 255))"
                  />
                </FormField>
                <FormField label="active">
                  <Input
                    value={rootBorderColorActive}
                    onChange={({ detail }) => setUrlParams({ rootBorderColorActive: detail.value })}
                    disabled={!useCustomStyles}
                    placeholder="light-dark(rgb(0, 80, 160), rgb(80, 160, 240))"
                  />
                </FormField>
                <FormField label="disabled">
                  <Input
                    value={rootBorderColorDisabled}
                    onChange={({ detail }) => setUrlParams({ rootBorderColorDisabled: detail.value })}
                    disabled={!useCustomStyles}
                    placeholder="light-dark(rgb(200, 200, 200), rgb(60, 60, 60))"
                  />
                </FormField>
              </SpaceBetween>
            </ExpandableSection>

            <ExpandableSection headerText="Root > borderRadius" defaultExpanded={false}>
              <SpaceBetween size="s">
                <FormField label="default" description="e.g. 8px, 20px">
                  <Input
                    value={rootBorderRadiusDefault}
                    onChange={({ detail }) => setUrlParams({ rootBorderRadiusDefault: detail.value })}
                    disabled={!useCustomStyles}
                    placeholder="10px"
                  />
                </FormField>
                <FormField label="hover">
                  <Input
                    value={rootBorderRadiusHover}
                    onChange={({ detail }) => setUrlParams({ rootBorderRadiusHover: detail.value })}
                    disabled={!useCustomStyles}
                    placeholder="12px"
                  />
                </FormField>
                <FormField label="active">
                  <Input
                    value={rootBorderRadiusActive}
                    onChange={({ detail }) => setUrlParams({ rootBorderRadiusActive: detail.value })}
                    disabled={!useCustomStyles}
                    placeholder="6px"
                  />
                </FormField>
                <FormField label="disabled">
                  <Input
                    value={rootBorderRadiusDisabled}
                    onChange={({ detail }) => setUrlParams({ rootBorderRadiusDisabled: detail.value })}
                    disabled={!useCustomStyles}
                    placeholder="10px"
                  />
                </FormField>
              </SpaceBetween>
            </ExpandableSection>

            <ExpandableSection headerText="Root > borderWidth" defaultExpanded={false}>
              <SpaceBetween size="s">
                <FormField label="default" description="e.g. 1px, 4px">
                  <Input
                    value={rootBorderWidthDefault}
                    onChange={({ detail }) => setUrlParams({ rootBorderWidthDefault: detail.value })}
                    disabled={!useCustomStyles}
                    placeholder="4px"
                  />
                </FormField>
                <FormField label="hover">
                  <Input
                    value={rootBorderWidthHover}
                    onChange={({ detail }) => setUrlParams({ rootBorderWidthHover: detail.value })}
                    disabled={!useCustomStyles}
                    placeholder="2px"
                  />
                </FormField>
                <FormField label="active">
                  <Input
                    value={rootBorderWidthActive}
                    onChange={({ detail }) => setUrlParams({ rootBorderWidthActive: detail.value })}
                    disabled={!useCustomStyles}
                    placeholder="1px"
                  />
                </FormField>
                <FormField label="disabled">
                  <Input
                    value={rootBorderWidthDisabled}
                    onChange={({ detail }) => setUrlParams({ rootBorderWidthDisabled: detail.value })}
                    disabled={!useCustomStyles}
                    placeholder="1px"
                  />
                </FormField>
              </SpaceBetween>
            </ExpandableSection>

            <ExpandableSection headerText="Root > boxShadow" defaultExpanded={false}>
              <SpaceBetween size="s">
                <FormField label="default">
                  <Input
                    value={rootBoxShadowDefault}
                    onChange={({ detail }) => setUrlParams({ rootBoxShadowDefault: detail.value })}
                    disabled={!useCustomStyles}
                    placeholder="2px 2px 6px 4px rgba(0,0,0,0.2)"
                  />
                </FormField>
                <FormField label="hover">
                  <Input
                    value={rootBoxShadowHover}
                    onChange={({ detail }) => setUrlParams({ rootBoxShadowHover: detail.value })}
                    disabled={!useCustomStyles}
                    placeholder="2px 2px 8px 6px rgba(0,0,0,0.3)"
                  />
                </FormField>
                <FormField label="active">
                  <Input
                    value={rootBoxShadowActive}
                    onChange={({ detail }) => setUrlParams({ rootBoxShadowActive: detail.value })}
                    disabled={!useCustomStyles}
                    placeholder="1px 1px 4px 2px rgba(0,0,0,0.15)"
                  />
                </FormField>
                <FormField label="disabled">
                  <Input
                    value={rootBoxShadowDisabled}
                    onChange={({ detail }) => setUrlParams({ rootBoxShadowDisabled: detail.value })}
                    disabled={!useCustomStyles}
                    placeholder="none"
                  />
                </FormField>
              </SpaceBetween>
            </ExpandableSection>

            <ExpandableSection headerText="Root > focusRing" defaultExpanded={false}>
              <SpaceBetween size="s">
                <FormField label="borderColor">
                  <Input
                    value={rootFocusRingBorderColor}
                    onChange={({ detail }) => setUrlParams({ rootFocusRingBorderColor: detail.value })}
                    disabled={!useCustomStyles}
                    placeholder="blue"
                  />
                </FormField>
                <FormField label="borderRadius">
                  <Input
                    value={rootFocusRingBorderRadius}
                    onChange={({ detail }) => setUrlParams({ rootFocusRingBorderRadius: detail.value })}
                    disabled={!useCustomStyles}
                    placeholder="10px"
                  />
                </FormField>
                <FormField label="borderWidth">
                  <Input
                    value={rootFocusRingBorderWidth}
                    onChange={({ detail }) => setUrlParams({ rootFocusRingBorderWidth: detail.value })}
                    disabled={!useCustomStyles}
                    placeholder="2px"
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
          </SpaceBetween>
        </ExpandableSection>
      </SpaceBetween>
    </Container>
  );

  const renderActionCard = (index: number) => (
    <ActionCard
      key={index}
      variant={variant as ActionCardProps.Variant}
      header={showHeader ? <b>{`${headerText}${cardCount > 1 ? ` #${index + 1}` : ''}`}</b> : undefined}
      description={showDescription ? descriptionText : undefined}
      icon={showIcon && iconName && <Icon name={iconName} />}
      iconVerticalAlignment={showIcon ? iconVerticalAlignment : undefined}
      disabled={disabled}
      disableHeaderPaddings={disableHeaderPaddings}
      disableContentPaddings={disableContentPaddings}
      onClick={() => setLastClicked(`Card #${index + 1}`)}
      style={customStyle}
    >
      {showContent ? contentText : undefined}
    </ActionCard>
  );

  const cards = Array.from({ length: cardCount }, (_, i) => renderActionCard(i));

  const heightStyle = containerHeight
    ? { blockSize: `${parseInt(containerHeight)}px`, overflow: 'auto', padding: '16px' }
    : {};

  const wrapInContainer = (cardElements: React.ReactNode[]) => {
    switch (containerType) {
      case 'flexbox':
        return <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', ...heightStyle }}>{cardElements}</div>;
      case 'css-grid':
        return (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
              gap: '16px',
              ...heightStyle,
            }}
          >
            {cardElements}
          </div>
        );
      case 'grid-component':
        return (
          <div style={heightStyle}>
            <Grid gridDefinition={cardElements.map(() => ({ colspan: 6 }))}>{cardElements}</Grid>
          </div>
        );
      case 'container-component':
        return (
          <Container header={<Header variant="h3">Inside Container component</Header>}>
            <div style={heightStyle}>
              <SpaceBetween size="s">{cardElements}</SpaceBetween>
            </div>
          </Container>
        );
      case 'none':
        return <div style={heightStyle}>{cardElements}</div>;
      case 'div':
      default:
        return (
          <div style={heightStyle}>
            <SpaceBetween size="s">{cardElements}</SpaceBetween>
          </div>
        );
    }
  };

  const mainContent = (
    <Box>
      <SpaceBetween size="l">
        <div style={{ maxInlineSize: parseInt(containerWidth) }}>
          <Box margin={{ bottom: 's' }}>
            <Header
              variant="h3"
              description={`Container type: ${containerType} · ${cardCount} card(s) · Last clicked: ${lastClicked ?? 'None'}`}
            >
              Action Card Preview
            </Header>
          </Box>
          {wrapInContainer(cards)}
        </div>
      </SpaceBetween>
    </Box>
  );

  return (
    <SimplePage title="ActionCard - customization" subtitle="Shows how ActionCard can be configured.">
      <div
        style={{
          height: 'calc(100vh - 250px)',
        }}
      >
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
      </div>
    </SimplePage>
  );
}
