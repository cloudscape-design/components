// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import { Alert, Autosuggest, Box, Button, ButtonGroup, FormField, Link, SpaceBetween } from '~components';
import Dropdown from '~components/dropdown/internal';
import Option from '~components/internal/components/option';
import OptionsList from '~components/internal/components/options-list';
import SelectableItem from '~components/internal/components/selectable-item';

import { i18nStrings as alertI18nStrings } from '../alert/common';
import { SimplePage } from '../app/templates';
import { Heroshot } from '../common/heroshot';

export default function HeroshotOverviewPage() {
  return (
    <SimplePage
      title="Heroshots"
      subtitle="Thumbnail candidates for the components overview pages of the documentation website."
      screenshotArea={{}}
      i18n={{}}
    >
      <Section title="Button">
        <Heroshot label="Primary and normal">
          <SpaceBetween size="xs" direction="horizontal">
            <Button>Cancel</Button>
            <Button variant="primary">Create resource</Button>
          </SpaceBetween>
        </Heroshot>

        <Heroshot label="Variants">
          <SpaceBetween size="xs" alignItems="center">
            <Button variant="primary">Primary button</Button>
            <Button>Normal button</Button>
            <Button variant="link">Link button</Button>
          </SpaceBetween>
        </Heroshot>

        <Heroshot label="Icons and states">
          <SpaceBetween size="xs" alignItems="center">
            <SpaceBetween size="xs" direction="horizontal">
              <Button iconName="add-plus" variant="primary">
                Add
              </Button>
              <Button iconName="refresh" ariaLabel="Refresh" />
              <Button iconName="external" iconAlign="right" href="#">
                Open
              </Button>
            </SpaceBetween>
            <SpaceBetween size="xs" direction="horizontal">
              <Button loading={true}>Loading</Button>
              <Button disabled={true}>Disabled</Button>
            </SpaceBetween>
          </SpaceBetween>
        </Heroshot>

        <Heroshot label="With button group">
          <SpaceBetween size="xs" alignItems="center">
            <Button variant="primary">Create resource</Button>
            <ButtonGroup
              ariaLabel="Resource actions"
              variant="icon"
              items={[
                { type: 'icon-button', id: 'copy', iconName: 'copy', text: 'Copy' },
                { type: 'icon-button', id: 'edit', iconName: 'edit', text: 'Edit' },
                { type: 'icon-button', id: 'remove', iconName: 'remove', text: 'Remove' },
              ]}
            />
          </SpaceBetween>
        </Heroshot>
      </Section>

      <Section title="Alert">
        <Heroshot label="Info with link" stretch={true}>
          <Alert i18nStrings={alertI18nStrings} type="info" header="Instance type updated" dismissible={true}>
            The change applies after the next restart. <Link href="#">Learn more</Link>
          </Alert>
        </Heroshot>

        <Heroshot label="Types" stretch={true}>
          <SpaceBetween size="xs">
            <Alert i18nStrings={alertI18nStrings} type="success" header="Resource created" />
            <Alert i18nStrings={alertI18nStrings} type="warning" header="Approaching service quota" />
            <Alert i18nStrings={alertI18nStrings} type="error" header="Unable to delete resource" />
          </SpaceBetween>
        </Heroshot>

        <Heroshot label="Error with action" stretch={true}>
          <Alert
            i18nStrings={alertI18nStrings}
            type="error"
            header="Unable to load instances"
            action={<Button>Retry</Button>}
          >
            The request timed out after 30 seconds.
          </Alert>
        </Heroshot>
      </Section>

      <Section title="Autosuggest">
        <Heroshot label="Open suggestions" align="start" stretch={true}>
          <OpenAutosuggest />
        </Heroshot>

        <Heroshot label="With form field" stretch={true}>
          <FormField label="Region" description="Choose the region to deploy to.">
            <ClosedAutosuggest value="us-east-1" />
          </FormField>
        </Heroshot>

        <Heroshot label="Empty" stretch={true}>
          <ClosedAutosuggest value="" />
        </Heroshot>
      </Section>
    </SimplePage>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <SpaceBetween size="s">
      <Box variant="h2">{title}</Box>
      <SpaceBetween size="l" direction="horizontal">
        {children}
      </SpaceBetween>
    </SpaceBetween>
  );
}

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
      onOutsideClick={() => {}}
      onMouseDown={() => {}}
      trigger={<ClosedAutosuggest value={highlightText} />}
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

function ClosedAutosuggest({ value: initialValue }: { value: string }) {
  const [value, setValue] = useState(initialValue);

  return (
    <Autosuggest
      value={value}
      onChange={event => setValue(event.detail.value)}
      options={autosuggestOptions}
      ariaLabel="Region"
      placeholder="Choose a region"
      enteredTextLabel={enteredTextLabel}
      empty="No matches found"
    />
  );
}
