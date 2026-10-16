// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Box from '~components/box';
import FormField from '~components/form-field';
import Input from '~components/input';
import ControlGroup from '~components/internal/components/control-group';
import RadioGroup from '~components/radio-group';
import Select from '~components/select';
import SpaceBetween from '~components/space-between';
import Toggle from '~components/toggle';

import { useAppContext } from '../app/app-context';
import { SimplePage } from '../app/templates';
import FocusTarget from '../common/focus-target';
import { noop, operators } from './common';

type WrapMode = 'flex' | 'block' | 'none';

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
  const { urlParams, setUrlParams } = useAppContext<'withButton' | 'containerWidth' | 'wrapMode'>();
  const withButton = urlParams.withButton === true;
  const containerWidth = Number(urlParams.containerWidth) || 1000;
  const wrapMode = (urlParams.wrapMode as WrapMode) || 'flex';

  const testId = 'control-group-wrapper';

  function renderExample() {
    if (wrapMode === 'none') {
      return (
        <div data-testid={testId}>
          <LongGroup withButton={withButton} />
        </div>
      );
    }

    const resizableContainer = (children: React.ReactNode) => (
      <div
        data-testid="resizable-container"
        style={{
          position: 'relative',
          inlineSize: containerWidth,
          overflow: 'hidden',
          resize: 'horizontal',
          border: '2px dashed #7d8998',
          padding: 8,
        }}
      >
        <div data-testid={testId} style={{ inlineSize: '100%', overflow: 'hidden' }}>
          {children}
        </div>
      </div>
    );

    if (wrapMode === 'flex') {
      return resizableContainer(
        <SpaceBetween direction="horizontal" size="s">
          <LongGroup withButton={withButton} />
          <Box variant="p">Sibling content</Box>
        </SpaceBetween>
      );
    }

    // block: same resizable container, inner content in plain block flow.
    return resizableContainer(
      <>
        <LongGroup withButton={withButton} />
        <Box variant="p">Sibling content</Box>
      </>
    );
  }

  return (
    <SimplePage
      title="Control group responsiveness"
      subtitle='A control group with `direction="auto"` should stack vertically when the horizontal space is insufficient, and come back to the horizontal layout when it grows again. The "Wrap mode" setting chooses the wrapping container: a flexbox or a plain block container (both constrained by a resizable container width), or none at all (constrained only by the window).'
      settings={
        <SpaceBetween direction="horizontal" size="xxl">
          <Toggle checked={withButton} onChange={({ detail }) => setUrlParams({ withButton: detail.checked })}>
            With action button
          </Toggle>
          <FormField label="Wrap mode">
            <RadioGroup
              data-testid="wrap-mode"
              value={wrapMode}
              onChange={({ detail }) => setUrlParams({ wrapMode: detail.value })}
              items={[
                { value: 'none', label: 'None (window)' },
                { value: 'block', label: 'Block container' },
                { value: 'flex', label: 'Flexbox' },
              ]}
            />
          </FormField>
          {wrapMode !== 'none' && (
            <FormField label="Container width">
              <RadioGroup
                data-testid="width-radio"
                value={String(containerWidth)}
                onChange={({ detail }) => setUrlParams({ containerWidth: detail.value })}
                items={[
                  { value: '500', label: '500px' },
                  { value: '1000', label: '1000px' },
                ]}
              />
            </FormField>
          )}
        </SpaceBetween>
      }
    >
      <FocusTarget />
      {renderExample()}
      <p>
        This button should be focused after tabbing out of the last control{' '}
        <button data-testid="focus-after">focus after</button>
      </p>
    </SimplePage>
  );
}
