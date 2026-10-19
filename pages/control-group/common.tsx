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

// Control kinds that can appear inside a group. The validatable ones (input/autosuggest/select/
// multiselect) accept a per-control validation state; segmentedControl has no validation.
export type ControlKind = ValidatableControl | 'segmentedControl';

// Builds a control of the given kind, applying the per-control validation state where supported.
export function renderControl(kind: ControlKind, validation: Record<ValidatableControl, ValidationState>) {
  switch (kind) {
    case 'input':
      return <Input ariaLabel="Value" value="service" onChange={noop} {...validationProps(validation.input)} />;
    case 'autosuggest':
      return (
        <Autosuggest
          ariaLabel="Metric"
          value="CPU"
          onChange={noop}
          options={suggestions}
          enteredTextLabel={enteredTextLabel}
          {...validationProps(validation.autosuggest)}
        />
      );
    case 'select':
      return (
        <Select
          ariaLabel="Operator"
          selectedOption={operators[0]}
          options={operators}
          onChange={noop}
          {...validationProps(validation.select)}
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
          {...validationProps(validation.multiselect)}
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

// The individual controls that support a validation state (invalid / warning).
export type ValidatableControl = 'input' | 'autosuggest' | 'select' | 'multiselect';

export interface ControlGroupValidationSettings {
  // The group-as-a-unit validation, applied through the surrounding FormField.
  group: ValidationState;
  // Per-control validation, applied to each control's own `invalid` / `warning` prop.
  input: ValidationState;
  autosuggest: ValidationState;
  select: ValidationState;
  multiselect: ValidationState;
  // Group-level layout settings, extracted from the former validation page's permutation axes.
  direction: Direction;
  label: boolean;
  actionButton: boolean;
}

const parseValidationState = (value: unknown): ValidationState =>
  value === 'error' ? 'error' : value === 'warning' ? 'warning' : 'none';

// Translates a validation state into the `invalid` / `warning` props shared by the controls.
export function validationProps(state: ValidationState): { invalid?: boolean; warning?: boolean } {
  return { invalid: state === 'error' || undefined, warning: state === 'warning' || undefined };
}

// Maps each setting to the URL-param name that persists it (so integ tests can target the state
// and links are shareable). Direction reuses the shared `controlGroupDirection` param.
const paramKeys: Record<keyof ControlGroupValidationSettings, string> = {
  group: 'controlGroupValidationGroup',
  input: 'controlGroupValidationInput',
  autosuggest: 'controlGroupValidationAutosuggest',
  select: 'controlGroupValidationSelect',
  multiselect: 'controlGroupValidationMultiselect',
  direction: 'controlGroupDirection',
  label: 'controlGroupLabel',
  actionButton: 'controlGroupActionButton',
};

export function useControlGroupValidationSettings() {
  const { urlParams, setUrlParams } = useAppContext<(typeof paramKeys)[keyof typeof paramKeys]>();

  const settings: ControlGroupValidationSettings = {
    group: parseValidationState(urlParams[paramKeys.group]),
    input: parseValidationState(urlParams[paramKeys.input]),
    autosuggest: parseValidationState(urlParams[paramKeys.autosuggest]),
    select: parseValidationState(urlParams[paramKeys.select]),
    multiselect: parseValidationState(urlParams[paramKeys.multiselect]),
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

type ValidationKey = 'group' | 'input' | 'autosuggest' | 'select' | 'multiselect';

export function ControlGroupValidationSettingsPanel({
  settings,
  setSettings,
}: {
  settings: ControlGroupValidationSettings;
  setSettings: (next: Partial<ControlGroupValidationSettings>) => void;
}) {
  const validationField = (key: ValidationKey, label: string) => (
    <FormField label={label}>
      <RadioGroup
        value={settings[key]}
        onChange={({ detail }) => setSettings({ [key]: detail.value as ValidationState })}
        items={validationItems}
      />
    </FormField>
  );

  return (
    <SpaceBetween size="l" direction="horizontal">
      {validationField('group', 'Control group')}
      {validationField('input', 'Input')}
      {validationField('autosuggest', 'Autosuggest')}
      {validationField('select', 'Select')}
      {validationField('multiselect', 'Multiselect')}
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
