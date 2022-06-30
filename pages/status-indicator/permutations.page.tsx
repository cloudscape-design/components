// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import StatusIndicator, { StatusIndicatorProps } from '~components/status-indicator';
import createPermutations from '../utils/permutations';
import PermutationsView from '../utils/permutations-view';
import ScreenshotArea from '../utils/screenshot-area';

const permutations = createPermutations<StatusIndicatorProps>([
  {
    type: ['error', 'warning', 'success', 'info', 'stopped', 'pending', 'in-progress', 'loading'],
  },
  {
    type: ['pending'],
    colorOverride: ['blue', 'grey', 'green', 'red'],
  },
  {
    type: ['info'],
    wrapText: [true, false],
    children: [
      'Simple',
      'very long text very long text very long text very long text very long text very long text very long text very long text very long text very long text very long text very long text very long text very long text very long text very long text very long text very long text very long text very long text very long text very long text very long text very long text very long text very long text very long text very long text',
      'verylongtextwithoutspacesverylongtextwithoutspacesverylongtextwithoutspacesverylongtextwithoutspacesverylongtextwithoutspacesverylongtextwithoutspacesverylongtextwithoutspacesverylongtextwithoutspacesverylongtextwithoutspacesverylongtextwithoutspacesverylongtextwithoutspacesverylongtextwithoutspacesverylongtextwithoutspaces',
    ],
  },
]);

export default function StatusIndicatorPermutations() {
  return (
    <>
      <h1>StatusIndicator permutations</h1>
      <ScreenshotArea disableAnimations={true}>
        <PermutationsView
          permutations={permutations}
          render={permutation => (
            <div style={{ width: permutation.wrapText ? 'auto' : 200 }}>
              <StatusIndicator {...permutation} iconAriaLabel={`status ${permutation.type}`}>
                {permutation.children ?? <>Status {permutation.type}</>}
              </StatusIndicator>
            </div>
          )}
        />
      </ScreenshotArea>
    </>
  );
}
