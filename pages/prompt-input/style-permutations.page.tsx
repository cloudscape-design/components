// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { Button, FileTokenGroup } from '~components';
import PromptInput, { PromptInputProps } from '~components/prompt-input';

import img from '../icon/custom-icon.png';
import createPermutations from '../utils/permutations';
import PermutationsView from '../utils/permutations-view';
import ScreenshotArea from '../utils/screenshot-area';

const style1: PromptInputProps.Style = {
  root: {
    borderColor: {
      default: '#0ea5e9',
      hover: '#0284c7',
      focus: '#0369a1',
      disabled: '#bae6fd',
      readonly: '#7dd3fc',
    },
    borderWidth: '1px',
    borderRadius: '8px',
    backgroundColor: {
      default: '#f0f9ff',
      hover: '#e0f2fe',
      focus: '#e0f2fe',
      disabled: '#f0f9ff',
      readonly: '#f0f9ff',
    },
    boxShadow: {
      default: '0 1px 2px rgba(0, 0, 0, 0.05)',
      hover: '0 1px 3px rgba(14, 165, 233, 0.1)',
      focus: '0 0 0 3px rgba(14, 165, 233, 0.15)',
      disabled: 'none',
      readonly: '0 1px 2px rgba(0, 0, 0, 0.05)',
    },
    color: {
      default: '#0c4a6e',
      hover: '#0c4a6e',
      focus: '#0c4a6e',
      disabled: '#7dd3fc',
      readonly: '#0369a1',
    },
    fontSize: '14px',
    fontWeight: '400',
    paddingBlock: '4px',
    paddingInline: '8px',
  },
  placeholder: {
    color: '#0ea5e9',
    fontSize: '13px',
    fontStyle: 'italic',
  },
};

const style2: PromptInputProps.Style = {
  root: {
    borderColor: {
      default: '#a78bfa',
      hover: '#8b5cf6',
      focus: '#7c3aed',
      disabled: '#ddd6fe',
      readonly: '#c4b5fd',
    },
    borderWidth: '1px',
    borderRadius: '10px',
    backgroundColor: {
      default: '#faf5ff',
      hover: '#f5f3ff',
      focus: '#f5f3ff',
      disabled: '#faf5ff',
      readonly: '#faf5ff',
    },
    boxShadow: {
      default: '0 1px 2px rgba(0, 0, 0, 0.05)',
      hover: '0 1px 3px rgba(139, 92, 246, 0.12)',
      focus: '0 0 0 3px rgba(139, 92, 246, 0.18)',
      disabled: 'none',
      readonly: '0 1px 2px rgba(0, 0, 0, 0.05)',
    },
    color: {
      default: '#581c87',
      hover: '#581c87',
      focus: '#3b0764',
      disabled: '#a78bfa',
      readonly: '#6b21a8',
    },
    fontSize: '14px',
    fontWeight: '400',
    paddingBlock: '4px',
    paddingInline: '8px',
  },
  placeholder: {
    color: '#a78bfa',
    fontSize: '13px',
    fontStyle: 'italic',
  },
};

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
    style: [style1],
  },
  {
    value: [''],
    placeholder: [
      'Short placeholder',
      'Long placeholder, enough to extend beyond the input width.  Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    ],
    style: [style2],
  },
  {
    disabled: [false, true],
    actionButtonIconName: [undefined, 'send'],
    value: ['', 'Short value 2'],
    style: [style1],
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
    style: [style2],
  },
  {
    value: [
      '',
      'Short value 4',
      'Long value 4, enough to extend beyond the input width.  Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    ],
    actionButtonIconUrl: [img],
    actionButtonIconAlt: ['Letter A'],
    style: [style1],
  },
  {
    value: ['Short value 5'],
    actionButtonIconName: [undefined, 'send'],
    secondaryActions: [undefined, 'secondary actions 1'],
    secondaryContent: [undefined, 'secondary content 1'],
    invalid: [false, true],
    style: [style2],
  },
  {
    value: ['Short value 6'],
    actionButtonIconName: ['send'],
    secondaryActions: ['secondary actions 2'],
    secondaryContent: ['secondary content 2'],
    disableSecondaryActionsPaddings: [false, true],
    disableSecondaryContentPaddings: [false, true],
    style: [style1],
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
    style: [style2],
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
    style: [style1],
  },
]);

export default function PromptInputStylePermutations() {
  return (
    <>
      <h1>PromptInput Style permutations</h1>
      <ScreenshotArea disableAnimations={true}>
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
