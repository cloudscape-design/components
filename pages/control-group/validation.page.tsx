// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import FormField from '~components/form-field';
import ControlGroup, { ControlGroupProps } from '~components/internal/components/control-group';

import { PermutationsPage } from '../app/templates';
import createPermutations from '../utils/permutations';
import PermutationsView from '../utils/permutations-view';
import {
  ControlGroupValidationSettingsPanel,
  ControlKind,
  renderControl,
  useControlGroupValidationSettings,
} from './common';

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

const action: ControlGroupProps['actionButton'] = { iconName: 'remove', ariaLabel: 'Remove' };

export default function ControlGroupValidationSettings() {
  const { settings, setSettings } = useControlGroupValidationSettings();

  const errorText = settings.group === 'error' ? 'This value is required' : undefined;
  const warningText = settings.group === 'warning' ? 'Double-check this value' : undefined;

  return (
    <PermutationsPage
      title="Control group validation"
      i18n={{}}
      settings={<ControlGroupValidationSettingsPanel settings={settings} setSettings={setSettings} />}
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
