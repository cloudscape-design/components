// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

// The heroshot source for the pattern thumbnails on the documentation website. Each pattern in the
// gallery below is rendered inside a frame of the exact thumbnail size, which the screenshot specs
// crop to by `[data-testid="heroshot-pattern-<id>"]`. The previews are deliberately simplified: they
// only need to carry enough of a pattern to be recognisable at thumbnail size, so they show a single
// static state and leave out interaction, real data and the parts that would not survive the crop.
//
// Most previews are compositions at or near real size that the frame crops at its edges (see `Crop`),
// so a thumbnail reads as a detail of a real page rather than as a whole page made tiny. Only the
// handful of previews that lose their meaning without the whole layout — a wizard, a modal, a page
// hero — are laid out at a larger size and scaled down to fit (`CONTENT_SIZES`).
//
// Add a pattern by adding an entry to `patterns` and a `case` for its `kind` in `PatternPreview`.
//
// See `pages/heroshot/overview.page.tsx` for the equivalent page covering individual components.
import React from 'react';

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
  Form,
  FormField,
  Header,
  Icon,
  Input,
  KeyValuePairs,
  Link,
  Modal,
  Multiselect,
  PieChart,
  Popover,
  ProgressBar,
  PropertyFilter,
  RadioGroup,
  Select,
  SideNavigation,
  SpaceBetween,
  StatusIndicator,
  Table,
  Textarea,
  TextFilter,
  Tiles,
  Toggle,
  TopNavigation,
  Wizard,
} from '~components';
import Dropdown from '~components/dropdown/internal';
import Item from '~components/internal/components/listbox/parts/item';
import OptionsList from '~components/internal/components/options-list';
import PopoverArrow from '~components/popover/arrow';
import PopoverBody from '~components/popover/body';
import {
  borderRadiusContainer,
  borderRadiusInput,
  colorBackgroundButtonPrimaryDefault,
  colorBackgroundCellShaded,
  colorBackgroundContainerContent,
  colorBackgroundControlDisabled,
  colorBackgroundInputDefault,
  colorBackgroundStatusInfo,
  colorBorderDividerDefault,
  colorBorderInputDefault,
  colorChartsPaletteCategorical1,
  colorChartsPaletteCategorical2,
  colorTextHeadingDefault,
  colorTextLinkDefault,
  colorTextStatusSuccess,
  fontWeightHeadingM,
  spaceScaledM,
  spaceScaledS,
  spaceScaledXs,
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
  | 'alert-info'
  | 'announcement'
  | 'chart'
  | 'command'
  | 'create'
  | 'dashboard-item'
  | 'default-select'
  | 'density'
  | 'details'
  | 'disabled-states'
  | 'edit'
  | 'empty'
  | 'error-page'
  | 'feedback-buttons'
  | 'filter'
  | 'hero-header'
  | 'panels-diagram'
  | 'iam-access'
  | 'iam-role-select'
  | 'image'
  | 'in-context'
  | 'help-diagram'
  | 'inline-edit'
  | 'kms-select'
  | 'language-validation'
  | 'loading'
  | 'modal-details'
  | 'navigation'
  | 'one-click-delete'
  | 'password'
  | 'plans'
  | 'property-filter'
  | 'region-table'
  | 's3-modal'
  | 'saved-filters'
  | 'status'
  | 'subscription'
  | 'table'
  | 'tag-widget'
  | 'multiselect'
  | 'timestamps'
  | 'top-navigation'
  | 'validation'
  | 'wizard';

interface PatternDefinition {
  id: string;
  title: string;
  kind: PreviewKind;
  detail: string;
  /**
   * How the preview heads its content:
   * - omitted: the pattern's own title (or, for some kinds, its detail) as an h2, standing in for the
   *   page the pattern sits on;
   * - a string: that text as an h3, for previews that lead with their control rather than with the
   *   page around it;
   * - `null`: no heading at all, for previews that are only about the control itself.
   */
  heading?: string | null;
}

const patterns: ReadonlyArray<PatternDefinition> = [
  {
    id: 'access-denied-messaging',
    title: 'Access denied',
    kind: 'access-denied',
    detail: "You don't have permission to [AWSOrganizations:ListAccounts].",
  },
  {
    id: 'account-display',
    title: 'Account display',
    kind: 'account',
    detail: 'Mailapp-Backend-Devs',
  },
  { id: 'actions', title: 'Actions', kind: 'actions', detail: 'Create resource' },
  {
    id: 'announcing-beta-preview-features',
    title: 'Announcing beta and preview features',
    kind: 'announcement',
    detail: 'We are improving the way to create scheduled instances.',
  },
  {
    id: 'announcing-new-features',
    title: 'Announcing new features',
    kind: 'announcement',
    detail: 'Launch templates is a new capability.',
  },
  {
    id: 'managed-application-widget',
    title: 'AWS Managed Application widget',
    kind: 'subscription',
    detail: 'Current plan',
  },
  { id: 'aws-regions', title: 'AWS Regions', kind: 'region-table', detail: 'N. Virginia (us-east-1)' },
  { id: 'aws-tagging-widget', title: 'AWS Tagging widget', kind: 'tag-widget', detail: 'Find a tag' },
  { id: 'chart-metric-drill-down', title: 'Chart metric drill down', kind: 'chart', detail: 'September 23rd' },
  { id: 'cloudshell-commands', title: 'CloudShell commands', kind: 'command', detail: 'aws ec2 describe-instances' },
  { id: 'dashboard-items', title: 'Dashboard items', kind: 'dashboard-item', detail: 'Board item' },
  { id: 'defaults', title: 'Defaults', kind: 'default-select', detail: 'Availability zone' },
  { id: 'density-settings', title: 'Density settings', kind: 'density', detail: 'Comfortable' },
  {
    id: 'disabled-and-read-only-states',
    title: 'Disabled and read-only states',
    kind: 'disabled-states',
    detail: 'Option 1',
  },
  { id: 'edit-resource', title: 'Edit resource', kind: 'edit', detail: 'Resource name' },
  { id: 'empty-states', title: 'Empty states', kind: 'empty', detail: 'No resources' },
  { id: 'error-messages', title: 'Error messages', kind: 'access', detail: 'Correct the highlighted fields.' },
  { id: 'error-pages', title: 'Error pages', kind: 'error-page', detail: 'Page not found' },
  { id: 'errors', title: 'Errors', kind: 'access', detail: 'The resource could not be loaded.' },
  {
    id: 'feedback-mechanisms',
    title: 'Feedback mechanisms',
    kind: 'alert-info',
    detail: 'Known issues/limitations',
  },
  {
    id: 'filter-persistence-in-collection-views',
    title: 'Filter persistence in collection views',
    kind: 'filter',
    detail: 'Status = Running',
    heading: 'Resources',
  },
  {
    id: 'filtering-patterns',
    title: 'Filtering patterns',
    kind: 'property-filter',
    detail: 'Find resources',
  },
  { id: 'global-actions', title: 'Global actions', kind: 'actions', detail: 'Create thing' },
  { id: 'help-system', title: 'Help system', kind: 'help-diagram', detail: 'Help panel' },
  {
    id: 'hero-header',
    title: 'Hero header',
    kind: 'hero-header',
    detail: 'Enterprise search, observability, and security.',
  },
  {
    id: 'iam-roles-for-service-access',
    title: 'IAM roles for service access',
    kind: 'iam-access',
    detail:
      'To access other AWS services and resources your function needs an IAM role. Choose a role with the right permissions for your function.',
  },
  {
    id: 'iam-service-linked-roles',
    title: 'IAM service linked roles',
    kind: 'modal-details',
    detail: 'Permission details',
  },
  { id: 'iam-service-role', title: 'IAM service role', kind: 'iam-role-select', detail: 'Create a new service role' },
  {
    id: 'image-magnifier',
    title: 'Image magnifier',
    kind: 'image',
    detail: 'Architecture diagram',
  },
  { id: 'in-context-actions', title: 'In-context actions', kind: 'in-context', detail: 'Download' },
  {
    id: 'inclusive-language-validation',
    title: 'Inclusive language validation (internal)',
    kind: 'language-validation',
    detail: 'Grandfathered',
  },
  { id: 'inline-edit', title: 'Inline edit', kind: 'inline-edit', detail: '3A' },
  {
    id: 'kms-key-selection',
    title: 'KMS key selection',
    kind: 'kms-select',
    detail: 'Choose an AWS KMS key',
  },
  { id: 'loading-and-refreshing', title: 'Loading and refreshing', kind: 'loading', detail: 'Loading resources' },
  {
    id: 'migration-communication',
    title: 'Migration communication',
    kind: 'alert-info',
    detail: 'Introducing the new CloudFront console experience',
  },
  {
    id: 'migration-opt-in-opt-out',
    title: 'Migration opt-in/opt-out',
    kind: 'status',
    detail: 'Use the new console experience',
    heading: null,
  },
  { id: 'multi-page-create', title: 'Multipage create', kind: 'wizard', detail: 'Configure resource' },
  { id: 'one-click-delete', title: 'One-click delete', kind: 'one-click-delete', detail: 'Remove' },
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
    kind: 's3-modal',
    detail: 'Choose an object in S3',
  },
  {
    id: 'saved-filter-sets',
    title: 'Saved filter sets',
    kind: 'saved-filters',
    detail: 'Stopped instances',
  },
  { id: 'secondary-panels', title: 'Secondary panels', kind: 'panels-diagram', detail: 'Resource details' },
  { id: 'selection-in-forms', title: 'Selection in forms', kind: 'multiselect', detail: 'Choose options' },
  { id: 'service-navigation', title: 'Service navigation', kind: 'navigation', detail: 'Resources' },
  { id: 'side-navigation', title: 'Side navigation', kind: 'navigation', detail: 'Instances' },
  { id: 'sub-resource-create', title: 'Sub resource create', kind: 'create', detail: 'Add subnet' },
  { id: 'timestamps', title: 'Timestamps', kind: 'timestamps', detail: 'Creation date' },
  { id: 'top-navigation', title: 'Top navigation', kind: 'top-navigation', detail: 'Global utilities' },
  { id: 'user-feedback', title: 'User feedback', kind: 'feedback-buttons', detail: 'Was this page helpful?' },
  { id: 'validation', title: 'Validation', kind: 'validation', detail: 'Enter a valid root object.' },
  { id: 'view-resources', title: 'View resources', kind: 'table', detail: 'production-api' },
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
            bleedBlockEnd={BLEED_BLOCK_END_KINDS.has(pattern.kind)}
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

/**
 * Lays its content out wider than the frame so that the frame crops it at the edges. This keeps the
 * content at (or near) the size it would have on a real page instead of shrinking it to fit, which is
 * what makes a thumbnail read as a detail of a real page.
 *
 * `offsetInlineStart` moves the content out of the frame on the start edge as well, for previews whose
 * subject sits in the middle of a wider composition — a value column next to its labels, the utilities
 * at the end of a top navigation. `offsetBlockStart` does the same on the top edge, and takes a positive
 * value to push the content down instead.
 */
function Crop({
  width,
  scale = 1,
  offsetInlineStart = 0,
  offsetBlockStart = 0,
  origin = 'top left',
  children,
}: {
  width: number;
  scale?: number;
  offsetInlineStart?: number;
  offsetBlockStart?: number;
  origin?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        inlineSize: width,
        flexShrink: 0,
        marginInlineStart: offsetInlineStart,
        marginBlockStart: offsetBlockStart,
        transform: scale === 1 ? undefined : `scale(${scale})`,
        transformOrigin: origin,
      }}
    >
      {children}
    </div>
  );
}

/**
 * Centers its content on both axes. The frame stretches its content to the full width, so previews
 * that are about a single small control wrap it in this to sit in the middle of the frame instead.
 */
function Centered({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        blockSize: '100%',
        inlineSize: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {children}
    </div>
  );
}

// Simplified version of the access denied pattern: the error alert states the missing permission and
// offers the request text in a copyable code block. The real pattern lists the full user, service,
// action, resource and context lines; the frame only has room for the first of them.
//
// Laid out wider than the frame at full size, so the frame crops it at the right and bottom edges and
// the thumbnail reads as a detail of a real alert instead of a shrunken whole.
function AccessDeniedAlert({ detail }: { detail: string }) {
  const requestLines = [
    'User: [arn:aws:iam::123456789000:user/admin]',
    'Service: [AWSOrganizations]',
    'Action: [ListAccounts]',
  ];
  return (
    <Crop width={430}>
      <Alert type="error" header="Access denied">
        <SpaceBetween size="s">
          <div>{detail} To request access, copy the following text and send it to your AWS administrator.</div>
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
    </Crop>
  );
}

// Subscription widget: the plan and its tier in the header, with the charges and the payment method
// side by side below. Laid out wider than the frame and cropped, like the access denied preview.
function SubscriptionWidget({ detail }: { detail: string }) {
  return (
    // Scales about the vertical middle so that the container stays centered in the frame while the
    // crop falls on the right edge.
    <Crop width={760} scale={0.72} origin="left center">
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
    </Crop>
  );
}

/**
 * An announcement attached to the thing it is about: a dotted trigger next to the control or label it
 * annotates, with its popover open to the side. Popovers only open on click, which a heroshot can't
 * rely on, so the open state is assembled from the popover internals the same way the component
 * overview page does.
 *
 * The dismiss button is reproduced as a plain icon button rather than through `PopoverBody`, whose own
 * dismiss button traps focus inside the thumbnail — this static preview has no working dismiss to
 * release it again.
 */
function AnnouncementPopover({ trigger, header, detail }: { trigger: string; header: string; detail: string }) {
  return (
    <div style={{ position: 'relative', blockSize: '100%', display: 'flex', alignItems: 'center' }}>
      {/* Lifted above the middle of the frame so the trigger sits beside the top of its popover. */}
      <div style={{ transform: 'translateY(-30px)' }}>
        <Popover content={null} dismissButton={false}>
          {trigger}
        </Popover>
      </div>
      <div style={{ position: 'absolute', insetInlineStart: 52, insetBlockStart: 22, inlineSize: 254 }}>
        <div style={{ position: 'relative' }}>
          <div
            className={`${popoverStyles['container-arrow']} ${popoverStyles['container-arrow-position-right-top']}`}
            aria-hidden={true}
          >
            <PopoverArrow position="right-top" />
          </div>
          <div className={`${popoverStyles['container-body']} ${popoverStyles['container-body-size-medium']}`}>
            <PopoverBody dismissButton={false} dismissAriaLabel={undefined} onDismiss={undefined} header={header}>
              {detail}
            </PopoverBody>
          </div>
          <div style={{ position: 'absolute', insetBlockStart: 4, insetInlineEnd: 4 }}>
            <Button variant="icon" iconName="close" ariaLabel="Dismiss announcement" />
          </div>
        </div>
      </div>
    </div>
  );
}

// Drilling into a bar of a cost chart. Chart popovers only open on hover, which a heroshot can't rely
// on, so the open state is assembled from the popover internals the same way the component overview
// page does. The drilled-into service is expanded to the per-account breakdown the pattern is about.
function ChartDrillDownPopover({ detail }: { detail: string }) {
  const accounts = ['689704984877', '499704984878', '866704984844'];
  return (
    // The top inset keeps the chart's highest tick label clear of the layout box, which would otherwise
    // clip it; the popover is pushed down by the same amount so it stays level with the plot area.
    <div style={{ position: 'relative', blockSize: '100%', paddingBlockStart: 10 }}>
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
      <div style={{ position: 'absolute', insetBlockStart: 10, insetInlineStart: 90, inlineSize: 330 }}>
        <div style={{ position: 'relative' }}>
          <div
            className={`${popoverStyles['container-arrow']} ${popoverStyles['container-arrow-position-right-top']}`}
            aria-hidden={true}
          >
            <PopoverArrow position="right-top" />
          </div>
          <div className={`${popoverStyles['container-body']} ${popoverStyles['container-body-size-medium']}`}>
            {/*
             * No dismiss button: it would autofocus and trap focus inside the thumbnail, and this
             * static preview has no working dismiss to release it again.
             */}
            <PopoverBody
              dismissButton={false}
              dismissAriaLabel={undefined}
              onDismiss={undefined}
              header={detail}
              variant="chart"
            >
              <SpaceBetween size="xxs">
                <DrillDownRow
                  color={colorChartsPaletteCategorical1}
                  label="EC2"
                  amount="$1000.00"
                  expanded={true}
                  key="ec2"
                />
                {accounts.map(account => (
                  <DrillDownRow key={account} label={`Account: ${account}`} amount="$100.00" indented={true} />
                ))}
                <DrillDownRow color={colorChartsPaletteCategorical2} label="S3" amount="$1000.00" key="s3" />
              </SpaceBetween>
            </PopoverBody>
          </div>
        </div>
      </div>
    </div>
  );
}

function DrillDownRow({
  color,
  label,
  amount,
  expanded,
  indented,
}: {
  color?: string;
  label: string;
  amount: string;
  expanded?: boolean;
  indented?: boolean;
}) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: spaceScaledXxs,
        justifyContent: 'space-between',
        marginInlineStart: indented ? spaceScaledM : undefined,
        whiteSpace: 'nowrap',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: spaceScaledXxs }}>
        {expanded ? <Icon name="caret-down-filled" size="small" /> : null}
        {color ? (
          <div style={{ inlineSize: 12, blockSize: 12, borderRadius: 2, background: color }} aria-hidden={true} />
        ) : null}
        {color ? <Box variant="strong">{label}</Box> : <Box>{label}</Box>}
      </div>
      <Link external={true} href="#">
        {amount}
      </Link>
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

// The permissions a service-linked role carries, read in a modal from the form that creates it. Like
// the CloudShell modal it is rendered in an iframe so that the portal stays inside the frame.
function PermissionDetailsModal() {
  useUnlockedGalleryScroll();

  return (
    <Modal visible={true} header="Permission details" closeAriaLabel="Close modal">
      <KeyValuePairs
        items={[
          { label: 'Role name', value: 'AmazonCloudFrontDN' },
          { label: 'Trusted entity', value: 'cloudfront.amazonaws.com' },
          { label: 'Policy', value: 'AWSCloudFrontLogger' },
        ]}
      />
    </Modal>
  );
}

// Picking a bucket from a modal that lists the account's buckets, the entry point of the S3 resource
// selection pattern. Rendered in an iframe for the same reason as the modals above.
function S3SelectionModal() {
  useUnlockedGalleryScroll();

  return (
    <Modal
      visible={true}
      header="Choose an object in S3"
      closeAriaLabel="Close modal"
      footer={
        <Box float="right">
          <SpaceBetween size="xs" direction="horizontal">
            <Button variant="link">Cancel</Button>
            <Button variant="primary">Choose</Button>
          </SpaceBetween>
        </Box>
      }
    >
      <SpaceBetween size="s">
        <TextFilter filteringText="" filteringPlaceholder="Find buckets" filteringAriaLabel="Find buckets" />
        <Table
          variant="embedded"
          selectionType="single"
          selectedItems={[buckets[0]]}
          onSelectionChange={noop}
          ariaLabels={{
            selectionGroupLabel: 'Bucket selection',
            itemSelectionLabel: ({ selectedItems }, item) =>
              `${item.name}${selectedItems.includes(item) ? ', selected' : ''}`,
          }}
          items={buckets}
          columnDefinitions={[
            { id: 'name', header: 'Name', cell: item => <Link href="#">{item.name}</Link> },
            { id: 'created', header: 'Creation date', cell: item => item.created },
          ]}
        />
      </SpaceBetween>
    </Modal>
  );
}

// A single static dashboard item, which is what the pattern is about: a self-contained container that
// an operator can pick up by its drag handle, whose header carries the title and whose content area
// visualises one thing — here the share each item takes of a total.
function DashboardItem({ detail }: { detail: string }) {
  return (
    <Container
      header={
        <Header variant="h2">
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: spaceScaledXxs }}>
            <span aria-hidden={true}>
              <Icon name="drag-indicator" />
            </span>
            {detail}
          </span>
        </Header>
      }
    >
      <PieChart
        variant="donut"
        size="small"
        hideFilter={true}
        hideLegend={true}
        data={boardItemShares}
        segmentDescription={(segment, sum) => `${Math.round((segment.value / sum) * 100)}%`}
      />
    </Container>
  );
}

// The recommended default of a field, offered as the first option of its dropdown and selected when the
// form opens. Dropdowns only open on click, which a heroshot can't rely on, so the open state is
// reproduced from the same internal building blocks the real dropdown uses.
function DefaultSelect({ detail }: { detail: string }) {
  const defaultOption = {
    label: 'No preference',
    description: 'Availability zone will be assigned automatically',
  };
  return (
    <FormField
      label={detail}
      info={
        <Link variant="info" href="#">
          Info
        </Link>
      }
    >
      <Dropdown
        open={true}
        minWidth="trigger"
        maxWidth="trigger"
        // The frame clips its overflow, so without this the dropdown would shrink to the remaining space
        // inside the frame and cut off the last option mid-row.
        stretchHeight={true}
        onOutsideClick={noop}
        onMouseDown={noop}
        trigger={<Select selectedOption={defaultOption} options={[]} onChange={noop} ariaLabel={detail} />}
        content={
          <OptionsList open={true} statusType="finished" role="listbox" ariaLabel={detail}>
            <Item
              index={0}
              option={{ option: defaultOption }}
              selected={true}
              highlighted={true}
              highlightType="keyboard"
            />
            <Item index={1} option={{ option: { value: 'us-west-2a' } }} />
            <Item index={2} option={{ option: { value: 'us-west-2b' } }} />
          </OptionsList>
        }
      />
    </FormField>
  );
}

// Choosing a KMS key by searching the account's keys or pasting an ARN. Like the dropdown above, the
// open state is reproduced from the internal building blocks so that it holds without focus.
function KmsKeySelect({ detail }: { detail: string }) {
  return (
    <FormField label={detail}>
      <Dropdown
        open={true}
        minWidth="trigger"
        maxWidth="trigger"
        stretchHeight={true}
        onOutsideClick={noop}
        onMouseDown={noop}
        trigger={
          <Autosuggest
            value=""
            onChange={noop}
            options={kmsKeys}
            placeholder={`${detail} or enter an ARN`}
            ariaLabel={detail}
            empty="No matches found"
          />
        }
        content={
          <OptionsList open={true} statusType="finished" role="listbox" ariaLabel={detail}>
            {kmsKeys.map((option, index) => (
              <Item key={option.description} index={index} option={{ option }} />
            ))}
          </OptionsList>
        }
      />
    </FormField>
  );
}

// Choosing several values from a set while filling in a form, which is what the pattern covers. The
// control carries that on its own, so the preview shows the multiselect open and nothing else. Dropdowns
// only open on click, which a heroshot can't rely on, so the open state is reproduced from the same
// internal building blocks the real dropdown uses.
function MultiselectInForm({ detail }: { detail: string }) {
  return (
    // Nudged down so that the trigger and its open dropdown sit centered in the frame as one block: the
    // dropdown is positioned out of flow, so centering the trigger alone would leave the options hanging
    // past the bottom edge.
    <div style={{ marginBlockStart: 18 }}>
      <Dropdown
        open={true}
        minWidth="trigger"
        maxWidth="trigger"
        stretchHeight={true}
        onOutsideClick={noop}
        onMouseDown={noop}
        trigger={
          <Multiselect selectedOptions={[]} options={[]} placeholder={detail} onChange={noop} ariaLabel={detail} />
        }
        content={
          <OptionsList open={true} statusType="finished" role="listbox" ariaLabel={detail}>
            <Item
              index={0}
              selectionType="multi"
              option={{ option: { label: 'Option 1' } }}
              selected={true}
              highlighted={true}
              highlightType="keyboard"
            />
            <Item index={1} selectionType="multi" option={{ option: { label: 'Option 2' } }} />
          </OptionsList>
        }
      />
    </div>
  );
}

/**
 * The actions of a section, which is all this pattern is about: the grouped secondary actions and the
 * primary one, in the header of the section they act on. The section is laid out past the frame on the
 * start and bottom edges, so only its top-right corner is in view and the actions carry the thumbnail —
 * what the section holds does not matter here, so its content area is left empty.
 */
function ActionsInCorner({ detail }: { detail: string }) {
  return (
    <Crop width={560} offsetInlineStart={-256} offsetBlockStart={10}>
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
                <Button variant="primary">{detail}</Button>
              </SpaceBetween>
            }
          >
            Resources
          </Header>
        }
      >
        <div style={{ blockSize: 200 }} />
      </Container>
    </Crop>
  );
}

// The action offered on each row of a collection, which is all this pattern is about — so the preview
// shows the rows alone, without the collection-level actions above them.
function InContextActionsTable({ detail }: { detail: string }) {
  return (
    <Crop width={400}>
      <Table
        variant="embedded"
        items={cells}
        columnDefinitions={[
          {
            id: 'first',
            header: 'cell',
            cell: () => (
              <Popover content="Resource details" dismissButton={false}>
                Popover trigger
              </Popover>
            ),
          },
          { id: 'second', header: 'cell', cell: () => <Link href="#">{detail}</Link> },
        ]}
      />
    </Crop>
  );
}

// Tagging an existing resource: the tags already on it, searchable, with their values editable in place
// and the policy each value comes from linked from the row.
function TaggingWidget({ detail }: { detail: string }) {
  return (
    // The container variant, like the regions table: the search belongs to the table, so it goes in its
    // filter slot rather than in a box of its own above it.
    <Table
      items={tags}
      filter={<TextFilter filteringText="" filteringPlaceholder={detail} filteringAriaLabel={detail} />}
      columnDefinitions={[
        { id: 'key', header: 'Key', cell: item => item.key },
        {
          id: 'value',
          header: 'Value',
          cell: item => <Input type="search" value={item.value} onChange={noop} ariaLabel={`${item.key} value`} />,
        },
        { id: 'policy', header: 'Policy', cell: item => <Link href="#">{item.policies}</Link> },
      ]}
    />
  );
}

// Editing one cell of a table without leaving it: the active cell swaps its value for the control that
// edits it, with the submit and cancel actions beside the control.
function InlineEditTable({ detail }: { detail: string }) {
  return (
    <Crop width={520}>
      <Table
        variant="embedded"
        items={objects}
        sortingColumn={{ sortingField: 'name' }}
        columnDefinitions={[
          {
            id: 'name',
            header: 'Item',
            sortingField: 'name',
            cell: item => <Link href="#">{item.name}</Link>,
          },
          {
            id: 'type',
            header: 'Type',
            sortingField: 'type',
            cell: item =>
              item.editing ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: spaceScaledXxs }}>
                  <Select
                    selectedOption={{ label: detail, value: detail }}
                    options={[]}
                    onChange={noop}
                    ariaLabel={`${item.name} type`}
                  />
                  <Button variant="icon" iconName="close" ariaLabel="Cancel edit" />
                  <Button variant="icon" iconName="check" ariaLabel="Submit edit" />
                </div>
              ) : (
                item.type
              ),
          },
          { id: 'size', header: 'Size', cell: item => item.size },
        ]}
      />
    </Crop>
  );
}

// The filter bar of a collection whose filters are saved as a set: the saved sets to switch between,
// the free-text search, and the filters currently applied with the way to clear them.
function SavedFilterSets({ detail }: { detail: string }) {
  return (
    <Crop width={460}>
      <SpaceBetween size="s">
        <div style={{ display: 'grid', gridTemplateColumns: '190px 1fr', gap: spaceScaledS }}>
          <Select
            selectedOption={{ label: detail, value: 'stopped' }}
            options={[]}
            onChange={noop}
            ariaLabel="Saved filter sets"
          />
          <TextFilter filteringText="" filteringPlaceholder="Find resources" filteringAriaLabel="Find resources" />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: spaceScaledS }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: spaceScaledXxs,
              paddingInlineStart: spaceScaledS,
              border: `1px solid ${colorBorderInputDefault}`,
              borderRadius: borderRadiusInput,
              background: colorBackgroundInputDefault,
            }}
          >
            <Box>State: Stop</Box>
            <Button variant="icon" iconName="close" ariaLabel="Remove filter" />
          </div>
          <div style={{ alignSelf: 'stretch', borderInlineEnd: `1px solid ${colorBorderDividerDefault}` }} />
          <ButtonDropdown
            mainAction={{ text: 'Clear filters' }}
            items={[{ id: 'save', text: 'Save as new filter set' }]}
            ariaLabel="Filter set actions"
          />
        </div>
      </SpaceBetween>
    </Crop>
  );
}

/**
 * The role a service acts under, which is what the pattern asks the user to decide: let the console
 * create a role with the permissions the service needs, or point it at a role that already exists. The
 * consequence of the default choice is spelled out underneath it.
 */
function ServiceAccessForm({ detail }: { detail: string }) {
  return (
    // Laid out wider than the frame so the two choices keep their columns: Tiles falls back to one column
    // below 465px, and once the container's own padding is taken off, 520 is about the narrowest layout
    // that stays above that.
    <Crop width={520}>
      <Container>
        <FormField label="Permissions" description={detail}>
          <SpaceBetween size="s">
            <Tiles
              value="default"
              columns={2}
              onChange={noop}
              items={[
                { value: 'default', label: 'Create default role' },
                { value: 'existing', label: 'Use another role' },
              ]}
            />
            <Box variant="p">
              A new role will be created named &ldquo;myFunctionName-role-5abtoqem&rdquo; to give your function
              permission to upload logs to Amazon CloudWatch.
            </Box>
          </SpaceBetween>
        </FormField>
      </Container>
    </Crop>
  );
}

/**
 * How an account is named where a page refers to one, taken from the pattern's own example: the account
 * name links to the account, its ID follows in parentheses, and the email it belongs to closes the line
 * in secondary text. Read as one key-value pair of a details page, which is where the pattern puts it.
 *
 * The pattern's other example pairs this with copy-to-clipboard actions across three columns, which at
 * thumbnail width would collapse into a single column and lose that shape, so this preview shows the
 * account line alone.
 */
function AccountDisplay({ detail }: { detail: string }) {
  return (
    // Laid out a little wider than the frame so that the name and ID keep one line, with the email on
    // its own line below: the whole line is wider than any thumbnail, and cropping it would cut the ID
    // or break the email mid-word.
    <Crop width={380}>
      <Container>
        <KeyValuePairs
          columns={1}
          items={[
            {
              label: 'Account',
              value: (
                <div>
                  <div>
                    <Link href="#" variant="primary" external={true} externalIconAriaLabel="(opens in a new tab)">
                      {detail}
                    </Link>{' '}
                    <span>({account.id})</span>
                  </div>
                  <Box variant="span" color="text-body-secondary" fontSize="body-s">
                    {account.email}
                  </Box>
                </div>
              ),
            },
          ]}
        />
      </Container>
    </Crop>
  );
}

/**
 * The help system is about where help lives rather than about what it says: a panel beside the page,
 * holding the explanation of what the page asks for and the links that go deeper. At thumbnail size real
 * copy in both halves is unreadable, so this preview is an abstract drawing of that split, with the page
 * content on the left and the panel on the right. Everything is drawn from colour tokens, so the drawing
 * follows the theme like the rest of the gallery.
 */
function HelpSystemDiagram() {
  return (
    // Laid out wider than the frame and shifted, so the page content is cut on the start edge and the
    // panel keeps its full width: the panel is the subject of the pattern.
    <Crop width={430} offsetInlineStart={-116}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 190px',
          // Taller than the frame, so the drawing is cropped at its bottom edge rather than floating in it.
          blockSize: 200,
          boxSizing: 'border-box',
          borderBlockStart: `1px solid ${colorBorderDividerDefault}`,
          background: colorBackgroundContainerContent,
        }}
        aria-hidden={true}
      >
        <div style={{ padding: spaceScaledM }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: spaceScaledS }}>
            <Bar />
            <div
              style={{
                blockSize: 11,
                inlineSize: 60,
                flexShrink: 0,
                background: colorBackgroundButtonPrimaryDefault,
              }}
            />
          </div>
          {/* The container the page content sits in, which the help panel explains. */}
          <div
            style={{
              marginBlockStart: 24,
              blockSize: 130,
              border: `1px solid ${colorBorderDividerDefault}`,
              borderRadius: borderRadiusContainer,
            }}
          />
        </div>
        <div style={{ padding: spaceScaledM, borderInlineStart: `1px solid ${colorBorderDividerDefault}` }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ blockSize: 14, inlineSize: 100, background: colorTextHeadingDefault }} />
            <Icon name="angle-right" />
          </div>
          <div style={{ display: 'grid', rowGap: 9, marginBlockStart: 12 }}>
            <Bar />
            <Bar />
            <Bar />
            <div style={{ inlineSize: '80%' }}>
              <Bar />
            </div>
          </div>
          {/* The links out of the panel, which the pattern puts at the end of it. */}
          <div style={{ display: 'grid', rowGap: 9, marginBlockStart: 12 }}>
            <LinkBar />
            <LinkBar />
          </div>
        </div>
      </div>
    </Crop>
  );
}

function LinkBar() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: spaceScaledXs }}>
      <div style={{ blockSize: 7, inlineSize: '76%', background: colorTextLinkDefault }} />
      <div style={{ blockSize: 7, inlineSize: 10, background: colorTextLinkDefault }} />
    </div>
  );
}

/**
 * Secondary panels are about what sits beside the page rather than about any one panel's content: two of
 * them open at once, each with its own title and its own way of collapsing. At thumbnail size real copy
 * in two columns is unreadable, so this is an abstract drawing of that arrangement, in the same style as
 * the help system drawing above.
 */
function SecondaryPanelsDiagram() {
  return (
    // Same framing as the help system drawing: the layout's end edge lands on the frame's, so its
    // top-right corner is in view, and what comes before it is cut on the start edge.
    <Crop width={340} offsetInlineStart={-26}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '170px 170px',
          // Taller than the frame, so the drawing is cropped at its bottom edge rather than floating in it.
          blockSize: 200,
          boxSizing: 'border-box',
          borderBlockStart: `1px solid ${colorBorderDividerDefault}`,
          background: colorBackgroundContainerContent,
        }}
        aria-hidden={true}
      >
        {/* A panel of details, with rows that expand into more of them. */}
        <PanelColumn>
          <div style={{ display: 'grid', rowGap: 9, marginBlockStart: 14 }}>
            <Bar />
            <Bar />
          </div>
          <div style={{ display: 'grid', rowGap: 9, marginBlockStart: 16 }}>
            <ExpandableRow />
            <ExpandableRow />
          </div>
        </PanelColumn>
        {/* A panel of progress, where each step carries its own status. */}
        <PanelColumn>
          <div style={{ display: 'grid', rowGap: 9, marginBlockStart: 14 }}>
            <StatusRow iconName="status-positive" iconVariant="success" barColor={colorTextStatusSuccess} />
            <Bar />
            <Bar />
            <div style={{ inlineSize: '70%' }}>
              <Bar />
            </div>
          </div>
          <div style={{ display: 'grid', rowGap: 9, marginBlockStart: 16 }}>
            <StatusRow iconName="status-pending" barColor={colorTextHeadingDefault} />
            <Bar />
            <div style={{ inlineSize: '70%' }}>
              <Bar />
            </div>
          </div>
        </PanelColumn>
      </div>
    </Crop>
  );
}

// A panel of the drawing above: its title and the control that collapses it, over whatever it holds.
function PanelColumn({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ padding: spaceScaledM, borderInlineStart: `1px solid ${colorBorderDividerDefault}` }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ blockSize: 11, inlineSize: 90, background: colorTextHeadingDefault }} />
        <Icon name="angle-right" />
      </div>
      {children}
    </div>
  );
}

function ExpandableRow() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: spaceScaledXxs }}>
      <Icon name="caret-right-filled" size="small" />
      <div style={{ inlineSize: '78%' }}>
        <Bar />
      </div>
    </div>
  );
}

function StatusRow({
  iconName,
  iconVariant,
  barColor,
}: {
  iconName: 'status-positive' | 'status-pending';
  iconVariant?: 'success';
  barColor: string;
}) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: spaceScaledXs }}>
      <Icon name={iconName} variant={iconVariant} />
      <div style={{ blockSize: 7, inlineSize: '82%', background: barColor }} />
    </div>
  );
}

/**
 * The density setting is about the spacing of a whole page rather than about one control, which no real
 * component can show at thumbnail size. So this preview is an abstract drawing instead: the same page,
 * once in comfortable and once in compact spacing, with its content standing in as bars. Everything is
 * drawn from colour tokens, so the drawing follows the theme like the rest of the gallery.
 */
function DensityDiagram() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: spaceScaledM }}>
      <DensityPanel rows={5} rowGap={13} />
      <DensityPanel rows={8} rowGap={6} />
    </div>
  );
}

function DensityPanel({ rows, rowGap }: { rows: number; rowGap: number }) {
  return (
    <div
      // Taller than the frame so that the panels are cropped at its bottom edge, which keeps the rows
      // reading as part of a longer page.
      style={{
        blockSize: 190,
        boxSizing: 'border-box',
        padding: spaceScaledM,
        border: `1px solid ${colorBorderDividerDefault}`,
        borderRadius: borderRadiusContainer,
        background: colorBackgroundContainerContent,
      }}
      aria-hidden={true}
    >
      <div style={{ blockSize: 7, inlineSize: '70%', background: colorTextHeadingDefault }} />
      <div style={{ display: 'grid', rowGap, marginBlockStart: 20 }}>
        {Array.from({ length: rows }, (_, index) => (
          <div key={index} style={{ display: 'grid', gridTemplateColumns: '12% 32% 1fr', gap: 6 }}>
            <Bar />
            <Bar />
            <Bar />
          </div>
        ))}
      </div>
    </div>
  );
}

// A placeholder for a line of content in the abstract drawings above.
function Bar() {
  return <div style={{ blockSize: 7, inlineSize: '100%', background: colorBackgroundControlDisabled }} />;
}

// A diagram shown at a size the page has room for, with the control that magnifies it in the corner.
function ImageMagnifier() {
  return (
    // Shifted up so the diagram's bottom-left corner is in view, with the magnify control in it: the
    // diagram runs past the frame on the top and end edges, as it would on a page with room for it.
    <Crop width={430} offsetBlockStart={-90}>
      <div
        style={{
          border: `1px solid ${colorBorderDividerDefault}`,
          borderRadius: borderRadiusInput,
          background: colorBackgroundInputDefault,
          padding: spaceScaledXs,
        }}
      >
        <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: spaceScaledXs, alignItems: 'end' }}>
          <Button iconName="zoom-in" ariaLabel="Magnify diagram" />
          {/* Stands in for the diagram itself, which a thumbnail has no room to show. */}
          <div style={{ blockSize: 200, background: colorBackgroundStatusInfo }} aria-hidden={true} />
        </div>
      </div>
    </Crop>
  );
}

/**
 * The heading a preview puts above its content, or `undefined` for no heading at all — which is why
 * this is a function and not a component: a component rendering `null` would still leave the container
 * drawing an empty header strip. See `PatternDefinition.heading`.
 *
 * `fallback` is the h2 text for kinds that head their content with the pattern detail rather than its
 * title; `counter` only applies to a collection heading, so it is passed where the content is one.
 */
function previewHeading(
  pattern: PatternDefinition,
  { counter, fallback }: { counter?: string; fallback?: string } = {}
): React.ReactNode {
  if (pattern.heading === null) {
    return undefined;
  }
  return pattern.heading ? (
    <Header variant="h3" counter={counter}>
      {pattern.heading}
    </Header>
  ) : (
    <Header variant="h2">{fallback ?? pattern.title}</Header>
  );
}

/**
 * The hero header of a product page is a band of its own above the page content: what the product is on
 * one side, the actions that take you into it on the other. At thumbnail size its copy is unreadable, so
 * this preview is an abstract drawing of that band and the page it heads, in the same style as the other
 * drawings in this gallery.
 */
function HeroHeaderDiagram() {
  return (
    <div style={{ inlineSize: '100%', blockSize: 200, background: colorBackgroundContainerContent }} aria-hidden={true}>
      {/* The band itself: the product named and described, with its actions at the end. */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr auto',
          gap: spaceScaledM,
          alignItems: 'start',
          padding: spaceScaledM,
          background: colorBackgroundCellShaded,
        }}
      >
        <div>
          <div style={{ blockSize: 12, inlineSize: '85%', background: colorTextHeadingDefault }} />
          <div style={{ display: 'grid', rowGap: 8, marginBlockStart: 14, inlineSize: '70%' }}>
            <Bar />
            <Bar />
          </div>
        </div>
        <div style={{ display: 'grid', rowGap: 8, inlineSize: 72 }}>
          <div style={{ blockSize: 14, background: colorTextHeadingDefault }} />
          <div
            style={{
              blockSize: 14,
              boxSizing: 'border-box',
              border: `1px solid ${colorBorderDividerDefault}`,
              background: colorBackgroundContainerContent,
            }}
          />
        </div>
      </div>
      {/* The page content the band heads, cropped at the frame's bottom edge. */}
      <div style={{ padding: spaceScaledM }}>
        <div
          style={{
            blockSize: 120,
            border: `1px solid ${colorBorderDividerDefault}`,
            borderRadius: borderRadiusContainer,
          }}
        />
      </div>
    </div>
  );
}

function PatternPreview({ pattern }: { pattern: PatternDefinition }) {
  switch (pattern.kind) {
    // Cropped at the right edge, like the info alerts: the alert reads at the width it has on a real
    // page rather than being squeezed into the frame.
    case 'access':
      return (
        <Crop width={470}>
          <Alert type="error" header={pattern.title}>
            {pattern.detail}
          </Alert>
        </Crop>
      );
    case 'access-denied':
      return <AccessDeniedAlert detail={pattern.detail} />;
    case 'subscription':
      return <SubscriptionWidget detail={pattern.detail} />;
    // The pattern is about reading the account you are acting in, so the preview shows only the account
    // line itself: its name and number, the account type, and the address it belongs to.
    case 'account':
      return <AccountDisplay detail={pattern.detail} />;
    case 'actions':
      return <ActionsInCorner detail={pattern.detail} />;
    case 'in-context':
      return <InContextActionsTable detail={pattern.detail} />;
    case 'announcement':
      return (
        <AnnouncementPopover
          trigger={pattern.id === 'announcing-new-features' ? 'New' : 'Beta'}
          header={pattern.id === 'announcing-new-features' ? 'New feature' : 'Beta feature'}
          detail={pattern.detail}
        />
      );
    // Announcements and caveats a service makes about itself, which the pattern delivers as a page-level
    // info alert. Cropped at the right edge so the text reads at the size it has on a real page.
    case 'alert-info':
      return (
        <Crop width={470}>
          <Alert type="info" header={pattern.detail}>
            {pattern.id === 'migration-communication' ? (
              <>
                We&apos;ve redesigned the CloudFront console to make it easier to find what you need.{' '}
                <Link href="#">Let us know what you think.</Link>
              </>
            ) : (
              'Review the documentation to learn about potential compatibility issues with specific database versions.'
            )}
          </Alert>
        </Crop>
      );
    case 'chart':
      return <ChartDrillDownPopover detail={pattern.detail} />;
    case 'command':
      return <IframeWrapper id="heroshot-run-command" size={PAGE_CONTENT_SIZE} AppComponent={RunCommandModal} />;
    case 'modal-details':
      return (
        <IframeWrapper
          id="heroshot-permission-details"
          size={PAGE_CONTENT_SIZE}
          AppComponent={PermissionDetailsModal}
        />
      );
    case 's3-modal':
      return <IframeWrapper id="heroshot-s3-selection" size={PAGE_CONTENT_SIZE} AppComponent={S3SelectionModal} />;
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
    case 'hero-header':
      return <HeroHeaderDiagram />;
    case 'dashboard-item':
      return <DashboardItem detail={pattern.detail} />;
    case 'default-select':
      return <DefaultSelect detail={pattern.detail} />;
    case 'kms-select':
      return <KmsKeySelect detail={pattern.detail} />;
    case 'multiselect':
      return <MultiselectInForm detail={pattern.detail} />;
    case 'details':
      return (
        <Container header={previewHeading(pattern, { fallback: pattern.detail })}>
          <KeyValuePairs
            columns={2}
            items={[
              { label: 'Status', value: <StatusIndicator>Available</StatusIndicator> },
              { label: 'Region', value: 'eu-central-1' },
            ]}
          />
        </Container>
      );
    // The states a field can be in when the user may not change it: disabled, because something else has
    // to happen first, above the editable field it is compared with.
    case 'disabled-states':
      return (
        <Centered>
          <div style={{ inlineSize: '100%' }}>
            <SpaceBetween size="m">
              <Select
                disabled={true}
                selectedOption={{ label: pattern.detail, value: 'option-1' }}
                options={[]}
                onChange={noop}
                ariaLabel="Disabled selection"
              />
              <Select
                selectedOption={{ label: pattern.detail, value: 'option-1' }}
                options={[]}
                onChange={noop}
                ariaLabel="Selection"
              />
            </SpaceBetween>
          </div>
        </Centered>
      );
    // Two densities of the same content, which is what the setting switches between.
    case 'density':
      return <DensityDiagram />;
    // The fields carry the pattern on their own, so the section keeps no heading: at thumbnail size a
    // heading would cost the room the second field needs.
    case 'edit':
      return (
        <Container>
          <SpaceBetween size="l">
            <FormField label={pattern.detail}>
              <Input value="Production" onChange={noop} />
            </FormField>
            <FormField label="Description">
              <Input value="Production web tier" onChange={noop} />
            </FormField>
          </SpaceBetween>
        </Container>
      );
    case 'inline-edit':
      return <InlineEditTable detail={pattern.detail} />;
    // The empty state fills the slot its collection would occupy, so the preview shows the message and
    // the way out of it alone, without the table frame around them.
    case 'empty':
      return (
        <Centered>
          <Box textAlign="center">
            <SpaceBetween size="xs">
              <Box color="text-status-inactive">{pattern.detail}</Box>
              <Button>Create resource</Button>
            </SpaceBetween>
          </Box>
        </Centered>
      );
    case 'error-page':
      return (
        <Centered>
          <Box textAlign="center">
            <SpaceBetween size="xs">
              {/*
               * Medium rather than bold: Box only offers normal, bold and heavy, so the weight comes from
               * the heading token, which is the medium weight of the theme.
               */}
              <div style={{ fontWeight: fontWeightHeadingM }}>{pattern.detail}</div>
              <Button>Create resource</Button>
            </SpaceBetween>
          </Box>
        </Centered>
      );
    // A collection whose filter survives leaving the page and coming back, so the preview shows the
    // filter applied and the rows it leaves behind.
    case 'filter':
      return (
        <Table
          variant="embedded"
          header={previewHeading(pattern)}
          filter={
            <TextFilter
              filteringText="production"
              filteringAriaLabel="Filter resources"
              countText="2 matches"
              onChange={noop}
            />
          }
          items={resources.slice(0, 2)}
          columnDefinitions={resourceColumns}
        />
      );
    // Filtering by property: the query is built from tokens, which is what the pattern is about, so the
    // preview shows the tokens and their operators rather than the collection under them.
    case 'property-filter':
      return (
        <Crop width={470}>
          <PropertyFilter
            query={{ operation: 'or', tokens: filterTokens }}
            filteringAriaLabel="Filter resources"
            filteringPlaceholder={pattern.detail}
            filteringProperties={filteringProperties}
            onChange={noop}
          />
        </Crop>
      );
    case 'saved-filters':
      return <SavedFilterSets detail={pattern.detail} />;
    case 'panels-diagram':
      return <SecondaryPanelsDiagram />;
    case 'iam-access':
      return <ServiceAccessForm detail={pattern.detail} />;
    // Choosing between an existing role and a new one, the decision the pattern is about.
    case 'iam-role-select':
      return (
        <FormField label="Service access">
          <RadioGroup
            value="new"
            onChange={noop}
            items={[
              { value: 'new', label: pattern.detail },
              { value: 'existing', label: 'Use an existing service role' },
            ]}
          />
        </FormField>
      );
    case 'image':
      return <ImageMagnifier />;
    case 'help-diagram':
      return <HelpSystemDiagram />;
    // Loading is page-level here rather than inside a collection, which is what the pattern covers: the
    // page says what it is fetching and nothing else is on it yet.
    case 'loading':
      return (
        <Centered>
          <StatusIndicator type="loading">{pattern.detail}</StatusIndicator>
        </Centered>
      );
    case 'navigation':
      return (
        <SideNavigation
          header={{ text: 'Service', href: '#' }}
          activeHref="#resources"
          items={[
            { type: 'link', text: 'Dashboard', href: '#dashboard' },
            { type: 'link', text: pattern.detail, href: '#resources' },
          ]}
        />
      );
    // The same composition as the TopNavigation component heroshot: the bar at the full width of the
    // frame, with the identity at its start and the utilities at its end.
    case 'top-navigation':
      return (
        <TopNavigation
          identity={{ title: 'Service', href: '#' }}
          utilities={[
            { type: 'button', iconName: 'notification', ariaLabel: 'Notifications' },
            { type: 'menu-dropdown', text: 'Account', items: [{ id: 'profile', text: 'Profile' }] },
          ]}
        />
      );
    // Deleting a low-risk item without a confirmation step: the action sits on the item itself and takes
    // effect on the first click. Cropped on the start edge so the remove actions lead the composition.
    case 'one-click-delete':
      return (
        <Crop width={470} offsetInlineStart={-145}>
          {/*
           * The rows are laid out directly rather than with AttributeEditor, which stacks its fields
           * one per row at this width and would lose the row-per-item shape the pattern is about.
           */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '150px 200px max-content',
              columnGap: spaceScaledS,
              rowGap: spaceScaledXs,
              alignItems: 'end',
              whiteSpace: 'nowrap',
            }}
          >
            <Box variant="awsui-key-label">Key</Box>
            <Box variant="awsui-key-label">Value</Box>
            <div />
            {recipients.map(recipient => (
              <React.Fragment key={recipient.key}>
                <Input value={recipient.key} onChange={noop} ariaLabel="Key" />
                <Input value={recipient.value} onChange={noop} ariaLabel="Value" />
                <Button>{pattern.detail}</Button>
              </React.Fragment>
            ))}
            <div>
              <Button>Add new item</Button>
            </div>
          </div>
        </Crop>
      );
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
    // Flat-rate plan tiers, the pricing model the pattern covers: a fixed recurring price per user at
    // each tier, which the customer upgrades or downgrades between.
    case 'plans':
      return (
        <Centered>
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
        </Centered>
      );
    case 'region-table':
      return (
        <Crop width={400}>
          <Table
            items={regions}
            columnDefinitions={[
              { id: 'region', header: 'Region', cell: item => item.name },
              { id: 'status', header: 'Status', cell: () => <StatusIndicator>Healthy</StatusIndicator> },
            ]}
          />
        </Crop>
      );
    case 'status':
      return (
        <Container header={previewHeading(pattern)}>
          <Toggle checked={true} onChange={noop}>
            {pattern.detail}
          </Toggle>
        </Container>
      );
    // Feedback collected on the page it is about, which is what the pattern is: a single question and
    // the two answers to it.
    case 'feedback-buttons':
      return (
        <Centered>
          <SpaceBetween size="s" alignItems="center">
            <Box variant="h3">{pattern.detail}</Box>
            <SpaceBetween size="xs" direction="horizontal">
              <Button iconName="thumbs-up">Yes</Button>
              <Button iconName="thumbs-down">No</Button>
            </SpaceBetween>
          </SpaceBetween>
        </Centered>
      );
    case 'tag-widget':
      return <TaggingWidget detail={pattern.detail} />;
    // No heading: the pattern is about reading a collection, and the rows carry that on their own.
    case 'table':
      return <Table variant="embedded" items={resources} columnDefinitions={linkedResourceColumns} />;
    // An absolute timestamp with its timezone and the user who caused the event, which is the form the
    // pattern recommends over a relative one.
    case 'timestamps':
      return (
        <Centered>
          <div>
            <Box variant="awsui-key-label">{pattern.detail}</Box>
            <div>
              January 31, 2023, 14:32 (UTC+3:30) by <Link href="#">plrs</Link>
            </div>
          </div>
        </Centered>
      );
    // Validation on submit: the field keeps the value that failed, and the error says what to do about
    // it. Cropped at the right edge so the field reads at the width it has on a real form.
    case 'validation':
      return (
        <Crop width={430}>
          <FormField
            label="Root object"
            description="Enter the URL of the object that you want service to return when a viewer requests the root URL."
            errorText={pattern.detail}
          >
            <Input value="project" invalid={true} onChange={noop} />
          </FormField>
        </Crop>
      );
    // A term flagged while the user types it, with the guidance that replaces it underneath. The flagged
    // value stands in for the terms the real validation covers, which this repository does not use.
    case 'language-validation':
      return (
        <Crop width={430}>
          <SpaceBetween size="s">
            <FormField label="Name" description="Specify a unique name for the group.">
              <Input value={pattern.detail} invalid={true} onChange={noop} />
            </FormField>
            <Alert type="warning">
              The term &ldquo;{pattern.detail}&rdquo; does not follow Amazon acceptable language guidelines. Replace it
              with a more inclusive alternative.
            </Alert>
          </SpaceBetween>
        </Crop>
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

// Kinds laid out from the top of the frame rather than centered in it. Content taller than the frame is
// already top-aligned by the frame itself, so this is for compositions that fit vertically but are
// cropped horizontally, or that hang a dropdown below a trigger and need the room underneath.
const TOP_ANCHORED_KINDS = new Set<PreviewKind>([
  'access-denied',
  'actions',
  'default-select',
  'density',
  'help-diagram',
  'iam-access',
  'image',
  'in-context',
  'inline-edit',
  'kms-select',
  'one-click-delete',
  'panels-diagram',
  'region-table',
  'saved-filters',
  'multiselect',
]);

// Kinds that only read as themselves above the frame width are laid out larger and scaled down.
// Both sizes keep the 346:170 frame ratio so that the scaled content fills the frame without letterboxing.
// Page-level layouts only read as themselves at a full viewport width, so they are laid out at one.
const PAGE_CONTENT_SIZE = { width: 800, height: 393 };

const CONTENT_SIZES: Partial<Record<PreviewKind, { width: number; height: number }>> = {
  wizard: PAGE_CONTENT_SIZE,
  // The modals render at viewport scale, so they get a viewport-sized layout of their own.
  command: PAGE_CONTENT_SIZE,
  'modal-details': PAGE_CONTENT_SIZE,
  's3-modal': PAGE_CONTENT_SIZE,
  // Two fields and the strength meter are a little taller than the frame at full size, so they are laid
  // out slightly larger and scaled down (~0.85) to fit whole instead of having the second field cropped.
  password: { width: 370, height: 163 },
  // The dashboard item is laid out wide enough for the chart labels to sit beside the chart. The ratio
  // follows its own padded box, which has no bottom inset (see `BLEED_BLOCK_END_KINDS`), so the chart
  // gets the full height down to the frame edge.
  'dashboard-item': { width: 470, height: 230 },
  // The container variant puts the search inside the table, which with the header row and the editable
  // rows is taller than the frame; laid out larger so the search and two rows stay in view.
  'tag-widget': { width: 460, height: 202 },
  // The drill-down popover needs the room for its per-account rows, which only fits beside the chart at
  // a wider layout.
  chart: { width: 440, height: 193 },
};

// Kinds that give up the frame's bottom inset to the content. The dashboard item is a chart that is
// cropped at the bottom anyway, so every pixel of height it gains shows more of the chart.
const BLEED_BLOCK_END_KINDS = new Set<PreviewKind>(['dashboard-item']);

// Kinds whose content bleeds to the frame edges and so supplies its own insets.
const PADDINGS: Partial<Record<PreviewKind, number>> = {
  wizard: 8,
  command: 0,
  'hero-header': 0,
  'modal-details': 0,
  's3-modal': 0,
  'top-navigation': 0,
};

interface Resource {
  name: string;
  status: string;
}

// Enough segments that the dashboard item's chart reads as a breakdown rather than as a single value.
const boardItemShares = [
  { title: 'Item A', value: 50 },
  { title: 'Item B', value: 30 },
  { title: 'Item C', value: 20 },
];

const resources: Resource[] = [
  { name: 'production-api', status: 'Running' },
  { name: 'staging-worker', status: 'Stopped' },
  { name: 'analytics-batch', status: 'Running' },
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

// Rows of a generic collection, for the previews that are about the actions around a table rather than
// about the data in it.
const cells = [{ id: 'first' }, { id: 'second' }, { id: 'third' }];

// The account the account-display preview names, from the pattern's own example.
const account = { id: '508979544374', email: 'developers-backend@example.com' };

const regions = [{ name: 'N. Virginia (us-east-1)' }, { name: 'Ireland (eu-west-1)' }, { name: 'Ohio (us-east-2)' }];

const tags = [
  { key: 'CostCenter', value: '102', policies: '1' },
  { key: 'Environment', value: 'prod', policies: '2' },
  { key: 'Owner', value: 'platform', policies: '1' },
];

const objects = [
  { name: 'BKASRBK1', type: '1A', size: '1.2 MB', editing: false },
  { name: 'BPGGJENK', type: '3A', size: '2.3 MB', editing: true },
  { name: 'CAIISYXF2', type: '2B', size: '1.6 MB', editing: false },
];

const buckets = [
  { name: 'bucket-fuglat', created: 'December 27, 2019' },
  { name: 'bucket-ut', created: 'July 06, 2019' },
  { name: 'bucket-veniam', created: 'June 13, 2019' },
];

const recipients = [
  { key: 'owner', value: 'abcd@amazon.com' },
  { key: 'operator', value: 'efgh@amazon.com' },
];

// The same KMS key under a few aliases, as the real selection lists them: the key ID with the alias it
// is reachable by underneath.
const kmsKeys = [
  { value: '6b22f61b-68f3-417b-b8f2-aaa29112d9a0', description: 'alias-1' },
  { value: '6b22f61b-68f3-417b-b8f2-aaa29112d9a1', description: 'alias-2' },
  { value: '6b22f61b-68f3-417b-b8f2-aaa29112d9a2', description: 'alias-3' },
];

const filteringProperties = [
  { key: 'state', propertyLabel: 'State', groupValuesLabel: 'State values', operators: ['=', '!='] },
  { key: 'type', propertyLabel: 'Type', groupValuesLabel: 'Type values', operators: ['=', '!='] },
  { key: 'status', propertyLabel: 'Status', groupValuesLabel: 'Status values', operators: ['=', '!='] },
];

// Two tokens: enough for the operator between them to show, which is what the pattern is about, without
// filling the frame with chips.
const filterTokens = [
  { propertyKey: 'state', operator: '=', value: 'Running' },
  { propertyKey: 'type', operator: '=', value: 't3' },
];
