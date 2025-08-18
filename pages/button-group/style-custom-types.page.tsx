// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useRef } from 'react';

import { useCurrentMode } from '@cloudscape-design/component-toolkit/internal';

import { ButtonGroup as CloudscapeButtonGroup, SpaceBetween } from '~components';

import { palette } from '../app/themes/style-api';
import ScreenshotArea from '../utils/screenshot-area';

export default function CustomButtonGroupTypes() {
  return (
    <ScreenshotArea disableAnimations={true}>
      <h1>Custom ButtonGroup Types</h1>

      <SpaceBetween direction="vertical" size="l">
        <CustomButtonGroup colorTheme="default" orientation="horizontal">
          Default Horizontal
        </CustomButtonGroup>
        <CustomButtonGroup colorTheme="success" orientation="horizontal">
          Success Horizontal
        </CustomButtonGroup>
        <CustomButtonGroup colorTheme="error" orientation="vertical">
          Error Vertical
        </CustomButtonGroup>
        <CustomButtonGroup colorTheme="info" orientation="horizontal">
          Info Horizontal
        </CustomButtonGroup>
        <CustomButtonGroup colorTheme="warning" orientation="vertical">
          Warning Vertical
        </CustomButtonGroup>
        <ActionsExample />
        <FeedbackExample />
        <MenuDropdownExample />
        <FileInputExample />
      </SpaceBetween>
    </ScreenshotArea>
  );
}

interface CustomButtonGroupProps {
  children?: React.ReactNode;
  colorTheme: 'default' | 'error' | 'info' | 'warning' | 'success';
  orientation: 'horizontal' | 'vertical';
}

function CustomButtonGroup({ children, colorTheme, orientation }: CustomButtonGroupProps) {
  const mode = useCurrentMode(useRef(document.body));
  const background = backgrounds[mode][colorTheme];
  const itemBackground = itemBackgrounds[mode][colorTheme];
  const itemColor = itemColors[mode];
  const focusRing = focusRings[mode];

  return (
    <CloudscapeButtonGroup
      variant="icon"
      ariaLabel={`${children} button group`}
      items={[
        {
          type: 'icon-button',
          id: 'copy',
          text: 'Copy',
          iconName: 'copy',
        },
        {
          type: 'icon-toggle-button',
          id: 'like',
          text: 'Like',
          iconName: 'thumbs-up',
          pressed: false,
        },
        {
          type: 'menu-dropdown',
          id: 'more',
          text: 'More',
          items: [
            { id: 'share', text: 'Share', iconName: 'share' },
            { id: 'download', text: 'Download', iconName: 'download' },
          ],
        },
        {
          type: 'icon-file-input',
          id: 'upload',
          text: 'Upload',
          accept: '.jpg,.png',
          multiple: true,
        },
        {
          type: 'icon-button',
          id: 'settings',
          text: 'Settings',
          iconName: 'settings',
        },
      ]}
      style={{
        root: {
          background: background.default,
          borderRadius: '8px',
          borderWidth: '2px',
          borderColor: background.hover,
          gap: orientation === 'vertical' ? '8px' : '4px',
          flexDirection: orientation === 'vertical' ? 'column' : 'row',
          paddingBlock: '12px',
          paddingInline: '16px',
          focusRing,
        },
        item: {
          background: itemBackground,
          borderRadius: '6px',
          borderWidth: '1px',
          color: itemColor,
          focusRing: {
            borderColor: backgrounds[mode][colorTheme].active,
            borderWidth: '2px',
          },
          paddingBlock: '8px',
          paddingInline: '8px',
        },
      }}
    />
  );
}

const backgrounds = {
  light: {
    default: {
      active: palette.teal100,
      default: palette.teal20,
      hover: palette.teal80,
    },
    error: {
      active: palette.red100,
      default: palette.red20,
      hover: palette.red80,
    },
    info: {
      active: palette.blue100,
      default: palette.blue20,
      hover: palette.blue80,
    },
    success: {
      active: palette.green100,
      default: palette.green20,
      hover: palette.green80,
    },
    warning: {
      active: palette.orange100,
      default: palette.orange20,
      hover: palette.orange80,
    },
  },
  dark: {
    default: {
      active: palette.teal10,
      default: palette.teal90,
      hover: palette.teal30,
    },
    error: {
      active: palette.red10,
      default: palette.red90,
      hover: palette.red30,
    },
    info: {
      active: palette.blue10,
      default: palette.blue90,
      hover: palette.blue40,
    },
    success: {
      active: palette.green10,
      default: palette.green90,
      hover: palette.green30,
    },
    warning: {
      active: palette.orange10,
      default: palette.orange90,
      hover: palette.orange40,
    },
  },
};

const itemBackgrounds = {
  light: {
    default: {
      active: palette.teal80,
      default: palette.neutral10,
      disabled: palette.neutral40,
      hover: palette.teal60,
      pressed: palette.teal90,
    },
    error: {
      active: palette.red80,
      default: palette.neutral10,
      disabled: palette.neutral40,
      hover: palette.red60,
      pressed: palette.red90,
    },
    info: {
      active: palette.blue80,
      default: palette.neutral10,
      disabled: palette.neutral40,
      hover: palette.blue60,
      pressed: palette.blue90,
    },
    success: {
      active: palette.green80,
      default: palette.neutral10,
      disabled: palette.neutral40,
      hover: palette.green60,
      pressed: palette.green90,
    },
    warning: {
      active: palette.orange80,
      default: palette.neutral10,
      disabled: palette.neutral40,
      hover: palette.orange60,
      pressed: palette.orange90,
    },
  },
  dark: {
    default: {
      active: palette.teal30,
      default: palette.neutral90,
      disabled: palette.neutral80,
      hover: palette.teal60,
      pressed: palette.teal20,
    },
    error: {
      active: palette.red30,
      default: palette.neutral90,
      disabled: palette.neutral80,
      hover: palette.red60,
      pressed: palette.red20,
    },
    info: {
      active: palette.blue40,
      default: palette.neutral90,
      disabled: palette.neutral80,
      hover: palette.blue60,
      pressed: palette.blue20,
    },
    success: {
      active: palette.green30,
      default: palette.neutral90,
      disabled: palette.neutral80,
      hover: palette.green60,
      pressed: palette.green20,
    },
    warning: {
      active: palette.orange40,
      default: palette.neutral90,
      disabled: palette.neutral80,
      hover: palette.orange60,
      pressed: palette.orange40,
    },
  },
};

const itemColors = {
  light: {
    active: palette.neutral100,
    default: palette.neutral90,
    hover: palette.neutral100,
    disabled: palette.neutral60,
    pressed: palette.neutral100,
  },
  dark: {
    active: palette.neutral10,
    default: palette.neutral20,
    hover: palette.neutral10,
    disabled: palette.neutral60,
    pressed: palette.neutral10,
  },
};

const focusRings = {
  light: {
    borderColor: 'rgb(0, 64, 77)',
    borderWidth: '2px',
  },
  dark: {
    borderColor: 'rgb(233, 249, 252)',
    borderWidth: '2px',
  },
};

function ActionsExample() {
  return (
    <CloudscapeButtonGroup
      variant="icon"
      ariaLabel="Actions"
      items={[
        {
          type: 'icon-button',
          id: 'add',
          iconName: 'add-plus',
          text: 'Add',
        },
        {
          type: 'icon-button',
          id: 'remove',
          iconName: 'remove',
          text: 'Remove',
        },
      ]}
      style={{
        root: {
          background: palette.blue20,
          borderRadius: '8px',
          gap: '4px',
          paddingBlock: '8px',
          paddingInline: '12px',
        },
      }}
    />
  );
}

function FeedbackExample() {
  return (
    <CloudscapeButtonGroup
      variant="icon"
      ariaLabel="Feedback"
      items={[
        {
          type: 'group',
          text: 'Vote',
          items: [
            {
              type: 'icon-toggle-button',
              id: 'like',
              iconName: 'thumbs-up',
              pressedIconName: 'thumbs-up-filled',
              text: 'Like',
              pressed: true,
            },
            {
              type: 'icon-toggle-button',
              id: 'dislike',
              iconName: 'thumbs-down',
              pressedIconName: 'thumbs-down-filled',
              text: 'Dislike',
              pressed: false,
            },
          ],
        },
      ]}
      style={{
        root: {
          background: palette.green20,
          borderRadius: '12px',
          gap: '6px',
          paddingBlock: '10px',
          paddingInline: '14px',
        },
      }}
    />
  );
}

function MenuDropdownExample() {
  return (
    <CloudscapeButtonGroup
      variant="icon"
      ariaLabel="Menu dropdown"
      items={[
        {
          type: 'icon-button',
          id: 'copy',
          iconName: 'copy',
          text: 'Copy',
        },
        {
          type: 'menu-dropdown',
          id: 'more-actions',
          text: 'More actions',
          items: [{ id: 'cut', text: 'Cut', iconName: 'delete-marker' }],
        },
      ]}
      style={{
        root: {
          background: palette.orange20,
          borderRadius: '6px',
          gap: '4px',
          paddingBlock: '6px',
          paddingInline: '8px',
        },
        menuDropdown: {
          background: {
            default: palette.orange60,
            hover: palette.orange80,
            active: palette.orange90,
          },
          color: {
            default: palette.neutral10,
            hover: palette.neutral10,
          },
          borderRadius: '4px',
        },
      }}
    />
  );
}

function FileInputExample() {
  return (
    <CloudscapeButtonGroup
      variant="icon"
      ariaLabel="File input"
      items={[
        {
          type: 'icon-file-input',
          id: 'upload',
          text: 'Upload files',
          accept: '.jpg,.png,.pdf',
          multiple: true,
        },
      ]}
      style={{
        root: {
          background: palette.red20,
          borderRadius: '10px',
          gap: '6px',
          paddingBlock: '10px',
          paddingInline: '14px',
        },
        fileInput: {
          background: {
            default: palette.red60,
            hover: palette.red80,
          },
          color: {
            default: palette.neutral10,
            hover: palette.neutral10,
          },
          borderRadius: '6px',
          paddingBlock: '8px',
          paddingInline: '12px',
        },
      }}
    />
  );
}
