// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Box from '~components/box';
import Checkbox from '~components/checkbox';
import FormField from '~components/form-field';
import Input from '~components/input';
import ControlGroup from '~components/internal/components/control-group';
import RadioGroup from '~components/radio-group';
import Select from '~components/select';
import SpaceBetween from '~components/space-between';

import { useAppContext } from '../app/app-context';
import { SimplePage } from '../app/templates';
import FocusTarget from '../common/focus-target';
import { noop, operators } from './common';

function LongGroup({ withButton }: { withButton: boolean }) {
  return (
    <ControlGroup actionButton={withButton ? { iconName: 'remove', ariaLabel: 'Remove', onClick: noop } : undefined}>
      <Input ariaLabel="Label name" value="service" placeholder="Label name" onChange={noop} />
      <Select ariaLabel="Operator" selectedOption={operators[0]} options={operators} onChange={noop} />
      <Input ariaLabel="Label value" value="production" placeholder="Label value" onChange={noop} />
      <Input ariaLabel="Label name 2" value="region" placeholder="Label name" onChange={noop} />
      <Select ariaLabel="Operator 2" selectedOption={operators[0]} options={operators} onChange={noop} />
      <Input ariaLabel="Label value 2" value="us-east-1" placeholder="Label value" onChange={noop} />
    </ControlGroup>
  );
}

export default function ControlGroupResponsiveness() {
  const { urlParams, setUrlParams } = useAppContext<'withButton' | 'containerWidth'>();
  const withButton = urlParams.withButton === true;
  const containerWidth = Number(urlParams.containerWidth) || 1200;

  return (
    <SimplePage
      title="Control group responsiveness"
      subtitle='A control group with `direction="auto"` inside a horizontal flexbox. The control group should stack vertically when the horizontal space is insufficient, and come back to the horizontal layout when it grows again.'
      settings={
        <SpaceBetween size="m">
          <Checkbox checked={withButton} onChange={({ detail }) => setUrlParams({ withButton: detail.checked })}>
            With action button
          </Checkbox>
          <FormField label="Container width">
            <RadioGroup
              data-testid="width-radio"
              value={String(containerWidth)}
              onChange={({ detail }) => setUrlParams({ containerWidth: detail.value })}
              items={[
                { value: '300', label: '300px' },
                { value: '600', label: '600px' },
                { value: '800', label: '800px' },
                { value: '1200', label: '1200px' },
              ]}
            />
          </FormField>
        </SpaceBetween>
      }
    >
      <FocusTarget />
      <div
        data-testid="resizable-container"
        style={{
          position: 'relative',
          inlineSize: containerWidth,
          overflow: 'hidden',
          resize: 'horizontal',
        }}
      >
        <div
          data-testid="auto-spacebetween"
          style={{
            inlineSize: '100%',
            overflow: 'hidden',
          }}
        >
          <SpaceBetween direction="horizontal" size="s">
            <LongGroup withButton={withButton} />
            <Box variant="p">Sibling content</Box>
          </SpaceBetween>
        </div>
      </div>
      <p>
        This button should be focused after tabbing out of the last control{' '}
        <button data-testid="focus-after">focus after</button>
      </p>
    </SimplePage>
  );
}
