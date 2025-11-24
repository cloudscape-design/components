// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Button from '~components/button';
import Tooltip, { TooltipProps } from '~components/tooltip';

import createPermutations from '../utils/permutations';
import PermutationsView from '../utils/permutations-view';
import ScreenshotArea from '../utils/screenshot-area';

const permutations = createPermutations<TooltipProps>([
  {
    content: ['Simple tooltip', 'This is a longer tooltip with more content'],
    position: ['top', 'right', 'bottom', 'left'],
    trigger: ['hover-focus'],
    children: [<Button key="button">Hover me</Button>],
  },
  {
    content: ['Custom styled tooltip'],
    position: ['top'],
    trigger: ['hover-focus'],
    style: [
      {
        content: {
          backgroundColor: '#232f3e',
          color: '#ffffff',
          borderRadius: '8px',
          padding: '12px 16px',
          fontSize: '14px',
        },
      },
    ],
    children: [
      <Button variant="primary" key="styled">
        Custom Style
      </Button>,
    ],
  },
  {
    content: ['Focus tooltip'],
    position: ['top'],
    trigger: ['focus'],
    children: [<Button key="focus">Focus me</Button>],
  },
  {
    content: ['Hover only tooltip'],
    position: ['right'],
    trigger: ['hover'],
    children: [<Button key="hover">Hover only</Button>],
  },
]);

export default function TooltipPermutations() {
  return (
    <>
      <h1>Tooltip permutations</h1>
      <ScreenshotArea disableAnimations={true}>
        <div style={{ padding: '50px', display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
          <PermutationsView permutations={permutations} render={permutation => <Tooltip {...permutation} />} />
        </div>
      </ScreenshotArea>
    </>
  );
}
