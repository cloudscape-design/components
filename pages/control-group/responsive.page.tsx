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
  const containerWidth = Number(urlParams.containerWidth) || 1200;
  const wrapMode = (urlParams.wrapMode as WrapMode) || 'flex';

  // The control group's immediate anchor always carries the same stable test id,
  // so the integ test resolves the group from one selector regardless of wrap mode.
  const anchorProps = { 'data-testid': 'control-group-wrapper' } as const;

  function renderExample() {
    if (wrapMode === 'none') {
      // No positioned / width-constraining wrapper: the width sensor escapes to the
      // viewport, so the group is constrained only by the window. A bare static block
      // div is transparent to the sensor. This is expected and correct.
      return (
        <div {...anchorProps}>
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
          // Dashed outline makes the resizable boundary visible when dragging the handle.
          border: '2px dashed #7d8998',
          padding: 8,
        }}
      >
        <div {...anchorProps} style={{ inlineSize: '100%', overflow: 'hidden' }}>
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
          <FormField label="Wrap mode">
            <RadioGroup
              data-testid="wrap-mode"
              value={wrapMode}
              onChange={({ detail }) => setUrlParams({ wrapMode: detail.value })}
              items={[
                { value: 'flex', label: 'Flexbox' },
                { value: 'block', label: 'Block container' },
                { value: 'none', label: 'None (window)' },
              ]}
            />
          </FormField>
        </SpaceBetween>
      }
    >
      <FocusTarget />
      <Box variant="h3">Control group responsiveness</Box>
      {renderExample()}
      <p>
        This button should be focused after tabbing out of the last control{' '}
        <button data-testid="focus-after">focus after</button>
      </p>
    </SimplePage>
  );
}
