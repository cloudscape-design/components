// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { Button, FileTokenGroup } from '~components';
import PromptInput, { PromptInputProps } from '~components/prompt-input';

import img from '../icon/custom-icon.png';
import createPermutations from '../utils/permutations';
import PermutationsView from '../utils/permutations-view';
import ScreenshotArea from '../utils/screenshot-area';

const permutations = createPermutations<PromptInputProps>([
  {
    invalid: [false, true],
    warning: [false, true],
    actionButtonIconName: [undefined, 'send'],
    value: [
      '',
      'Short value 1',
      'Long value 1, enough to extend beyond the input width.  Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    ],
  },
  {
    value: [''],
    placeholder: [
      'Short placeholder',
      'Long placeholder, enough to extend beyond the input width.  Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    ],
  },
  {
    disabled: [false, true],
    actionButtonIconName: [undefined, 'send'],
    value: ['', 'Short value 2'],
  },
  {
    value: [
      '',
      'Short value 3',
      'Long value 3, enough to extend beyond the input width.  Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    ],
    actionButtonIconSvg: [
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" focusable="false" key="0">
        <g>
          <line x1="5.5" y1="12" x2="5.5" y2="15" />
          <line x1="0.5" y1="15" x2="10.5" y2="15" />
          <rect x="1" y="5" width="9" height="7" />
          <polyline points="5 4 5 1 14 1 14 8 10 8" />
        </g>
      </svg>,
    ],
  },
  {
    value: [
      '',
      'Short value 4',
      'Long value 4, enough to extend beyond the input width.  Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    ],
    actionButtonIconUrl: [img],
    actionButtonIconAlt: ['Letter A'],
  },
  {
    value: ['Short value 5'],
    actionButtonIconName: [undefined, 'send'],
    secondaryActions: [undefined, 'secondary actions 1'],
    secondaryContent: [undefined, 'secondary content 1'],
    invalid: [false, true],
  },
  {
    value: ['Short value 6'],
    actionButtonIconName: ['send'],
    secondaryActions: ['secondary actions 2'],
    secondaryContent: ['secondary content 2'],
    disableSecondaryActionsPaddings: [false, true],
    disableSecondaryContentPaddings: [false, true],
  },
  {
    value: ['Short value for custom primary actions'],
    actionButtonIconName: [undefined, 'send'],
    customPrimaryAction: [
      undefined,
      <Button variant="icon" iconName="add-plus" ariaLabel="Custom action" key="button" />,
    ],
    secondaryActions: [undefined, 'secondary actions'],
    disableSecondaryActionsPaddings: [false, true],
  },
  {
    value: ['Short value for secondary action responsiveness'],
    actionButtonIconName: [undefined, 'send'],
    secondaryActions: [
      'short',
      'longer but breakable secondary action content',
      'longerbutunbreakablesecondaryactioncontent',
      <FileTokenGroup
        key="file-token"
        items={[
          {
            file: new File([new Blob(['Test content'])], 'test-for-venue-use-case.pdf', {
              type: 'application/pdf',
              lastModified: 1590962400000,
            }),
          },
        ]}
        onDismiss={() => {}}
        showFileSize={true}
        showFileLastModified={true}
        showFileThumbnail={true}
        i18nStrings={{
          removeFileAriaLabel: () => 'Remove file',
          limitShowFewer: 'Show fewer files',
          limitShowMore: 'Show more files',
          errorIconAriaLabel: 'Error',
          warningIconAriaLabel: 'Warning',
        }}
      />,
    ],
  },
  // Token mode: Basic text and references
  {
    tokens: [
      [{ type: 'text', value: 'Simple text' }],
      [
        { type: 'text', value: 'Text with ' },
        { type: 'reference', id: 'ref-1', label: 'Reference', value: 'ref1', menuId: 'mentions' },
      ],
      [
        { type: 'reference', id: 'ref-1', label: 'Ref1', value: 'ref1', menuId: 'mentions' },
        { type: 'text', value: ' ' },
        { type: 'reference', id: 'ref-2', label: 'Ref2', value: 'ref2', menuId: 'mentions' },
      ],
    ],
  },
  // Token mode: Multiline content
  {
    tokens: [
      [
        { type: 'text', value: 'Line 1' },
        { type: 'break', value: '\n' },
        { type: 'text', value: 'Line 2' },
      ],
      [
        { type: 'text', value: 'A' },
        { type: 'break', value: '\n' },
        { type: 'reference', id: 'ref-1', label: 'Ref', value: 'ref1', menuId: 'mentions' },
        { type: 'break', value: '\n' },
        { type: 'text', value: 'B' },
      ],
    ],
  },
  // Token mode: Triggers (menus required for trigger rendering)
  {
    tokens: [
      [{ type: 'trigger', triggerChar: '@', value: '', id: 'trig-1' }],
      [{ type: 'trigger', triggerChar: '@', value: 'user', id: 'trig-1' }],
      [
        { type: 'text', value: 'Text ' },
        { type: 'trigger', triggerChar: '@', value: 'User', id: 'trig-1' },
      ],
    ],
    menus: [
      [
        {
          id: 'mentions',
          trigger: '@',
          options: [
            { value: 'user1', label: 'User 1' },
            { value: 'user2', label: 'User 2' },
          ],
        },
      ],
    ],
  },
  // Token mode: Pinned references
  {
    tokens: [
      [
        { type: 'reference', id: 'pin-1', label: 'Pinned', value: 'pin1', menuId: 'mentions', pinned: true },
        { type: 'text', value: 'Content' },
      ],
      [
        { type: 'reference', id: 'pin-1', label: 'Pin1', value: 'pin1', menuId: 'mentions', pinned: true },
        { type: 'reference', id: 'pin-2', label: 'Pin2', value: 'pin2', menuId: 'mentions', pinned: true },
        { type: 'text', value: 'Text' },
      ],
    ],
  },
  // Token mode: Complex mixed (menus required for trigger)
  {
    tokens: [
      [
        { type: 'reference', id: 'pin-1', label: 'P1', value: 'p1', menuId: 'mentions', pinned: true },
        { type: 'text', value: 'Start ' },
        { type: 'trigger', triggerChar: '@', value: 'trig', id: 'trig-1' },
        { type: 'text', value: ' ' },
        { type: 'reference', id: 'ref-1', label: 'Ref', value: 'ref1', menuId: 'mentions' },
        { type: 'break', value: '\n' },
        { type: 'text', value: 'Line 2' },
      ],
    ],
    menus: [
      [
        {
          id: 'mentions',
          trigger: '@',
          options: [
            { value: 'user1', label: 'User 1' },
            { value: 'user2', label: 'User 2' },
          ],
        },
      ],
    ],
  },
  // Token mode: State variations
  {
    tokens: [
      [
        { type: 'reference', id: 'pin-1', label: 'Dev Mode', value: 'dev', menuId: 'mode', pinned: true },
        { type: 'text', value: 'Tell me about ' },
        { type: 'reference', id: 'ref-1', label: 'Alice Smith', value: 'user-1', menuId: 'mentions' },
      ],
    ],
    disabled: [false, true],
    readOnly: [false, true],
    invalid: [false, true],
  },
  // Token mode: Warning state
  {
    tokens: [
      [
        { type: 'reference', id: 'pin-1', label: 'Dev Mode', value: 'dev', menuId: 'mode', pinned: true },
        { type: 'text', value: 'Tell me about ' },
        { type: 'reference', id: 'ref-1', label: 'Alice Smith', value: 'user-1', menuId: 'mentions' },
      ],
    ],
    disabled: [false, true],
    readOnly: [false, true],
    warning: [true],
  },
]);

export default function PromptInputPermutations() {
  return (
    <>
      <h1>PromptInput permutations</h1>
      <ScreenshotArea>
        <PermutationsView
          permutations={permutations}
          render={(permutation, index) => (
            <PromptInput
              ariaLabel={`Prompt input test ${index}`}
              actionButtonAriaLabel="Action button aria label"
              onChange={() => {
                /*empty handler to suppress react controlled property warning*/
              }}
              {...permutation}
            />
          )}
        />
      </ScreenshotArea>
    </>
  );
}
