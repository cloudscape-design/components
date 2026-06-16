// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React from 'react';

import Box from '@cloudscape-design/components/box';
import Container from '@cloudscape-design/components/container';
import FormField from '@cloudscape-design/components/form-field';
import Header from '@cloudscape-design/components/header';
import RadioGroup from '@cloudscape-design/components/radio-group';
import Select from '@cloudscape-design/components/select';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Tiles from '@cloudscape-design/components/tiles';

import { EngineState, EngineType, WizardState } from '../interfaces';
import { ENGINE_DETAILS, ENGINE_EDITIONS, ENGINE_USECASES, ENGINE_VERSIONS, ENGINES, LICENSES } from '../steps-config';

export const getEngineLabel = (engineOption: EngineType) => ENGINES.find(({ value }) => value === engineOption)?.label;

export const getEngineLicense = (engineOption: EngineType) => LICENSES[engineOption];

interface RadioOptionProps {
  engine: EngineState;
  onChange: (state: Partial<EngineState>) => void;
}

const RadioOption = ({ engine, onChange }: RadioOptionProps) => {
  const { edition, engineOption, usecase } = engine;

  return ENGINE_EDITIONS[engineOption] ? (
    <FormField label="Edition">
      <RadioGroup
        value={edition}
        onChange={event => onChange({ edition: event.detail.value })}
        items={ENGINE_EDITIONS[engineOption]}
      />
    </FormField>
  ) : (
    <FormField label="Use case" stretch={true}>
      <RadioGroup
        value={usecase}
        onChange={event => onChange({ usecase: event.detail.value })}
        items={ENGINE_USECASES}
      />
    </FormField>
  );
};

interface VersionProps {
  engine: EngineState;
  onChange: (state: Partial<EngineState>) => void;
}

const Version = ({ engine, onChange }: VersionProps) => {
  const { engineOption, version } = engine;
  return (
    <FormField label="Version">
      <Select
        onChange={event => onChange({ version: event.detail.selectedOption })}
        selectedAriaLabel="Selected"
        selectedOption={version}
        options={ENGINE_VERSIONS[engineOption]}
      />
    </FormField>
  );
};

interface EngineProps {
  info: WizardState;
  onChange: (state: Partial<EngineState>) => void;
}

const Engine = ({ info: { engine }, onChange }: EngineProps) => {
  const { engineOption } = engine;
  const childProps = { engine, onChange };
  return (
    <Box margin={{ bottom: 'l' }}>
      <Container header={<Header variant="h2">Engine options</Header>}>
        <SpaceBetween size="s">
          <Tiles
            ariaLabel="Engine options"
            items={ENGINES}
            value={engineOption}
            onChange={event => onChange({ engineOption: event.detail.value as EngineType })}
          />
          <SpaceBetween size="l">
            {ENGINE_DETAILS[engineOption]}
            <div className="custom-screenshot-hide">
              <Box variant="awsui-key-label">License model</Box>
              <div>{getEngineLicense(engineOption)}</div>
            </div>
            <RadioOption {...childProps} />
            {ENGINE_VERSIONS[engineOption] && <Version {...childProps} />}
          </SpaceBetween>
        </SpaceBetween>
      </Container>
    </Box>
  );
};

export default Engine;
