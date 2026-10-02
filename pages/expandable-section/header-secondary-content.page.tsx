// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Badge from '~components/badge';
import Box from '~components/box';
import Button from '~components/button';
import ButtonGroup from '~components/button-group';
import ExpandableSection from '~components/expandable-section';
import Input from '~components/input';
import Popover from '~components/popover';
import Select, { SelectProps } from '~components/select';
import SpaceBetween from '~components/space-between';

import { SimplePage } from '../app/templates';

const languageOptions: SelectProps.Options = [
  { label: 'SQL', value: 'sql' },
  { label: 'PPL', value: 'ppl' },
  { label: 'Logstash', value: 'logstash' },
];

function StandardExample() {
  return (
    <ExpandableSection variant="container" defaultExpanded={true} headerText="Standard expandable section">
      Content
    </ExpandableSection>
  );
}

function CreateQueryExample() {
  const [expanded, setExpanded] = useState(true);
  const [language, setLanguage] = useState<SelectProps.Option>(languageOptions[0]);
  return (
    <ExpandableSection
      variant="container"
      headerText="Create query"
      expanded={expanded}
      onChange={({ detail }) => setExpanded(detail.expanded)}
      headerSecondaryContent={
        <Select
          selectedOption={language}
          onChange={({ detail }) => setLanguage(detail.selectedOption)}
          options={languageOptions}
        />
      }
      headerActions={
        expanded ? (
          <SpaceBetween direction="horizontal" size="xs">
            <ButtonGroup
              ariaLabel="Query actions"
              variant="icon"
              items={[
                { type: 'icon-button', id: 'copy', iconName: 'copy', text: 'Copy' },
                { type: 'icon-button', id: 'remove', iconName: 'remove', text: 'Clear' },
              ]}
            />
            <Button>Save</Button>
            <Button variant="primary">Run</Button>
          </SpaceBetween>
        ) : (
          <Button variant="primary">Run</Button>
        )
      }
    >
      <Box color="text-body-secondary">SELECT * FROM logs WHERE status = 500 ORDER BY timestamp DESC LIMIT 100</Box>
    </ExpandableSection>
  );
}

function DescriptionAsSecondaryContentExample() {
  return (
    <ExpandableSection
      variant="container"
      defaultExpanded={true}
      headerText="Production database"
      headerSecondaryContent={<Box variant="small">Last synced 3 minutes ago</Box>}
      headerActions={<Button>Refresh</Button>}
    >
      <Box color="text-body-secondary">
        Supporting text can live in the secondary content slot next to the header text, instead of the description slot
        below it.
      </Box>
    </ExpandableSection>
  );
}

function HiddenHeaderTextExample() {
  const sectionName = 'Data source A';
  const [language, setLanguage] = useState<SelectProps.Option>(languageOptions[0]);
  return (
    <ExpandableSection
      variant="container"
      defaultExpanded={true}
      headerText={sectionName}
      hideHeaderText={true}
      headerSecondaryContent={
        <SpaceBetween direction="horizontal" size="xs" alignItems="center">
          <Badge color="severity-low">
            <Box padding={{ vertical: 'xxs' }} color="inherit">
              <Popover content="Edit name...">
                <Box fontSize="heading-m" color="inherit">
                  A
                </Box>
              </Popover>
            </Box>
          </Badge>
          <Select
            selectedOption={language}
            onChange={({ detail }) => setLanguage(detail.selectedOption)}
            options={languageOptions}
            ariaLabel="Query language"
          />
        </SpaceBetween>
      }
    >
      <Box color="text-body-secondary">Configuration for {sectionName}.</Box>
    </ExpandableSection>
  );
}

function HiddenHeaderTextSearchExample() {
  const [value, setValue] = useState('');
  return (
    <ExpandableSection
      variant="container"
      defaultExpanded={true}
      headerText="Search results"
      hideHeaderText={true}
      headerSecondaryContent={
        <Input
          type="search"
          value={value}
          onChange={({ detail }) => setValue(detail.value)}
          placeholder="Search results"
          ariaLabel="Search results"
        />
      }
    >
      <Box color="text-body-secondary">Results matching “{value || 'your query'}”.</Box>
    </ExpandableSection>
  );
}

function LongContentExample() {
  const [language, setLanguage] = useState<SelectProps.Option>(languageOptions[0]);
  return (
    <ExpandableSection
      variant="container"
      defaultExpanded={true}
      headerText="Create query for the aggregated multi-region production log analytics dataset"
      headerSecondaryContent={
        <Select
          selectedOption={language}
          onChange={({ detail }) => setLanguage(detail.selectedOption)}
          options={languageOptions}
        />
      }
      headerActions={
        <SpaceBetween direction="horizontal" size="xs">
          <Button>Save</Button>
          <Button variant="primary">Run</Button>
        </SpaceBetween>
      }
    >
      <Box color="text-body-secondary">Stress case: long header text next to an interactive control and actions.</Box>
    </ExpandableSection>
  );
}

function DefaultVariantLongExample() {
  const [language, setLanguage] = useState<SelectProps.Option>(languageOptions[0]);
  return (
    <ExpandableSection
      variant="default"
      defaultExpanded={true}
      headerText="Default variant with a long header that wraps to several lines on a narrow screen"
      headerSecondaryContent={
        <Select
          selectedOption={language}
          onChange={({ detail }) => setLanguage(detail.selectedOption)}
          options={languageOptions}
        />
      }
    >
      <Box color="text-body-secondary">Default variant stress case.</Box>
    </ExpandableSection>
  );
}

export default function ExpandableSectionHeaderSecondaryContentPage() {
  return (
    <SimplePage title="Expandable section — header secondary content" screenshotArea={{}}>
      <SpaceBetween size="l">
        <div>
          <h2>Standard</h2>
          <StandardExample />
        </div>
        <div>
          <h2>Interactive control alongside visible header text</h2>
          <CreateQueryExample />
        </div>
        <div>
          <h2>Description-style text as secondary content</h2>
          <DescriptionAsSecondaryContentExample />
        </div>
        <div>
          <h2>Interactive control with hidden header text</h2>
          <HiddenHeaderTextExample />
        </div>
        <div>
          <h2>Search input with hidden header text</h2>
          <HiddenHeaderTextSearchExample />
        </div>
        <div>
          <h2>Long header text with control and actions</h2>
          <LongContentExample />
        </div>
        <div>
          <h2>Default variant, long header with control</h2>
          <DefaultVariantLongExample />
        </div>
      </SpaceBetween>
    </SimplePage>
  );
}
