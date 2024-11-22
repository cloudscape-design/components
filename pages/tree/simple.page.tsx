// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import { BreadcrumbGroup } from '~components';
import Badge from '~components/badge';
import Box from '~components/box';
import SpaceBetween from '~components/space-between';
import StatusIndicator from '~components/status-indicator/internal';
import Tree, { TreeProps } from '~components/tree';

const iconInstance = (
  <svg width="17" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M10.2636 1.33337V2.66671M10.2636 13.3334V14.6667M1.59692 10H2.93026M1.59692 6.00004H2.93026M13.5969 10H14.9303M13.5969 6.00004H14.9303M6.26359 1.33337V2.66671M6.26359 13.3334V14.6667M4.26359 2.66671H12.2636C13 2.66671 13.5969 3.26366 13.5969 4.00004V12C13.5969 12.7364 13 13.3334 12.2636 13.3334H4.26359C3.52721 13.3334 2.93026 12.7364 2.93026 12V4.00004C2.93026 3.26366 3.52721 2.66671 4.26359 2.66671ZM6.26359 6.00004H10.2636V10H6.26359V6.00004Z"
      stroke="#18181B"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const iconVolume = (
  <svg width="14" height="16" viewBox="0 0 14 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M13.0879 3.33337C13.0879 4.43794 10.4016 5.33337 7.08789 5.33337C3.77418 5.33337 1.08789 4.43794 1.08789 3.33337M13.0879 3.33337C13.0879 2.2288 10.4016 1.33337 7.08789 1.33337C3.77418 1.33337 1.08789 2.2288 1.08789 3.33337M13.0879 3.33337V12.6667C13.0879 13.1971 12.4557 13.7058 11.3305 14.0809C10.2053 14.456 8.67919 14.6667 7.08789 14.6667C5.49659 14.6667 3.97047 14.456 2.84525 14.0809C1.72003 13.7058 1.08789 13.1971 1.08789 12.6667V3.33337M1.08789 8.00004C1.08789 8.53047 1.72003 9.03918 2.84525 9.41425C3.97047 9.78933 5.49659 10 7.08789 10C8.67919 10 10.2053 9.78933 11.3305 9.41425C12.4557 9.03918 13.0879 8.53047 13.0879 8.00004"
      stroke="#18181B"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default function TreeSimpleScenario() {
  const [selection, setSelection] = useState<TreeProps.ArboristNode | undefined>(undefined);
  return (
    <>
      <Box padding="l">
        <h1>Tree demo</h1>

        <div style={{ display: 'flex' }}>
          <Tree
            initialOpenIds={[
              'ec2',
              'i-0419dc89ea0215fe8',
              'i-0419dc89ea0215fe8-EBSvolumes',
              'i-0419dc89ea0215fe8-securitygroups',
            ]}
            onSelect={s => void setSelection(s)}
            items={[
              {
                id: 'ec2',
                name: (
                  <>
                    EC2 <Box variant="small">(3 instances)</Box>
                  </>
                ),
                iconName: 'folder',
                badges: (
                  <SpaceBetween size="xxs" direction="horizontal">
                    <Badge color="severity-high">1</Badge>
                    <Badge color="severity-medium">3</Badge>
                    <Badge color="green">35</Badge>
                  </SpaceBetween>
                ),
                children: ['i-0419dc89ea0215fe8', 'i-a0215fe80419dc89e', 'i-fe80419da089e215c'].map(
                  (name, instanceIndex) => ({
                    id: name,
                    name,
                    iconSvg: iconInstance,
                    badges: instanceIndex === 1 ? <StatusIndicator type="warning" /> : undefined,
                    dropdownItems: [
                      { id: 'start', text: 'Start' },
                      { id: 'stop', text: 'Stop' },
                      { id: 'restart', text: 'Restart' },
                      { id: 'terminate', text: 'Terminate' },
                    ],
                    children: [
                      {
                        id: name + '-EBSvolumes',
                        name: (
                          <>
                            EBS volumes <Box variant="small">(5)</Box>
                          </>
                        ),
                        iconName: 'folder',
                        badges: instanceIndex === 1 ? <StatusIndicator type="warning" /> : undefined,
                        children: new Array(5).fill(null).map((_, index) => ({
                          id: name + `vol1${index}`,
                          name: `Volume ${index + 1}`,
                          dropdownItems: [
                            { id: 'modify', text: 'Modify' },
                            { id: 'snapshot', text: 'Create snapshot' },
                            { id: 'snapshotpolicy', text: 'Create snapshot lifecycle policy' },
                            { id: 'delete', text: 'Delete' },
                            { id: 'attach', text: 'Attach' },
                          ],
                          iconSvg: iconVolume,
                          badges: instanceIndex === 1 && index === 3 ? <StatusIndicator type="warning" /> : undefined,
                        })),
                      },
                      {
                        id: name + '-securitygroups',
                        name: (
                          <>
                            Security groups <Box variant="small">(2)</Box>
                          </>
                        ),
                        iconName: 'folder',
                        children: new Array(2).fill(null).map((_, index) => ({
                          id: name + `sg${index}`,
                          name: `Security group ${index + 1}`,
                          iconName: 'security',
                          dropdownItems: [
                            { id: 'modify', text: 'Edit inbound rules' },
                            { id: 'snapshot', text: 'Edit outbound rules' },
                            { id: 'snapshotpolicy', text: 'Create snapshot lifecycle policy' },
                            { id: 'delete', text: 'Delete' },
                          ],
                        })),
                      },
                    ],
                  })
                ),
              },
            ]}
          />
          <div
            style={{
              flex: 1,
              borderInlineStart: '1px solid rgba(128 128 128 / 50%)',
              paddingInlineStart: 40,
              marginInlineStart: 10,
            }}
          >
            {selection && (
              <>
                {selection.level === 1 ? (
                  <SpaceBetween size="l">
                    <BreadcrumbGroup
                      items={[
                        { text: 'EC2', href: '' },
                        { text: selection.data.name as any, href: '' },
                      ]}
                    />
                    <Box variant="h2">EC2 instance: {selection.data.name}</Box>
                  </SpaceBetween>
                ) : selection.level === 2 ? (
                  <SpaceBetween size="l">
                    <BreadcrumbGroup
                      items={[
                        { text: 'EC2', href: '' },
                        { text: selection.parent?.data.name as any, href: '' },
                        { text: selection.childIndex === 0 ? 'EBS volumes' : 'Security groups', href: '' },
                      ]}
                    />
                    <Box variant="h2">
                      {selection.childIndex === 0 ? 'EBS volumes' : 'Security groups'} attached to{' '}
                      {selection.parent?.data.name}
                    </Box>
                  </SpaceBetween>
                ) : selection.level === 3 ? (
                  <SpaceBetween size="l">
                    <BreadcrumbGroup
                      items={[
                        { text: 'EC2', href: '' },
                        { text: selection.parent?.parent?.data.name as any, href: '' },
                        { text: selection.parent?.childIndex === 0 ? 'EBS volumes' : 'Security groups', href: '' },
                        { text: selection.data.name as any, href: '' },
                      ]}
                    />
                    <Box variant="h2">{selection.data.name}</Box>
                  </SpaceBetween>
                ) : undefined}
              </>
            )}
          </div>
        </div>
      </Box>
    </>
  );
}
