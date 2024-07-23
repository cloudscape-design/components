// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Button from '~components/button';
import ColumnLayout from '~components/column-layout';
import FormField, { FormFieldProps } from '~components/form-field';
import Input, { InputProps } from '~components/input';
import TextContent from '~components/text-content';

import ScreenshotArea from '../utils/screenshot-area';

const defaultInputProps = {
  value: '',
  onChange: () => {},
};

const primaryControl = (props: Partial<InputProps>) => <Input {...defaultInputProps} {...props} />;

// TODO: Replace this with Select
const secondaryControl = (props: Partial<InputProps>) => (
  <Input {...defaultInputProps} {...props} ariaLabel="Label for the secondary" />
);

const primaryMultiControl = (props: Partial<InputProps>) => {
  return (
    <ColumnLayout columns={2}>
      {primaryControl(props)}
      {secondaryControl(props)}
    </ColumnLayout>
  );
};

interface Scenario {
  columns?: number;
  label?: string;
  control: (props: Partial<InputProps>) => JSX.Element;
  secondaryControl?: (props: Partial<InputProps>) => JSX.Element;
  stretch?: boolean;
}

const scenarios: Array<Scenario> = [
  { label: 'Default primary', control: primaryControl, stretch: undefined },
  {
    label: 'Default primary and secondary',
    control: primaryControl,
    secondaryControl: secondaryControl,
    stretch: undefined,
  },
  { label: 'Primary stretched', control: primaryControl, stretch: true },
  {
    label: 'Primary and secondary stretched',
    control: primaryControl,
    secondaryControl: secondaryControl,
    stretch: true,
  },
  {
    label: 'Primary contains a column layout, no secondary control',
    control: primaryMultiControl,
    stretch: undefined,
  },
  {
    label: 'Primary contains a column layout',
    control: primaryMultiControl,
    secondaryControl: secondaryControl,
    stretch: undefined,
  },
  { columns: 1, label: 'Default primary inside a column layout', control: primaryControl, stretch: undefined },
  {
    columns: 1,
    label: 'Default primary and secondary inside a column layout',
    control: primaryControl,
    secondaryControl: secondaryControl,
    stretch: undefined,
  },
  { columns: 2, label: 'Default primary inside a multi column layout', control: primaryControl, stretch: undefined },
  {
    columns: 2,
    label: 'Default primary and secondary inside a multi column layout',
    control: primaryControl,
    secondaryControl: secondaryControl,
    stretch: undefined,
  },
  {
    columns: 2,
    label: 'Default primary inside a multi column layout, no-stretch explicitly defined',
    control: primaryControl,
    stretch: false,
  },
  {
    columns: 2,
    label: 'Default primary and secondary inside a multi column layout, no-stretch explicitly defined',
    control: primaryControl,
    secondaryControl: secondaryControl,
    stretch: false,
  },
  {
    label: 'Default primary inside a column layout',
    control: primaryControl,
    secondaryControl: () => <Button>VeryLongAndUglyTextWithNoSpaces</Button>,
    stretch: undefined,
  },
];

export default function FormFieldControlScenario() {
  const nested = (props: InputProps) => (
    <FormField secondaryControl={secondaryControl({})} label="Nested primary label">
      {primaryControl(props)}
    </FormField>
  );
  const nestedStretch = (props: FormFieldProps) => (
    <FormField
      secondaryControl={secondaryControl({})}
      stretch={true}
      label="Nested secondary label (stretch)"
      {...props}
    >
      {primaryControl({})}
    </FormField>
  );

  const nestedScenarios = [
    { label: 'Nested form fields: stretch outer', control: nested, secondaryControl: nestedStretch, stretch: true },
    { label: 'Nested form fields', control: nested, secondaryControl: nestedStretch, stretch: undefined },
  ];

  const formField = (scenario: Scenario, key: string) => {
    let secondaryControl = null;
    if (scenario.secondaryControl) {
      secondaryControl = scenario.secondaryControl({});
    }

    return (
      <FormField
        label={scenario.label}
        constraintText="Some constraint text."
        description="A detailed description."
        secondaryControl={secondaryControl}
        stretch={scenario.stretch}
        key={key}
      >
        {primaryControl({})}
      </FormField>
    );
  };

  const columnLayout = (scenario: Scenario, idx: number, key: string) => {
    const formFields = [];
    for (let i = 0; i < scenario.columns!; i++) {
      formFields.push(formField(scenario, `scenario-${idx}-column-${i}`));
    }

    return (
      <ColumnLayout columns={scenario.columns} key={key}>
        {formFields}
      </ColumnLayout>
    );
  };

  const createScenarios = () => {
    return scenarios.map((scenario, idx) => {
      return scenario.columns ? columnLayout(scenario, idx, `scenario-${idx}`) : formField(scenario, `scenario-${idx}`);
    });
  };

  const createNestedScenarios = () =>
    nestedScenarios.map((scenario, idx) => {
      const controlId = `nested-scenario-${idx}`;

      return (
        <FormField
          label={scenario.label}
          constraintText="Some constraint text."
          description="A detailed description"
          stretch={scenario.stretch}
          key={controlId}
          secondaryControl={
            <FormField secondaryControl={secondaryControl({})} stretch={true} label="Nested secondary label (stretch)">
              {primaryControl({})}
            </FormField>
          }
        >
          <FormField secondaryControl={secondaryControl({})} label="Nested primary label">
            {primaryControl({})}
          </FormField>
        </FormField>
      );
    });

  return (
    <div>
      <TextContent>
        <h1>Form fields in multiple columns</h1>
        <ul>
          <li>Primary control consumes 9 columns (8 in refresh) out of 12 by default</li>
          <li>Primary control consumes 12 columns out of 12 on small screens</li>
          <li>Secondary control consumes 3 columns (4 in refresh) out of 12 by default</li>
          <li>Secondary control consumes 12 columns out of 12 on small screens, stacks below the primary</li>
          <li>
            Primary control consumes 12 columns out of 12 when it is a multi column layout or stretch is explicitly set,
            and secondary control stacks if defined
          </li>
          <li>Both stretch when the form field is placed inside a multi column layout</li>
        </ul>
      </TextContent>

      <ScreenshotArea>
        {createScenarios()}
        {createNestedScenarios()}
      </ScreenshotArea>
    </div>
  );
}
