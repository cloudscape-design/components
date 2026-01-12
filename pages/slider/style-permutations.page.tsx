// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { Box } from '~components';
import Slider, { SliderProps } from '~components/slider';

import createPermutations from '../utils/permutations';
import PermutationsView from '../utils/permutations-view';
import ScreenshotArea from '../utils/screenshot-area';

// Blue theme with rounded handle
const style1 = {
  track: {
    backgroundColor: 'light-dark(#dbeafe, #1e3a8a)',
  },
  range: {
    backgroundColor: {
      default: 'light-dark(#3b82f6, #60a5fa)',
      active: 'light-dark(#2563eb, #3b82f6)',
    },
  },
  handle: {
    backgroundColor: {
      default: 'light-dark(#3b82f6, #60a5fa)',
      hover: 'light-dark(#2563eb, #3b82f6)',
      active: 'light-dark(#1d4ed8, #2563eb)',
    },
    borderRadius: '50%',
  },
};

// Orange theme with square handle
const style2 = {
  track: {
    backgroundColor: 'light-dark(#fed7aa, #7c2d12)',
  },
  range: {
    backgroundColor: {
      default: 'light-dark(#f97316, #fb923c)',
      active: 'light-dark(#ea580c, #f97316)',
    },
  },
  handle: {
    backgroundColor: {
      default: 'light-dark(#f97316, #fb923c)',
      hover: 'light-dark(#ea580c, #f97316)',
      active: 'light-dark(#c2410c, #ea580c)',
    },
    borderRadius: '4px',
  },
};

const permutations = createPermutations<SliderProps>([
  {
    min: [0],
    max: [100],
    hideFillLine: [false, true],
    style: [style1, style2],
  },
]);

export default function SliderStylePermutations() {
  return (
    <>
      <h1>Slider Style Permutations</h1>

      <ScreenshotArea disableAnimations={true}>
        <PermutationsView
          permutations={permutations}
          render={permutation => (
            <Box>
              <Slider {...permutation} value={50} step={10} tickMarks={true} ariaLabel="Styled slider" />
            </Box>
          )}
        />
      </ScreenshotArea>
    </>
  );
}
