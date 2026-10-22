// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

// The heroshot source for the pattern thumbnails on the documentation website. Each pattern in the
// gallery below is rendered inside a frame of the exact thumbnail size, which the screenshot specs
// crop to by `[data-testid="heroshot-pattern-<id>"]`. The previews are deliberately simplified: they
// only need to carry enough of a pattern to be recognisable at thumbnail size, so they show a single
// static state and leave out interaction, real data and the parts that would not survive the crop.
//
// Add a pattern by adding an entry to `patterns` and a `case` for its `kind` in `PatternPreview`.
// Previews that only read as themselves above the frame width are laid out larger and either scaled
// down to fit (`CONTENT_SIZES`) or scaled slightly and cropped at the frame edges.
//
// See `pages/heroshot/overview.page.tsx` for the equivalent page covering individual components.
import React, { useState } from 'react';

import {
  Alert,
  Autosuggest,
  Badge,
  BarChart,
  Box,
  Button,
  ButtonDropdown,
  ColumnLayout,
  Container,
  ContentLayout,
  Flashbar,
  Form,
  FormField,
  Header,
  Input,
  KeyValuePairs,
  Link,
  Modal,
  ProgressBar,
  PropertyFilter,
  RadioGroup,
  Select,
  SideNavigation,
  SpaceBetween,
  StatusIndicator,
  Table,
  Tabs,
  Textarea,
  TextContent,
  TextFilter,
  Tiles,
  Toggle,
  TopNavigation,
  Wizard,
} from '~components';
import Dropdown from '~components/dropdown/internal';
import Option from '~components/internal/components/option';
import OptionsList from '~components/internal/components/options-list';
import SelectableItem from '~components/internal/components/selectable-item';
import PopoverArrow from '~components/popover/arrow';
import PopoverBody from '~components/popover/body';
import {
  borderRadiusInput,
  colorBackgroundInputDefault,
  colorBorderInputDefault,
  colorChartsPaletteCategorical1,
  colorChartsPaletteCategorical2,
  spaceScaledM,
  spaceScaledS,
  spaceScaledXxs,
} from '~design-tokens';

import { SimplePage } from '../app/templates';
import { Heroshot } from '../common/heroshot';
import { IframeWrapper } from '../utils/iframe-wrapper';

// @ts-expect-error The generated style map does not publish a TypeScript declaration.
import popoverStyles from '~components/popover/styles.css.js';

type PreviewKind =
  | 'access'
  | 'access-denied'
  | 'account'
  | 'actions'
  | 'announcement'
  | 'chart'
  | 'command'
  | 'create'
  | 'dashboard'
  | 'details'
  | 'edit'
  | 'empty'
  | 'feedback'
  | 'filter'
  | 'form'
  | 'help'
  | 'info-link'
  | 'loading'
  | 'navigation'
  | 'password'
  | 'plans'
  | 'selection'
  | 'status'
  | 'subscription'
  | 'tag-suggest'
  | 'table'
  | 'timestamps'
  | 'tabs'
  | 'wizard';

interface PatternDefinition {
  id: string;
  title: string;
  kind: PreviewKind;
  detail: string;
}

const patterns: ReadonlyArray<PatternDefinition> = [
  {
    id: 'access-denied-messaging',
    title: 'Access denied',
    kind: 'access-denied',
    detail: "You don't have permission to [AWSOrganizations:ListAccounts].",
  },
  { id: 'account-display', title: 'Account display', kind: 'account', detail: 'Development account' },
  { id: 'actions', title: 'Actions', kind: 'actions', detail: 'Resource' },
  {
    id: 'announcing-beta-preview-features',
    title: 'Announcing beta and preview features',
    kind: 'announcement',
    detail: 'Preview',
  },
  { id: 'announcing-new-features', title: 'Announcing new features', kind: 'tabs', detail: 'Distribution monitoring' },
  {
    id: 'managed-application-widget',
    title: 'AWS Managed Application widget',
    kind: 'subscription',
    detail: 'Current plan',
  },
  { id: 'aws-regions', title: 'AWS Regions', kind: 'selection', detail: 'Europe (Frankfurt)' },
  { id: 'aws-tagging-widget', title: 'AWS Tagging widget', kind: 'tag-suggest', detail: 'some-ta' },
  { id: 'chart-metric-drill-down', title: 'Chart metric drill down', kind: 'chart', detail: 'Requests by status' },
  { id: 'cloudshell-commands', title: 'CloudShell commands', kind: 'command', detail: 'aws ec2 describe-instances' },
  { id: 'dashboard-items', title: 'Dashboard items', kind: 'dashboard', detail: 'Resource health' },
  { id: 'defaults', title: 'Defaults', kind: 'form', detail: 'Recommended settings applied' },
  { id: 'density-settings', title: 'Density settings', kind: 'selection', detail: 'Comfortable' },
  {
    id: 'disabled-and-read-only-states',
    title: 'Disabled and read-only states',
    kind: 'form',
    detail: 'Managed by your organization',
  },
  { id: 'edit-resource', title: 'Edit resource', kind: 'edit', detail: 'Resource name' },
  { id: 'empty-states', title: 'Empty states', kind: 'empty', detail: 'No resources yet' },
  { id: 'error-messages', title: 'Error messages', kind: 'access', detail: 'Correct the highlighted fields.' },
  { id: 'error-pages', title: 'Error pages', kind: 'empty', detail: 'Page not found' },
  { id: 'errors', title: 'Errors', kind: 'access', detail: 'The resource could not be loaded.' },
  {
    id: 'feedback-mechanisms',
    title: 'Feedback mechanisms',
    kind: 'feedback',
    detail: 'Instance created successfully.',
  },
  {
    id: 'filter-persistence-in-collection-views',
    title: 'Filter persistence in collection views',
    kind: 'filter',
    detail: 'Status = Running',
  },
  { id: 'filtering-patterns', title: 'Filtering patterns', kind: 'filter', detail: 'Find resources' },
  { id: 'global-actions', title: 'Global actions', kind: 'actions', detail: 'Items' },
  { id: 'help-system', title: 'Help system', kind: 'info-link', detail: 'Distribution ID' },
  { id: 'hero-header', title: 'Hero header', kind: 'dashboard', detail: 'Build and operate your application' },
  {
    id: 'iam-roles-for-service-access',
    title: 'IAM roles for service access',
    kind: 'selection',
    detail: 'Choose an IAM role',
  },
  { id: 'iam-service-linked-roles', title: 'IAM service linked roles', kind: 'status', detail: 'Service-linked role' },
  { id: 'iam-service-role', title: 'IAM service role', kind: 'selection', detail: 'Create a new service role' },
  { id: 'image-magnifier', title: 'Image magnifier', kind: 'details', detail: 'Architecture diagram' },
  { id: 'in-context-actions', title: 'In-context actions', kind: 'actions', detail: 'Actions for selected resource' },
  {
    id: 'inclusive-language-validation',
    title: 'Inclusive language validation (internal)',
    kind: 'form',
    detail: 'Use an inclusive alternative.',
  },
  { id: 'inline-edit', title: 'Inline edit', kind: 'edit', detail: 'Edit resource description' },
  { id: 'kms-key-selection', title: 'KMS key selection', kind: 'selection', detail: 'AWS managed key' },
  { id: 'loading-and-refreshing', title: 'Loading and refreshing', kind: 'loading', detail: 'Refreshing resources' },
  {
    id: 'migration-communication',
    title: 'Migration communication',
    kind: 'announcement',
    detail: 'A new console experience is available.',
  },
  {
    id: 'migration-opt-in-opt-out',
    title: 'Migration opt-in/opt-out',
    kind: 'status',
    detail: 'Use the new console experience',
  },
  { id: 'multi-page-create', title: 'Multipage create', kind: 'wizard', detail: 'Configure resource' },
  { id: 'one-click-delete', title: 'One-click delete', kind: 'actions', detail: 'Delete low-risk item' },
  {
    id: 'password-strength-indicator',
    title: 'Password strength indicator',
    kind: 'password',
    detail: 'Password',
  },
  {
    id: 'pricing-and-plan-management',
    title: 'Pricing and plan management',
    kind: 'plans',
    detail: 'Standard',
  },
  { id: 'resource-details', title: 'Resource details', kind: 'details', detail: 'Instance details' },
  {
    id: 's3-resource-selection',
    title: 'S3 resource selection',
    kind: 'selection',
    detail: 's3://example-bucket/logs/',
  },
  { id: 'saved-filter-sets', title: 'Saved filter sets', kind: 'filter', detail: 'Production resources' },
  { id: 'secondary-panels', title: 'Secondary panels', kind: 'help', detail: 'Selected resource details' },
  { id: 'selection-in-forms', title: 'Selection in forms', kind: 'selection', detail: 'On-demand' },
  { id: 'service-navigation', title: 'Service navigation', kind: 'navigation', detail: 'Resources' },
  { id: 'side-navigation', title: 'Side navigation', kind: 'navigation', detail: 'Instances' },
  { id: 'sub-resource-create', title: 'Sub resource create', kind: 'create', detail: 'Add subnet' },
  { id: 'timestamps', title: 'Timestamps', kind: 'timestamps', detail: 'Creation date' },
  { id: 'top-navigation', title: 'Top navigation', kind: 'navigation', detail: 'Global utilities' },
  { id: 'user-feedback', title: 'User feedback', kind: 'status', detail: 'How was your experience?' },
  { id: 'validation', title: 'Validation', kind: 'form', detail: 'Enter a valid resource name.' },
  { id: 'view-resources', title: 'View resources', kind: 'table', detail: 'Browse resources' },
];

export default function PatternsOverviewHeroshotPage() {
  return (
    <SimplePage title="Pattern heroshots" screenshotArea={{ disableAnimations: true }} i18n={{}}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24 }}>
        {patterns.map(pattern => (
          <Heroshot
            key={pattern.id}
            id={`pattern-${pattern.id}`}
            label={pattern.title}
            align={TOP_ANCHORED_KINDS.has(pattern.kind) ? 'start' : 'center'}
            padding={PADDINGS[pattern.kind] ?? 16}
            stretch={true}
            contentSize={CONTENT_SIZES[pattern.kind]}
          >
            <PatternPreview pattern={pattern} />
          </Heroshot>
        ))}
      </div>
    </SimplePage>
  );
}

// The new feature is called out by appending an italic "new" to the label of the tab that holds it.
function NewFeatureTabs({ detail }: { detail: string }) {
  const [activeTabId, setActiveTabId] = useState('monitoring');
  return (
    // The tabs are shorter than the scaled content box, so they are centered in it to sit in the
    // middle of the frame instead of at its top.
    <div style={{ blockSize: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <Tabs
        activeTabId={activeTabId}
        onChange={({ detail }) => setActiveTabId(detail.activeTabId)}
        tabs={[
          { id: 'details', label: 'Details', content: 'Distribution details' },
          { id: 'permissions', label: 'Permissions', content: 'Distribution permissions' },
          {
            id: 'monitoring',
            label: (
              <>
                Monitoring - <i>new</i>
              </>
            ),
            content: detail,
          },
        ]}
      />
    </div>
  );
}

// Simplified version of the access denied pattern: the error alert states the missing permission and
// offers the request text in a copyable code block. The real pattern lists the full user, service,
// action, resource and context lines; the frame only has room for the shape, so they are trimmed.
//
// Unlike the other scaled previews this one is not shrunk to fit. It is laid out wider than the frame
// and only slightly scaled down, so the frame crops it at the right and bottom edges and the thumbnail
// reads as a detail of a real alert instead of a shrunken whole.
const ACCESS_DENIED_CROP = { layoutWidth: 560, scale: 0.87 };

function AccessDeniedAlert({ detail }: { detail: string }) {
  const requestLines = ['Service: [AWSOrganizations]', 'Action: [ListAccounts]', 'User: [user/awsgenericuser]'];
  return (
    <div
      style={{
        inlineSize: ACCESS_DENIED_CROP.layoutWidth,
        transform: `scale(${ACCESS_DENIED_CROP.scale})`,
        transformOrigin: 'top left',
      }}
    >
      <Alert type="error" header="Access denied">
        <SpaceBetween size="s">
          <div>
            {detail} To request access, copy the following text and send it to your AWS administrator.{' '}
            <Link external={true} href="#">
              Learn more
            </Link>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: spaceScaledXxs }}>
            <div
              style={{
                paddingInline: spaceScaledM,
                paddingBlock: spaceScaledS,
                border: `1px solid ${colorBorderInputDefault}`,
                borderRadius: borderRadiusInput,
                background: colorBackgroundInputDefault,
              }}
            >
              <SpaceBetween size="xxxs">
                {requestLines.map(line => (
                  <Box key={line} variant="code">
                    {line}
                  </Box>
                ))}
              </SpaceBetween>
            </div>
            <div>
              <Button iconName="copy">Copy</Button>
            </div>
          </div>
        </SpaceBetween>
      </Alert>
    </div>
  );
}

// Subscription widget: the plan and its tier in the header, with the charges and the payment method
// side by side below. Laid out wider than the frame and cropped, like the access denied preview.
const SUBSCRIPTION_CROP = { layoutWidth: 760, scale: 0.72 };

function SubscriptionWidget({ detail }: { detail: string }) {
  return (
    <div
      style={{
        inlineSize: SUBSCRIPTION_CROP.layoutWidth,
        transform: `scale(${SUBSCRIPTION_CROP.scale})`,
        // Scales about the vertical middle so that the container stays centered in the frame while the
        // crop falls on the right edge.
        transformOrigin: 'left center',
      }}
    >
      <Container
        header={
          <Header
            variant="h2"
            actions={<Button variant="primary">Manage plan</Button>}
            info={<Badge color="grey">PRO</Badge>}
          >
            {detail}
          </Header>
        }
      >
        <ColumnLayout columns={2} borders="vertical">
          <SpaceBetween size="xxs">
            <Box variant="awsui-key-label">Current estimated charges</Box>
            <SpaceBetween size="s" direction="horizontal" alignItems="center">
              <Box variant="h2">$00.00</Box>
              <Link href="#">View usage</Link>
            </SpaceBetween>
          </SpaceBetween>
          <SpaceBetween size="xxs">
            <Box variant="awsui-key-label">Payment method</Box>
            <SpaceBetween size="s" direction="horizontal" alignItems="center">
              <Box variant="h2">Visa •••• 1234</Box>
              <Link href="#">Change</Link>
            </SpaceBetween>
          </SpaceBetween>
        </ColumnLayout>
      </Container>
    </div>
  );
}

// Tag key suggestions while typing. The public Autosuggest only opens its dropdown while the input is
// focused, which a heroshot can't rely on, so the open state is reproduced from the same internal
// building blocks the real dropdown uses, as the component overview page does.
function OpenTagKeyAutosuggest({ detail }: { detail: string }) {
  const tagKeys = [`${detail}g1`, `${detail}g2`];
  return (
    <Dropdown
      open={true}
      minWidth="trigger"
      maxWidth="trigger"
      // The frame clips its overflow, so without this the dropdown would shrink to the remaining space
      // inside the frame and cut off the last option mid-row.
      stretchHeight={true}
      onOutsideClick={noop}
      onMouseDown={noop}
      trigger={
        <Autosuggest
          value={detail}
          onChange={noop}
          options={tagKeys.map(value => ({ value }))}
          ariaLabel="Tag key"
          empty="No matches found"
        />
      }
      content={
        <OptionsList open={true} statusType="finished" role="listbox" ariaLabel="Tag key">
          <SelectableItem isParent={true}>
            <Option option={{ label: 'Existing tag keys' }} />
          </SelectableItem>
          {tagKeys.map(value => (
            <SelectableItem key={value} isChild={true}>
              <Option option={{ value }} highlightText={detail} />
            </SelectableItem>
          ))}
        </OptionsList>
      }
    />
  );
}

// Drilling into a bar of a cost chart. Chart popovers only open on hover, which a heroshot can't rely
// on, so the open state is assembled from the popover internals the same way the component overview
// page does. Simplified from the real pattern: the per-account breakdown under each service is left
// out, so the rows are a flat list of services and their totals.
function ChartDrillDownPopover() {
  const series = [
    { label: 'EC2', color: colorChartsPaletteCategorical1 },
    { label: 'S3', color: colorChartsPaletteCategorical2 },
  ];
  return (
    <div style={{ position: 'relative', blockSize: '100%' }}>
      <BarChart
        hideFilter={true}
        hideLegend={true}
        height={130}
        xScaleType="categorical"
        // The neighbouring days keep the drilled-into bar narrow, as it would be in a real chart.
        xDomain={['Sep 23', 'Sep 24', 'Sep 25']}
        yDomain={[0, 40000]}
        yTickFormatter={value => `${value / 1000}K`}
        series={[{ title: 'EC2', type: 'bar', data: [{ x: 'Sep 23', y: 28000 }] }]}
      />
      <div style={{ position: 'absolute', insetBlockStart: 0, insetInlineStart: 96, inlineSize: 232 }}>
        <div style={{ position: 'relative' }}>
          <div
            className={`${popoverStyles['container-arrow']} ${popoverStyles['container-arrow-position-right-top']}`}
            aria-hidden={true}
          >
            <PopoverArrow position="right-top" />
          </div>
          <div className={`${popoverStyles['container-body']} ${popoverStyles['container-body-size-small']}`}>
            <PopoverBody
              dismissButton={true}
              dismissAriaLabel="Close"
              onDismiss={noop}
              header="September 23rd"
              variant="chart"
            >
              <SpaceBetween size="xs">
                {series.map(item => (
                  <div
                    key={item.label}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: spaceScaledXxs,
                      justifyContent: 'space-between',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: spaceScaledXxs }}>
                      <div
                        style={{ inlineSize: 12, blockSize: 12, borderRadius: 2, background: item.color }}
                        aria-hidden={true}
                      />
                      <Box variant="strong">{item.label}</Box>
                    </div>
                    <Link external={true} href="#">
                      $1000.00
                    </Link>
                  </div>
                ))}
              </SpaceBetween>
            </PopoverBody>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * IframeWrapper isolates the modal's portal target, but Modal's scroll-lock hook still uses the parent
 * document, which would stop the gallery below from scrolling.
 */
function useUnlockedGalleryScroll() {
  React.useEffect(() => {
    const unlockGallery = () => {
      const modalOpenClass = Array.from(document.body.classList).find(className => className.includes('modal-open'));
      if (modalOpenClass) {
        document.body.classList.remove(modalOpenClass);
      }
    };
    const observer = new MutationObserver(unlockGallery);
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
    unlockGallery();
    return () => observer.disconnect();
  }, []);
}

// Running a command in a CloudShell environment: the command to run and the environment to run it in,
// side by side. The modal is rendered in a portal, so it needs a viewport of its own to stay inside
// the frame, which is what the iframe below provides.
function RunCommandModal() {
  useUnlockedGalleryScroll();

  return (
    <Modal
      visible={true}
      header="Run command"
      closeAriaLabel="Close modal"
      footer={
        <Box float="right">
          <SpaceBetween size="xs" direction="horizontal">
            <Button variant="link">Cancel</Button>
            <Button variant="primary">Run</Button>
          </SpaceBetween>
        </Box>
      }
    >
      <SpaceBetween size="l">
        <Box variant="p">A new tab in the VPC environment will be created to run this command.</Box>
        <ColumnLayout columns={2} borders="vertical">
          <FormField label="Command">
            <Textarea
              rows={4}
              value="redis6-cli --tls -h test-pqoefs.serverless.use1.cache.amazonaws.com -p 6379"
              onChange={noop}
            />
          </FormField>
          <FormField
            label="CloudShell environment"
            description="The command will run in the following VPC environment."
          >
            <RadioGroup
              value="elasticache-vpc"
              onChange={noop}
              items={[{ value: 'elasticache-vpc', label: 'elastiCache-VPC' }]}
            />
          </FormField>
        </ColumnLayout>
      </SpaceBetween>
    </Modal>
  );
}

function PatternPreview({ pattern }: { pattern: PatternDefinition }) {
  switch (pattern.kind) {
    case 'access':
      return (
        <Alert type="error" header={pattern.title} action={<Button>View permissions</Button>}>
          {pattern.detail}
        </Alert>
      );
    case 'access-denied':
      return <AccessDeniedAlert detail={pattern.detail} />;
    case 'subscription':
      return <SubscriptionWidget detail={pattern.detail} />;
    case 'account':
      return (
        <Container>
          <KeyValuePairs items={[{ label: pattern.detail, value: '1234-5678-9012' }]} />
        </Container>
      );
    case 'actions':
      return (
        <Container
          header={
            <Header
              variant="h2"
              actions={
                <SpaceBetween direction="horizontal" size="xs">
                  <ButtonDropdown
                    items={[
                      { id: 'edit', text: 'Edit' },
                      { id: 'delete', text: 'Delete' },
                    ]}
                  >
                    Actions
                  </ButtonDropdown>
                  <Button variant="primary">{pattern.id === 'one-click-delete' ? 'Delete' : 'Create'}</Button>
                </SpaceBetween>
              }
            >
              {pattern.detail}
            </Header>
          }
        />
      );
    case 'announcement':
      return (
        <Alert type="info" header={pattern.detail} action={<Button>Learn more</Button>}>
          {pattern.title}
        </Alert>
      );
    case 'tabs':
      return <NewFeatureTabs detail={pattern.detail} />;
    case 'chart':
      return <ChartDrillDownPopover />;
    case 'command':
      return <IframeWrapper id="heroshot-run-command" size={PAGE_CONTENT_SIZE} AppComponent={RunCommandModal} />;
    case 'create':
      return (
        <Form
          header={<Header variant="h2">{pattern.detail}</Header>}
          actions={<Button variant="primary">Create</Button>}
        >
          <FormField label="Name">
            <Input value="production-resource" onChange={noop} />
          </FormField>
        </Form>
      );
    case 'dashboard':
      return (
        <ContentLayout
          header={
            <Header variant="h1" description={pattern.detail}>
              {pattern.title}
            </Header>
          }
        >
          <ColumnLayout columns={2} borders="vertical">
            <KeyValuePairs items={[{ label: 'Healthy', value: <StatusIndicator>12 resources</StatusIndicator> }]} />
            <KeyValuePairs
              items={[
                { label: 'Needs attention', value: <StatusIndicator type="warning">2 resources</StatusIndicator> },
              ]}
            />
          </ColumnLayout>
        </ContentLayout>
      );
    case 'details':
      return (
        <Container header={<Header variant="h2">{pattern.detail}</Header>}>
          <KeyValuePairs
            columns={2}
            items={[
              { label: 'Status', value: <StatusIndicator>Available</StatusIndicator> },
              { label: 'Region', value: 'eu-central-1' },
            ]}
          />
        </Container>
      );
    case 'edit':
      return (
        <Container header={<Header variant="h2">{pattern.title}</Header>}>
          <FormField label={pattern.detail}>
            <Input value="Production" onChange={noop} />
          </FormField>
        </Container>
      );
    case 'empty':
      return (
        <Table
          variant="embedded"
          header={<Header variant="h2">{pattern.title}</Header>}
          items={resources.slice(0, 0)}
          columnDefinitions={[{ id: 'name', header: 'Name', cell: item => item.name }]}
          empty={
            <Box textAlign="center">
              <SpaceBetween size="xs">
                <b>{pattern.detail}</b>
                <Button>Create resource</Button>
              </SpaceBetween>
            </Box>
          }
        />
      );
    case 'feedback':
      return <Flashbar items={[{ type: 'success', content: pattern.detail, id: 'success' }]} />;
    case 'filter':
      return (
        <Table
          variant="embedded"
          header={<Header variant="h2">{pattern.title}</Header>}
          filter={
            pattern.id === 'filtering-patterns' ? (
              <PropertyFilter
                query={{ tokens: [], operation: 'and' }}
                filteringAriaLabel="Filter resources"
                filteringPlaceholder={pattern.detail}
                filteringProperties={[]}
                onChange={noop}
              />
            ) : (
              <TextFilter
                filteringText="production"
                filteringAriaLabel="Filter resources"
                countText="2 matches"
                onChange={noop}
              />
            )
          }
          items={resources.slice(0, 2)}
          columnDefinitions={resourceColumns}
        />
      );
    case 'form':
      return (
        <Container header={<Header variant="h2">{pattern.title}</Header>}>
          <FormField
            label="Resource name"
            description={pattern.id === 'defaults' ? pattern.detail : undefined}
            errorText={
              pattern.id === 'validation' || pattern.id === 'inclusive-language-validation' ? pattern.detail : undefined
            }
          >
            <Input
              value={pattern.id === 'disabled-and-read-only-states' ? 'Organization default' : 'resource-name'}
              disabled={pattern.id === 'disabled-and-read-only-states'}
              onChange={noop}
            />
          </FormField>
        </Container>
      );
    case 'help':
      return (
        <Container header={<Header variant="h2">{pattern.title}</Header>}>
          <SpaceBetween size="xs">
            <Box>{pattern.detail}</Box>
            <Link href="#">Learn more</Link>
          </SpaceBetween>
        </Container>
      );
    case 'info-link':
      return (
        // The frame stretches its content, so the pairs are wrapped in a box that shrinks to their own
        // width and is then centered on both axes. A single column because at the frame width a third
        // of it is too narrow to keep the label, value and info link from wrapping.
        <div style={{ blockSize: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ inlineSize: 'fit-content' }}>
            <KeyValuePairs
              columns={1}
              items={[
                {
                  label: pattern.detail,
                  value: 'E1WG1ZNPRXT0D4',
                  info: (
                    <Link variant="info" href="#">
                      Info
                    </Link>
                  ),
                },
              ]}
            />
          </div>
        </div>
      );
    case 'loading':
      return (
        <Table
          variant="embedded"
          header={<Header variant="h2">{pattern.title}</Header>}
          loading={true}
          loadingText={pattern.detail}
          items={resources}
          columnDefinitions={resourceColumns}
        />
      );
    case 'navigation':
      return pattern.id === 'top-navigation' || pattern.id === 'aws-console-navigation' ? (
        <TopNavigation
          identity={{ title: pattern.detail, href: '#' }}
          utilities={[
            { type: 'button', iconName: 'notification', ariaLabel: 'Notifications' },
            { type: 'menu-dropdown', text: 'Account', items: [{ id: 'settings', text: 'Settings' }] },
          ]}
        />
      ) : (
        <SideNavigation
          header={{ text: 'Service', href: '#' }}
          activeHref="#resources"
          items={[
            { type: 'link', text: 'Dashboard', href: '#dashboard' },
            { type: 'link', text: pattern.detail, href: '#resources' },
          ]}
        />
      );
    // Flat-rate plan tiers, the pricing model the pattern covers: a fixed recurring price per user at
    // each tier, which the customer upgrades or downgrades between.
    // The real pattern renders the strength meter with PasswordStrengthIndicator, which ships in a
    // separate package, so the frame shows the fields it sits between and stands the meter in with a
    // progress bar.
    case 'password':
      return (
        <SpaceBetween size="m">
          <FormField label={pattern.detail}>
            <SpaceBetween size="xs">
              <Input type="password" value="correct-horse" onChange={noop} />
              <ProgressBar value={85} />
            </SpaceBetween>
          </FormField>
          <FormField label="Confirm password">
            <Input type="password" value="correct-horse" onChange={noop} />
          </FormField>
        </SpaceBetween>
      );
    case 'plans':
      return (
        // The frame stretches its content, so the tiers are wrapped in a box that shrinks to their own
        // width and is then centered on both axes.
        <div style={{ blockSize: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ inlineSize: 'fit-content' }}>
            <RadioGroup
              value={pattern.detail.toLowerCase()}
              onChange={noop}
              items={[
                { value: 'basic', label: 'Basic', description: 'Free' },
                { value: 'standard', label: 'Standard', description: '$20 per user/month' },
                { value: 'premium', label: 'Premium', description: '$40 per user/month' },
              ]}
            />
          </div>
        </div>
      );
    case 'selection':
      return (
        <Container header={<Header variant="h2">{pattern.title}</Header>}>
          {pattern.id === 'selection-in-forms' || pattern.id === 'density-settings' ? (
            <Tiles
              value="selected"
              columns={2}
              onChange={noop}
              items={[
                { value: 'selected', label: pattern.detail },
                { value: 'alternative', label: 'Alternative' },
              ]}
            />
          ) : pattern.id.includes('iam') ? (
            <RadioGroup
              value="existing"
              onChange={noop}
              items={[
                { value: 'existing', label: pattern.detail },
                { value: 'new', label: 'Create a new role' },
              ]}
            />
          ) : (
            <Select selectedOption={{ label: pattern.detail, value: 'selected' }} options={[]} onChange={noop} />
          )}
        </Container>
      );
    case 'status':
      return (
        <Container header={<Header variant="h2">{pattern.title}</Header>}>
          <SpaceBetween size="s">
            {pattern.id === 'user-feedback' ? (
              <RadioGroup
                value="good"
                onChange={noop}
                items={[
                  { value: 'good', label: 'Good' },
                  { value: 'poor', label: 'Needs improvement' },
                ]}
              />
            ) : (
              <Toggle checked={true} onChange={noop}>
                {pattern.detail}
              </Toggle>
            )}
          </SpaceBetween>
        </Container>
      );
    case 'tag-suggest':
      return <OpenTagKeyAutosuggest detail={pattern.detail} />;
    case 'table':
      return (
        <Table
          variant="embedded"
          header={<Header variant="h2">{pattern.detail}</Header>}
          items={resources}
          columnDefinitions={linkedResourceColumns}
        />
      );
    case 'timestamps':
      return (
        <TextContent>
          <p>
            <Box variant="awsui-key-label">{pattern.detail}</Box>5 hours ago by <Link href="#">plrs</Link>
          </p>
          <br />
          <p>
            <Box variant="awsui-key-label">Scan completed</Box>6 days ago
          </p>
        </TextContent>
      );
    case 'wizard':
      return (
        <Wizard
          activeStepIndex={1}
          steps={[
            { title: 'Details', content: 'Enter resource details.' },
            {
              title: pattern.detail,
              content: (
                <FormField label="Name">
                  <Input value="production-resource" onChange={noop} />
                </FormField>
              ),
            },
            { title: 'Review', content: 'Review configuration.' },
          ]}
          i18nStrings={{ cancelButton: 'Cancel', nextButton: 'Next', previousButton: 'Previous' }}
        />
      );
  }
}

const noop = () => {};

// Kinds laid out from the top of the frame rather than centered in it: the wizard because it is taller
// than the frame, the access denied alert because its crop is meant to fall on the bottom edge, and the
// tag suggestions because its dropdown hangs below the input and needs the room underneath.
const TOP_ANCHORED_KINDS = new Set<PreviewKind>(['access-denied', 'tag-suggest', 'wizard']);

// Kinds that only read as themselves above the frame width are laid out larger and scaled down.
// Both sizes keep the 346:170 frame ratio so that the scaled content fills the frame without letterboxing.
// Page-level layouts only read as themselves at a full viewport width, so they are laid out at one.
const PAGE_CONTENT_SIZE = { width: 800, height: 393 };

const CONTENT_SIZES: Partial<Record<PreviewKind, { width: number; height: number }>> = {
  wizard: PAGE_CONTENT_SIZE,
  // The modal renders at viewport scale, so it gets a viewport-sized layout of its own.
  command: PAGE_CONTENT_SIZE,
  // Just wide enough that the three tabs fit on one line instead of collapsing into scroll buttons.
  // The ratio matches the padded content box (314x138), not the frame, so that the scaled tabs fill
  // the full width instead of being letterboxed by the height constraint.
  tabs: { width: 420, height: 185 },
};

// Kinds whose content bleeds to the frame edges and so supplies its own insets.
const PADDINGS: Partial<Record<PreviewKind, number>> = { wizard: 8, command: 0 };

interface Resource {
  name: string;
  status: string;
}

const resources: Resource[] = [
  { name: 'production-api', status: 'Running' },
  { name: 'staging-worker', status: 'Stopped' },
];
const statusColumn = {
  id: 'status',
  header: 'Status',
  cell: (item: Resource) => (
    <StatusIndicator type={item.status === 'Stopped' ? 'stopped' : 'success'}>{item.status}</StatusIndicator>
  ),
};
const resourceColumns = [{ id: 'name', header: 'Name', cell: (item: Resource) => item.name }, statusColumn];
// Collection views navigate to a resource from its name, so there the name is a link.
const linkedResourceColumns = [
  { id: 'name', header: 'Name', cell: (item: Resource) => <Link href="#">{item.name}</Link> },
  statusColumn,
];
