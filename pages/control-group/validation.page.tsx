// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { SpaceBetween } from '~components';
import FormField from '~components/form-field';
import Input from '~components/input';
import ControlGroup from '~components/internal/components/control-group';
import Select from '~components/select';

import { SimplePage } from '../app/templates';
import { input, noop, operators, select, useControlGroupDirection } from './common';
import { DirectionSettings } from './common';

// A three-control group makes the middle control's neutral seam edges visible:
// only its first and last siblings paint an outward-facing group edge.
const threeControls = [
  <Select key="op" ariaLabel="Operator" selectedOption={operators[0]} options={operators} onChange={noop} />,
  <Input key="value" ariaLabel="Value" value="service" onChange={noop} />,
  <Select key="unit" ariaLabel="Unit" selectedOption={operators[0]} options={operators} onChange={noop} />,
];

export default function ControlGroupValidation() {
  const { direction, setDirection } = useControlGroupDirection();

  return (
    <SimplePage
      title="Control group validation"
      subtitle="Each control paints the error/warning color on its own outward-facing border edges only — the edges that do not touch an adjacent control. The seams between controls stay neutral. The group's leading (inline-start) edge is rendered by the first control with the same extra-thick border width the inner controls use for validation, independent of whether a group has an action button; the action button's edges stay neutral. The styling persists on hover. Toggle the direction to see horizontal and vertical (stacked) groups."
      settings={<DirectionSettings direction={direction} setDirection={setDirection} />}
      i18n={{}}
      screenshotArea={{}}
    >
      <SpaceBetween size="l">
        <FormField label="Error state" errorText="This value is required">
          <ControlGroup direction={direction}>
            {input}
            {select}
          </ControlGroup>
        </FormField>

        <FormField label="Warning state" warningText="Double-check this value">
          <ControlGroup direction={direction}>
            {input}
            {select}
          </ControlGroup>
        </FormField>

        <FormField label="Error state with action button" errorText="This value is required">
          <ControlGroup direction={direction} actionButton={{ iconName: 'remove', ariaLabel: 'Remove' }}>
            {input}
            {select}
          </ControlGroup>
        </FormField>

        <FormField label="Warning state with action button" warningText="Double-check this value">
          <ControlGroup direction={direction} actionButton={{ iconName: 'remove', ariaLabel: 'Remove' }}>
            {input}
            {select}
          </ControlGroup>
        </FormField>

        <FormField label="Error state (three controls)" errorText="This value is required">
          <ControlGroup direction={direction}>{threeControls}</ControlGroup>
        </FormField>

        <FormField label="Warning state (three controls)" warningText="Double-check this value">
          <ControlGroup direction={direction}>{threeControls}</ControlGroup>
        </FormField>

        <FormField label="Error state with action button (three controls)" errorText="This value is required">
          <ControlGroup direction={direction} actionButton={{ iconName: 'remove', ariaLabel: 'Remove' }}>
            {threeControls}
          </ControlGroup>
        </FormField>

        <FormField label="Warning state with action button (three controls)" warningText="Double-check this value">
          <ControlGroup direction={direction} actionButton={{ iconName: 'remove', ariaLabel: 'Remove' }}>
            {threeControls}
          </ControlGroup>
        </FormField>

        <FormField
          label="Error wins over warning"
          errorText="This value is required"
          warningText="Ignored while invalid"
        >
          <ControlGroup direction={direction}>
            {input}
            {select}
          </ControlGroup>
        </FormField>
      </SpaceBetween>
    </SimplePage>
  );
}
