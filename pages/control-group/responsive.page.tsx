// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Box from '~components/box';
import Button from '~components/button';
import Input from '~components/input';
import ControlGroup from '~components/internal/components/control-group';
import Select from '~components/select';
import SpaceBetween from '~components/space-between';

import { SimplePage } from '../app/templates';
import FocusTarget from '../common/focus-target';
import { noop, operators } from './common';

function LongGroup() {
  return (
    <ControlGroup>
      <Input ariaLabel="Label name" value="service" placeholder="Label name" onChange={noop} />
      <Select ariaLabel="Operator" selectedOption={operators[0]} options={operators} onChange={noop} />
      <Input ariaLabel="Label value" value="production" placeholder="Label value" onChange={noop} />
      <Input ariaLabel="Label name 2" value="region" placeholder="Label name" onChange={noop} />
      <Select ariaLabel="Operator 2" selectedOption={operators[0]} options={operators} onChange={noop} />
      <Input ariaLabel="Label value 2" value="us-east-1" placeholder="Label value" onChange={noop} />
    </ControlGroup>
  );
}

function LongGroupWithAction() {
  return (
    <ControlGroup actionButton={{ iconName: 'remove', ariaLabel: 'Remove', onClick: noop }}>
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
  return (
    <SimplePage
      title="Control group responsiveness"
      subtitle='A control group with `direction="auto"` inside a horizontal flexbox. The control group should stack vertically when the horizontal space is insufficient, and come back to the horizontal layout when it grows again.'
    >
      <FocusTarget />
      <div
        data-testid="auto-spacebetween"
        style={{
          inlineSize: '100%',
          overflow: 'hidden',
        }}
      >
        <SpaceBetween direction="horizontal" size="s">
          <LongGroup />
          <Box variant="p">Sibling content</Box>
        </SpaceBetween>
      </div>
      <Button data-testid="focus-after">Focus after</Button>
      <div
        data-testid="auto-button-spacebetween"
        style={{
          inlineSize: '100%',
          overflow: 'hidden',
        }}
      >
        <SpaceBetween direction="horizontal" size="s">
          <LongGroupWithAction />
          <Box variant="p">Sibling content</Box>
        </SpaceBetween>
      </div>
    </SimplePage>
  );
}
