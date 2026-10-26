// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import {
  ActionCard,
  Alert,
  AnchorNavigation,
  AnnotationContext,
  AppLayout,
  AppLayoutToolbar,
  AreaChart,
  AttributeEditor,
  Autosuggest,
  Badge,
  BarChart,
  Box,
  BreadcrumbGroup,
  Button,
  ButtonDropdown,
  ButtonGroup,
  Calendar,
  Cards,
  Checkbox,
  CodeEditor,
  CollectionPreferences,
  ColumnLayout,
  Container,
  ContentLayout,
  CopyToClipboard,
  DateInput,
  DatePicker,
  DateRangePicker,
  Dialog,
  Divider,
  Drawer,
  ExpandableSection,
  FileDropzone,
  FileInput,
  FileTokenGroup,
  FileUpload,
  Flashbar,
  Form,
  FormField,
  Grid,
  Header,
  HelpPanel,
  Hotspot,
  Icon,
  IconProvider,
  Input,
  ItemCard,
  KeyValuePairs,
  LineChart,
  Link,
  List,
  LiveRegion,
  MixedLineBarChart,
  Modal,
  Multiselect,
  NavigableGroup,
  Pagination,
  PanelLayout,
  PieChart,
  Popover,
  ProgressBar,
  PromptInput,
  PropertyFilter,
  RadioButton,
  RadioGroup,
  S3ResourceSelector,
  SegmentedControl,
  Select,
  SideNavigation,
  Skeleton,
  Slider,
  SpaceBetween,
  Spinner,
  SplitPanel,
  StatusIndicator,
  Steps,
  Table,
  Tabs,
  TagEditor,
  Textarea,
  TextContent,
  TextFilter,
  Tiles,
  TimeInput,
  Toggle,
  ToggleButton,
  Token,
  TokenGroup,
  TopNavigation,
  TreeView,
  TruncatedText,
  TutorialPanel,
  Wizard,
} from '~components';
import Dropdown from '~components/dropdown/internal';
import Option from '~components/internal/components/option';
import OptionsList from '~components/internal/components/options-list';
import SelectableItem from '~components/internal/components/selectable-item';
import PopoverArrow from '~components/popover/arrow';
import PopoverBody from '~components/popover/body';

import { SimplePage } from '../app/templates';
import { i18nStrings as codeEditorI18nStrings, themes as codeEditorThemes } from '../code-editor/base-props';
import { Heroshot } from '../common/heroshot';
import { annotationContextStrings, tutorialPanelStrings } from '../onboarding/i18n';
import tutorialData from '../onboarding/tutorials';
import { IframeWrapper } from '../utils/iframe-wrapper';

// @ts-expect-error The generated style map does not publish a TypeScript declaration.
import popoverStyles from '~components/popover/styles.css.js';

export default function HeroshotOverviewPage() {
  return (
    <SimplePage title="Heroshots" screenshotArea={{ disableAnimations: true }} i18n={{}}>
      {/* The frames have a fixed size, so the gallery wraps them instead of stacking 70+ rows. */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24 }}>
        <Heroshot id="action-card" label="ActionCard" stretch={true}>
          <ActionCard
            header="Create a VPC"
            description="Set up an isolated network for your resources."
            icon={<Icon name="add-plus" />}
            href="#"
          />
        </Heroshot>

        <Heroshot id="alert" label="Alert" stretch={true}>
          <Alert type="info" header="Instance type updated" dismissible={true}>
            The change applies after the next restart. <Link href="#">Learn more</Link>
          </Alert>
        </Heroshot>

        <Heroshot id="anchor-navigation" label="AnchorNavigation" stretch={true}>
          <div style={{ transform: `translateX(100px)` }}>
            <AnchorNavigation activeHref="#overview" anchors={anchors} />
          </div>
        </Heroshot>

        <Heroshot id="annotation-context" label="AnnotationContext" padding={0} contentSize={ANNOTATION_CONTENT_SIZE}>
          <IframeWrapper
            id="heroshot-annotation-context"
            size={ANNOTATION_CONTENT_SIZE}
            AppComponent={AnnotationContextHeroshot}
            transparentBackground={true}
          />
        </Heroshot>

        <Heroshot id="hands-on-tutorials" label="Tutorial components" padding={0} contentSize={ANNOTATION_CONTENT_SIZE}>
          <IframeWrapper
            id="heroshot-hands-on-tutorials"
            size={ANNOTATION_CONTENT_SIZE}
            AppComponent={AnnotationContextHeroshot}
            transparentBackground={true}
          />
        </Heroshot>

        <Heroshot id="app-layout" label="AppLayout" padding={0} contentSize={LAYOUT_CONTENT_SIZE}>
          <IframeWrapper id="heroshot-app-layout" size={LAYOUT_CONTENT_SIZE} AppComponent={AppLayoutHeroshot} />
        </Heroshot>

        <Heroshot id="app-layout-toolbar" label="AppLayoutToolbar" padding={0} contentSize={LAYOUT_CONTENT_SIZE}>
          <IframeWrapper
            id="heroshot-app-layout-toolbar"
            size={LAYOUT_CONTENT_SIZE}
            AppComponent={AppLayoutToolbarHeroshot}
          />
        </Heroshot>

        <Heroshot id="area-chart" label="AreaChart" stretch={true}>
          <AreaChart
            height={110}
            hideFilter={true}
            hideLegend={true}
            xScaleType="categorical"
            series={[{ title: 'Requests', type: 'area', data: timeSeries }]}
          />
        </Heroshot>

        <Heroshot id="attribute-editor" label="AttributeEditor" align="start" stretch={true}>
          <AttributeEditor
            addButtonText="Add tag"
            removeButtonText="Remove"
            items={[{ key: 'Environment', value: 'Production' }]}
            definition={[
              { label: 'Key', control: item => <Input value={item.key} readOnly={true} onChange={noop} /> },
              { label: 'Value', control: item => <Input value={item.value} readOnly={true} onChange={noop} /> },
            ]}
          />
        </Heroshot>

        <Heroshot id="autosuggest" label="Autosuggest" align="start" stretch={true}>
          <OpenAutosuggest />
        </Heroshot>

        <Heroshot id="badge" label="Badge">
          <SpaceBetween size="xs" direction="horizontal">
            <Badge>Default</Badge>
            <Badge color="blue">Blue</Badge>
            <Badge color="green">Green</Badge>
            <Badge color="red">Red</Badge>
          </SpaceBetween>
        </Heroshot>

        <Heroshot id="bar-chart" label="BarChart" stretch={true}>
          <BarChart
            height={110}
            hideFilter={true}
            hideLegend={true}
            xScaleType="categorical"
            series={[{ title: 'Requests', type: 'bar', data: timeSeries }]}
          />
        </Heroshot>

        <Heroshot id="charts" label="Charts" stretch={true}>
          <BarChart
            height={110}
            hideFilter={true}
            hideLegend={true}
            xScaleType="categorical"
            series={[{ title: 'Requests', type: 'bar', data: timeSeries }]}
          />
        </Heroshot>

        <Heroshot id="charts-legacy" label="Charts (Legacy)" stretch={true}>
          <BarChart
            height={110}
            hideFilter={true}
            hideLegend={true}
            xScaleType="categorical"
            series={[{ title: 'Requests', type: 'bar', data: timeSeries }]}
          />
        </Heroshot>

        <Heroshot id="box" label="Box" stretch={true}>
          <SpaceBetween size="xxs">
            <Box variant="h2">Instance details</Box>
            <Box variant="p" color="text-body-secondary">
              Review the configuration before you launch the instance.
            </Box>
          </SpaceBetween>
        </Heroshot>

        <Heroshot id="breadcrumb-group" label="BreadcrumbGroup" stretch={true}>
          <BreadcrumbGroup
            ariaLabel="Breadcrumbs"
            items={[
              { text: 'Service', href: '#' },
              { text: 'Instances', href: '#' },
              { text: 'i-01af2c', href: '#' },
            ]}
          />
        </Heroshot>

        <Heroshot id="button" label="Button">
          <SpaceBetween size="xs" direction="horizontal">
            <Button>Cancel</Button>
            <Button variant="primary">Create resource</Button>
          </SpaceBetween>
        </Heroshot>

        <Heroshot id="button-dropdown" label="ButtonDropdown">
          <ButtonDropdown
            items={[
              { id: 'edit', text: 'Edit' },
              { id: 'duplicate', text: 'Duplicate' },
              { id: 'delete', text: 'Delete' },
            ]}
          >
            Actions
          </ButtonDropdown>
        </Heroshot>

        <Heroshot id="button-group" label="ButtonGroup">
          <ButtonGroup
            ariaLabel="Resource actions"
            variant="icon"
            items={[
              { type: 'icon-button', id: 'copy', iconName: 'copy', text: 'Copy' },
              { type: 'icon-button', id: 'edit', iconName: 'edit', text: 'Edit' },
              { type: 'icon-button', id: 'remove', iconName: 'remove', text: 'Remove' },
            ]}
          />
        </Heroshot>

        <Heroshot id="calendar" label="Calendar">
          <Calendar value="2026-10-06" onChange={noop} />
        </Heroshot>

        <Heroshot id="cards" label="Cards" stretch={true}>
          <Cards
            items={instances.slice(0, 1)}
            selectedItems={[instances[0]]}
            selectionType="multi"
            onSelectionChange={noop}
            ariaLabels={{ selectionGroupLabel: 'Instances', itemSelectionLabel: (_data, item) => item.id }}
            cardDefinition={{
              header: item => item.id,
              sections: [{ id: 'type', header: 'Type', content: item => item.type }],
            }}
          />
        </Heroshot>

        <Heroshot id="checkbox" label="Checkbox">
          <SpaceBetween size="xs">
            <Checkbox checked={true} onChange={noop}>
              Enable monitoring
            </Checkbox>
            <Checkbox checked={false} onChange={noop}>
              Enable termination protection
            </Checkbox>
          </SpaceBetween>
        </Heroshot>

        <Heroshot id="code-editor" label="CodeEditor" stretch={true} padding={8}>
          <CodeEditorHeroshot />
        </Heroshot>

        <Heroshot
          id="collection-preferences"
          label="CollectionPreferences"
          padding={0}
          contentSize={OVERLAY_CONTENT_SIZE}
        >
          <IframeWrapper
            id="heroshot-collection-preferences"
            size={OVERLAY_CONTENT_SIZE}
            AppComponent={CollectionPreferencesHeroshot}
          />
        </Heroshot>

        <Heroshot id="column-layout" label="ColumnLayout" stretch={true}>
          <ColumnLayout columns={2}>
            <SpaceBetween size="xxs">
              <Box variant="awsui-key-label">Instance type</Box>
              <div>t3.medium</div>
            </SpaceBetween>
            <SpaceBetween size="xxs">
              <Box variant="awsui-key-label">Region</Box>
              <div>us-east-1</div>
            </SpaceBetween>
          </ColumnLayout>
        </Heroshot>

        <Heroshot id="container" label="Container" stretch={true}>
          <Container header={<Header variant="h2">Instance details</Header>}>
            <KeyValuePairs items={[{ label: 'Instance type', value: 't3.medium' }]} />
          </Container>
        </Heroshot>

        <Heroshot id="content-layout" label="ContentLayout" stretch={true}>
          <ContentLayout header={<Header variant="h1">Instances</Header>}>
            <Container>Content</Container>
          </ContentLayout>
        </Heroshot>

        <Heroshot id="copy-to-clipboard" label="CopyToClipboard">
          <CopyToClipboard
            variant="inline"
            copyButtonAriaLabel="Copy instance ID"
            textToCopy="i-01af2c9d8e7b6a5f4"
            copySuccessText="Instance ID copied"
            copyErrorText="Instance ID failed to copy"
          />
        </Heroshot>

        <Heroshot id="date-input" label="DateInput" stretch={true}>
          <FormField label="Start date">
            <DateInput value="2026-10-06" onChange={noop} />
          </FormField>
        </Heroshot>

        <Heroshot id="date-picker" label="DatePicker" stretch={true}>
          <FormField label="Start date">
            <DatePicker value="2026-10-06" onChange={noop} />
          </FormField>
        </Heroshot>

        <Heroshot id="date-range-picker" label="DateRangePicker" stretch={true}>
          <FormField label="Date range">
            <DateRangePicker
              value={{ type: 'absolute', startDate: '2026-10-01', endDate: '2026-10-06' }}
              relativeOptions={[]}
              isValidRange={() => ({ valid: true })}
              onChange={noop}
            />
          </FormField>
        </Heroshot>

        <Heroshot id="dialog" label="Dialog" stretch={true}>
          <Dialog
            header="Delete instance"
            onDismiss={noop}
            footer={
              <SpaceBetween size="xs" direction="horizontal">
                <Button>Cancel</Button>
                <Button variant="primary">Delete</Button>
              </SpaceBetween>
            }
          >
            This action cannot be undone.
          </Dialog>
        </Heroshot>

        <Heroshot id="divider" label="Divider" stretch={true}>
          <SpaceBetween size="s">
            <Box>Instance settings</Box>
            <Divider />
            <Box>Network settings</Box>
          </SpaceBetween>
        </Heroshot>

        <Heroshot id="drawer" label="Drawer" align="start" stretch={true} padding={0}>
          <Drawer open={true} header="Instance details" closeAction={{ ariaLabel: 'Close drawer' }}>
            <KeyValuePairs items={[{ label: 'Instance type', value: 't3.medium' }]} />
          </Drawer>
        </Heroshot>

        <Heroshot id="dropdown" label="Dropdown" align="start">
          <div style={{ transform: `translate(-8px, 20px)` }}>
            <Dropdown
              open={true}
              minWidth="trigger"
              // The frame clips its overflow, so without this the dropdown would shrink to the
              // remaining space inside the frame and the list would become scrollable.
              stretchHeight={true}
              onOutsideClick={noop}
              onMouseDown={noop}
              trigger={<Button>Actions</Button>}
              content={
                // SelectableItem renders `role="option"`, so the list has to be a listbox: inside a
                // `role="menu"` the rows would be invalid children without a required parent.
                <OptionsList open={true} statusType="finished" role="listbox" ariaLabel="Actions">
                  <SelectableItem>View details</SelectableItem>
                  <SelectableItem>Delete</SelectableItem>
                </OptionsList>
              }
            />
          </div>
        </Heroshot>

        <Heroshot id="expandable-section" label="ExpandableSection" stretch={true}>
          <ExpandableSection headerText="Advanced settings" defaultExpanded={true}>
            <KeyValuePairs items={[{ label: 'Termination protection', value: 'Enabled' }]} />
          </ExpandableSection>
        </Heroshot>

        <Heroshot id="file-dropzone" label="FileDropzone" stretch={true}>
          <FileDropzone onChange={noop}>Drop files to upload</FileDropzone>
        </Heroshot>

        <Heroshot id="file-uploading-components" label="File uploading components" stretch={true}>
          <FileDropzone onChange={noop}>Drop files to upload</FileDropzone>
        </Heroshot>

        <Heroshot id="file-input" label="FileInput">
          <FileInput value={[]} onChange={noop}>
            Choose file
          </FileInput>
        </Heroshot>

        <Heroshot id="file-token-group" label="FileTokenGroup" stretch={true}>
          <FileTokenGroup
            items={[{ file: certificateFile }]}
            onDismiss={noop}
            showFileSize={true}
            i18nStrings={{ removeFileAriaLabel: index => `Remove file ${index + 1}` }}
          />
        </Heroshot>

        <Heroshot id="file-upload" label="FileUpload" stretch={true}>
          <FormField label="Certificate">
            <FileUpload value={[certificateFile]} onChange={noop} showFileSize={true} />
          </FormField>
        </Heroshot>

        <Heroshot id="flashbar" label="Flashbar" stretch={true}>
          <Flashbar
            items={[
              {
                type: 'success',
                header: 'Instance launched',
                dismissible: true,
                dismissLabel: 'Dismiss message',
                onDismiss: noop,
                id: 'success',
              },
              { type: 'in-progress', header: 'Attaching volume', loading: true, id: 'progress' },
            ]}
          />
        </Heroshot>

        <Heroshot id="form" label="Form" align="start" stretch={true}>
          <Form
            header={<Header variant="h1">Create instance</Header>}
            actions={
              <SpaceBetween size="xs" direction="horizontal">
                <Button>Cancel</Button>
                <Button variant="primary">Create</Button>
              </SpaceBetween>
            }
          >
            <Container>
              <FormField label="Name">
                <Input value="" onChange={noop} />
              </FormField>
            </Container>
          </Form>
        </Heroshot>

        <Heroshot id="form-field" label="FormField" stretch={true}>
          <FormField label="Instance name" description="Must be unique within the region.">
            <Input value="my-instance" onChange={noop} />
          </FormField>
        </Heroshot>

        <Heroshot id="grid" label="Grid" stretch={true}>
          <Grid gridDefinition={[{ colspan: 8 }, { colspan: 4 }]}>
            <Container>Main</Container>
            <Container>Side</Container>
          </Grid>
        </Heroshot>

        <Heroshot id="header" label="Header" stretch={true}>
          <Header
            variant="h2"
            description="Instances running in this region."
            counter="(12)"
            actions={<Button variant="primary">Launch instance</Button>}
          >
            Instances
          </Header>
        </Heroshot>

        <Heroshot id="help-panel" label="HelpPanel" align="start" stretch={true}>
          <HelpPanel header={<h2>Instances</h2>}>
            <p>An instance is a virtual server in the cloud.</p>
          </HelpPanel>
        </Heroshot>

        <Heroshot id="hotspot" label="Hotspot" padding={0} contentSize={HOTSPOT_CONTENT_SIZE}>
          <div style={{ transform: 'translateY(-66px)' }}>
            <IframeWrapper
              id="heroshot-hotspot"
              size={HOTSPOT_CONTENT_SIZE}
              AppComponent={HotspotHeroshot}
              transparentBackground={true}
            />
          </div>
        </Heroshot>

        <Heroshot id="icon" label="Icon">
          <SpaceBetween size="s" direction="horizontal">
            <Icon name="settings" size="big" />
            <Icon name="status-positive" size="big" variant="success" />
            <Icon name="status-warning" size="big" variant="warning" />
            <Icon name="folder" size="big" />
          </SpaceBetween>
        </Heroshot>

        <Heroshot id="icon-provider" label="IconProvider">
          <IconProvider icons={{ settings: customSettingsIcon }}>
            <Button iconName="settings">Settings</Button>
          </IconProvider>
        </Heroshot>

        <Heroshot id="input" label="Input" stretch={true}>
          <Input value="my-instance" ariaLabel="Instance name" onChange={noop} />
        </Heroshot>

        <Heroshot id="item-card" label="ItemCard" stretch={true}>
          <ItemCard
            header="t3.medium"
            description="2 vCPU, 4 GiB memory"
            footer={<Link href="#">Compare types</Link>}
          />
        </Heroshot>

        <Heroshot id="key-value-pairs" label="KeyValuePairs" stretch={true}>
          <KeyValuePairs
            columns={2}
            items={[
              { label: 'Instance type', value: 't3.medium' },
              { label: 'Region', value: 'us-east-1' },
              { label: 'Status', value: <StatusIndicator>Running</StatusIndicator> },
              { label: 'Launched', value: 'Oct 6, 2026' },
            ]}
          />
        </Heroshot>

        <Heroshot id="line-chart" label="LineChart" stretch={true}>
          <LineChart
            height={110}
            hideFilter={true}
            hideLegend={true}
            xScaleType="categorical"
            series={[{ title: 'Requests', type: 'line', data: timeSeries }]}
          />
        </Heroshot>

        <Heroshot id="link" label="Link">
          <SpaceBetween size="xs">
            <Link href="#">Secondary link</Link>
            <Link href="#" variant="primary">
              Primary link
            </Link>
            <Link href="#" external={true}>
              External link
            </Link>
          </SpaceBetween>
        </Heroshot>

        <Heroshot id="list" label="List" stretch={true}>
          <List
            ariaLabel="Resources"
            items={
              [
                { id: 'instances', content: 'Instances', iconName: 'multiscreen' },
                { id: 'volumes', content: 'Volumes', iconName: 'view-horizontal' },
                { id: 'security-groups', content: 'Security groups', iconName: 'security' },
              ] as const
            }
            renderItem={item => ({
              id: item.id,
              content: item.content,
              icon: <Icon name={item.iconName} ariaLabel={`${item.content} icon`} />,
            })}
          />
        </Heroshot>

        <Heroshot id="live-region" label="LiveRegion">
          <LiveRegion>
            <StatusIndicator type="success">Deployment completed</StatusIndicator>
          </LiveRegion>
        </Heroshot>

        <Heroshot id="mixed-line-bar-chart" label="MixedLineBarChart" stretch={true}>
          <MixedLineBarChart
            height={110}
            hideFilter={true}
            hideLegend={true}
            xScaleType="categorical"
            series={[
              { title: 'Requests', type: 'bar', data: timeSeries },
              { title: 'Average', type: 'line', data: timeSeries },
            ]}
          />
        </Heroshot>

        <Heroshot id="modal" label="Modal" padding={0} contentSize={OVERLAY_CONTENT_SIZE}>
          <IframeWrapper id="heroshot-modal" size={OVERLAY_CONTENT_SIZE} AppComponent={ModalHeroshot} />
        </Heroshot>

        <Heroshot id="multiselect" label="Multiselect" stretch={true}>
          <FormField label="Security groups">
            <Multiselect
              selectedOptions={[
                { label: 'default', value: 'sg-1' },
                { label: 'web', value: 'sg-2' },
              ]}
              options={[]}
              onChange={noop}
            />
          </FormField>
        </Heroshot>

        <Heroshot id="navigable-group" label="NavigableGroup">
          <div role="toolbar" aria-label="Resource actions">
            <NavigableGroup navigationDirection="horizontal" getItemKey={element => element.id}>
              <SpaceBetween direction="horizontal" size="xs">
                <Button id="add" iconName="add-plus">
                  Add
                </Button>
                <Button id="edit" iconName="edit">
                  Edit
                </Button>
                <Button id="remove" iconName="remove">
                  Delete
                </Button>
              </SpaceBetween>
            </NavigableGroup>
          </div>
        </Heroshot>

        <Heroshot id="panel-layout" label="PanelLayout" stretch={true} padding={8}>
          <PanelLayout
            display="all"
            panelPosition="side-end"
            resizable={true}
            defaultPanelSize={140}
            minPanelSize={110}
            maxPanelSize={180}
            i18nStrings={{
              resizeHandleAriaLabel: 'Resize panels',
              resizeHandleTooltipText: 'Resize panels',
            }}
            panelContent={
              <div style={{ padding: 12 }}>
                <div>Panel content</div>
                <div>Selected resource</div>
                <div>Details appear in this panel.</div>
              </div>
            }
            mainContent={
              <div style={{ padding: 12 }}>
                <div>Main content</div>
                <div>Resource list</div>
                <div>Choose an item to view its details.</div>
              </div>
            }
          />
        </Heroshot>

        <Heroshot id="pagination" label="Pagination">
          <Pagination currentPageIndex={2} pagesCount={5} onChange={noop} />
        </Heroshot>

        <Heroshot id="pie-chart" label="PieChart" stretch={true}>
          <PieChart
            variant="donut"
            size="small"
            hideFilter={true}
            hideLegend={true}
            hideTitles={true}
            hideDescriptions={true}
            innerMetricValue="128"
            innerMetricDescription="instances"
            data={pieData}
          />
        </Heroshot>

        <Heroshot id="pie-chart-legacy" label="Pie and donut charts (Legacy)" stretch={true}>
          <PieChart
            variant="donut"
            size="small"
            hideFilter={true}
            hideLegend={true}
            hideTitles={true}
            hideDescriptions={true}
            innerMetricValue="128"
            innerMetricDescription="instances"
            data={pieData}
          />
        </Heroshot>

        <Heroshot id="popover" label="Popover" stretch={true} padding={0}>
          <StaticPopoverHeroshot />
        </Heroshot>

        <Heroshot id="progress-bar" label="ProgressBar" stretch={true}>
          <ProgressBar value={68} label="Snapshot progress" description="Copying volume data" />
        </Heroshot>

        <Heroshot id="prompt-input" label="PromptInput" stretch={true}>
          <PromptInput
            value="How do I resize an instance?"
            ariaLabel="Ask a question"
            onChange={noop}
            actionButtonIconName="send"
            actionButtonAriaLabel="Send"
          />
        </Heroshot>

        <Heroshot id="property-filter" label="PropertyFilter" stretch={true}>
          <PropertyFilter
            query={{ operation: 'and', tokens: [{ propertyKey: 'type', operator: '=', value: 't3.medium' }] }}
            filteringAriaLabel="Filter instances"
            onChange={noop}
            filteringProperties={[
              { key: 'type', propertyLabel: 'Type', groupValuesLabel: 'Type values', operators: ['='] },
            ]}
          />
        </Heroshot>

        <Heroshot id="radio-button" label="RadioButton">
          <RadioButton name="purchase-option" value="on-demand" checked={true} onSelect={noop}>
            On-demand
          </RadioButton>
        </Heroshot>

        <Heroshot id="radio-group" label="RadioGroup">
          <RadioGroup
            value="on-demand"
            onChange={noop}
            items={[
              { value: 'on-demand', label: 'On-demand' },
              { value: 'spot', label: 'Spot' },
            ]}
          />
        </Heroshot>

        <Heroshot id="s3-resource-selector" label="S3ResourceSelector" stretch={true}>
          <S3ResourceSelector
            resource={{ uri: 's3://example-bucket/logs/' }}
            fetchBuckets={() => Promise.resolve([])}
            fetchObjects={() => Promise.resolve([])}
            fetchVersions={() => Promise.resolve([])}
            selectableItemsTypes={['buckets', 'objects']}
          />
        </Heroshot>

        <Heroshot id="segmented-control" label="SegmentedControl">
          <SegmentedControl
            selectedId="table"
            onChange={noop}
            label="View"
            options={[
              { id: 'table', text: 'Table' },
              { id: 'cards', text: 'Cards' },
            ]}
          />
        </Heroshot>

        <Heroshot id="select" label="Select" stretch={true}>
          <FormField label="Instance type">
            <Select selectedOption={{ label: 't3.medium', value: 't3.medium' }} options={[]} onChange={noop} />
          </FormField>
        </Heroshot>

        <Heroshot id="side-navigation" label="SideNavigation" align="start" stretch={true}>
          <SideNavigation
            header={{ text: 'Service', href: '#' }}
            activeHref="#instances"
            items={[
              { type: 'link', text: 'Dashboard', href: '#dashboard' },
              { type: 'link', text: 'Instances', href: '#instances' },
              { type: 'link', text: 'Volumes', href: '#volumes' },
            ]}
          />
        </Heroshot>

        <Heroshot id="skeleton" label="Skeleton" stretch={true}>
          <SpaceBetween size="s">
            <Skeleton variant="text-heading-m" width="60%" />
            <Skeleton variant="text-body-m" />
            <Skeleton variant="text-body-m" width="80%" />
          </SpaceBetween>
        </Heroshot>

        <Heroshot id="slider" label="Slider" stretch={true}>
          <FormField label="Volume size">
            <Slider value={40} min={0} max={100} onChange={noop} />
          </FormField>
        </Heroshot>

        <Heroshot id="space-between" label="SpaceBetween" stretch={true}>
          <SpaceBetween size="s">
            <Container>First</Container>
            <Container>Second</Container>
          </SpaceBetween>
        </Heroshot>

        <Heroshot id="spinner" label="Spinner">
          <Spinner size="large" />
        </Heroshot>

        <Heroshot id="split-panel" label="SplitPanel" padding={0} contentSize={LAYOUT_CONTENT_SIZE}>
          <IframeWrapper id="heroshot-split-panel" size={LAYOUT_CONTENT_SIZE} AppComponent={SplitPanelHeroshot} />
        </Heroshot>

        <Heroshot id="status-indicator" label="StatusIndicator">
          <SpaceBetween size="xs">
            <StatusIndicator type="success">Running</StatusIndicator>
            <StatusIndicator type="in-progress">Pending</StatusIndicator>
            <StatusIndicator type="error">Failed</StatusIndicator>
          </SpaceBetween>
        </Heroshot>

        <Heroshot id="steps" label="Steps" stretch={true}>
          <Steps
            steps={[
              { status: 'success', header: 'Validated template' },
              { status: 'loading', header: 'Creating resources' },
              { status: 'pending', header: 'Running health checks' },
            ]}
          />
        </Heroshot>

        <Heroshot id="table" label="Table" align="start" stretch={true}>
          <Table
            variant="embedded"
            items={instances}
            columnDefinitions={[
              { id: 'id', header: 'ID', cell: item => item.id },
              { id: 'type', header: 'Type', cell: item => item.type },
            ]}
          />
        </Heroshot>

        <Heroshot id="tabs" label="Tabs" stretch={true}>
          <Tabs
            tabs={[
              { id: 'details', label: 'Details', content: 'Instance details' },
              { id: 'monitoring', label: 'Monitoring' },
              { id: 'tags', label: 'Tags' },
            ]}
          />
        </Heroshot>

        <Heroshot id="tag-editor" label="TagEditor" align="start" stretch={true}>
          <TagEditor tags={[{ key: 'Environment', value: 'Production', existing: false }]} onChange={noop} />
        </Heroshot>

        <Heroshot id="text-content" label="TextContent" stretch={true}>
          <TextContent>
            <h2>Instances</h2>
            <p>An instance is a virtual server in the cloud.</p>
          </TextContent>
        </Heroshot>

        <Heroshot id="text-filter" label="TextFilter" stretch={true}>
          <TextFilter filteringText="t3" filteringAriaLabel="Filter instances" countText="3 matches" onChange={noop} />
        </Heroshot>

        <Heroshot id="textarea" label="Textarea" stretch={true}>
          <FormField label="Description">
            <Textarea value="Hosts the public web tier." onChange={noop} rows={2} />
          </FormField>
        </Heroshot>

        <Heroshot id="tiles" label="Tiles" stretch={true}>
          <Tiles
            value="on-demand"
            onChange={noop}
            columns={2}
            items={[
              { value: 'on-demand', label: 'On-demand' },
              { value: 'spot', label: 'Spot' },
            ]}
          />
        </Heroshot>

        <Heroshot id="time-input" label="TimeInput" stretch={true}>
          <FormField label="Start time">
            <TimeInput value="14:30" onChange={noop} />
          </FormField>
        </Heroshot>

        <Heroshot id="toggle" label="Toggle">
          <SpaceBetween size="xs">
            <Toggle checked={true} onChange={noop}>
              Detailed monitoring
            </Toggle>
            <Toggle checked={false} onChange={noop}>
              Auto scaling
            </Toggle>
          </SpaceBetween>
        </Heroshot>

        <Heroshot id="toggle-button" label="ToggleButton">
          <SpaceBetween size="xs" direction="horizontal">
            <ToggleButton pressed={true} iconName="star-filled" pressedIconName="star-filled" onChange={noop}>
              Favorite
            </ToggleButton>
            <ToggleButton pressed={false} iconName="star" pressedIconName="star-filled" onChange={noop}>
              Favorite
            </ToggleButton>
          </SpaceBetween>
        </Heroshot>

        <Heroshot id="token" label="Token">
          {/*
            Token sets `block-size: 100%` so that tokens in a group match the tallest one. The wrapper
            gives it an auto-height parent, so it renders at its own height instead of filling the frame.
          */}
          <div>
            <Token label="us-east-1" dismissLabel="Remove us-east-1" onDismiss={noop} />
          </div>
        </Heroshot>

        <Heroshot id="token-group" label="TokenGroup">
          <TokenGroup
            onDismiss={noop}
            items={[
              { label: 'us-east-1', dismissLabel: 'Remove us-east-1' },
              { label: 'us-west-2', dismissLabel: 'Remove us-west-2' },
              { label: 'eu-west-1', dismissLabel: 'Remove eu-west-1' },
            ]}
          />
        </Heroshot>

        <Heroshot id="tooltip" label="Tooltip" stretch={true} padding={0}>
          <StaticTooltipHeroshot />
        </Heroshot>

        <Heroshot id="top-navigation" label="TopNavigation" stretch={true} padding={0}>
          <TopNavigation
            identity={{ title: 'Service', href: '#' }}
            utilities={[
              { type: 'button', iconName: 'notification', ariaLabel: 'Notifications' },
              { type: 'menu-dropdown', text: 'Account', items: [{ id: 'profile', text: 'Profile' }] },
            ]}
          />
        </Heroshot>

        <Heroshot id="tree-view" label="TreeView" stretch={true}>
          <TreeView
            ariaLabel="Resources"
            items={treeItems}
            expandedItems={['vpc']}
            onItemToggle={noop}
            getItemId={item => item.id}
            getItemChildren={item => item.children}
            renderItem={item => ({ content: item.label })}
          />
        </Heroshot>

        <Heroshot id="truncated-text" label="TruncatedText" stretch={true}>
          <div style={{ maxInlineSize: 220 }}>
            <TruncatedText>arn:aws:lambda:us-east-1:123456789012:function:production-handler</TruncatedText>
          </div>
        </Heroshot>

        <Heroshot id="tutorial-panel" label="TutorialPanel" align="start" stretch={true}>
          <TutorialPanel tutorials={previewTutorials} i18nStrings={previewTutorialPanelStrings} />
        </Heroshot>

        <Heroshot
          id="wizard"
          label="Wizard"
          align="start"
          stretch={true}
          padding={8}
          contentSize={OVERLAY_CONTENT_SIZE}
        >
          <Wizard
            activeStepIndex={0}
            steps={[
              {
                title: 'Instance details',
                content: (
                  <SpaceBetween size="s">
                    <FormField label="Name">
                      <Input value="my-instance" onChange={noop} />
                    </FormField>
                    <FormField label="Instance type">
                      <Select
                        selectedOption={{ label: 't3.medium', value: 't3.medium' }}
                        options={[]}
                        onChange={noop}
                      />
                    </FormField>
                  </SpaceBetween>
                ),
              },
              { title: 'Network settings', content: 'Choose a VPC and subnet.' },
              { title: 'Storage', content: 'Configure the root volume.' },
              { title: 'Review and create', content: 'Review the configuration.' },
            ]}
            i18nStrings={{ cancelButton: 'Cancel', nextButton: 'Next', previousButton: 'Previous' }}
          />
        </Heroshot>
      </div>
    </SimplePage>
  );
}

const noop = () => {};

const instances = [
  { id: 'i-01af2c', type: 't3.medium' },
  { id: 'i-02bd3e', type: 'm5.large' },
  { id: 'i-03ce4f', type: 'c5.xlarge' },
];

/**
 * Viewport the page-level layouts are rendered at before being scaled into the frame. Matches the
 * 346:170 frame ratio so nothing is letterboxed, and is wide enough for the layout to lay out its
 * panels side by side rather than collapsing to its narrow-viewport behaviour.
 */
const LAYOUT_CONTENT_SIZE = { width: 1280, height: 629 };

/**
 * Shared by both layout heroshots so the only visible difference between them is the toolbar that
 * app layout toolbar adds.
 */
const layoutSlots = {
  navigationOpen: true,
  toolsOpen: true,
  onNavigationChange: noop,
  onToolsChange: noop,
  breadcrumbs: (
    <BreadcrumbGroup
      items={[
        { text: 'Service', href: '#' },
        { text: 'Instances', href: '#' },
      ]}
    />
  ),
  navigation: (
    <SideNavigation
      header={{ text: 'Service', href: '#' }}
      activeHref="#instances"
      items={[
        { type: 'link', text: 'Dashboard', href: '#dashboard' },
        { type: 'link', text: 'Instances', href: '#instances' },
        { type: 'link', text: 'Volumes', href: '#volumes' },
      ]}
    />
  ),
  tools: (
    <HelpPanel header={<h2>Instances</h2>}>
      <p>An instance is a virtual server in the cloud.</p>
    </HelpPanel>
  ),
  content: (
    <SpaceBetween size="m">
      <Header variant="h1" actions={<Button variant="primary">Launch instance</Button>}>
        Instances
      </Header>
      <Table
        variant="container"
        header={<Header counter="(3)">Running instances</Header>}
        items={instances}
        columnDefinitions={[
          { id: 'id', header: 'Instance ID', cell: item => item.id },
          { id: 'type', header: 'Type', cell: item => item.type },
          { id: 'status', header: 'Status', cell: () => <StatusIndicator>Running</StatusIndicator> },
        ]}
      />
    </SpaceBetween>
  ),
} as const;

/**
 * App layout measures the viewport to place its panels, so scaling a plain `div` would leave it
 * laying out against the browser window instead of the frame. Rendering it in an iframe gives it a
 * viewport of exactly `LAYOUT_CONTENT_SIZE`, which the frame then scales down as a whole.
 */
function AppLayoutHeroshot() {
  return <AppLayout {...layoutSlots} />;
}

/** Same technique as {@link AppLayoutHeroshot}; the toolbar is what distinguishes the thumbnail. */
function AppLayoutToolbarHeroshot() {
  return <AppLayoutToolbar {...layoutSlots} />;
}

const anchors = [
  { text: 'Overview', href: '#overview', level: 1 },
  { text: 'Networking', href: '#networking', level: 1 },
  { text: 'Subnets', href: '#subnets', level: 2 },
];

const timeSeries = [
  { x: 'Mon', y: 120 },
  { x: 'Tue', y: 180 },
  { x: 'Wed', y: 140 },
  { x: 'Thu', y: 220 },
  { x: 'Fri', y: 190 },
];

const pieData = [
  { title: 'Running', value: 84 },
  { title: 'Stopped', value: 32 },
  { title: 'Pending', value: 12 },
];

interface TreeItem {
  id: string;
  label: string;
  children?: TreeItem[];
}

const treeItems: TreeItem[] = [
  {
    id: 'vpc',
    label: 'vpc-0a1b2c',
    children: [
      { id: 'subnet-a', label: 'subnet-public-a' },
      { id: 'subnet-b', label: 'subnet-private-b' },
    ],
  },
];

const certificateFile = new File([new Uint8Array(2048)], 'certificate.pem', { type: 'application/x-pem-file' });

const autosuggestOptions = [
  { value: 'us-east-1' },
  { value: 'us-east-2' },
  { value: 'us-west-1' },
  { value: 'eu-west-1' },
];

const enteredTextLabel = (value: string) => `Use: ${value}`;

/**
 * The public Autosuggest only opens its dropdown while the input is focused, which a heroshot
 * can't rely on. This reproduces the open state statically from the same internal building
 * blocks the real dropdown uses, so it stays open without focus or interaction.
 */
function OpenAutosuggest() {
  // Narrow enough that the entered-text row plus the matches fit the frame without being clipped.
  const highlightText = 'us-e';
  const matches = autosuggestOptions.filter(option => option.value.startsWith(highlightText));

  return (
    <Dropdown
      open={true}
      minWidth="trigger"
      maxWidth="trigger"
      // The frame clips its overflow, so without this the dropdown would shrink to the remaining
      // space inside the frame and cut off the last option mid-row.
      stretchHeight={true}
      onOutsideClick={noop}
      onMouseDown={noop}
      trigger={
        <Autosuggest
          value={highlightText}
          onChange={noop}
          options={autosuggestOptions}
          ariaLabel="Region"
          enteredTextLabel={enteredTextLabel}
          empty="No matches found"
        />
      }
      content={
        <OptionsList open={true} statusType="finished" role="listbox" ariaLabel="Region">
          <SelectableItem highlighted={true} highlightType="keyboard">
            <span>{enteredTextLabel(highlightText)}</span>
          </SelectableItem>
          {matches.map(option => (
            <SelectableItem key={option.value}>
              <Option option={option} highlightText={highlightText} />
            </SelectableItem>
          ))}
        </OptionsList>
      }
    />
  );
}

const sourceTutorial = tutorialData(noop)[0];
const previewTutorial = {
  ...sourceTutorial,
  title: 'Create a bucket',
  description: 'Create and configure an Amazon S3 bucket.',
  tasks: [
    {
      ...sourceTutorial.tasks[0],
      title: 'Bucket settings',
      steps: [
        {
          ...sourceTutorial.tasks[0].steps[0],
          title: 'Name the bucket',
          content: 'Enter a unique bucket name.',
          hotspotId: 'preview-annotation',
        },
        {
          ...sourceTutorial.tasks[0].steps[2],
          title: 'Choose a Region',
          content: 'Select a Region for the bucket.',
          hotspotId: 'preview-hotspot',
        },
      ],
    },
  ],
};
const previewTutorials = [previewTutorial];
const previewTutorialPanelStrings = {
  ...tutorialPanelStrings,
  tutorialListDescription: 'Follow a short guided tutorial.',
};
const ANNOTATION_CONTENT_SIZE = { width: 350, height: 172 };
const HOTSPOT_CONTENT_SIZE = { width: 300, height: 147 };
const OVERLAY_CONTENT_SIZE = { width: 800, height: 393 };

const customSettingsIcon = (
  <svg viewBox="0 0 16 16" focusable={false}>
    <circle cx="8" cy="8" r="5" fill="none" stroke="currentColor" strokeWidth="2" />
    <circle cx="8" cy="8" r="1.5" fill="currentColor" />
  </svg>
);

function AnnotationContextHeroshot() {
  return (
    <AnnotationContext
      currentTutorial={previewTutorial}
      i18nStrings={annotationContextStrings}
      onStartTutorial={noop}
      onExitTutorial={noop}
    >
      <div style={{ inlineSize: 150, padding: '130px 10px 0', transform: `translateY(22px)` }}>
        <Hotspot hotspotId={previewTutorial.tasks[0].steps[0].hotspotId} direction="top">
          <Input value="" onChange={noop} />
        </Hotspot>
      </div>
    </AnnotationContext>
  );
}

function HotspotHeroshot() {
  return (
    <AnnotationContext
      currentTutorial={previewTutorial}
      i18nStrings={annotationContextStrings}
      onStartTutorial={noop}
      onExitTutorial={noop}
    >
      <div style={{ inlineSize: 150, padding: '110px 5px 0' }}>
        <Hotspot hotspotId={previewTutorial.tasks[0].steps[0].hotspotId} direction="top">
          <Input value="" placeholder="Bucket name" onChange={noop} />
        </Hotspot>
      </div>
    </AnnotationContext>
  );
}

function CodeEditorHeroshot() {
  const [ace, setAce] = React.useState<any>();

  React.useEffect(() => {
    let active = true;
    import('ace-builds').then(aceModule => {
      if (!active) {
        return;
      }
      aceModule.config.set('basePath', './ace/');
      aceModule.config.set('themePath', './ace/');
      aceModule.config.set('modePath', './ace/');
      aceModule.config.set('workerPath', './ace/');
      aceModule.config.set('loadWorkerFromBlob', false);
      aceModule.config.set('useStrictCSP', true);
      setAce(aceModule);
    });
    return () => {
      active = false;
    };
  }, []);

  return (
    <CodeEditor
      ace={ace}
      value="const region = 'us-east-1';"
      language="javascript"
      editorContentHeight={80}
      loading={!ace}
      i18nStrings={codeEditorI18nStrings}
      themes={codeEditorThemes}
      preferences={{ theme: 'dawn', wrapLines: true }}
      onDelayedChange={noop}
      onPreferencesChange={noop}
    />
  );
}

/**
 * IframeWrapper isolates the modal's portal target, but Modal's scroll-lock hook still uses the
 * parent document, which would stop the gallery below from scrolling.
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

function ModalHeroshot() {
  useUnlockedGalleryScroll();

  return (
    <Modal
      visible={true}
      header="Delete instance"
      closeAriaLabel="Close modal"
      footer={<Button variant="primary">Delete</Button>}
    >
      This action cannot be undone.
    </Modal>
  );
}

/**
 * The preferences modal can only be opened from the trigger, so the heroshot clicks it on mount to
 * capture the preferences themselves instead of the icon alone.
 */
function CollectionPreferencesHeroshot() {
  const triggerWrapperRef = React.useRef<HTMLDivElement>(null);
  const [triggerHidden, setTriggerHidden] = React.useState(false);
  useUnlockedGalleryScroll();

  React.useEffect(() => {
    triggerWrapperRef.current?.querySelector('button')?.click();
    setTriggerHidden(true);
  }, []);

  return (
    // The modal is rendered in a portal, so taking the trigger out of the layout leaves the
    // preferences as the only content in the frame instead of a stray icon in its corner. The
    // trigger is hidden only after it has been clicked, because `display: none` suppresses the
    // click event itself.
    <div ref={triggerWrapperRef} style={{ display: triggerHidden ? 'none' : undefined }}>
      <CollectionPreferences
        title="Preferences"
        confirmLabel="Confirm"
        cancelLabel="Cancel"
        preferences={{ pageSize: 20, wrapLines: true }}
        pageSizePreference={{
          title: 'Page size',
          options: [
            { value: 10, label: '10 resources' },
            { value: 20, label: '20 resources' },
            { value: 50, label: '50 resources' },
          ],
        }}
        wrapLinesPreference={{ label: 'Wrap lines', description: 'Wrap lines to see all of the text.' }}
      />
    </div>
  );
}

function StaticPopoverHeroshot() {
  return (
    <div style={{ position: 'relative', blockSize: '100%', textAlign: 'center', paddingBlockStart: 8 }}>
      <Popover content={null} dismissButton={false}>
        View status
      </Popover>
      <div
        style={{
          position: 'absolute',
          insetBlockStart: 44,
          insetInlineStart: 18,
          inlineSize: 310,
          textAlign: 'start',
        }}
      >
        <div style={{ position: 'relative' }}>
          <div
            className={`${popoverStyles['container-arrow']} ${popoverStyles['container-arrow-position-bottom-center']}`}
            aria-hidden={true}
          >
            <PopoverArrow position="bottom-center" />
          </div>
          <div className={`${popoverStyles['container-body']} ${popoverStyles['container-body-size-medium']}`}>
            <PopoverBody
              dismissButton={false}
              dismissAriaLabel={undefined}
              onDismiss={undefined}
              header="Instance status"
            >
              <span data-testid="popover-preview-content">The instance is running normally.</span>
            </PopoverBody>
          </div>
        </div>
      </div>
    </div>
  );
}

function SplitPanelHeroshot() {
  return (
    <AppLayout
      navigationHide={true}
      toolsHide={true}
      splitPanelOpen={true}
      onSplitPanelToggle={noop}
      splitPanelPreferences={{ position: 'side' }}
      splitPanel={
        <SplitPanel header="Instance details" hidePreferencesButton={true}>
          <KeyValuePairs items={[{ label: 'Instance type', value: 't3.medium' }]} />
        </SplitPanel>
      }
      content={
        <Container header={<Header variant="h1">Instances</Header>}>Select an instance to view details.</Container>
      }
    />
  );
}

function StaticTooltipHeroshot() {
  return (
    <div style={{ position: 'relative', blockSize: '100%', textAlign: 'center', paddingBlockStart: 20 }}>
      <Button>Instance type</Button>
      <div
        style={{
          position: 'absolute',
          insetBlockStart: 66,
          insetInlineStart: 53,
          inlineSize: 240,
          textAlign: 'start',
        }}
      >
        <div style={{ position: 'relative' }}>
          <div
            className={`${popoverStyles['container-arrow']} ${popoverStyles['container-arrow-position-bottom-center']}`}
            aria-hidden={true}
          >
            <PopoverArrow position="bottom-center" />
          </div>
          <div className={`${popoverStyles['container-body']} ${popoverStyles['container-body-size-medium']}`}>
            <PopoverBody dismissButton={false} dismissAriaLabel={undefined} onDismiss={undefined} header={undefined}>
              Choose the compute capacity for this instance.
            </PopoverBody>
          </div>
        </div>
      </div>
    </div>
  );
}
