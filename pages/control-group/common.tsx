// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Autosuggest, { AutosuggestProps } from '~components/autosuggest';
import Checkbox from '~components/checkbox';
import FormField from '~components/form-field';
import Input from '~components/input';
import { ControlGroupProps } from '~components/internal/components/control-group/interfaces';
import Multiselect, { MultiselectProps } from '~components/multiselect';
import RadioGroup from '~components/radio-group';
import SegmentedControl, { SegmentedControlProps } from '~components/segmented-control';
import Select, { SelectProps } from '~components/select';
import SpaceBetween from '~components/space-between';

import { useAppContext } from '../app/app-context';

export const noop = () => {
  /* empty handler to suppress controlled-component warnings */
};

export const operators: SelectProps.Option[] = [
  { value: '=', label: '=' },
  { value: '!=', label: '!=' },
];

export const multiOptions: MultiselectProps.Option[] = [
  { value: '1', label: 'Option 1' },
  { value: '2', label: 'Option 2' },
];

export const segments: SegmentedControlProps.Option[] = [
  { id: 'and', text: 'AND' },
  { id: 'or', text: 'OR' },
];

export const enteredTextLabel = (value: string) => `Use: ${value}`;

export const suggestions: AutosuggestProps.Option[] = [{ value: 'CPUUtilization' }, { value: 'MemoryUtilization' }];

export const input = <Input ariaLabel="Value" value="service" onChange={noop} />;

export const select = <Select ariaLabel="Operator" selectedOption={operators[0]} options={operators} onChange={noop} />;

export const multiselect = (
  <Multiselect
    ariaLabel="Labels"
    inlineTokens={true}
    selectedOptions={[multiOptions[0]]}
    options={multiOptions}
    onChange={noop}
  />
);

export const segmentedControl = <SegmentedControl selectedId="and" options={segments} label="Join" onChange={noop} />;

export const autosuggest = (
  <Autosuggest
    ariaLabel="Metric"
    value="CPU"
    onChange={noop}
    options={suggestions}
    enteredTextLabel={enteredTextLabel}
  />
);

export const autosuggestTokens = (
  <Autosuggest
    ariaLabel="Metrics"
    value=""
    tokens={[{ value: 'CPUUtilization' }, { value: 'MemoryUtilization' }]}
    onChange={noop}
    options={suggestions}
    enteredTextLabel={enteredTextLabel}
  />
);

// Control kinds that can appear inside a group. The stateful ones (input/autosuggest/select/
// multiselect) accept a per-control disabled / read-only state; segmentedControl has none.
export type ControlKind = StatefulControl | 'segmentedControl';

// Translates a per-control state into the `disabled` prop.
function stateProps(state: ControlState): { disabled?: boolean } {
  return { disabled: state === 'disabled' || undefined };
}

// Builds a control of the given kind, applying the per-control state where supported.
export function renderControl(kind: ControlKind, controlStates: Record<StatefulControl, ControlState>) {
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

export type Direction = NonNullable<ControlGroupProps['direction']>;

export function useControlGroupDirection() {
  const { urlParams, setUrlParams } = useAppContext<'controlGroupDirection'>(); // The name `direction` is already taken for the LTR/RTL URL parameter
  const direction: Direction = urlParams.controlGroupDirection === 'vertical' ? 'vertical' : 'horizontal';
  const setDirection = (value: Direction) => setUrlParams({ controlGroupDirection: value });
  return { direction, setDirection };
}

export function DirectionSettings({
  direction,
  setDirection,
}: {
  direction: Direction;
  setDirection: (value: Direction) => void;
}) {
  return (
    <FormField label="Direction">
      <RadioGroup
        value={direction}
        onChange={({ detail }) => setDirection(detail.value as Direction)}
        items={[
          { value: 'horizontal', label: 'Horizontal' },
          { value: 'vertical', label: 'Vertical' },
        ]}
      />
    </FormField>
  );
}

export type ValidationState = 'none' | 'error' | 'warning';

// Per-control state: either normal or disabled.
export type ControlState = 'none' | 'disabled';

// The individual controls that take a per-control state.
export type StatefulControl = 'input' | 'autosuggest' | 'select' | 'multiselect';

export interface ControlGroupValidationSettings {
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
}

const parseValidationState = (value: unknown): ValidationState =>
  value === 'error' ? 'error' : value === 'warning' ? 'warning' : 'none';

const parseControlState = (value: unknown): ControlState => (value === 'disabled' ? 'disabled' : 'none');

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
};

export function useControlGroupValidationSettings() {
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

export function ControlGroupValidationSettingsPanel({
  settings,
  setSettings,
}: {
  settings: ControlGroupValidationSettings;
  setSettings: (next: Partial<ControlGroupValidationSettings>) => void;
}) {
  return (
    <SpaceBetween size="l" direction="horizontal">
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
