// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Autosuggest from '~components/autosuggest';
import Checkbox from '~components/checkbox';
import FormField from '~components/form-field';
import Input from '~components/input';
import ControlGroup, { ControlGroupProps } from '~components/internal/components/control-group';
import Multiselect from '~components/multiselect';
import RadioGroup from '~components/radio-group';
import SegmentedControl from '~components/segmented-control';
import Select from '~components/select';
import SpaceBetween from '~components/space-between';

import { useAppContext } from '../app/app-context';
import { PermutationsPage } from '../app/templates';
import createPermutations from '../utils/permutations';
import PermutationsView from '../utils/permutations-view';
import { Direction, enteredTextLabel, multiOptions, noop, operators, segments, suggestions } from './common';

type ValidationState = 'none' | 'error' | 'warning';

// Per-control state: either normal or disabled.
type ControlState = 'none' | 'disabled';

// The individual controls that take a per-control state.
type StatefulControl = 'input' | 'autosuggest' | 'select' | 'multiselect';

// Control kinds that can appear inside a group. The stateful ones take a per-control disabled
// state; segmentedControl has none.
type ControlKind = StatefulControl | 'segmentedControl';

interface ControlGroupValidationSettings {
  // The group-as-a-unit validation, applied through the surrounding FormField.
  group: ValidationState;
  // Per-control state, applied to each control's own `disabled` prop.
  input: ControlState;
  autosuggest: ControlState;
  select: ControlState;
  multiselect: ControlState;
  // Group-level layout settings, extracted from the former validation page's permutation axes.
  direction: Direction;
  label: boolean;
  actionButton: boolean;
  // Renders the action button (when present) in its disabled state.
  actionButtonDisabled: boolean;
}

const parseValidationState = (value: unknown): ValidationState =>
  value === 'error' ? 'error' : value === 'warning' ? 'warning' : 'none';

const parseControlState = (value: unknown): ControlState => (value === 'disabled' ? 'disabled' : 'none');

// Translates a per-control state into the `disabled` prop.
function stateProps(state: ControlState): { disabled?: boolean } {
  return { disabled: state === 'disabled' || undefined };
}

// Builds a control of the given kind, applying the per-control state where supported.
function renderControl(kind: ControlKind, controlStates: Record<StatefulControl, ControlState>) {
  switch (kind) {
    case 'input':
      return <Input ariaLabel="Value" value="service" onChange={noop} {...stateProps(controlStates.input)} />;
    case 'autosuggest':
      return (
        <Autosuggest
          ariaLabel="Metric"
          value="CPU"
          onChange={noop}
          options={suggestions}
          enteredTextLabel={enteredTextLabel}
          {...stateProps(controlStates.autosuggest)}
        />
      );
    case 'select':
      return (
        <Select
          ariaLabel="Operator"
          selectedOption={operators[0]}
          options={operators}
          onChange={noop}
          {...stateProps(controlStates.select)}
        />
      );
    case 'multiselect':
      return (
        <Multiselect
          ariaLabel="Labels"
          inlineTokens={true}
          selectedOptions={[multiOptions[0]]}
          options={multiOptions}
          onChange={noop}
          {...stateProps(controlStates.multiselect)}
        />
      );
    case 'segmentedControl':
      return <SegmentedControl selectedId="and" options={segments} label="Join" onChange={noop} />;
  }
}

// Maps each setting to the URL-param name that persists it (so integ tests can target the state
// and links are shareable). Direction reuses the shared `controlGroupDirection` param.
const paramKeys: Record<keyof ControlGroupValidationSettings, string> = {
  group: 'controlGroupValidationGroup',
  input: 'controlGroupStateInput',
  autosuggest: 'controlGroupStateAutosuggest',
  select: 'controlGroupStateSelect',
  multiselect: 'controlGroupStateMultiselect',
  direction: 'controlGroupDirection',
  label: 'controlGroupLabel',
  actionButton: 'controlGroupActionButton',
  actionButtonDisabled: 'controlGroupActionButtonDisabled',
};

function useControlGroupValidationSettings() {
  const { urlParams, setUrlParams } = useAppContext<(typeof paramKeys)[keyof typeof paramKeys]>();

  const settings: ControlGroupValidationSettings = {
    group: parseValidationState(urlParams[paramKeys.group]),
    input: parseControlState(urlParams[paramKeys.input]),
    autosuggest: parseControlState(urlParams[paramKeys.autosuggest]),
    select: parseControlState(urlParams[paramKeys.select]),
    multiselect: parseControlState(urlParams[paramKeys.multiselect]),
    direction: urlParams[paramKeys.direction] === 'vertical' ? 'vertical' : 'horizontal',
    label: urlParams[paramKeys.label] === true,
    actionButton: urlParams[paramKeys.actionButton] === true,
    actionButtonDisabled: urlParams[paramKeys.actionButtonDisabled] === true,
  };

  const setSettings = (next: Partial<ControlGroupValidationSettings>) =>
    setUrlParams(
      Object.fromEntries(
        Object.entries(next).map(([key, value]) => [paramKeys[key as keyof ControlGroupValidationSettings], value])
      )
    );

  return { settings, setSettings };
}

const validationItems: ReadonlyArray<{ value: ValidationState; label: string }> = [
  { value: 'none', label: 'None' },
  { value: 'error', label: 'Error' },
  { value: 'warning', label: 'Warning' },
];

// The controls listed in the "Disabled controls" field, in display order.
const statefulControls: ReadonlyArray<{ key: StatefulControl; label: string }> = [
  { key: 'input', label: 'Input' },
  { key: 'autosuggest', label: 'Autosuggest' },
  { key: 'select', label: 'Select' },
  { key: 'multiselect', label: 'Multiselect' },
];

function SettingsPanel({
  settings,
  setSettings,
}: {
  settings: ControlGroupValidationSettings;
  setSettings: (next: Partial<ControlGroupValidationSettings>) => void;
}) {
  return (
    <SpaceBetween size="xxl" direction="horizontal">
      <FormField label="Control group">
        <RadioGroup
          value={settings.group}
          onChange={({ detail }) => setSettings({ group: detail.value as ValidationState })}
          items={validationItems}
        />
      </FormField>
      <FormField label="Disabled controls">
        <SpaceBetween size="xs">
          {statefulControls.map(({ key, label }) => (
            <Checkbox
              key={key}
              checked={settings[key] === 'disabled'}
              onChange={({ detail }) => setSettings({ [key]: detail.checked ? 'disabled' : 'none' })}
            >
              {label}
            </Checkbox>
          ))}
          <Checkbox
            checked={settings.actionButtonDisabled}
            onChange={({ detail }) => setSettings({ actionButtonDisabled: detail.checked })}
          >
            Action button
          </Checkbox>
        </SpaceBetween>
      </FormField>
      <FormField label="Direction">
        <RadioGroup
          value={settings.direction}
          onChange={({ detail }) => setSettings({ direction: detail.value as Direction })}
          items={[
            { value: 'horizontal', label: 'Horizontal' },
            { value: 'vertical', label: 'Vertical' },
          ]}
        />
      </FormField>
      <SpaceBetween size="xs">
        <Checkbox checked={settings.label} onChange={({ detail }) => setSettings({ label: detail.checked })}>
          Inline label
        </Checkbox>
        <Checkbox
          checked={settings.actionButton}
          onChange={({ detail }) => setSettings({ actionButton: detail.checked })}
        >
          Action button
        </Checkbox>
      </SpaceBetween>
    </SpaceBetween>
  );
}

// The same child combinations the former validation page covered, as control-kind sequences.
// Validation state and inline-label presence are now settings, so they are no longer axes here.
const combinations: ReadonlyArray<ControlKind[]> = [
  ['input', 'select'],
  ['input', 'segmentedControl'],
  ['select', 'multiselect'],
  ['autosuggest', 'select'],
  ['input', 'select', 'multiselect'],
  ['input', 'segmentedControl', 'select'],
  ['select', 'autosuggest', 'multiselect'],
];

const permutations = createPermutations<{ controls: ControlKind[] }>([{ controls: combinations }]);

export default function ControlGroupValidationSettings() {
  const { settings, setSettings } = useControlGroupValidationSettings();

  const errorText = settings.group === 'error' ? 'This value is required' : undefined;
  const warningText = settings.group === 'warning' ? 'Double-check this value' : undefined;

  const action: ControlGroupProps['actionButton'] = {
    iconName: 'remove',
    ariaLabel: 'Remove',
    disabled: settings.actionButtonDisabled,
  };

  return (
    <PermutationsPage
      title="Control group validation"
      i18n={{}}
      settings={<SettingsPanel settings={settings} setSettings={setSettings} />}
    >
      <PermutationsView
        permutations={permutations}
        render={({ controls }) => (
          <FormField errorText={errorText} warningText={warningText}>
            <ControlGroup
              direction={settings.direction}
              inlineLabelText={settings.label ? 'Label' : undefined}
              actionButton={settings.actionButton ? action : undefined}
            >
              {controls.map((kind, index) => (
                <React.Fragment key={index}>{renderControl(kind, settings)}</React.Fragment>
              ))}
            </ControlGroup>
          </FormField>
        )}
      />
    </PermutationsPage>
  );
}
