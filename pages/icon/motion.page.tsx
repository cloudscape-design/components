// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useContext, useState } from 'react';

import ActionCard from '~components/action-card';
import Alert from '~components/alert';
import Badge from '~components/badge';
import Box from '~components/box';
import BreadcrumbGroup from '~components/breadcrumb-group';
import Button from '~components/button';
import ButtonDropdown from '~components/button-dropdown';
import Checkbox from '~components/checkbox';
import CollectionPreferences from '~components/collection-preferences';
import Container from '~components/container';
import CopyToClipboard from '~components/copy-to-clipboard';
import DatePicker from '~components/date-picker';
import ExpandableSection from '~components/expandable-section';
import FileInput from '~components/file-input';
import Flashbar from '~components/flashbar';
import Form from '~components/form';
import FormField from '~components/form-field';
import Header from '~components/header';
import Icon from '~components/icon';
import IconProvider from '~components/icon-provider';
import Input from '~components/input';
import Link from '~components/link';
import Modal from '~components/modal';
import Pagination from '~components/pagination';
import Select, { SelectProps } from '~components/select';
import SpaceBetween from '~components/space-between';
import StatusIndicator from '~components/status-indicator';
import Table, { TableProps } from '~components/table';
import Tabs from '~components/tabs';
import TokenGroup from '~components/token-group';
import TopNavigation from '~components/top-navigation';
import TreeView from '~components/tree-view';

import AppContext, { Theme } from '../app/app-context';

import styles from './motion.scss';

/**
 * Icon hover motion, shown entirely in component context.
 *
 * Every icon here sits inside the real component it ships in, because the mechanism
 * depends on the region being an interactive ANCESTOR — a bare icon would prove nothing.
 *
 * Sections carry their verdict from the regions doc. `bespoke` marks an icon with its own
 * entry in `$icon-hover-motion`; everything else gets the shared default hover motion (a subtle
 * scale), which is what most armed regions actually receive today.
 */

type Verdict = 'yes' | 'yes-1b' | 'no';

const VERDICT: Record<Verdict, { label: string; color: 'green' | 'blue' | 'red' }> = {
  yes: { label: 'Yes', color: 'green' },
  'yes-1b': { label: 'Yes (1B)', color: 'blue' },
  no: { label: 'No', color: 'red' },
};

function Section({
  verdict,
  title,
  why,
  children,
}: {
  verdict: Verdict;
  title: string;
  why: string;
  children: React.ReactNode;
}) {
  const v = VERDICT[verdict];
  return (
    <div className={styles.section}>
      <Header variant="h2" description={why} info={<Badge color={v.color}>{v.label}</Badge>}>
        {title}
      </Header>
      <div className={styles.body}>{children}</div>
    </div>
  );
}

/**
 * A realistic page fragment.
 *
 * The per-region sections below prove the mechanism fires. A composition is for judging how
 * it FEELS: whether several animated icons in one header read as busy, and whether motion on
 * one icon next to a decorative one reads as deliberate. Annotated with the question it is
 * meant to answer rather than a verdict per icon, which at this density would just be noise.
 */
function Composition({
  title,
  question,
  flush,
  children,
}: {
  title: string;
  question: string;
  flush?: boolean;
  children: React.ReactNode;
}) {
  return (
    <Container
      disableContentPaddings={flush}
      header={
        <Box fontSize="body-s">
          <strong>{title}</strong>{' '}
          <Box variant="span" color="text-body-secondary" fontSize="body-s">
            — {question}
          </Box>
        </Box>
      }
    >
      {children}
    </Container>
  );
}

/** One demo cell: the component itself, plus which icon it exercises. */
function Case({
  label,
  icon,
  bespoke,
  children,
}: {
  label: string;
  icon: string;
  bespoke?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className={styles.case}>
      <div className={styles.control}>{children}</div>
      <div className={styles.meta}>
        <div className={styles.label}>{label}</div>
        <div className={styles.icon}>
          <code>{icon}</code>
          {bespoke ? (
            <span className={styles.bespoke}> bespoke</span>
          ) : (
            <span className={styles.generic}> default</span>
          )}
        </div>
      </div>
    </div>
  );
}

// A builder's own SVG. It has not opted in via `data-awsui-icon-animated`, so it can never match a
// motion selector even though the wrapper still carries `.name-settings`.
const builderSvg = (
  <svg viewBox="0 0 16 16" focusable="false" aria-hidden="true">
    <circle cx="8" cy="8" r="5" />
    <path d="M8 5v6" />
  </svg>
);

interface Row {
  name: string;
  type: string;
  children?: Row[];
}

const ROWS: Row[] = [
  { name: 'alpha', type: 'Distribution', children: [{ name: 'alpha-1', type: 'Origin' }] },
  { name: 'beta', type: 'Distribution', children: [{ name: 'beta-1', type: 'Origin' }] },
  { name: 'gamma', type: 'Distribution' },
];

interface TreeItem {
  id: string;
  content: string;
  children?: TreeItem[];
}

const TREE_ITEMS: TreeItem[] = [
  {
    id: '1',
    content: 'Buckets',
    children: [
      { id: '1.1', content: 'logs' },
      { id: '1.2', content: 'assets' },
    ],
  },
  { id: '2', content: 'Functions', children: [{ id: '2.1', content: 'resize' }] },
];

interface Distribution {
  id: string;
  name: string;
  state: string;
  origin: string;
  children?: Distribution[];
}

// Long enough that the pointer can be swept down the whole column, which is the actual
// 1B question: many armed icons entering and leaving hover in one gesture.
const DISTRIBUTIONS: Distribution[] = Array.from({ length: 14 }, (_, i) => ({
  id: `d${i}`,
  name: `E2QWRUHAPOMQZ${String(i).padStart(2, '0')}`,
  state: i % 4 === 0 ? 'Deploying' : i % 5 === 0 ? 'Error' : 'Enabled',
  origin: `origin-${i % 3}.example.com`,
  children:
    i % 6 === 0 ? [{ id: `d${i}-a`, name: `behaviour-${i}`, state: 'Enabled', origin: 'default (*)' }] : undefined,
}));

export default function IconMotionPage() {
  const { urlParams, setUrlParams } = useContext(AppContext);
  const oneTheme = urlParams.theme === Theme.OneTheme;
  const rtl = urlParams.direction === 'rtl';

  const [modalVisible, setModalVisible] = useState(false);
  const [page, setPage] = useState(2);
  const [date, setDate] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [selected, setSelected] = useState<SelectProps.Option>({ label: 'Option 1', value: '1' });
  const [expandedRows, setExpandedRows] = useState<Row[]>([]);
  const [expandedTree, setExpandedTree] = useState<string[]>(['1']);
  const [tokens, setTokens] = useState([{ label: 'us-east-1' }, { label: 'eu-west-1' }, { label: 'ap-south-1' }]);
  const [cellValue, setCellValue] = useState<Record<string, string>>({});

  const [tabs, setTabs] = useState(['general', 'origins', 'behaviours', 'errorPages', 'invalidations']);
  const [activeTab, setActiveTab] = useState('general');
  const [sortingColumn, setSortingColumn] = useState<TableProps.SortingColumn<Distribution>>({ sortingField: 'name' });
  const [sortingDescending, setSortingDescending] = useState(false);
  const [expandedDistributions, setExpandedDistributions] = useState<Distribution[]>([]);
  const [distributionEdits, setDistributionEdits] = useState<Record<string, string>>({});
  const [flashItems, setFlashItems] = useState(['deploying', 'error', 'done']);

  function toggleDirection() {
    const next = rtl ? 'ltr' : 'rtl';
    // The app only reads `direction` at startup, so set the attribute directly too.
    document.documentElement.setAttribute('dir', next);
    setUrlParams({ direction: next });
  }

  const distributionColumns: TableProps.ColumnDefinition<Distribution>[] = [
    {
      id: 'name',
      header: 'Distribution ID',
      sortingField: 'name',
      cell: item => distributionEdits[item.id] ?? item.name,
      editConfig: {
        ariaLabel: 'Distribution ID',
        editIconAriaLabel: 'editable',
        errorIconAriaLabel: 'Distribution ID error',
        editingCell: (item, { currentValue, setValue }: TableProps.CellContext<string>) => (
          <Input autoFocus={true} value={currentValue ?? item.name} onChange={event => setValue(event.detail.value)} />
        ),
      },
    },
    {
      id: 'state',
      header: 'State',
      sortingField: 'state',
      // A StatusIndicator icon is decorative: it reports state rather than offering an
      // action, so it must stay still even though it sits in an armed row.
      cell: item => (
        <StatusIndicator type={item.state === 'Enabled' ? 'success' : item.state === 'Error' ? 'error' : 'in-progress'}>
          {item.state}
        </StatusIndicator>
      ),
    },
    { id: 'origin', header: 'Origin', sortingField: 'origin', cell: item => item.origin },
    {
      id: 'actions',
      header: '',
      cell: item => (
        <ButtonDropdown
          variant="icon"
          ariaLabel={`Actions for ${item.name}`}
          items={[
            { id: 'edit', text: 'Edit' },
            { id: 'disable', text: 'Disable' },
            { id: 'delete', text: 'Delete' },
          ]}
        />
      ),
    },
  ];

  const editableColumns: TableProps.ColumnDefinition<Row>[] = [
    {
      id: 'name',
      header: 'Name',
      cell: item => cellValue[item.name] ?? item.name,
      editConfig: {
        ariaLabel: 'Name',
        editIconAriaLabel: 'editable',
        errorIconAriaLabel: 'Name error',
        editingCell: (item, { currentValue, setValue }: TableProps.CellContext<string>) => (
          <Input autoFocus={true} value={currentValue ?? item.name} onChange={event => setValue(event.detail.value)} />
        ),
      },
    },
    {
      id: 'type',
      header: 'Type',
      cell: item => item.type,
      editConfig: {
        ariaLabel: 'Type',
        editIconAriaLabel: 'editable',
        errorIconAriaLabel: 'Type error',
        editingCell: (item, { currentValue, setValue }: TableProps.CellContext<string>) => (
          <Input autoFocus={true} value={currentValue ?? item.type} onChange={event => setValue(event.detail.value)} />
        ),
      },
    },
  ];

  return (
    <Box margin="l">
      <SpaceBetween size="xl">
        <div>
          <Header
            variant="h1"
            description="Hover or keyboard-focus a control to play its icon micro-interaction. CSS only, no JavaScript, hover and focus-visible only — no click or press state."
          >
            Icon hover motion — in component context
          </Header>
          <Box color="text-body-secondary" fontSize="body-s">
            Every icon below is inside the component it actually ships in. The mechanism needs the region to be an
            interactive ancestor, so a bare icon would demonstrate nothing.
          </Box>
        </div>

        <SpaceBetween size="xs">
          <Checkbox
            checked={oneTheme}
            onChange={({ detail }) => setUrlParams({ theme: detail.checked ? Theme.OneTheme : Theme.Default })}
          >
            One Theme (<code>.awsui-one-theme</code>) — motion only applies when this is on
          </Checkbox>
          <Checkbox
            checked={urlParams.motionDisabled}
            onChange={({ detail }) => setUrlParams({ motionDisabled: detail.checked })}
          >
            Motion disabled (<code>.awsui-motion-disabled</code>) — must suppress everything below
          </Checkbox>
          <Checkbox checked={rtl} onChange={toggleDirection}>
            RTL — 18 icons are mirrored, so directional motion reverses. Scale and opacity survive it; translate does
            not.
          </Checkbox>
          <Box color="text-body-secondary" fontSize="body-s">
            Requires the dev server to run with <code>INCLUDE_ONE_THEME=true</code>; without it the motion CSS is not
            emitted at all.
          </Box>
        </SpaceBetween>

        <div>
          <Header
            variant="h2"
            description="Plausible Console page fragments. The reference sections further down prove the mechanism fires; these are for judging whether it feels deliberate at realistic density."
          >
            Realistic compositions
          </Header>
        </div>

        <SpaceBetween size="l">
          <Composition
            title="Tabs with a per-tab action"
            question="tab dismiss icons, scroll arrows and a dropdown caret land in one header. Does it feel busy?"
          >
            <div className={styles.narrow}>
              <Tabs
                activeTabId={activeTab}
                onChange={({ detail }) => setActiveTab(detail.activeTabId)}
                actions={
                  <ButtonDropdown
                    variant="icon"
                    ariaLabel="Tab list actions"
                    items={[
                      { id: 'add', text: 'Add tab' },
                      { id: 'closeAll', text: 'Close all' },
                    ]}
                  />
                }
                tabs={tabs.map(id => ({
                  id,
                  label: id === 'errorPages' ? 'Error pages' : id[0].toUpperCase() + id.slice(1),
                  dismissible: true,
                  dismissLabel: `Close ${id}`,
                  onDismiss: () => setTabs(current => current.filter(t => t !== id)),
                  action: (
                    <ButtonDropdown
                      variant="icon"
                      ariaLabel={`Actions for ${id}`}
                      items={[
                        { id: 'duplicate', text: 'Duplicate' },
                        { id: 'rename', text: 'Rename' },
                      ]}
                    />
                  ),
                  content: 'Narrow on purpose, so the tab strip overflows and the scroll arrows appear.',
                }))}
              />
            </div>
          </Composition>

          <Composition
            title="Table page — header actions over a sweepable list"
            question="the densest realistic case. Sweep the pointer down the actions column: does a run of firing icons read as feedback or as flicker?"
          >
            <Table
              variant="embedded"
              columnDefinitions={distributionColumns}
              items={DISTRIBUTIONS}
              sortingColumn={sortingColumn}
              sortingDescending={sortingDescending}
              onSortingChange={({ detail }) => {
                setSortingColumn(detail.sortingColumn);
                setSortingDescending(detail.isDescending ?? false);
              }}
              expandableRows={{
                getItemChildren: item => item.children ?? [],
                isItemExpandable: item => Boolean(item.children),
                expandedItems: expandedDistributions,
                onExpandableItemToggle: ({ detail }) =>
                  setExpandedDistributions(current =>
                    detail.expanded
                      ? [...current, detail.item]
                      : current.filter(candidate => candidate.id !== detail.item.id)
                  ),
              }}
              submitEdit={(item, _column, newValue) => {
                setDistributionEdits(current => ({ ...current, [item.id]: String(newValue) }));
              }}
              header={
                <Header
                  variant="h2"
                  counter={`(${DISTRIBUTIONS.length})`}
                  description="Sortable columns, an inline-editable first column, expandable rows and three header affordances."
                  actions={
                    <SpaceBetween direction="horizontal" size="xs">
                      <Button iconName="refresh" ariaLabel="Refresh distributions" />
                      <ButtonDropdown
                        items={[
                          { id: 'disable', text: 'Disable' },
                          { id: 'delete', text: 'Delete' },
                        ]}
                      >
                        Actions
                      </ButtonDropdown>
                      <CollectionPreferences
                        title="Preferences"
                        confirmLabel="Confirm"
                        cancelLabel="Cancel"
                        onConfirm={() => {}}
                        preferences={{ pageSize: 20 }}
                        pageSizePreference={{
                          title: 'Page size',
                          options: [
                            { value: 20, label: '20' },
                            { value: 50, label: '50' },
                          ],
                        }}
                      />
                      <Button variant="primary">Create distribution</Button>
                    </SpaceBetween>
                  }
                >
                  Distributions
                </Header>
              }
              pagination={
                <Pagination
                  currentPageIndex={page}
                  pagesCount={5}
                  onChange={({ detail }) => setPage(detail.currentPageIndex)}
                />
              }
            />
          </Composition>

          <Composition
            title="Form — animated and decorative icons side by side"
            question="error icons must stay still while the controls beside them animate. Does the discrimination read as intentional, or as an inconsistency?"
          >
            <Form
              actions={
                <SpaceBetween direction="horizontal" size="xs">
                  <Button>Cancel</Button>
                  <Button variant="primary" iconName="upload" iconAlign="right">
                    Upload and deploy
                  </Button>
                </SpaceBetween>
              }
            >
              <SpaceBetween size="l">
                <FormField
                  label="Origin domain"
                  errorText="Enter a valid domain name."
                  description="The error icon here is decorative — it reports state, so it must not animate."
                >
                  <Input value="" onChange={() => {}} placeholder="example.com" />
                </FormField>
                <FormField label="Certificate" errorText="Select a certificate.">
                  <Select
                    selectedOption={selected}
                    onChange={({ detail }) => setSelected(detail.selectedOption)}
                    options={[
                      { label: 'Option 1', value: '1' },
                      { label: 'Option 2', value: '2' },
                    ]}
                  />
                </FormField>
                <FormField label="Valid from" description="The calendar trigger is an affordance — it animates.">
                  <DatePicker
                    value={date}
                    onChange={({ detail }) => setDate(detail.value)}
                    openCalendarAriaLabel={() => 'Choose date'}
                    placeholder="YYYY/MM/DD"
                  />
                </FormField>
                <FormField label="Function bundle">
                  <FileInput multiple={true} value={files} onChange={event => setFiles(event.detail.value)}>
                    Choose files
                  </FileInput>
                </FormField>
                <FormField label="Edge locations">
                  <TokenGroup
                    items={tokens}
                    onDismiss={({ detail }) =>
                      setTokens(current => current.filter((_, index) => index !== detail.itemIndex))
                    }
                  />
                </FormField>
              </SpaceBetween>
            </Form>
          </Composition>

          <Composition
            title="Notification stack — status icon and dismiss in one surface"
            question="the sharpest affordance test: a still status icon and an animating dismiss icon sit inches apart inside the same flash."
          >
            <SpaceBetween size="s">
              <Flashbar
                items={flashItems.map(id => ({
                  id,
                  type: id === 'error' ? ('error' as const) : id === 'done' ? ('success' as const) : ('info' as const),
                  loading: id === 'deploying',
                  dismissible: true,
                  dismissLabel: 'Dismiss',
                  onDismiss: () => setFlashItems(current => current.filter(candidate => candidate !== id)),
                  header:
                    id === 'error'
                      ? 'Deployment failed'
                      : id === 'done'
                        ? 'Distribution deployed'
                        : 'Deployment in progress',
                  content:
                    id === 'error' ? (
                      <>
                        The origin rejected the request.{' '}
                        <Link external={true} href="#">
                          Troubleshooting guide
                        </Link>
                      </>
                    ) : (
                      'Status icon on the left reports state. Dismiss on the right is the affordance.'
                    ),
                }))}
              />
              <Alert
                type="warning"
                dismissible={true}
                header="Certificate expires in 14 days"
                action={<Button iconName="external">Renew</Button>}
              >
                Three icons in one surface: the warning status icon, the external-link icon in the action, and dismiss.
              </Alert>
            </SpaceBetween>
          </Composition>

          <Composition
            title="Chrome — top navigation and breadcrumbs above content"
            question="does motion in chrome feel different from motion in content, when both are on screen at once?"
            flush={true}
          >
            <TopNavigation
              identity={{ href: '#', title: 'Console' }}
              utilities={[
                { type: 'button', iconName: 'notification', ariaLabel: 'Notifications', title: 'Notifications' },
                { type: 'button', iconName: 'settings', ariaLabel: 'Settings', title: 'Settings' },
                { type: 'button', iconName: 'external', text: 'Documentation', href: '#', external: true },
                { type: 'menu-dropdown', text: 'schomax', items: [{ id: 'signout', text: 'Sign out' }] },
              ]}
              i18nStrings={{ overflowMenuTriggerText: 'More', overflowMenuTitleText: 'All' }}
            />
            <div className={styles['chrome-content']}>
              <SpaceBetween size="m">
                <BreadcrumbGroup
                  items={[
                    { text: 'CloudFront', href: '#' },
                    { text: 'Distributions', href: '#' },
                    { text: 'E2QWRUHAPOMQZ01', href: '#' },
                  ]}
                />
                <Header
                  variant="h1"
                  actions={
                    <SpaceBetween direction="horizontal" size="xs">
                      <Button iconName="refresh" ariaLabel="Refresh" />
                      <Button iconName="copy" ariaLabel="Copy ARN" />
                      <Button variant="primary">Edit</Button>
                    </SpaceBetween>
                  }
                >
                  E2QWRUHAPOMQZ01
                </Header>
                <ExpandableSection headerText="Details" defaultExpanded={true}>
                  Content-level affordances are here; chrome-level ones are in the bar above.
                </ExpandableSection>
              </SpaceBetween>
            </div>
          </Composition>
        </SpaceBetween>

        <div>
          <Header variant="h2" description="Reference: one region per section, with the verdict from the regions doc.">
            By region
          </Header>
        </div>

        <Section
          verdict="yes"
          title="Armed, single-instance"
          why="One clear affordance per view. The icon is the control, hovering it is intentional, and there is nothing nearby to compete with."
        >
          <div className={styles.grid}>
            <Case label="CollectionPreferences trigger" icon="settings" bespoke={true}>
              <CollectionPreferences
                title="Preferences"
                confirmLabel="Confirm"
                cancelLabel="Cancel"
                onConfirm={() => {}}
                preferences={{ pageSize: 10 }}
                pageSizePreference={{
                  title: 'Page size',
                  options: [
                    { value: 10, label: '10' },
                    { value: 20, label: '20' },
                  ],
                }}
              />
            </Case>
            <Case label="Reload / error recovery" icon="refresh" bespoke={true}>
              <Button iconName="refresh" ariaLabel="Reload" />
            </Case>
            <Case label="CopyToClipboard" icon="copy" bespoke={true}>
              <CopyToClipboard
                copyButtonAriaLabel="Copy ARN"
                copyErrorText="Failed to copy"
                copySuccessText="Copied"
                textToCopy="arn:aws:s3:::example"
                variant="icon"
              />
            </Case>
            <Case label="Editor toolbar — undo" icon="undo" bespoke={true}>
              <Button variant="icon" iconName="undo" ariaLabel="Undo" />
            </Case>
            <Case label="Editor toolbar — redo" icon="redo" bespoke={true}>
              <Button variant="icon" iconName="redo" ariaLabel="Redo" />
            </Case>
            <Case label="Favourite toggle" icon="heart" bespoke={true}>
              <Button variant="icon" iconName="heart" ariaLabel="Favourite" />
            </Case>
            <Case label="Alert dismiss" icon="close">
              <Alert dismissible={true} type="info" header="Deployment queued">
                Dismiss me.
              </Alert>
            </Case>
            <Case label="Modal dismiss" icon="close">
              <>
                <Button onClick={() => setModalVisible(true)}>Open modal</Button>
                <Modal
                  visible={modalVisible}
                  onDismiss={() => setModalVisible(false)}
                  header="Modal with a dismiss affordance"
                >
                  Hover the dismiss icon in the header.
                </Modal>
              </>
            </Case>
            <Case label="FileInput" icon="upload">
              <FileInput multiple={true} value={files} onChange={event => setFiles(event.detail.value)}>
                Choose files
              </FileInput>
            </Case>
            <Case label="DatePicker" icon="calendar">
              <DatePicker
                value={date}
                onChange={({ detail }) => setDate(detail.value)}
                openCalendarAriaLabel={() => 'Choose date'}
                placeholder="YYYY/MM/DD"
              />
            </Case>
            <Case label="Pagination prev / next" icon="angle-left, angle-right">
              <Pagination
                currentPageIndex={page}
                pagesCount={5}
                onChange={({ detail }) => setPage(detail.currentPageIndex)}
              />
            </Case>
            <Case label="Tabs scroll arrows (overflowing)" icon="angle-left, angle-right">
              <div className={styles.narrow}>
                <Tabs
                  tabs={Array.from({ length: 10 }, (_, i) => ({
                    id: `t${i}`,
                    label: `Tab number ${i + 1}`,
                    content: i === 0 ? 'Narrow container forces the scroll arrows to appear.' : `Content ${i + 1}`,
                  }))}
                />
              </div>
            </Case>
          </div>
        </Section>

        <Section
          verdict="yes"
          title="Non-interactive container — explicit opt-in, no interactive ancestor at all"
          why='The reason the region became an explicit attribute rather than an implicit tag/role list: a plain, non-interactive div has no button/anchor/role="button" semantics to match, so the old mechanism could never reach it. It still legitimately owns hover state (e.g. an action-card-style summary tile), so it now opts in directly with `data-awsui-motion-trigger="hover"` — the value names the trigger, so a future press trigger can add its own token without a second attribute.'
        >
          <div className={styles.grid}>
            <Case label="Action-card-style tile (plain div, no button/anchor/role)" icon="heart" bespoke={true}>
              <div className={styles['action-card']} data-awsui-motion-trigger="hover">
                <Icon name="heart" size="big" />
                <div>
                  <Box variant="awsui-key-label">Favourites</Box>
                  <Box variant="small" color="text-body-secondary">
                    Hover anywhere on this tile — there is no button, anchor, or role=&quot;button&quot; here.
                  </Box>
                </div>
              </div>
            </Case>
          </div>
        </Section>

        <Section
          verdict="yes"
          title="ActionCard — the real component: target vs. consumer slot"
          why="ActionCard is why target scope exists as an axis independent from the region: its own `icon` slot and its `header`/`description`/`children` slots sit under the same tagged `.root`, with no ancestor that separates them. Only `icon` carries `data-awsui-motion-target`, so hovering the card or focusing its header button animates the heart — a consumer's own `Icon` in `description`, and the `Link` in `children`, never move no matter how you hover or tab through them."
        >
          <div className={styles.grid}>
            <Case label="Own icon slot animates; consumer icon + link stay still" icon="heart" bespoke={true}>
              <ActionCard
                header="Storage bucket"
                icon={<Icon name="heart" />}
                description={
                  <>
                    <Icon name="status-info" /> Consumer icon in `description` — stays still.
                  </>
                }
              >
                Hover the card, or Tab to the header button: the heart animates. Tab again to{' '}
                <Link href="#">this link</Link> — the heart stays still, because the link owns its own focus, not the
                card&apos;s.
              </ActionCard>
            </Case>
          </div>
        </Section>

        <Section
          verdict="yes"
          title="Rotating carets — hover and click compose"
          why="The caret already rotates on open via a transform on the OUTER icon span. Hover motion targets the INNER svg, so the two compose instead of fighting. Open and close each of these while hovering: the rotation must still happen. Scale-based motion only here — a translate would fight the rotation."
        >
          <div className={styles.grid}>
            <Case label="ExpandableSection" icon="angle-down / caret-down-filled">
              <ExpandableSection headerText="Advanced settings">Hover the caret, then click it.</ExpandableSection>
            </Case>
            <Case label="ButtonDropdown trigger" icon="angle-down / caret-down-filled">
              <ButtonDropdown
                items={[
                  { id: '1', text: 'Delete' },
                  { id: '2', text: 'Duplicate' },
                ]}
              >
                Actions
              </ButtonDropdown>
            </Case>
            <Case label="Select trigger" icon="caret-down-filled">
              <Select
                selectedOption={selected}
                onChange={({ detail }) => setSelected(detail.selectedOption)}
                options={[
                  { label: 'Option 1', value: '1' },
                  { label: 'Option 2', value: '2' },
                ]}
              />
            </Case>
            <Case label="Table expandable row toggle" icon="caret-down-filled">
              <Table
                variant="embedded"
                columnDefinitions={[
                  { id: 'name', header: 'Name', cell: item => item.name },
                  { id: 'type', header: 'Type', cell: item => item.type },
                ]}
                items={ROWS}
                expandableRows={{
                  getItemChildren: item => item.children ?? [],
                  isItemExpandable: item => !!item.children,
                  expandedItems: expandedRows,
                  onExpandableItemToggle: ({ detail }) =>
                    setExpandedRows(prev =>
                      detail.expanded ? [...prev, detail.item] : prev.filter(i => i.name !== detail.item.name)
                    ),
                }}
              />
            </Case>
            <Case label="TreeView expand toggle" icon="caret-down-filled">
              <TreeView
                ariaLabel="Resources"
                items={TREE_ITEMS}
                renderItem={item => ({ content: item.content })}
                getItemId={item => item.id}
                getItemChildren={item => item.children}
                expandedItems={expandedTree}
                onItemToggle={({ detail }) =>
                  setExpandedTree(prev =>
                    detail.expanded ? [...prev, detail.item.id] : prev.filter(id => id !== detail.item.id)
                  )
                }
                i18nStrings={{ expandButtonLabel: () => 'Expand', collapseButtonLabel: () => 'Collapse' }}
              />
            </Case>
          </div>
        </Section>

        <Section
          verdict="yes-1b"
          title="Dense contexts — flagged for 1B testing"
          why="Many armed icons within a small area. Sweep the pointer down each of these: the question is whether it reads as responsive or as noise. This section is the point of the 1B study, not a decision already made."
        >
          <SpaceBetween size="l">
            <div>
              <Box variant="awsui-key-label">Table with a per-cell edit affordance — the densest armed case</Box>
              <Table
                variant="embedded"
                columnDefinitions={editableColumns}
                items={ROWS}
                submitEdit={(item, column, newValue) => {
                  void column;
                  setCellValue(prev => ({ ...prev, [item.name]: String(newValue) }));
                }}
                ariaLabels={{
                  activateEditLabel: column => `Edit ${column.header}`,
                  cancelEditLabel: () => 'Cancel',
                  submitEditLabel: () => 'Submit',
                }}
              />
            </div>
            <div>
              <Box variant="awsui-key-label">A list of external links</Box>
              <SpaceBetween size="xxs">
                {['Pricing', 'Quotas', 'Regions', 'Security', 'SLA'].map(label => (
                  <Link key={label} external={true} href="#" onFollow={event => event.preventDefault()}>
                    {label}
                  </Link>
                ))}
              </SpaceBetween>
            </div>
            <div>
              <Box variant="awsui-key-label">TokenGroup — a dismiss affordance per token</Box>
              <TokenGroup
                items={tokens}
                onDismiss={({ detail }) => setTokens(prev => prev.filter((_, i) => i !== detail.itemIndex))}
              />
            </div>
            <div>
              <Box variant="awsui-key-label">Flashbar with several dismissible items</Box>
              <Flashbar
                items={[
                  { id: '1', type: 'success', header: 'Stack created', dismissible: true, onDismiss: () => {} },
                  { id: '2', type: 'warning', header: 'Quota nearly reached', dismissible: true, onDismiss: () => {} },
                  { id: '3', type: 'error', header: 'Deployment failed', dismissible: true, onDismiss: () => {} },
                ]}
              />
            </div>
          </SpaceBetween>
        </Section>

        <Section
          verdict="no"
          title="Must NOT animate — not opted in"
          why="All three carry .name-settings, because the class reflects the name that was ASKED FOR, not what rendered. Only the built-in one may move: the others render a builder's SVG, which has not opted in via data-awsui-icon-animated. The absence of motion here is the design working."
        >
          <div className={styles.grid}>
            <Case label="Built-in icon — animates" icon="settings" bespoke={true}>
              <Button variant="icon" iconName="settings" ariaLabel="Built-in settings" />
            </Case>
            <Case label="Same Button, iconSvg override" icon="settings (name only)">
              <Button iconName="settings" iconSvg={builderSvg} ariaLabel="iconName plus iconSvg" />
            </Case>
            <Case label="Same Button, IconProvider override" icon="settings (name only)">
              <IconProvider icons={{ settings: builderSvg }}>
                <Button variant="icon" iconName="settings" ariaLabel="IconProvider override" />
              </IconProvider>
            </Case>
          </div>
        </Section>

        <Section
          verdict="no"
          title="Must NOT animate — disabled"
          why="A disabled control must not react to hover. :hover DOES match a disabled element, so this needs an explicit guard: :not(:disabled):not([aria-disabled='true']). The disabledReason case is the one that was broken — it stays a LIVE button so its tooltip works, and is caught only by the aria-disabled clause."
        >
          <div className={styles.grid}>
            <Case label="Disabled Button (native disabled)" icon="settings">
              <Button variant="icon" iconName="settings" ariaLabel="Disabled" disabled={true} />
            </Case>
            <Case label="Button with disabledReason (aria-disabled on a live button)" icon="settings">
              <Button
                iconName="settings"
                ariaLabel="Disabled with reason"
                disabled={true}
                disabledReason="You do not have permission"
              />
            </Case>
            <Case label="Disabled Pagination" icon="angle-left, angle-right">
              <Pagination currentPageIndex={1} pagesCount={5} disabled={true} onChange={() => {}} />
            </Case>
          </div>
        </Section>

        <Section
          verdict="no"
          title="Must NOT animate — not an affordance"
          why="These icons convey state, not an action. Nothing is hoverable about them, there is no interactive ancestor, and animating them would suggest a control that is not there."
        >
          <div className={styles.grid}>
            <Case label="StatusIndicator" icon="status-positive (not in map)">
              <SpaceBetween size="xxs">
                <StatusIndicator type="success">Available</StatusIndicator>
                <StatusIndicator type="warning">Degraded</StatusIndicator>
                <StatusIndicator type="error">Unavailable</StatusIndicator>
              </SpaceBetween>
            </Case>
            <Case label="FormField with errorText" icon="status-warning (not in map)">
              <FormField label="Bucket name" errorText="Name is already taken">
                <Input value="my-bucket" onChange={() => {}} />
              </FormField>
            </Case>
            <Case label="Alert status icon" icon="status-warning (not in map)">
              <Alert type="warning" header="Approaching quota">
                The status icon is not an affordance.
              </Alert>
            </Case>
          </div>
        </Section>
      </SpaceBetween>
    </Box>
  );
}
