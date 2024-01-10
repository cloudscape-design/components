// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import Input from '~components/input';
import Box from '~components/box';
import SpaceBetween from '~components/space-between';
import FormField from '~components/form-field';
import { Grid, Select, Slider, SliderProps } from '~components';

function Sliders() {
  const [value, setValue] = React.useState<SliderProps.ChangeDetail['value']>(2);
  const [value2, setValue2] = React.useState<SliderProps.ChangeDetail['value']>(2);
  const [value3, setValue3] = React.useState<SliderProps.ChangeDetail['value']>(50);
  const [sliderValue, setSliderValue] = useState(2000);
  const [rangeMin, setRangeMin] = useState(20);
  const [rangeMax, setRangeMax] = useState(80);
  const [error, setError] = useState(false);
  const [decimalError, setDecimalError] = useState(false);
  const [error2, setError2] = useState(false);
  const [minValue, setMinValue] = React.useState<any>({ value: '5' });
  const rangeOptions = [{ value: '5' }, { value: '10' }, { value: '15' }, { value: '20' }, { value: '25' }];

  React.useEffect(() => {
    setError2(value2 < 0 || value2 > 10000 || value2 % 1 !== 0);
  }, [value2]);

  return (
    <SpaceBetween size="xxl">
      <Slider value={sliderValue} min={0} max={100} onChange={({ detail }) => setSliderValue(detail.value)} />
      <Slider value={50} min={0} max={100} disabled={true} />

      <FormField
        constraintText="Units must be a value between 0 and 10,000."
        label="Slider with error on blur / enter key"
        errorText={
          decimalError ? 'Unit must be a whole number' : error ? 'Unit must be between 0 and 10,000.' : undefined
        }
      >
        <Grid gridDefinition={[{ colspan: { default: 8, xs: 4 } }, { colspan: { default: 3, xs: 3 } }]}>
          <Slider
            value={value}
            onChange={({ detail }) => {
              setValue(detail.value);
            }}
            min={0}
            max={10000}
            // step={0.5}
          />
          <SpaceBetween size="m" alignItems="center" direction="horizontal">
            <Input
              type="number"
              inputMode="numeric"
              invalid={error || decimalError}
              onBlur={() => {
                setDecimalError(value % 1 !== 0);
                setError(value < 0 || value > 10000);
              }}
              onKeyDown={({ detail }) => {
                if (detail.keyCode === 13) {
                  setDecimalError(value % 1 !== 0);
                  setError(value < 0 || value > 10000);
                }
              }}
              value={`${value}`}
              onChange={({ detail }) => {
                setValue(Number(detail.value));
              }}
            />
            <Box>Units</Box>
          </SpaceBetween>
        </Grid>
      </FormField>
      <FormField
        constraintText="Units must be a value between 0 and 10,000."
        label="Slider with immediate error"
        errorText={
          error2 ? (value2 % 1 !== 0 ? 'Unit must be a whole number' : 'Unit must be between 0 and 10,000.') : undefined
        }
      >
        <Grid gridDefinition={[{ colspan: { default: 8, xs: 4 } }, { colspan: { default: 3, xs: 3 } }]}>
          <Slider
            value={value2}
            onChange={({ detail }) => {
              setValue2(detail.value);
            }}
            min={0}
            max={10000}
          />
          <SpaceBetween size="m" alignItems="center" direction="horizontal">
            <Input
              type="number"
              inputMode="numeric"
              invalid={error2}
              value={`${value2}`}
              onChange={({ detail }) => {
                setValue2(Number(detail.value));
              }}
            />
            <Box>Units</Box>
          </SpaceBetween>
        </Grid>
      </FormField>
      <FormField label="Slider with select">
        <Grid
          gridDefinition={[
            { colspan: { default: 4, xs: 2 } },
            { colspan: { default: 4, xs: 2 }, offset: { xs: 8, default: 4 } },
          ]}
        >
          <Select
            selectedOption={minValue}
            onChange={({ detail }) => setMinValue(detail.selectedOption)}
            options={rangeOptions}
          />
        </Grid>
        <Slider
          value={minValue.value}
          onChange={({ detail }) => {
            setMinValue({ value: detail.value });
          }}
          min={5}
          max={25}
          step={5}
        />
      </FormField>
      <FormField label="Stepped slider">
        <Slider
          value={value3}
          onChange={({ detail }) => {
            setValue3(detail.value);
          }}
          min={0}
          max={100}
          step={25}
        />
      </FormField>
      <FormField label="Range slider" description="This doesn't have any validation set up">
        <Grid
          gridDefinition={[
            { colspan: { default: 4, xs: 2 } },
            { colspan: { default: 4, xs: 2 }, offset: { xs: 8, default: 4 } },
          ]}
        >
          <Input
            type="number"
            inputMode="numeric"
            value={`${rangeMin}`}
            onChange={({ detail }) => {
              setRangeMin(Number(detail.value));
            }}
          />
          <Input
            type="number"
            inputMode="numeric"
            value={`${rangeMax}`}
            onBlur={() => setRangeMax(rangeMax)}
            onChange={({ detail }) => setRangeMax(Number(detail.value))}
          />
        </Grid>
        <Slider
          variant="range"
          rangeValue={[rangeMin, rangeMax]}
          onRangeChange={({ detail }) => {
            setRangeMin(detail.value[0]);
            setRangeMax(detail.value[1]);
          }}
          min={0}
          max={100}
        />
      </FormField>
    </SpaceBetween>
  );
}

export default function InputsPage() {
  return (
    <div style={{ padding: 30 }}>
      <h1>Sliders demo</h1>
      <SpaceBetween size="xxl">
        <Sliders />
      </SpaceBetween>
    </div>
  );
}
