// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Autosuggest, { AutosuggestProps } from '~components/autosuggest';
import Container from '~components/container';
import ControlGroup from '~components/control-group';
import Header from '~components/header';
import Multiselect, { MultiselectProps } from '~components/multiselect';
import Select, { SelectProps } from '~components/select';
import SpaceBetween from '~components/space-between';

import { SimplePage } from '../app/templates';

const resizableContainerStyle: React.CSSProperties = {
  resize: 'horizontal',
  overflow: 'auto',
  inlineSize: 950,
  minInlineSize: 200,
  maxInlineSize: '100%',
  padding: 16,
  paddingBlockEnd: 150,
  border: '1px dashed var(--awsui-color-border-divider-default, #b6bec9)',
  borderRadius: 8,
};

const enteredTextLabel = (value: string) => `Use: ${value}`;

// Fixed width used to pin each control in the second example. Because the control fills
// its wrapper (`inline-size: 100%`), the wrapper's hardcoded width — not the selected
// content — determines the control's width, so switching options no longer swings it.
const FIXED_CONTROL_WIDTH = 200;

// Options whose labels have VERY different lengths. The point of this example is that a
// Select / Multiselect / Autosuggest trigger sizes to its selected content, so switching
// between a short and a long option swings the control's intrinsic width — and because a
// ControlGroup row is content-sized, that swing changes the whole group's natural width
// and thus when it wraps. Resize the container (or just change the selection) to see it.
const REGION_OPTIONS: SelectProps.Option[] = [
  { value: 'us', label: 'US' },
  { value: 'eu-west', label: 'Europe (Ireland)' },
  {
    value: 'emea',
    label: 'Europe, Middle East, and Africa — consolidated reporting region',
  },
];

const SCOPE_OPTIONS: MultiselectProps.Option[] = [
  { value: 'r', label: 'Read' },
  { value: 'w', label: 'Write' },
  { value: 'admin', label: 'Administer' },
  {
    value: 'audit',
    label: 'Audit, compliance, and long-term archival access across all accounts',
  },
];

const TEAM_SUGGESTIONS: AutosuggestProps.Option[] = [
  { value: 'ops' },
  { value: 'platform-engineering' },
  { value: 'security, risk, and compliance operations team' },
];

// A ControlGroup combining a Select, a Multiselect, and an Autosuggest whose option
// labels range from very short to very long. It relies on each control's built-in
// `wrapBehavior="auto"`, so the group stacks on its own once the (selection-dependent)
// content no longer fits the available width.
function LongLabelControls() {
  const [region, setRegion] = useState<SelectProps.Option>(REGION_OPTIONS[0]);
  const [scopes, setScopes] = useState<ReadonlyArray<MultiselectProps.Option>>([SCOPE_OPTIONS[0]]);
  const [team, setTeam] = useState('');
  return (
    <ControlGroup inlineLabelText="Access rule">
      <Select
        ariaLabel="Region"
        selectedOption={region}
        options={REGION_OPTIONS}
        onChange={e => setRegion(e.detail.selectedOption)}
      />
      <Multiselect
        ariaLabel="Scopes"
        placeholder="Choose scopes"
        selectedOptions={scopes}
        options={SCOPE_OPTIONS}
        inlineTokens={true}
        deselectAriaLabel={option => `Remove ${option.label}`}
        onChange={e => setScopes(e.detail.selectedOptions)}
      />
      <Autosuggest
        ariaLabel="Team"
        value={team}
        placeholder="Owning team"
        options={TEAM_SUGGESTIONS}
        enteredTextLabel={enteredTextLabel}
        clearAriaLabel="Clear"
        expandToViewport={true}
        onChange={e => setTeam(e.detail.value)}
      />
    </ControlGroup>
  );
}

// The same controls, but each is wrapped in a div with a hardcoded width. The control
// fills its wrapper, so the wrapper's fixed width — not the (long) selected label —
// decides the control's width. Switching options no longer changes any control's size,
// so the group's width is stable and its wrap point depends only on the available space.
function FixedWidthControls() {
  const [region, setRegion] = useState<SelectProps.Option>(REGION_OPTIONS[0]);
  const [scopes, setScopes] = useState<ReadonlyArray<MultiselectProps.Option>>([SCOPE_OPTIONS[0]]);
  const [team, setTeam] = useState('');
  const wrapperStyle: React.CSSProperties = { inlineSize: FIXED_CONTROL_WIDTH };
  return (
    <ControlGroup inlineLabelText="Access rule">
      <div style={wrapperStyle}>
        <Select
          ariaLabel="Region"
          selectedOption={region}
          options={REGION_OPTIONS}
          onChange={e => setRegion(e.detail.selectedOption)}
        />
      </div>
      <div style={wrapperStyle}>
        <Multiselect
          ariaLabel="Scopes"
          placeholder="Choose scopes"
          selectedOptions={scopes}
          options={SCOPE_OPTIONS}
          inlineTokens={true}
          deselectAriaLabel={option => `Remove ${option.label}`}
          onChange={e => setScopes(e.detail.selectedOptions)}
        />
      </div>
      <div style={wrapperStyle}>
        <Autosuggest
          ariaLabel="Team"
          value={team}
          placeholder="Owning team"
          options={TEAM_SUGGESTIONS}
          enteredTextLabel={enteredTextLabel}
          clearAriaLabel="Clear"
          expandToViewport={true}
          onChange={e => setTeam(e.detail.value)}
        />
      </div>
    </ControlGroup>
  );
}

export default function () {
  return (
    <SimplePage
      title="Control group with long option labels"
      subtitle="A Select, Multiselect, and Autosuggest whose option labels range from very short to very long, so the controls' widths swing with the selection. Change the selection or resize the container (drag the handle) to see the group re-wrap."
    >
      <SpaceBetween size="l">
        <Container
          header={
            <Header
              variant="h2"
              description="Each control sizes to its selected content, so the group's width changes with the selection."
            >
              Long option labels
            </Header>
          }
        >
          <div style={resizableContainerStyle}>
            <LongLabelControls />
          </div>
        </Container>

        <Container
          header={
            <Header
              variant="h2"
              description="Each control is wrapped in a div with a hardcoded width, so its size stays fixed regardless of the selected label."
            >
              Long option labels, fixed control widths
            </Header>
          }
        >
          <div style={resizableContainerStyle}>
            <FixedWidthControls />
          </div>
        </Container>
      </SpaceBetween>
    </SimplePage>
  );
}
