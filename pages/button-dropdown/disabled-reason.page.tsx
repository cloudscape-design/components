// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import { ButtonDropdown, ButtonDropdownProps } from '~components';
import ScreenshotArea from '../utils/screenshot-area';

const actionsItems: ButtonDropdownProps.Items = [
  { id: 'connect', text: 'Connect', disabledReason: 'Instance must be running.', disabled: true },
  { id: 'details', text: 'View details', disabledReason: 'A single instance needs to be selected.', disabled: true },
  {
    id: 'manage-state',
    text: 'Manage instance state',
    disabledReason: 'Instance state must not be pending or stopping.',
    disabled: true,
  },
  {
    text: 'Instance Settings',
    id: 'settings',
    items: [
      {
        id: 'auto-scaling',
        text: 'Attach to Auto Scaling Group',
        disabledReason: 'Instance must be running and not already be attached to an Auto Scaling Group.',
        disabled: true,
      },
      {
        id: 'termination-protection',
        text: 'Change termination protections',
      },
      {
        id: 'stop-protection',
        text: 'Change stop protection',
      },
      {
        id: 'shutdown-behavior',
        text: 'Change shutdown behavior',
        disabledReason: "Instance can't be a spot instance.",
        disabled: true,
      },
    ],
  },
  {
    text: 'Networking',
    items: [
      { id: 'network-interface', text: 'Attach network interface' },
      {
        id: 'detach',
        text: 'Detach network interface',
        disabledReason: 'Instance must be attached to at least one network interface',
        disabled: true,
      },
    ],
  },
  {
    text: 'Security',
    items: [
      {
        id: 'security-groups',
        text: 'Change security groups',
        disabledReason: 'Instance must be a VPC (non-classic) instance and must not be terminated.',
        disabled: true,
      },
      {
        id: 'windows-password',
        text: 'Get windows password',
        disabledReason: 'Instance must be a Windows instance.',
        disabled: true,
      },
      {
        id: 'iam-role',
        text: 'Modify IAM role',
        disabledReason: 'Instance must be running or stopped.',
        disabled: true,
      },
    ],
  },
  {
    id: 'classic-link',
    text: 'ClassicLink',
    items: [],
    disabledReason: 'Requires a classic-enabled accounts.',
    disabled: true,
  },
  {
    text: 'Image and templates',
    items: [
      {
        id: 'create-image',
        text: 'Create image',
        disabledReason: 'Instance must be running, stopped or stopping.',
        disabled: true,
      },
      {
        id: 'create-template',
        text: 'Create template from instance',
      },
    ],
  },
  { text: 'Monitor and troubleshoot', items: [{ id: 'system-log', text: 'Get System log' }] },
];

export default function DescriptionPage() {
  const [isRightAligned, setIsRightAligned] = useState(false);
  return (
    <>
      <h1>Descriptions in ButtonDropdown</h1>
      <label>
        <input
          type="checkbox"
          checked={isRightAligned}
          data-testid="alignment"
          onChange={() => setIsRightAligned(val => !val)}
        />
        Right Align
      </label>
      <ScreenshotArea>
        <div style={{ float: isRightAligned ? 'right' : undefined }}>
          <ButtonDropdown items={actionsItems} expandableGroups={true} data-testid="buttonDropdown">
            Actions
          </ButtonDropdown>
        </div>
      </ScreenshotArea>
    </>
  );
}
