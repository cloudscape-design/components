// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Alert from '~components/alert';
import Autosuggest from '~components/autosuggest';
import Box from '~components/box';
import Button from '~components/button';
import ButtonDropdown from '~components/button-dropdown';
import ButtonGroup from '~components/button-group';
import Flashbar, { FlashbarProps } from '~components/flashbar';
import Icon from '~components/icon';
import IconProvider from '~components/icon-provider';
import Link from '~components/link';
import Multiselect, { MultiselectProps } from '~components/multiselect';
import SegmentedControl from '~components/segmented-control';
import SpaceBetween from '~components/space-between';
import StatusIndicator from '~components/status-indicator';
import TextFilter from '~components/text-filter';
import Toggle from '~components/toggle';
import TreeView from '~components/tree-view';

import ScreenshotArea from '../utils/screenshot-area';

const shortText = {
  statusSuccess: 'Deployment succeeded',
  statusError: 'Build failed',
  statusWarning: 'High memory usage',
  statusInfo: 'Update available',
  statusPending: 'Awaiting approval',
  statusInProgress: 'Deploying',
  statusStopped: 'Instance stopped',
  alertDismissible: 'This is an info alert with a dismiss icon.',
  alertHeader: 'Known issues/limitations',
  alertContent:
    'Review the documentation to learn about potential compatibility issues with specific database versions.',
  linkExternal: 'External link (primary)',
  linkSecondary: 'External link (secondary)',
  linkInline: 'documentation',
  linkInlinePrefix: 'Visit the',
  linkInlineSuffix: 'for more details about this feature.',
  linkHeadingM: 'External link (heading-m font)',
  linkBodyS: 'External link (body-s font)',
  flashWarningHeader: 'High memory usage detected',
  flashInfoHeader: 'New feature available',
  flashInfoContent: 'Check out the new dashboard improvements.',
  buttonSettings: 'Settings',
  buttonDownload: 'Download',
  buttonAddItem: 'Add item',
  nestedSmallSuccess: 'Dense: deployment succeeded',
  nestedSmallError: 'Dense: build failed',
  nestedNormalSuccess: 'Normal: deployment succeeded',
  nestedNormalError: 'Normal: build failed',
  linkSmallRegion: 'External link in small region',
  linkNormalRegion: 'External link in normal region',
};

const longText = {
  statusSuccess:
    'Deployment succeeded — all 47 microservices passed health checks and are now serving production traffic across three availability zones',
  statusError:
    'Build failed — the compilation step encountered 12 type errors in the authentication module after the dependency upgrade to version 4.2.1',
  statusWarning:
    'High memory usage — the primary database instance is consuming 89% of available memory and may trigger automatic scaling within the next 15 minutes',
  statusInfo:
    'Update available — a new version of the runtime environment (v3.8.2) includes critical security patches and performance improvements for concurrent workloads',
  statusPending:
    'Awaiting approval — the infrastructure change request requires sign-off from two additional team leads before deployment can proceed to the staging environment',
  statusInProgress:
    'Deploying — currently rolling out changes to region us-west-2 with a canary deployment strategy targeting 5% of traffic initially',
  statusStopped:
    'Instance stopped — the compute instance was automatically terminated due to exceeding the maximum idle timeout of 4 hours configured in the resource policy',
  alertDismissible:
    'This is an informational alert to notify you that scheduled maintenance will be performed on the primary database cluster this weekend. During the maintenance window (Saturday 2:00 AM - 6:00 AM UTC), you may experience brief periods of read-only access. Please plan your batch processing jobs accordingly and ensure all critical writes are completed before the maintenance begins.',
  alertHeader: 'Known issues and limitations with the current release',
  alertContent:
    'Review the documentation carefully to learn about potential compatibility issues with specific database versions, including PostgreSQL 14.x timestamp handling changes, MySQL 8.0 character set defaults, and the deprecated connection pooling parameters that will be removed in the next major release.',
  linkExternal:
    'View the complete API reference documentation for all available endpoints and authentication methods (primary)',
  linkSecondary: 'Browse the community-contributed examples and integration patterns for common use cases (secondary)',
  linkInline: 'comprehensive migration guide and troubleshooting documentation',
  linkInlinePrefix: 'Before upgrading, please carefully review the',
  linkInlineSuffix:
    'which covers breaking changes, deprecated features, and recommended migration paths for each major version.',
  linkHeadingM: 'External link to the architecture decision records repository (heading-m font)',
  linkBodyS: 'External link to supplementary configuration examples (body-s font)',
  flashWarningHeader: 'High memory usage detected on production cluster nodes in us-east-1 region',
  flashInfoHeader: 'New feature available: enhanced monitoring dashboard with real-time alerting capabilities',
  flashInfoContent:
    'Check out the new dashboard improvements including customizable widgets, historical trend analysis, and automated anomaly detection powered by machine learning.',
  buttonSettings: 'Advanced configuration settings',
  buttonDownload: 'Download full report',
  buttonAddItem: 'Add new monitoring rule',
  nestedSmallSuccess: 'Dense view: deployment succeeded across all target environments with zero downtime',
  nestedSmallError: 'Dense view: build failed due to incompatible transitive dependency resolution',
  nestedNormalSuccess: 'Normal view: deployment succeeded and all integration tests passed in the staging environment',
  nestedNormalError: 'Normal view: build failed with 3 compilation errors in the shared utilities module',
  linkSmallRegion:
    'External link to the condensed operational runbook for incident response procedures in small region',
  linkNormalRegion:
    'External link to the full operational runbook with detailed step-by-step instructions in normal region',
};

const getFlashbarItems = (text: typeof shortText): FlashbarProps.MessageDefinition[] => [
  {
    type: 'warning',
    dismissible: true,
    dismissLabel: 'Dismiss',
    statusIconAriaLabel: 'Warning',
    header: text.flashWarningHeader,
    id: 'flash-warning',
  },
  {
    type: 'info',
    dismissible: true,
    dismissLabel: 'Dismiss',
    statusIconAriaLabel: 'Info',
    header: text.flashInfoHeader,
    content: text.flashInfoContent,
    id: 'flash-info',
  },
];

const autosuggestOptions = [
  {
    value: 'Suggestion 1',
    description: 'Description for suggestion 1',
    tags: ['tag1', 'tag2'],
    labelTag: 'Active',
  },
  {
    value: 'Suggestion 2',
    description: 'Description for suggestion 2',
    tags: ['tag3'],
    labelTag: 'Pending',
  },
  {
    value: 'Suggestion 3',
    description: 'Description for suggestion 3',
    filteringTags: ['hidden-filter'],
  },
  { value: 'Suggestion 4', disabled: true, description: 'This option is disabled' },
  { value: 'Suggestion 5', tags: ['production', 'us-east-1'] },
];

const multiselectGroupedOptions: MultiselectProps.Options = [
  {
    label: 'US Regions',
    options: [
      { value: 'us-east-1', label: 'US East (N. Virginia)', description: 'us-east-1', tags: ['Primary'] },
      { value: 'us-east-2', label: 'US East (Ohio)', description: 'us-east-2' },
      { value: 'us-west-1', label: 'US West (N. California)', description: 'us-west-1' },
      { value: 'us-west-2', label: 'US West (Oregon)', description: 'us-west-2', tags: ['Primary'] },
    ],
  },
  {
    label: 'Europe Regions',
    options: [
      { value: 'eu-west-1', label: 'Europe (Ireland)', description: 'eu-west-1' },
      { value: 'eu-central-1', label: 'Europe (Frankfurt)', description: 'eu-central-1', tags: ['Primary'] },
      { value: 'eu-west-2', label: 'Europe (London)', description: 'eu-west-2' },
    ],
  },
  {
    label: 'Asia Pacific Regions',
    options: [
      { value: 'ap-southeast-1', label: 'Asia Pacific (Singapore)', description: 'ap-southeast-1' },
      { value: 'ap-northeast-1', label: 'Asia Pacific (Tokyo)', description: 'ap-northeast-1', tags: ['Primary'] },
      { value: 'ap-south-1', label: 'Asia Pacific (Mumbai)', description: 'ap-south-1', disabled: true },
    ],
  },
];

interface TreeItem {
  id: string;
  label: string;
  type?: 'success' | 'warning' | 'error' | 'info';
  relatedNode?: string;
  hasActions?: boolean;
  children?: TreeItem[];
}

const treeViewItems: TreeItem[] = [
  {
    id: '1',
    label: 'Evaluated',
    type: 'success',
    hasActions: true,
  },
  {
    id: '2',
    label: 'node-20',
    relatedNode: 'eksclu-node-wx456',
    type: 'success',
    hasActions: true,
    children: [
      { id: '2.1', label: 'node-17', type: 'warning' },
      { id: '2.2', label: 'node-18', type: 'success' },
    ],
  },
  {
    id: '3',
    label: 'node 21',
    relatedNode: 'eksclu-node-wx457',
    hasActions: true,
    children: [
      {
        id: '3.1',
        label: 'node 19',
        relatedNode: 'eksclu-node-wx457',
        type: 'success',
        hasActions: true,
        children: [
          { id: '3.1.1', label: 'node-22', type: 'success' },
          { id: '3.1.2', label: 'node-23', type: 'success' },
        ],
      },
    ],
  },
];

export default function IconSizeProviderScenario() {
  const [filteringText, setFilteringText] = useState('');
  const [selectedSegmentId, setSelectedSegmentId] = useState('seg-1');
  const [autosuggestValue, setAutosuggestValue] = useState('');
  const [selectedMultiselectOptions, setSelectedMultiselectOptions] = useState<MultiselectProps.Option[]>([
    { value: 'us-east-1', label: 'US East (N. Virginia)' },
  ]);
  const [expandedItems, setExpandedItems] = useState<string[]>(['2', '3', '3.1']);
  const [useLongText, setUseLongText] = useState(false);

  const text = useLongText ? longText : shortText;
  const flashbarItems = getFlashbarItems(text);

  return (
    <ScreenshotArea>
      <h1>IconProvider iconSize prop</h1>

      <Toggle checked={useLongText} onChange={({ detail }) => setUseLongText(detail.checked)}>
        Use longer text examples
      </Toggle>

      <SpaceBetween size="l">
        {/* Baseline: no provider override — all icons render at default "normal" size */}
        <section>
          <Box variant="h2">No iconSize (default normal)</Box>
          <SpaceBetween size="s">
            <SpaceBetween size="xs">
              <StatusIndicator type="success">{text.statusSuccess}</StatusIndicator>
              <StatusIndicator type="error">{text.statusError}</StatusIndicator>
              <StatusIndicator type="warning">{text.statusWarning}</StatusIndicator>
              <StatusIndicator type="info">{text.statusInfo}</StatusIndicator>
              <StatusIndicator type="pending">{text.statusPending}</StatusIndicator>
              <StatusIndicator type="in-progress">{text.statusInProgress}</StatusIndicator>
              <StatusIndicator type="stopped">{text.statusStopped}</StatusIndicator>
            </SpaceBetween>
            <SpaceBetween size="xs" direction="horizontal" alignItems="center">
              <Icon name="settings" />
              <Icon name="search" />
              <Icon name="notification" />
              <Icon name="lock-private" />
              <Icon name="gen-ai" />
            </SpaceBetween>
            <SpaceBetween size="xs" direction="horizontal" alignItems="center">
              <Button iconName="settings">{text.buttonSettings}</Button>
              <Button iconName="download" variant="primary">
                {text.buttonDownload}
              </Button>
              <Button iconName="add-plus" variant="link">
                {text.buttonAddItem}
              </Button>
              <Button iconName="refresh" variant="icon" ariaLabel="Refresh" />
            </SpaceBetween>
            <ButtonGroup
              ariaLabel="Actions"
              variant="icon"
              items={[
                { type: 'icon-button', id: 'copy', iconName: 'copy', text: 'Copy' },
                { type: 'icon-button', id: 'edit', iconName: 'edit', text: 'Edit' },
                { type: 'icon-button', id: 'delete', iconName: 'remove', text: 'Delete' },
                { type: 'icon-button', id: 'share', iconName: 'share', text: 'Share' },
              ]}
            />
            <SegmentedControl
              selectedId={selectedSegmentId}
              onChange={({ detail }) => setSelectedSegmentId(detail.selectedId)}
              label="View mode"
              options={[
                { id: 'seg-1', iconName: 'view-full', text: 'Full' },
                { id: 'seg-2', iconName: 'view-horizontal', text: 'Horizontal' },
                { id: 'seg-3', iconName: 'view-vertical', text: 'Vertical' },
                { id: 'seg-4', iconName: 'settings', text: 'Settings' },
              ]}
            />
            <Alert type="info" dismissible={true}>
              {text.alertDismissible}
            </Alert>
            <Alert statusIconAriaLabel="Info" header={text.alertHeader}>
              {text.alertContent}
            </Alert>
            <SpaceBetween size="xs">
              <div>
                <Link href="#" external={true}>
                  {text.linkExternal}
                </Link>
              </div>
              <div>
                <Link href="#" external={true} variant="secondary">
                  {text.linkSecondary}
                </Link>
              </div>
              <div>
                {text.linkInlinePrefix}{' '}
                <Link href="#" external={true}>
                  {text.linkInline}
                </Link>{' '}
                {text.linkInlineSuffix}
              </div>
              <div>
                <Link href="#" external={true} fontSize="heading-m">
                  {text.linkHeadingM}
                </Link>
              </div>
              <div>
                <Link href="#" external={true} fontSize="body-s">
                  {text.linkBodyS}
                </Link>
              </div>
            </SpaceBetween>
            <TextFilter
              filteringText={filteringText}
              filteringAriaLabel="Filter items"
              onChange={({ detail }) => setFilteringText(detail.filteringText)}
            />
            <Flashbar items={flashbarItems} />
            <Autosuggest
              value={autosuggestValue}
              onChange={({ detail }) => setAutosuggestValue(detail.value)}
              options={autosuggestOptions}
              enteredTextLabel={value => `Use: ${value}`}
              ariaLabel="Autosuggest with features"
              placeholder="Search resources"
              empty="No matches found"
            />
            <Multiselect
              selectedOptions={selectedMultiselectOptions}
              onChange={({ detail }) => setSelectedMultiselectOptions([...detail.selectedOptions])}
              options={multiselectGroupedOptions}
              placeholder="Choose regions"
              deselectAriaLabel={option => `Remove ${option.label}`}
              tokenLimit={3}
              i18nStrings={{
                tokenLimitShowFewer: 'Show fewer',
                tokenLimitShowMore: 'Show more',
              }}
            />
            <TreeView<TreeItem>
              items={treeViewItems}
              expandedItems={expandedItems}
              renderItem={item => ({
                content: (
                  <StatusIndicator type={item.type} iconAriaLabel={item.type}>
                    {item.label} {item.relatedNode && '('}
                    {item.relatedNode && (
                      <Link href="#" variant="primary">
                        {item.relatedNode}
                      </Link>
                    )}
                    {item.relatedNode && ')'}
                  </StatusIndicator>
                ),
                actions: item.hasActions ? (
                  <ButtonDropdown
                    items={[
                      { id: 'start', text: 'Start' },
                      { id: 'stop', text: 'Stop' },
                      { id: 'terminate', text: 'Terminate' },
                    ]}
                    ariaLabel={`Actions menu for ${item.label}`}
                    variant="inline-icon"
                  />
                ) : undefined,
                announcementLabel: `${item.label} ${item.relatedNode ?? ''}`,
              })}
              getItemId={item => item.id}
              getItemChildren={item => item.children}
              onItemToggle={({ detail }) =>
                setExpandedItems(prev =>
                  detail.expanded ? [...prev, detail.item.id] : prev.filter(id => id !== detail.item.id)
                )
              }
              ariaLabel="With actions"
            />
          </SpaceBetween>
        </section>

        {/* Provider sets iconSize="small" — icons should be 12×12 */}
        <section>
          <Box variant="h2">iconSize set to small (also remaps inherit to small)</Box>
          <IconProvider icons={{}} iconSize="small" iconSizeInherit="small">
            <SpaceBetween size="s">
              <SpaceBetween size="xs">
                <StatusIndicator type="success">{text.statusSuccess}</StatusIndicator>
                <StatusIndicator type="error">{text.statusError}</StatusIndicator>
                <StatusIndicator type="warning">{text.statusWarning}</StatusIndicator>
                <StatusIndicator type="info">{text.statusInfo}</StatusIndicator>
                <StatusIndicator type="pending">{text.statusPending}</StatusIndicator>
                <StatusIndicator type="in-progress">{text.statusInProgress}</StatusIndicator>
                <StatusIndicator type="stopped">{text.statusStopped}</StatusIndicator>
              </SpaceBetween>
              <SpaceBetween size="xs" direction="horizontal" alignItems="center">
                <Icon name="settings" />
                <Icon name="search" />
                <Icon name="notification" />
                <Icon name="lock-private" />
                <Icon name="gen-ai" />
              </SpaceBetween>
              <SpaceBetween size="xs" direction="horizontal" alignItems="center">
                <Button iconName="settings">{text.buttonSettings}</Button>
                <Button iconName="download" variant="primary">
                  {text.buttonDownload}
                </Button>
                <Button iconName="add-plus" variant="link">
                  {text.buttonAddItem}
                </Button>
                <Button iconName="refresh" variant="icon" ariaLabel="Refresh" />
              </SpaceBetween>
              <ButtonGroup
                ariaLabel="Actions"
                variant="icon"
                items={[
                  { type: 'icon-button', id: 'copy', iconName: 'copy', text: 'Copy' },
                  { type: 'icon-button', id: 'edit', iconName: 'edit', text: 'Edit' },
                  { type: 'icon-button', id: 'delete', iconName: 'remove', text: 'Delete' },
                  { type: 'icon-button', id: 'share', iconName: 'share', text: 'Share' },
                ]}
              />
              <SegmentedControl
                selectedId={selectedSegmentId}
                onChange={({ detail }) => setSelectedSegmentId(detail.selectedId)}
                label="View mode"
                options={[
                  { id: 'seg-1', iconName: 'view-full', text: 'Full' },
                  { id: 'seg-2', iconName: 'view-horizontal', text: 'Horizontal' },
                  { id: 'seg-3', iconName: 'view-vertical', text: 'Vertical' },
                  { id: 'seg-4', iconName: 'settings', text: 'Settings' },
                ]}
              />
              <Alert type="info" dismissible={true}>
                {text.alertDismissible}
              </Alert>
              <Alert statusIconAriaLabel="Info" header={text.alertHeader}>
                {text.alertContent}
              </Alert>
              <SpaceBetween size="xs">
                <div>
                  <Link href="#" external={true}>
                    {text.linkExternal}
                  </Link>
                </div>
                <div>
                  <Link href="#" external={true} variant="secondary">
                    {text.linkSecondary}
                  </Link>
                </div>
                <div>
                  {text.linkInlinePrefix}{' '}
                  <Link href="#" external={true}>
                    {text.linkInline}
                  </Link>{' '}
                  {text.linkInlineSuffix}
                </div>
                <div>
                  <Link href="#" external={true} fontSize="heading-m">
                    {text.linkHeadingM}
                  </Link>
                </div>
                <div>
                  <Link href="#" external={true} fontSize="body-s">
                    {text.linkBodyS}
                  </Link>
                </div>
              </SpaceBetween>
              <TextFilter
                filteringText={filteringText}
                filteringAriaLabel="Filter items"
                onChange={({ detail }) => setFilteringText(detail.filteringText)}
              />
              <Flashbar items={flashbarItems} />
              <Autosuggest
                value={autosuggestValue}
                onChange={({ detail }) => setAutosuggestValue(detail.value)}
                options={autosuggestOptions}
                enteredTextLabel={value => `Use: ${value}`}
                ariaLabel="Autosuggest with features"
                placeholder="Search resources"
                empty="No matches found"
              />
              <Multiselect
                selectedOptions={selectedMultiselectOptions}
                onChange={({ detail }) => setSelectedMultiselectOptions([...detail.selectedOptions])}
                options={multiselectGroupedOptions}
                placeholder="Choose regions"
                deselectAriaLabel={option => `Remove ${option.label}`}
                tokenLimit={3}
                i18nStrings={{
                  tokenLimitShowFewer: 'Show fewer',
                  tokenLimitShowMore: 'Show more',
                }}
              />
              <TreeView<TreeItem>
                items={treeViewItems}
                expandedItems={expandedItems}
                renderItem={item => ({
                  content: (
                    <StatusIndicator type={item.type} iconAriaLabel={item.type}>
                      {item.label} {item.relatedNode && '('}
                      {item.relatedNode && (
                        <Link href="#" variant="primary">
                          {item.relatedNode}
                        </Link>
                      )}
                      {item.relatedNode && ')'}
                    </StatusIndicator>
                  ),
                  actions: item.hasActions ? (
                    <ButtonDropdown
                      items={[
                        { id: 'start', text: 'Start' },
                        { id: 'stop', text: 'Stop' },
                        { id: 'terminate', text: 'Terminate' },
                      ]}
                      ariaLabel={`Actions menu for ${item.label}`}
                      variant="inline-icon"
                    />
                  ) : undefined,
                  announcementLabel: `${item.label} ${item.relatedNode ?? ''}`,
                })}
                getItemId={item => item.id}
                getItemChildren={item => item.children}
                onItemToggle={({ detail }) =>
                  setExpandedItems(prev =>
                    detail.expanded ? [...prev, detail.item.id] : prev.filter(id => id !== detail.item.id)
                  )
                }
                ariaLabel="With actions"
              />
            </SpaceBetween>
          </IconProvider>
        </section>

        {/* Provider sets iconSize="big" — icons should be 24×24 */}
        <section>
          <Box variant="h2">iconSize set to big (also remaps inherit to big)</Box>
          <IconProvider icons={{}} iconSize="big" iconSizeInherit="big">
            <SpaceBetween size="s">
              <SpaceBetween size="xs">
                <StatusIndicator type="success">{text.statusSuccess}</StatusIndicator>
                <StatusIndicator type="error">{text.statusError}</StatusIndicator>
                <StatusIndicator type="warning">{text.statusWarning}</StatusIndicator>
                <StatusIndicator type="info">{text.statusInfo}</StatusIndicator>
                <StatusIndicator type="pending">{text.statusPending}</StatusIndicator>
                <StatusIndicator type="in-progress">{text.statusInProgress}</StatusIndicator>
                <StatusIndicator type="stopped">{text.statusStopped}</StatusIndicator>
              </SpaceBetween>
              <SpaceBetween size="xs" direction="horizontal" alignItems="center">
                <Icon name="settings" />
                <Icon name="search" />
                <Icon name="notification" />
                <Icon name="lock-private" />
                <Icon name="gen-ai" />
              </SpaceBetween>
              <SpaceBetween size="xs" direction="horizontal" alignItems="center">
                <Button iconName="settings">{text.buttonSettings}</Button>
                <Button iconName="download" variant="primary">
                  {text.buttonDownload}
                </Button>
                <Button iconName="add-plus" variant="link">
                  {text.buttonAddItem}
                </Button>
                <Button iconName="refresh" variant="icon" ariaLabel="Refresh" />
              </SpaceBetween>
              <ButtonGroup
                ariaLabel="Actions"
                variant="icon"
                items={[
                  { type: 'icon-button', id: 'copy', iconName: 'copy', text: 'Copy' },
                  { type: 'icon-button', id: 'edit', iconName: 'edit', text: 'Edit' },
                  { type: 'icon-button', id: 'delete', iconName: 'remove', text: 'Delete' },
                  { type: 'icon-button', id: 'share', iconName: 'share', text: 'Share' },
                ]}
              />
              <SegmentedControl
                selectedId={selectedSegmentId}
                onChange={({ detail }) => setSelectedSegmentId(detail.selectedId)}
                label="View mode"
                options={[
                  { id: 'seg-1', iconName: 'view-full', text: 'Full' },
                  { id: 'seg-2', iconName: 'view-horizontal', text: 'Horizontal' },
                  { id: 'seg-3', iconName: 'view-vertical', text: 'Vertical' },
                  { id: 'seg-4', iconName: 'settings', text: 'Settings' },
                ]}
              />
              <Alert type="info" dismissible={true}>
                {text.alertDismissible}
              </Alert>
              <Alert statusIconAriaLabel="Info" header={text.alertHeader}>
                {text.alertContent}
              </Alert>
              <SpaceBetween size="xs">
                <div>
                  <Link href="#" external={true}>
                    {text.linkExternal}
                  </Link>
                </div>
                <div>
                  <Link href="#" external={true} variant="secondary">
                    {text.linkSecondary}
                  </Link>
                </div>
                <div>
                  {text.linkInlinePrefix}{' '}
                  <Link href="#" external={true}>
                    {text.linkInline}
                  </Link>{' '}
                  {text.linkInlineSuffix}
                </div>
                <div>
                  <Link href="#" external={true} fontSize="heading-m">
                    {text.linkHeadingM}
                  </Link>
                </div>
                <div>
                  <Link href="#" external={true} fontSize="body-s">
                    {text.linkBodyS}
                  </Link>
                </div>
              </SpaceBetween>
              <TextFilter
                filteringText={filteringText}
                filteringAriaLabel="Filter items"
                onChange={({ detail }) => setFilteringText(detail.filteringText)}
              />
              <Flashbar items={flashbarItems} />
              <Autosuggest
                value={autosuggestValue}
                onChange={({ detail }) => setAutosuggestValue(detail.value)}
                options={autosuggestOptions}
                enteredTextLabel={value => `Use: ${value}`}
                ariaLabel="Autosuggest with features"
                placeholder="Search resources"
                empty="No matches found"
              />
              <Multiselect
                selectedOptions={selectedMultiselectOptions}
                onChange={({ detail }) => setSelectedMultiselectOptions([...detail.selectedOptions])}
                options={multiselectGroupedOptions}
                placeholder="Choose regions"
                deselectAriaLabel={option => `Remove ${option.label}`}
                tokenLimit={3}
                i18nStrings={{
                  tokenLimitShowFewer: 'Show fewer',
                  tokenLimitShowMore: 'Show more',
                }}
              />
              <TreeView<TreeItem>
                items={treeViewItems}
                expandedItems={expandedItems}
                renderItem={item => ({
                  content: (
                    <StatusIndicator type={item.type} iconAriaLabel={item.type}>
                      {item.label} {item.relatedNode && '('}
                      {item.relatedNode && (
                        <Link href="#" variant="primary">
                          {item.relatedNode}
                        </Link>
                      )}
                      {item.relatedNode && ')'}
                    </StatusIndicator>
                  ),
                  actions: item.hasActions ? (
                    <ButtonDropdown
                      items={[
                        { id: 'start', text: 'Start' },
                        { id: 'stop', text: 'Stop' },
                        { id: 'terminate', text: 'Terminate' },
                      ]}
                      ariaLabel={`Actions menu for ${item.label}`}
                      variant="inline-icon"
                    />
                  ) : undefined,
                  announcementLabel: `${item.label} ${item.relatedNode ?? ''}`,
                })}
                getItemId={item => item.id}
                getItemChildren={item => item.children}
                onItemToggle={({ detail }) =>
                  setExpandedItems(prev =>
                    detail.expanded ? [...prev, detail.item.id] : prev.filter(id => id !== detail.item.id)
                  )
                }
                ariaLabel="With actions"
              />
            </SpaceBetween>
          </IconProvider>
        </section>

        {/* Provider sets iconSize="large" — icons should be 32×32 */}
        <section>
          <Box variant="h2">iconSize set to large (also remaps inherit to large)</Box>
          <IconProvider icons={{}} iconSize="large" iconSizeInherit="large">
            <SpaceBetween size="s">
              <SpaceBetween size="xs">
                <StatusIndicator type="success">{text.statusSuccess}</StatusIndicator>
                <StatusIndicator type="error">{text.statusError}</StatusIndicator>
                <StatusIndicator type="info">{text.statusInfo}</StatusIndicator>
              </SpaceBetween>
              <SpaceBetween size="xs" direction="horizontal" alignItems="center">
                <Icon name="settings" />
                <Icon name="search" />
                <Icon name="notification" />
                <Icon name="lock-private" />
                <Icon name="gen-ai" />
              </SpaceBetween>
              <SpaceBetween size="xs" direction="horizontal" alignItems="center">
                <Button iconName="settings">{text.buttonSettings}</Button>
                <Button iconName="refresh" variant="icon" ariaLabel="Refresh" />
              </SpaceBetween>
              <ButtonGroup
                ariaLabel="Actions"
                variant="icon"
                items={[
                  { type: 'icon-button', id: 'copy', iconName: 'copy', text: 'Copy' },
                  { type: 'icon-button', id: 'edit', iconName: 'edit', text: 'Edit' },
                  { type: 'icon-button', id: 'delete', iconName: 'remove', text: 'Delete' },
                  { type: 'icon-button', id: 'share', iconName: 'share', text: 'Share' },
                ]}
              />
              <SegmentedControl
                selectedId={selectedSegmentId}
                onChange={({ detail }) => setSelectedSegmentId(detail.selectedId)}
                label="View mode"
                options={[
                  { id: 'seg-1', iconName: 'view-full', text: 'Full' },
                  { id: 'seg-2', iconName: 'view-horizontal', text: 'Horizontal' },
                  { id: 'seg-3', iconName: 'view-vertical', text: 'Vertical' },
                  { id: 'seg-4', iconName: 'settings', text: 'Settings' },
                ]}
              />
              <SpaceBetween size="xs">
                <div>
                  <Link href="#" external={true}>
                    {text.linkExternal}
                  </Link>
                </div>
                <div>
                  <Link href="#" external={true} variant="secondary">
                    {text.linkSecondary}
                  </Link>
                </div>
                <div>
                  <Link href="#" external={true} fontSize="heading-m">
                    {text.linkHeadingM}
                  </Link>
                </div>
              </SpaceBetween>
              <Flashbar items={flashbarItems} />
              <Autosuggest
                value={autosuggestValue}
                onChange={({ detail }) => setAutosuggestValue(detail.value)}
                options={autosuggestOptions}
                enteredTextLabel={value => `Use: ${value}`}
                ariaLabel="Autosuggest with features"
                placeholder="Search resources"
                empty="No matches found"
              />
              <Multiselect
                selectedOptions={selectedMultiselectOptions}
                onChange={({ detail }) => setSelectedMultiselectOptions([...detail.selectedOptions])}
                options={multiselectGroupedOptions}
                placeholder="Choose regions"
                deselectAriaLabel={option => `Remove ${option.label}`}
                tokenLimit={3}
                i18nStrings={{
                  tokenLimitShowFewer: 'Show fewer',
                  tokenLimitShowMore: 'Show more',
                }}
              />
              <TreeView<TreeItem>
                items={treeViewItems}
                expandedItems={expandedItems}
                renderItem={item => ({
                  content: (
                    <StatusIndicator type={item.type} iconAriaLabel={item.type}>
                      {item.label} {item.relatedNode && '('}
                      {item.relatedNode && (
                        <Link href="#" variant="primary">
                          {item.relatedNode}
                        </Link>
                      )}
                      {item.relatedNode && ')'}
                    </StatusIndicator>
                  ),
                  actions: item.hasActions ? (
                    <ButtonDropdown
                      items={[
                        { id: 'start', text: 'Start' },
                        { id: 'stop', text: 'Stop' },
                        { id: 'terminate', text: 'Terminate' },
                      ]}
                      ariaLabel={`Actions menu for ${item.label}`}
                      variant="inline-icon"
                    />
                  ) : undefined,
                  announcementLabel: `${item.label} ${item.relatedNode ?? ''}`,
                })}
                getItemId={item => item.id}
                getItemChildren={item => item.children}
                onItemToggle={({ detail }) =>
                  setExpandedItems(prev =>
                    detail.expanded ? [...prev, detail.item.id] : prev.filter(id => id !== detail.item.id)
                  )
                }
                ariaLabel="With actions"
              />
            </SpaceBetween>
          </IconProvider>
        </section>

        {/* Nested provider: outer small, inner resets to normal */}
        <section>
          <Box variant="h2">Nested: outer small, inner resets to normal</Box>
          <IconProvider icons={{}} iconSize="small">
            <SpaceBetween size="s">
              <Box color="text-status-info" fontWeight="bold">
                Small region:
              </Box>
              <SpaceBetween size="xs">
                <StatusIndicator type="success">{text.nestedSmallSuccess}</StatusIndicator>
                <StatusIndicator type="error">{text.nestedSmallError}</StatusIndicator>
              </SpaceBetween>
              <SpaceBetween size="xs" direction="horizontal" alignItems="center">
                <Icon name="settings" />
                <Icon name="search" />
                <Button iconName="add-plus" variant="normal">
                  Add
                </Button>
                <Button iconName="refresh" variant="icon" ariaLabel="Refresh" />
              </SpaceBetween>
              <div>
                <Link href="#" external={true}>
                  {text.linkSmallRegion}
                </Link>
              </div>

              <IconProvider icons={{}} iconSize="normal">
                <SpaceBetween size="s">
                  <Box color="text-status-info" fontWeight="bold">
                    Normal region (nested reset):
                  </Box>
                  <SpaceBetween size="xs">
                    <StatusIndicator type="success">{text.nestedNormalSuccess}</StatusIndicator>
                    <StatusIndicator type="error">{text.nestedNormalError}</StatusIndicator>
                  </SpaceBetween>
                  <SpaceBetween size="xs" direction="horizontal" alignItems="center">
                    <Icon name="settings" />
                    <Icon name="search" />
                    <Button iconName="add-plus" variant="normal">
                      Add
                    </Button>
                    <Button iconName="refresh" variant="icon" ariaLabel="Refresh" />
                  </SpaceBetween>
                  <div>
                    <Link href="#" external={true}>
                      {text.linkNormalRegion}
                    </Link>
                  </div>
                </SpaceBetween>
              </IconProvider>
            </SpaceBetween>
          </IconProvider>
        </section>

        {/* Explicit size prop on Icon should override the provider */}
        <section>
          <Box variant="h2">Explicit size prop overrides provider</Box>
          <IconProvider icons={{}} iconSize="small">
            <SpaceBetween size="xs" direction="horizontal" alignItems="center">
              <span>Provider says small:</span>
              <Icon name="settings" />
              <span>Explicit normal:</span>
              <Icon name="settings" size="normal" />
              <span>Explicit big:</span>
              <Icon name="settings" size="big" />
              <span>Explicit large:</span>
              <Icon name="settings" size="large" />
            </SpaceBetween>
          </IconProvider>
        </section>

        {/* Side-by-side comparison across sizes */}
        <section>
          <Box variant="h2">Side-by-side comparison</Box>
          <SpaceBetween size="m" direction="horizontal">
            <div>
              <Box fontWeight="bold">Small</Box>
              <IconProvider icons={{}} iconSize="small" iconSizeInherit="small">
                <SpaceBetween size="xs">
                  <StatusIndicator type="success">OK</StatusIndicator>
                  <Button iconName="settings">Go</Button>
                  <Link href="#" external={true}>
                    Link
                  </Link>
                </SpaceBetween>
              </IconProvider>
            </div>
            <div>
              <Box fontWeight="bold">Normal</Box>
              <IconProvider icons={{}} iconSize="normal" iconSizeInherit="normal">
                <SpaceBetween size="xs">
                  <StatusIndicator type="success">OK</StatusIndicator>
                  <Button iconName="settings">Go</Button>
                  <Link href="#" external={true}>
                    Link
                  </Link>
                </SpaceBetween>
              </IconProvider>
            </div>
            <div>
              <Box fontWeight="bold">Big</Box>
              <IconProvider icons={{}} iconSize="big" iconSizeInherit="big">
                <SpaceBetween size="xs">
                  <StatusIndicator type="success">OK</StatusIndicator>
                  <Button iconName="settings">Go</Button>
                  <Link href="#" external={true}>
                    Link
                  </Link>
                </SpaceBetween>
              </IconProvider>
            </div>
            <div>
              <Box fontWeight="bold">Large</Box>
              <IconProvider icons={{}} iconSize="large" iconSizeInherit="large">
                <SpaceBetween size="xs">
                  <StatusIndicator type="success">OK</StatusIndicator>
                  <Button iconName="settings">Go</Button>
                  <Link href="#" external={true}>
                    Link
                  </Link>
                </SpaceBetween>
              </IconProvider>
            </div>
          </SpaceBetween>
        </section>
      </SpaceBetween>
    </ScreenshotArea>
  );
}
