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
        <BasicExample />
        <ActionsExample />
        <FeedbackExample />
        <MenuDropdownExample />
        <FileInputExample />
        <NavExample />
      </SpaceBetween>
    </ScreenshotArea>
  );
}

function BasicExample() {
  const mode = useCurrentMode(useRef(document.body));
  return (
    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
      <CloudscapeButtonGroup
        variant="icon"
        ariaLabel="Basic button group"
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
            type: 'icon-button',
            id: 'settings',
            text: 'Settings',
            iconName: 'settings',
          },
        ]}
        style={{
          root: {
            background: backgrounds[mode].blue,
            borderRadius: '20px',
            gap: '6px',
            paddingBlock: '14px',
            paddingInline: '18px',
            boxShadow: boxShadows[mode].blue,
            flexDirection: 'column',
            focusRing: {
              borderColor: focusRingColors[mode].blue,
              borderWidth: '3px',
              borderRadius: '20px',
            },
          },
          item: {
            color: {
              active: itemColors[mode].blue.active,
              default: itemColors[mode].blue.default,
              hover: itemColors[mode].blue.hover,
              disabled: itemColors[mode].disabled,
            },
            focusRing: {
              borderColor: focusRingColors[mode].blue,
              borderWidth: '2px',
              borderRadius: '8px',
            },
          },
        }}
      />
    </div>
  );
}

function ActionsExample() {
  const mode = useCurrentMode(useRef(document.body));
  return (
    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
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
            disabled: true,
          },
        ]}
        style={{
          root: {
            background: backgrounds[mode].green,
            borderRadius: '16px',
            gap: '4px',
            paddingBlock: '12px',
            paddingInline: '12px',
            boxShadow: boxShadows[mode].green,
            borderWidth: '4px',
            borderColor: borderColors[mode].green,
            focusRing: {
              borderColor: focusRingColors[mode].green,
              borderWidth: '3px',
              borderRadius: '16px',
            },
          },
          item: {
            color: {
              active: itemColors[mode].green.active,
              default: itemColors[mode].green.default,
              hover: itemColors[mode].green.hover,
              disabled: itemColors[mode].disabled,
            },
            focusRing: {
              borderColor: focusRingColors[mode].green,
              borderWidth: '2px',
              borderRadius: '8px',
            },
          },
        }}
      />
    </div>
  );
}

function FeedbackExample() {
  const mode = useCurrentMode(useRef(document.body));
  return (
    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
      <CloudscapeButtonGroup
        variant="icon"
        ariaLabel="Feedback"
        items={[
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
        ]}
        style={{
          root: {
            background: backgrounds[mode].orange,
            borderRadius: '50px',
            gap: '8px',
            paddingBlock: '12px',
            paddingInline: '20px',
            boxShadow: boxShadows[mode].orange,
            flexDirection: 'column',
            focusRing: {
              borderColor: focusRingColors[mode].orange,
              borderWidth: '3px',
              borderRadius: '50px',
            },
          },
          item: {
            color: {
              active: itemColors[mode].orange.active,
              default: itemColors[mode].orange.default,
              hover: itemColors[mode].orange.hover,
              disabled: itemColors[mode].disabled,
            },
            focusRing: {
              borderColor: focusRingColors[mode].orange,
              borderWidth: '2px',
              borderRadius: '8px',
            },
          },
        }}
      />
    </div>
  );
}

function MenuDropdownExample() {
  const mode = useCurrentMode(useRef(document.body));
  return (
    <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
      <CloudscapeButtonGroup
        variant="icon"
        ariaLabel="Menu actions"
        items={[
          {
            type: 'icon-button',
            id: 'edit',
            text: 'Edit',
            iconName: 'edit',
          },
          {
            type: 'icon-button',
            id: 'delete',
            text: 'Delete',
            iconName: 'remove',
          },
          {
            type: 'icon-button',
            id: 'duplicate',
            text: 'Duplicate',
            iconName: 'copy',
            disabled: true,
          },
        ]}
        style={{
          root: {
            background: backgrounds[mode].red,
            borderRadius: '18px',
            gap: '4px',
            paddingBlock: '12px',
            paddingInline: '12px',
            boxShadow: boxShadows[mode].red,
            borderWidth: '2px',
            borderColor: borderColors[mode].red,
            focusRing: {
              borderColor: focusRingColors[mode].red,
              borderWidth: '2px',
              borderRadius: '8px',
            },
          },
          item: {
            color: {
              active: itemColors[mode].red.active,
              default: itemColors[mode].red.default,
              hover: itemColors[mode].red.hover,
              disabled: itemColors[mode].disabled,
            },
            focusRing: {
              borderColor: focusRingColors[mode].red,
              borderWidth: '2px',
              borderRadius: '8px',
            },
          },
        }}
      />
      <CloudscapeButtonGroup
        variant="icon"
        ariaLabel="More actions"
        items={[
          {
            type: 'menu-dropdown',
            id: 'more',
            text: 'More',
            items: [
              { id: 'share', text: 'Share', iconName: 'share' },
              { id: 'export', text: 'Export', iconName: 'download' },
            ],
          },
        ]}
        style={{
          root: {
            background: backgrounds[mode].red,
            borderRadius: '50%',
            paddingBlock: '12px',
            paddingInline: '12px',
            boxShadow: boxShadows[mode].red,
            borderWidth: '2px',
            borderColor: borderColors[mode].red,
            focusRing: {
              borderColor: focusRingColors[mode].red,
              borderWidth: '2px',
              borderRadius: '8px',
            },
          },
          item: {
            color: {
              active: itemColors[mode].red.active,
              default: itemColors[mode].red.default,
              hover: itemColors[mode].red.hover,
              disabled: itemColors[mode].disabled,
            },
            focusRing: {
              borderColor: focusRingColors[mode].red,
              borderWidth: '2px',
              borderRadius: '8px',
            },
          },
        }}
      />
    </div>
  );
}

function FileInputExample() {
  const mode = useCurrentMode(useRef(document.body));
  return (
    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
      <CloudscapeButtonGroup
        variant="icon"
        ariaLabel="File operations"
        items={[
          {
            type: 'icon-file-input',
            id: 'upload',
            text: 'Upload files',
            accept: '.jpg,.png,.pdf',
            multiple: true,
          },
          {
            type: 'icon-button',
            id: 'download',
            text: 'Download',
            iconName: 'download',
          },
        ]}
        style={{
          root: {
            background: backgrounds[mode].teal,
            borderRadius: '24px',
            gap: '8px',
            paddingBlock: '12px',
            paddingInline: '16px',
            boxShadow: boxShadows[mode].teal,
            focusRing: {
              borderColor: focusRingColors[mode].teal,
              borderWidth: '2px',
              borderRadius: '8px',
            },
          },
          item: {
            color: {
              active: itemColors[mode].teal.active,
              default: itemColors[mode].teal.default,
              hover: itemColors[mode].teal.hover,
              disabled: itemColors[mode].disabled,
            },
            focusRing: {
              borderColor: focusRingColors[mode].teal,
              borderWidth: '2px',
              borderRadius: '8px',
            },
          },
        }}
      />
    </div>
  );
}

function NavExample() {
  const mode = useCurrentMode(useRef(document.body));
  return (
    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
      <CloudscapeButtonGroup
        variant="icon"
        ariaLabel="Main navigation"
        items={[
          {
            type: 'icon-button',
            id: 'view-full',
            text: 'View',
            iconName: 'view-full',
          },
          {
            type: 'icon-button',
            id: 'folder',
            text: 'Folder',
            iconName: 'folder',
          },
          {
            type: 'icon-button',
            id: 'status-positive',
            text: 'Analytics',
            iconName: 'status-positive',
          },
        ]}
        style={{
          root: {
            background: backgrounds[mode].nav,
            borderRadius: '24px',
            gap: '8px',
            paddingBlock: '12px',
            paddingInline: '16px',
            boxShadow: boxShadows[mode].nav,
            focusRing: {
              borderColor: focusRingColors[mode].nav,
              borderWidth: '2px',
              borderRadius: '8px',
            },
          },
          item: {
            color: {
              active: itemColors[mode].nav.active,
              default: itemColors[mode].nav.default,
              hover: itemColors[mode].nav.hover,
              disabled: itemColors[mode].disabled,
            },
            focusRing: {
              borderColor: focusRingColors[mode].nav,
              borderWidth: '2px',
              borderRadius: '8px',
            },
          },
        }}
      />
      <CloudscapeButtonGroup
        variant="icon"
        ariaLabel="Search"
        items={[
          {
            type: 'icon-button',
            id: 'search',
            text: 'Search',
            iconName: 'search',
          },
        ]}
        style={{
          root: {
            background: backgrounds[mode].nav,
            borderRadius: '24px',
            gap: '8px',
            paddingBlock: '12px',
            paddingInline: '16px',
            boxShadow: boxShadows[mode].nav,
            focusRing: {
              borderColor: focusRingColors[mode].nav,
              borderWidth: '2px',
              borderRadius: '8px',
            },
          },
          item: {
            color: {
              active: itemColors[mode].nav.active,
              default: itemColors[mode].nav.default,
              hover: itemColors[mode].nav.hover,
              disabled: itemColors[mode].disabled,
            },
            focusRing: {
              borderColor: focusRingColors[mode].nav,
              borderWidth: '2px',
              borderRadius: '8px',
            },
          },
        }}
      />
    </div>
  );
}

const backgrounds = {
  light: {
    blue: 'rgba(166, 222, 255, 0.91)',
    green: 'rgba(152, 234, 182, 0.87)',
    orange: 'rgba(223, 146, 91, 1)',
    red: 'rgba(234, 91, 86, 0.52)',
    teal: 'rgba(138, 237, 225, 0.76)',
    nav: 'rgba(205, 202, 202, 0.85)',
  },
  dark: {
    blue: 'rgba(64, 123, 178, 0.8)',
    green: 'rgba(34, 197, 94, 0.3)',
    orange: 'rgba(204, 90, 9, 0.81)',
    red: 'rgba(210, 60, 60, 0.63)',
    teal: 'rgba(9, 188, 155, 0.71)',
    nav: 'rgba(124, 122, 122, 1)',
  },
};

const borderColors = {
  light: {
    green: 'rgba(24, 146, 69, 0.4)',
    red: 'rgba(239, 68, 68, 0.4)',
  },
  dark: {
    green: 'rgba(34, 197, 94, 0.6)',
    red: 'rgba(239, 68, 68, 0.6)',
  },
};

const boxShadows = {
  light: {
    blue: '0 2px 12px rgba(59, 130, 246, 0.15)',
    green: '0 2px 12px rgba(34, 197, 94, 0.15)',
    orange: '0 2px 12px rgba(249, 115, 22, 0.15)',
    red: '0 2px 12px rgba(239, 68, 68, 0.15)',
    teal: '0 2px 12px rgba(20, 184, 166, 0.15)',
    nav: '0 4px 20px rgba(0, 0, 0, 0.1)',
  },
  dark: {
    blue: '0 2px 12px rgba(59, 130, 246, 0.25)',
    green: '0 2px 12px rgba(34, 197, 94, 0.25)',
    orange: '0 2px 12px rgba(249, 115, 22, 0.25)',
    red: '0 2px 12px rgba(239, 68, 68, 0.25)',
    teal: '0 2px 12px rgba(20, 184, 166, 0.25)',
    nav: '0 4px 20px rgba(255, 255, 255, 0.1)',
  },
};

const focusRingColors = {
  light: {
    blue: palette.blue80,
    green: palette.green60,
    orange: palette.orange60,
    red: palette.red80,
    teal: palette.teal80,
    nav: palette.neutral80,
  },
  dark: {
    blue: palette.blue40,
    green: palette.green30,
    orange: palette.orange40,
    red: palette.red30,
    teal: palette.teal40,
    nav: palette.neutral40,
  },
};

const itemColors = {
  light: {
    blue: {
      active: palette.blue100,
      default: palette.blue90,
      hover: palette.blue100,
    },
    green: {
      active: palette.green100,
      default: palette.green90,
      hover: palette.green100,
    },
    orange: {
      active: palette.orange100,
      default: palette.orange90,
      hover: palette.orange100,
    },
    red: {
      active: palette.red100,
      default: palette.red80,
      hover: palette.red100,
    },
    teal: {
      active: palette.teal100,
      default: palette.teal80,
      hover: palette.teal100,
    },
    nav: {
      active: palette.neutral100,
      default: palette.neutral80,
      hover: palette.neutral100,
    },
    disabled: palette.neutral60,
  },
  dark: {
    blue: {
      active: palette.blue10,
      default: palette.blue20,
      hover: palette.blue10,
    },
    green: {
      active: palette.green10,
      default: palette.green20,
      hover: palette.green10,
    },
    orange: {
      active: palette.orange10,
      default: palette.orange20,
      hover: palette.orange10,
    },
    red: {
      active: palette.red10,
      default: palette.red20,
      hover: palette.red10,
    },
    teal: {
      active: palette.teal10,
      default: palette.teal20,
      hover: palette.teal10,
    },
    nav: {
      active: palette.neutral10,
      default: palette.neutral20,
      hover: palette.neutral10,
    },
    disabled: palette.neutral40,
  },
};
