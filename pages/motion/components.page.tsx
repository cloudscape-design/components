// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Box from '~components/box';
import Button from '~components/button';
import Checkbox from '~components/checkbox';
import ColumnLayout from '~components/column-layout';
import Container from '~components/container';
import ExpandableSection from '~components/expandable-section';
import FormField from '~components/form-field';
import Header from '~components/header';
import KeyValuePairs from '~components/key-value-pairs';
import Link from '~components/link';
import Multiselect, { MultiselectProps } from '~components/multiselect';
import Popover from '~components/popover';
import RadioGroup from '~components/radio-group';
import SideNavigation from '~components/side-navigation';
import SpaceBetween from '~components/space-between';
import StatusIndicator from '~components/status-indicator';
import Table from '~components/table';
import Tiles from '~components/tiles';
import Toggle from '~components/toggle';

import { SimplePage } from '../app/templates';
import { generateItems, Instance } from '../table/generate-data';
import { columnsConfig, selectionLabels } from '../table/shared-configs';

const items = generateItems(5);

const regionOptions: MultiselectProps.Options = [
  { label: 'us-east-1', value: 'us-east-1', description: 'US East (N. Virginia)' },
  { label: 'us-west-2', value: 'us-west-2', description: 'US West (Oregon)' },
  { label: 'eu-central-1', value: 'eu-central-1', description: 'Europe (Frankfurt)' },
  { label: 'ap-southeast-1', value: 'ap-southeast-1', description: 'Asia Pacific (Singapore)' },
];

function InstancesTable() {
  const [selectedItems, setSelectedItems] = useState<Instance[]>([]);
  const [showDetails, setShowDetails] = useState(false);
  return (
    <Table
      header={
        <Header
          variant="h2"
          counter={selectedItems.length ? `(${selectedItems.length}/${items.length})` : `(${items.length})`}
          actions={
            <SpaceBetween direction="horizontal" size="s" alignItems="center">
              <Toggle checked={showDetails} onChange={({ detail }) => setShowDetails(detail.checked)}>
                Show image IDs
              </Toggle>
              <Button iconName="refresh" ariaLabel="Refresh" />
              <Button disabled={selectedItems.length === 0}>Stop</Button>
            </SpaceBetween>
          }
        >
          Instances
        </Header>
      }
      selectionType="multi"
      selectedItems={selectedItems}
      onSelectionChange={({ detail }) => setSelectedItems(detail.selectedItems)}
      ariaLabels={selectionLabels}
      columnDefinitions={columnsConfig}
      visibleColumns={showDetails ? undefined : ['id', 'type', 'dnsName', 'state']}
      items={items}
      variant="container"
    />
  );
}

function LaunchForm() {
  const [regions, setRegions] = useState<MultiselectProps.Options>([]);
  const [tier, setTier] = useState('standard');
  const [network, setNetwork] = useState('public');
  const [monitoring, setMonitoring] = useState(true);
  const [termination, setTermination] = useState(false);
  const [tags, setTags] = useState({ env: true, owner: false });
  return (
    <Container header={<Header variant="h2">Launch configuration</Header>}>
      <SpaceBetween size="l">
        <FormField label="Regions" description="Options render a checkbox each.">
          <Multiselect
            selectedOptions={regions}
            onChange={({ detail }) => setRegions(detail.selectedOptions)}
            options={regionOptions}
            placeholder="Choose regions"
            tokenLimit={2}
          />
        </FormField>
        <FormField label="Storage tier">
          <Tiles
            value={tier}
            onChange={({ detail }) => setTier(detail.value)}
            columns={3}
            items={[
              { label: 'Standard', value: 'standard', description: 'General purpose SSD' },
              { label: 'Provisioned', value: 'provisioned', description: 'High IOPS' },
              { label: 'Cold', value: 'cold', description: 'Infrequent access' },
            ]}
          />
        </FormField>
        <FormField label="Network">
          <RadioGroup
            value={network}
            onChange={({ detail }) => setNetwork(detail.value)}
            items={[
              { label: 'Public subnet', value: 'public' },
              { label: 'Private subnet', value: 'private' },
              { label: 'Isolated', value: 'isolated' },
            ]}
          />
        </FormField>
        <FormField label="Tags">
          <Checkbox checked={tags.env} onChange={({ detail }) => setTags({ ...tags, env: detail.checked })}>
            Environment
          </Checkbox>
          <Checkbox checked={tags.owner} onChange={({ detail }) => setTags({ ...tags, owner: detail.checked })}>
            Owner
          </Checkbox>
        </FormField>
        <ExpandableSection headerText="Advanced settings" variant="footer">
          <SpaceBetween size="s">
            <Toggle checked={monitoring} onChange={({ detail }) => setMonitoring(detail.checked)}>
              Detailed monitoring
            </Toggle>
            <Toggle checked={termination} onChange={({ detail }) => setTermination(detail.checked)}>
              Termination protection
            </Toggle>
          </SpaceBetween>
        </ExpandableSection>
      </SpaceBetween>
    </Container>
  );
}

function InstanceDetails() {
  return (
    <SpaceBetween size="m">
      <ExpandableSection
        headerText="Instance summary"
        variant="container"
        defaultExpanded={true}
        headerActions={<Button iconName="copy">Copy ARN</Button>}
      >
        <KeyValuePairs
          columns={2}
          items={[
            {
              label: 'Status',
              value: (
                <Popover
                  header="Status check"
                  content="2/2 checks passed. Last checked 3 minutes ago."
                  dismissAriaLabel="Close"
                >
                  <StatusIndicator type="success">Running</StatusIndicator>
                </Popover>
              ),
            },
            {
              label: 'Public IP',
              value: (
                <Popover
                  size="small"
                  position="top"
                  triggerType="custom"
                  dismissButton={false}
                  content={<StatusIndicator type="success">Copied</StatusIndicator>}
                >
                  <Button variant="inline-icon" iconName="copy" ariaLabel="Copy IP" />
                </Popover>
              ),
            },
            {
              label: 'Pricing',
              value: (
                <Popover
                  header="On-demand pricing"
                  position="right"
                  content="$0.0416 per hour. Reserved instances offer up to 72% discount."
                  dismissAriaLabel="Close"
                >
                  <Link variant="info">Info</Link>
                </Popover>
              ),
            },
            { label: 'Availability zone', value: 'us-east-1a' },
          ]}
        />
      </ExpandableSection>
      <ExpandableSection headerText="Security groups" variant="container">
        <Box>sg-0a1b2c3d (default)</Box>
      </ExpandableSection>
      <ExpandableSection headerText="Storage" variant="container">
        <Box>1 volume, 8 GiB gp3</Box>
      </ExpandableSection>
    </SpaceBetween>
  );
}

function Navigation() {
  return (
    <Container disableContentPaddings={true}>
      <SideNavigation
        header={{ text: 'EC2', href: '#' }}
        items={[
          { type: 'link', text: 'Dashboard', href: '#dashboard' },
          {
            type: 'section',
            text: 'Instances',
            items: [
              { type: 'link', text: 'Instances', href: '#instances' },
              { type: 'link', text: 'Launch templates', href: '#templates' },
            ],
          },
          {
            type: 'expandable-link-group',
            text: 'Images',
            href: '#images',
            items: [{ type: 'link', text: 'AMIs', href: '#amis' }],
          },
        ]}
      />
    </Container>
  );
}

export default function MotionComponentsPage() {
  return (
    <SimplePage
      title="Component motion in context"
      subtitle="Checkbox, radio button, toggle, expandable section, and popover placed inside the components that host them."
      screenshotArea={{ disableAnimations: false }}
    >
      <InstancesTable />
      <ColumnLayout columns={2}>
        <LaunchForm />
        <SpaceBetween size="m">
          <InstanceDetails />
          <Navigation />
        </SpaceBetween>
      </ColumnLayout>
    </SimplePage>
  );
}
