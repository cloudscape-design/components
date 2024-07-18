// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';

import { ContainerProps } from '~components/container';

import createPermutations from '../utils/permutations';
import PermutationsView from '../utils/permutations-view';
import ScreenshotArea from '../utils/screenshot-area';
import { PermutationContainer, PermutationIframe } from './common';
import image43 from './images/4-3.png';
import image916 from './images/9-16.png';
import image169 from './images/16-9.png';
import imageVideo from './images/video.png';

const permutations = createPermutations<ContainerProps.Media>([
  {
    content: [
      <img key={'image169'} src={image169} alt="placeholder" />,
      <img key={'image43'} src={image43} alt="placeholder" />,
      <img key={'image916'} src={image916} alt="placeholder" />,
      <img key={'imageVideo'} src={imageVideo} alt="placeholder" />,
      <PermutationIframe key="iframe" />,
    ],
    height: ['', 100, 200, 300],
  },
]);

export default function MediaPermutations() {
  return (
    <>
      <h1>Media permutations - top</h1>
      <ScreenshotArea disableAnimations={true}>
        <PermutationsView
          permutations={permutations}
          render={permutation => <PermutationContainer permutation={{ ...permutation, position: 'top' }} />}
        />
      </ScreenshotArea>
    </>
  );
}
