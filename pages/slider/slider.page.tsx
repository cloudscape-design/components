// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import Input from '~components/input';
import Box from '~components/box';
import SpaceBetween from '~components/space-between';
import FormField from '~components/form-field';
import Container from '~components/container';
import Header from '~components/header';
import { Grid, ProgressBar, Select, SelectProps, Slider } from '~components';

import styles from './styles.scss';

function Sliders() {
  const [value2, setValue2] = React.useState(200);
  const [value3, setValue3] = React.useState(50);
  const [value4, setValue4] = React.useState(4);
  const [value5, setValue5] = React.useState(0);
  const [value6, setValue6] = React.useState(25);
  const [value7, setValue7] = React.useState(2);
  const [sliderValue, setSliderValue] = useState(40);
  const [error2, setError2] = useState(false);
  const [minValue, setMinValue] = React.useState<SelectProps.Option>({ value: '5' });
  const rangeOptions = [{ value: '5' }, { value: '10' }, { value: '15' }, { value: '20' }, { value: '25' }];

  const DTWordOptions = [
    { value: 0, label: 'Backend dev' },
    { value: 2, label: 'Frontend dev' },
    { value: 4, label: `Scott O'Brien` },
    { value: 6, label: 'Jessica Kuelz ' },
    { value: 8, label: 'Katie George' },
    { value: 10, label: 'UX designer' },
  ];

  const satisfactionScaleOptions = [
    { value: 0, label: 'Extremely unsatisfied' },
    { value: 1, label: 'Somewhat satisfied' },
    { value: 2, label: `Not satisfied or unsatisfied` },
    { value: 3, label: 'Somewhat satisfied' },
    { value: 4, label: 'Extremely satisfied' },
  ];

  const satisfactionScaleOptions2 = [
    { value: 0, label: 'Extremely unsatisfied' },
    { value: 100, label: 'Somewhat satisfied' },
    { value: 200, label: `Not satisfied or unsatisfied` },
    { value: 300, label: 'Somewhat satisfied' },
    { value: 400, label: 'Extremely satisfied' },
  ];

  React.useEffect(() => {
    setError2(value2 < 0 || value2 > 100 || value2 % 1 !== 0);
  }, [value2]);

  return (
    <SpaceBetween size="xxl">
      <Slider
        ariaLabel="slider-example"
        valueFormatter={value => `${value}%`}
        value={sliderValue}
        min={0}
        max={100}
        onChange={({ detail }) => {
          setSliderValue(detail.value);
        }}
      />

      <Slider ariaLabel="slider-disabled-example" value={50} min={0} max={100} disabled={true} />

      <FormField
        label="Slider with input and validation"
        errorText={
          error2 ? (value2 % 1 !== 0 ? 'Unit must be a whole number' : 'Unit must be between 0 and 100.') : undefined
        }
      >
        <div className={styles['flex-wrapper']}>
          <div className={styles['slider-wrapper']}>
            <Slider
              value={value2}
              onChange={({ detail }) => {
                setValue2(detail.value);
              }}
              min={0}
              max={100}
              tickMarks={true}
              step={25}
              invalid={error2}
            />
          </div>
          <SpaceBetween size="m" alignItems="center" direction="horizontal">
            <div className={styles['input-wrapper']}>
              <Input
                type="number"
                inputMode="numeric"
                invalid={error2}
                value={`${value2}`}
                onChange={({ detail }) => {
                  setValue2(Number(detail.value));
                }}
              />
            </div>
            <Box>Units</Box>
          </SpaceBetween>
        </div>
      </FormField>

      <FormField label="Slider with select">
        <Grid gridDefinition={[{ colspan: { default: 4, xs: 2 } }]}>
          <Select
            selectedOption={minValue}
            onChange={({ detail }) => setMinValue(detail.selectedOption)}
            options={rangeOptions}
          />
        </Grid>
        <Slider
          value={Number(minValue.value)}
          onChange={({ detail }) => {
            setMinValue({ value: `${detail.value}` });
          }}
          min={5}
          max={25}
          step={5}
          tickMarks={true}
        />
      </FormField>
      <FormField label="Stepped slider">
        <Slider
          value={value3}
          onChange={({ detail }) => {
            setValue3(detail.value);
          }}
          valueFormatter={value => `${value} is the very long and precise value at this point.`}
          min={0}
          max={100}
          step={10}
          referenceValues={[30, 50, 55, 60, 75]}
          tickMarks={true}
        />
      </FormField>
      <FormField label="Where do you fall on the DT scale?">
        <Slider
          value={value4}
          onChange={({ detail }) => {
            setValue4(detail.value);
          }}
          valueFormatter={value => DTWordOptions.find(item => item.value === value)?.label || ''}
          step={2}
          tickMarks={true}
          min={0}
          max={10}
          referenceValues={[2, 4, 6, 8]}
        />
      </FormField>
      <FormField label="How satisfied are you by your results?">
        <Slider
          value={value5}
          onChange={({ detail }) => {
            setValue5(detail.value);
          }}
          step={1}
          min={0}
          max={4}
          valueFormatter={value => satisfactionScaleOptions.find(item => item.value === value)?.label || ''}
          referenceValues={[1, 2, 3]}
          tickMarks={true}
        />
      </FormField>
      <FormField label="How satisfied are you by your results?">
        <Slider
          value={value5}
          onChange={({ detail }) => {
            setValue5(detail.value);
          }}
          step={100}
          min={0}
          max={400}
          valueFormatter={value => satisfactionScaleOptions2.find(item => item.value === value)?.label || ''}
          referenceValues={[100, 200, 300]}
          tickMarks={true}
        />
      </FormField>
      <FormField label="How hot do you like your salsa?">
        <Slider
          value={value6}
          onChange={({ detail }) => {
            setValue6(detail.value);
          }}
          step={10}
          tickMarks={true}
          min={0}
          max={100}
          referenceValues={[50]}
          valueFormatter={value => `${value} is the value`}
          //referenceValues={[...Array(10000).keys()]}
        />
      </FormField>
      <FormField label="How hot do you like your salsa?">
        <Slider
          value={value7}
          onChange={({ detail }) => {
            setValue7(detail.value);
          }}
          min={0}
          max={100}
          valueFormatter={value => `${value}`}
          tickMarks={true}
          referenceValues={[7, 8, 9, 10, 25, 37, 39, 52, 53, 59, 67, 68, 93]}
        />
      </FormField>
    </SpaceBetween>
  );
}

export default function InputsPage() {
  const [value, setValue] = React.useState(4);
  const [temperature, setTemperature] = React.useState(0.8);
  return (
    <div style={{ padding: 30 }}>
      <h1>Sliders demo</h1>
      <SpaceBetween size="xxl">
        <Sliders />
        <Container header={<Header>This is a header</Header>}>
          <SpaceBetween size="xl">
            <FormField label="This is a form field" description="This is a description">
              <Input value="" placeholder="Placeholder" />
            </FormField>
            <FormField label="Volume">
              <div className={styles['flex-wrapper']}>
                <div className={styles['slider-wrapper']}>
                  <Slider value={value} onChange={({ detail }) => setValue(detail.value)} min={0} max={11} />
                </div>
                <SpaceBetween size="xs" direction="horizontal" alignItems="center">
                  <div className={styles['input-wrapper']}>
                    <Input
                      type="number"
                      inputMode="numeric"
                      value={`${value}`}
                      onChange={({ detail }) => {
                        setValue(Number(detail.value));
                      }}
                    />
                  </div>
                  <Box>Units</Box>
                </SpaceBetween>
              </div>
            </FormField>
            <FormField label="Volume">
              <Slider value={value} onChange={({ detail }) => setValue(detail.value)} min={0} max={11} />
            </FormField>
            <FormField label="This is a form field" description="This is a description">
              <Input value="" placeholder="Placeholder" />
            </FormField>
            <FormField label="This is a form field" description="This is a description">
              <ProgressBar value={50} />
            </FormField>
            <FormField label="Temperature">
              <Grid gridDefinition={[{ colspan: 2 }, { colspan: 10 }]}>
                <Input
                  type="number"
                  inputMode="numeric"
                  value={`${temperature}`}
                  onChange={({ detail }) => {
                    setTemperature(Number(detail.value));
                  }}
                />
              </Grid>
              <Slider
                step={0.1}
                value={temperature}
                onChange={({ detail }) => setTemperature(detail.value)}
                min={0}
                max={1}
              />
            </FormField>
          </SpaceBetween>
        </Container>
      </SpaceBetween>
    </div>
  );
}
