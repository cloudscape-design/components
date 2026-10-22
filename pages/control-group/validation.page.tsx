// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Autosuggest from '~components/autosuggest';
import Checkbox from '~components/checkbox';
import ControlGroup, { ControlGroupProps } from '~components/control-group';
import FormField from '~components/form-field';
import Input from '~components/input';
import Multiselect from '~components/multiselect';
import RadioGroup from '~components/radio-group';
import SegmentedControl from '~components/segmented-control';
import Select from '~components/select';
import SpaceBetween from '~components/space-between';

import { useAppContext } from '../app/app-context';
import { PermutationsPage } from '../app/templates';
import createPermutations from '../utils/permutations';
import PermutationsView from '../utils/permutations-view';
import { Direction, multiOptions, noop, operators, segments, suggestions } from './common';

type ValidationState = 'none' | 'error' | 'warning';

// The individual controls that can be individually disabled.
type StatefulControl = 'input' | 'autosuggest' | 'select' | 'multiselect';

// Control kinds that can appear inside a group. The stateful ones can be disabled;
// segmentedControl cannot.
type ControlKind = StatefulControl | 'segmentedControl';

// Things that can appear in the `disabled` list: the stateful controls plus the action button.
type Disableable = StatefulControl | 'actionbutton';

const disableableItems: ReadonlyArray<Disableable> = ['input', 'autosuggest', 'select', 'multiselect', 'actionbutton'];

interface ControlGroupValidationSettings {
  // The group-as-a-unit validation, applied through the surrounding FormField.
  group: ValidationState;
  // The set of controls (and the action button) rendered in their disabled state.
  disabled: ReadonlySet<Disableable>;
  direction: Direction;
  label: boolean;
  actionButton: boolean;
}

const parseValidationState = (value: unknown): ValidationState =>
  value === 'error' ? 'error' : value === 'warning' ? 'warning' : 'none';

const parseDirection = (value: unknown): Direction => (value === 'vertical' ? 'vertical' : 'horizontal');

// Parses a comma-separated, lowercase list of control names into a set.
function parseDisabled(value: unknown): ReadonlySet<Disableable> {
  if (typeof value !== 'string') {
    return new Set();
  }
  const names = value.split(',').map(name => name.trim().toLowerCase());
  return new Set(disableableItems.filter(item => names.includes(item)));
}

// Serializes the disabled set back into a comma-separated, lowercase list in a stable order.
function serializeDisabled(disabled: ReadonlySet<Disableable>): string {
  return disableableItems.filter(item => disabled.has(item)).join(',');
}

// Translates the disabled set into a control's `disabled` prop.
function stateProps(control: StatefulControl, disabled: ReadonlySet<Disableable>): { disabled?: boolean } {
  return { disabled: disabled.has(control) || undefined };
}

// Builds a control of the given kind, applying the disabled state where supported.
function renderControl(kind: ControlKind, disabled: ReadonlySet<Disableable>) {
  switch (kind) {
    case 'input':
      return <Input ariaLabel="Value" value="service" onChange={noop} {...stateProps('input', disabled)} />;
    case 'autosuggest':
      return (
        <Autosuggest
          ariaLabel="Metric"
          value="CPU"
          onChange={noop}
          options={suggestions}
          {...stateProps('autosuggest', disabled)}
        />
      );
    case 'select':
      return (
        <Select
          ariaLabel="Operator"
          selectedOption={operators[0]}
          options={operators}
          onChange={noop}
          {...stateProps('select', disabled)}
        />
      );
    case 'multiselect':
      return (
        <Multiselect
          ariaLabel="Labels"
          selectedOptions={[multiOptions[0]]}
          options={multiOptions}
          onChange={noop}
          {...stateProps('multiselect', disabled)}
        />
      );
    case 'segmentedControl':
      return <SegmentedControl selectedId="and" options={segments} label="Join" onChange={noop} />;
  }
}

type ParamName = 'group' | 'disabled' | 'controlGroupDirection' | 'label' | 'actionButton';

function useControlGroupValidationSettings() {
  const { urlParams, setUrlParams } = useAppContext<ParamName>();

  const settings: ControlGroupValidationSettings = {
    group: parseValidationState(urlParams.group),
    disabled: parseDisabled(urlParams.disabled),
    direction: parseDirection(urlParams.controlGroupDirection),
    label: urlParams.label === true,
    actionButton: urlParams.actionButton === true,
  };

  const setSettings = (next: Partial<ControlGroupValidationSettings>) =>
    setUrlParams({
      ...(next.group !== undefined && { group: next.group }),
      ...(next.disabled !== undefined && { disabled: serializeDisabled(next.disabled) }),
      ...(next.direction !== undefined && { controlGroupDirection: next.direction }),
      ...(next.label !== undefined && { label: next.label }),
      ...(next.actionButton !== undefined && { actionButton: next.actionButton }),
    });

  return { settings, setSettings };
}

// Returns a copy of the disabled set with `item` added or removed.
function toggleDisabled(disabled: ReadonlySet<Disableable>, item: Disableable, checked: boolean): Set<Disableable> {
  const next = new Set(disabled);
  if (checked) {
    next.add(item);
  } else {
    next.delete(item);
  }
  return next;
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
      <FormField label="Validation state">
        <RadioGroup
          value={settings.group}
          onChange={({ detail }) => setSettings({ group: parseValidationState(detail.value) })}
          items={validationItems}
        />
      </FormField>
      <FormField label="Disabled controls">
        <SpaceBetween size="xs">
          {statefulControls.map(({ key, label }) => (
            <Checkbox
              key={key}
              checked={settings.disabled.has(key)}
              onChange={({ detail }) =>
                setSettings({ disabled: toggleDisabled(settings.disabled, key, detail.checked) })
              }
            >
              {label}
            </Checkbox>
          ))}
          <Checkbox
            checked={settings.disabled.has('actionbutton')}
            onChange={({ detail }) =>
              setSettings({ disabled: toggleDisabled(settings.disabled, 'actionbutton', detail.checked) })
            }
          >
            Action button
          </Checkbox>
        </SpaceBetween>
      </FormField>
      <FormField label="Direction">
        <RadioGroup
          value={settings.direction}
          onChange={({ detail }) => setSettings({ direction: parseDirection(detail.value) })}
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
    disabled: settings.disabled.has('actionbutton'),
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
                <React.Fragment key={index}>{renderControl(kind, settings.disabled)}</React.Fragment>
              ))}
            </ControlGroup>
          </FormField>
        )}
      />
    </PermutationsPage>
  );
}
