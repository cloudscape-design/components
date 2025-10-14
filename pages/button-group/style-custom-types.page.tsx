// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

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
            background: `light-dark(rgba(166, 222, 255, 0.91), rgba(64, 123, 178, 0.8))`,
            borderRadius: '20px',
            paddingBlock: '14px',
            paddingInline: '18px',
            boxShadow: getBoxShadow('blue'),
            focusRing: {
              borderColor: `light-dark(${palette.blue80}, ${palette.blue40})`,
              borderWidth: '3px',
              borderRadius: '20px',
            },
          },
          item: {
            color: {
              active: `light-dark(${palette.blue100}, ${palette.blue10})`,
              default: `light-dark(${palette.blue90}, ${palette.blue20})`,
              hover: `light-dark(${palette.blue100}, ${palette.blue10})`,
              disabled: `light-dark(${palette.neutral60}, ${palette.neutral40})`,
            },
            focusRing: {
              borderColor: `light-dark(${palette.blue80}, ${palette.blue40})`,
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
            background: `light-dark(rgba(152, 234, 182, 0.87), rgba(34, 197, 94, 0.3))`,
            borderRadius: '16px',
            paddingBlock: '8px',
            paddingInline: '12px',
            boxShadow: getBoxShadow('green'),
            borderWidth: '4px',
            borderColor: `light-dark(rgba(24, 146, 69, 0.4), rgba(34, 197, 94, 0.6))`,
            focusRing: {
              borderColor: `light-dark(${palette.green60}, ${palette.green30})`,
              borderWidth: '3px',
              borderRadius: '16px',
            },
          },
          item: {
            color: {
              active: `light-dark(${palette.green100}, ${palette.green10})`,
              default: `light-dark(${palette.green90}, ${palette.green20})`,
              hover: `light-dark(${palette.green100}, ${palette.green10})`,
              disabled: `light-dark(${palette.neutral60}, ${palette.neutral40})`,
            },
            focusRing: {
              borderColor: `light-dark(${palette.green60}, ${palette.green30})`,
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
            background: `light-dark(rgba(223, 146, 91, 1), rgba(204, 90, 9, 0.81))`,
            borderRadius: '50px',
            paddingBlock: '14px',
            paddingInline: '12px',
            boxShadow: getBoxShadow('orange'),
            focusRing: {
              borderColor: `light-dark(${palette.orange60}, ${palette.orange40})`,
              borderWidth: '3px',
              borderRadius: '50px',
            },
          },
          item: {
            color: {
              active: `light-dark(${palette.orange100}, ${palette.orange10})`,
              default: `light-dark(${palette.orange90}, ${palette.orange20})`,
              hover: `light-dark(${palette.orange100}, ${palette.orange10})`,
              disabled: `light-dark(${palette.neutral60}, ${palette.neutral40})`,
            },
            focusRing: {
              borderColor: `light-dark(${palette.orange60}, ${palette.orange40})`,
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
            background: `light-dark(rgba(234, 91, 86, 0.52), rgba(210, 60, 60, 0.63))`,
            borderRadius: '18px',
            paddingBlock: '12px',
            paddingInline: '12px',
            boxShadow: getBoxShadow('red'),
            borderWidth: '2px',
            borderColor: `light-dark(rgba(239, 68, 68, 0.4), rgba(239, 68, 68, 0.6))`,
            focusRing: {
              borderColor: `light-dark(${palette.red80}, ${palette.red30})`,
              borderWidth: '2px',
              borderRadius: '8px',
            },
          },
          item: {
            color: {
              active: `light-dark(${palette.red100}, ${palette.red10})`,
              default: `light-dark(${palette.red80}, ${palette.red20})`,
              hover: `light-dark(${palette.red100}, ${palette.red10})`,
              disabled: `light-dark(${palette.neutral60}, ${palette.neutral40})`,
            },
            focusRing: {
              borderColor: `light-dark(${palette.red80}, ${palette.red30})`,
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
            background: `light-dark(rgba(234, 91, 86, 0.52), rgba(210, 60, 60, 0.63))`,
            borderRadius: '50%',
            paddingBlock: '12px',
            paddingInline: '12px',
            boxShadow: getBoxShadow('red'),
            borderWidth: '2px',
            borderColor: `light-dark(rgba(239, 68, 68, 0.4), rgba(239, 68, 68, 0.6))`,
            focusRing: {
              borderColor: `light-dark(${palette.red80}, ${palette.red30})`,
              borderWidth: '2px',
              borderRadius: '8px',
            },
          },
          item: {
            color: {
              active: `light-dark(${palette.red100}, ${palette.red10})`,
              default: `light-dark(${palette.red80}, ${palette.red20})`,
              hover: `light-dark(${palette.red100}, ${palette.red10})`,
              disabled: `light-dark(${palette.neutral60}, ${palette.neutral40})`,
            },
            focusRing: {
              borderColor: `light-dark(${palette.red80}, ${palette.red30})`,
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
            background: `light-dark(rgba(138, 237, 225, 0.76), rgba(9, 188, 155, 0.71))`,
            borderRadius: '24px',
            paddingBlock: '12px',
            paddingInline: '16px',
            boxShadow: getBoxShadow('teal'),
            focusRing: {
              borderColor: `light-dark(${palette.teal80}, ${palette.teal40})`,
              borderWidth: '2px',
              borderRadius: '8px',
            },
          },
          item: {
            color: {
              active: `light-dark(${palette.teal100}, ${palette.teal10})`,
              default: `light-dark(${palette.teal80}, ${palette.teal20})`,
              hover: `light-dark(${palette.teal100}, ${palette.teal10})`,
              disabled: `light-dark(${palette.neutral60}, ${palette.neutral40})`,
            },
            focusRing: {
              borderColor: `light-dark(${palette.teal80}, ${palette.teal40})`,
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
            background: `light-dark(rgba(205, 202, 202, 0.85), rgba(124, 122, 122, 1))`,
            borderRadius: '24px',
            paddingBlock: '12px',
            paddingInline: '16px',
            boxShadow: getBoxShadow('nav'),
            focusRing: {
              borderColor: `light-dark(${palette.neutral80}, ${palette.neutral40})`,
              borderWidth: '2px',
              borderRadius: '8px',
            },
          },
          item: {
            color: {
              active: `light-dark(${palette.neutral100}, ${palette.neutral10})`,
              default: `light-dark(${palette.neutral80}, ${palette.neutral20})`,
              hover: `light-dark(${palette.neutral100}, ${palette.neutral10})`,
              disabled: `light-dark(${palette.neutral60}, ${palette.neutral40})`,
            },
            focusRing: {
              borderColor: `light-dark(${palette.neutral80}, ${palette.neutral40})`,
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
            background: `light-dark(rgba(205, 202, 202, 0.85), rgba(124, 122, 122, 1))`,
            borderRadius: '24px',
            paddingBlock: '12px',
            paddingInline: '16px',
            boxShadow: getBoxShadow('nav'),
            focusRing: {
              borderColor: `light-dark(${palette.neutral80}, ${palette.neutral40})`,
              borderWidth: '2px',
              borderRadius: '8px',
            },
          },
          item: {
            color: {
              active: `light-dark(${palette.neutral100}, ${palette.neutral10})`,
              default: `light-dark(${palette.neutral80}, ${palette.neutral20})`,
              hover: `light-dark(${palette.neutral100}, ${palette.neutral10})`,
              disabled: `light-dark(${palette.neutral60}, ${palette.neutral40})`,
            },
            focusRing: {
              borderColor: `light-dark(${palette.neutral80}, ${palette.neutral40})`,
              borderWidth: '2px',
              borderRadius: '8px',
            },
          },
        }}
      />
    </div>
  );
}
function getBoxShadow(colorTheme: string) {
  const boxShadows = {
    blue: `0 2px 12px light-dark(rgba(59, 130, 246, 0.15), rgba(59, 130, 246, 0.25))`,
    green: `0 2px 12px light-dark(rgba(34, 197, 94, 0.15), rgba(34, 197, 94, 0.25))`,
    orange: `0 2px 12px light-dark(rgba(249, 115, 22, 0.15), rgba(249, 115, 22, 0.25))`,
    red: `0 2px 12px light-dark(rgba(239, 68, 68, 0.15), rgba(239, 68, 68, 0.25))`,
    teal: `0 2px 12px light-dark(rgba(20, 184, 166, 0.15),rgba(20, 184, 166, 0.25))`,
    nav: `0 4px 20px light-dark(rgba(0, 0, 0, 0.1), rgba(255, 255, 255, 0.1))`,
  };
  return boxShadows[colorTheme as keyof typeof boxShadows];
}
