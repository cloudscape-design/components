// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import Avatar, { AvatarProps } from '~components/avatar';
import createPermutations from '../utils/permutations';
import PermutationsView from '../utils/permutations-view';
import ScreenshotArea from '../utils/screenshot-area';
import customIconUrl from '../icon/custom-icon.png';

const customIconSvg = (
  <svg
    className="w-6 h-6 text-gray-800 dark:text-white"
    aria-hidden="true"
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    fill="none"
    viewBox="0 0 24 24"
  >
    <path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="m8 9 3 3-3 3m5 0h3M4 19h16a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1Z"
    />
  </svg>
);

const permutations = createPermutations<AvatarProps>([
  {
    type: ['user', 'gen-ai'],
    initials: [undefined, 'JD'],
    loading: [false, true],
    iconName: [undefined, 'star-filled'],
    iconSvg: [undefined, customIconSvg],
    iconUrl: [undefined, customIconUrl],
  },
]);

export default function AvatarPermutations() {
  return (
    <>
      <h1>Avatar permutations</h1>
      <ScreenshotArea disableAnimations={true}>
        <PermutationsView
          permutations={permutations}
          render={permutation => <Avatar ariaLabel="Avatar" {...permutation} />}
        />
      </ScreenshotArea>
    </>
  );
}
