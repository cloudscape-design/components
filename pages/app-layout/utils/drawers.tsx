// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { AppLayoutProps, Drawer, SpaceBetween } from '~components';
import styles from '../styles.scss';

const getAriaLabels = (title: string, badge: boolean) => {
  return {
    closeButton: `${title} close button`,
    drawerName: `${title}`,
    triggerButton: `${title} trigger button${badge ? ' (Unread notifications)' : ''}`,
    resizeHandle: `${title} resize handle`,
  };
};

function Security() {
  return (
    <Drawer header={<h2>Security</h2>}>
      <SpaceBetween size="l">
        <div className={styles.contentPlaceholder} />
        <div className={styles.contentPlaceholder} />
        <div className={styles.contentPlaceholder} />
      </SpaceBetween>
    </Drawer>
  );
}

export const drawerItems: Array<AppLayoutProps.Drawer> = [
  {
    ariaLabels: getAriaLabels('Security', false),
    content: <Security />,
    id: 'security',
    resizable: true,
    onResize: (event: any) => {
      // A drawer implementer may choose to listen to THEIR drawer's
      // resize event,should they want to persist, or otherwise respond
      // to their drawer being resized.
      console.log('Security Drawer is now: ', event.detail.size);
    },
    trigger: {
      iconName: 'security',
    },
  },
  {
    ariaLabels: getAriaLabels('Pro help', true),
    content: <Drawer header={<h2>Pro help</h2>}>Pro help.</Drawer>,
    badge: true,
    defaultSize: 600,
    id: 'pro-help',
    trigger: {
      iconName: 'contact',
    },
  },
  {
    ariaLabels: getAriaLabels('Links', false),
    resizable: true,
    defaultSize: 500,
    content: <Drawer header={<h2>Links</h2>}>Links.</Drawer>,
    id: 'links',
    trigger: {
      iconName: 'share',
    },
  },
  {
    ariaLabels: getAriaLabels('Test 1', true),
    content: <Drawer header={<h2>Test 1</h2>}>Test 1.</Drawer>,
    badge: true,
    id: 'test-1',
    trigger: {
      iconName: 'contact',
    },
  },
  {
    ariaLabels: getAriaLabels('Test 2', false),
    resizable: true,
    defaultSize: 500,
    content: <Drawer header={<h2>Test 2</h2>}>Test 2.</Drawer>,
    id: 'test-2',
    trigger: {
      iconName: 'share',
    },
  },
  {
    ariaLabels: getAriaLabels('Test 3', true),
    content: <Drawer header={<h2>Test 3</h2>}>Test 3.</Drawer>,
    badge: true,
    id: 'test-3',
    trigger: {
      iconName: 'contact',
    },
  },
  {
    ariaLabels: getAriaLabels('Test 4', false),
    resizable: true,
    defaultSize: 500,
    content: <Drawer header={<h2>Test 4</h2>}>Test 4.</Drawer>,
    id: 'test-4',
    trigger: {
      iconName: 'edit',
    },
  },
  {
    ariaLabels: getAriaLabels('Test 5', false),
    resizable: true,
    defaultSize: 500,
    content: <Drawer header={<h2>Test 5</h2>}>Test 5.</Drawer>,
    id: 'test-5',
    trigger: {
      iconName: 'add-plus',
    },
  },
  {
    ariaLabels: getAriaLabels('Test 6', false),
    resizable: true,
    defaultSize: 500,
    content: <Drawer header={<h2>Test 6</h2>}>Test 6.</Drawer>,
    id: 'test-6',
    trigger: {
      iconName: 'call',
    },
  },
];

export const drawerLabels = {
  drawers: 'Drawers',
  drawersOverflow: 'Drawers overflow',
  drawersOverflowWithBadge: 'Drawers overflow with badge',
};
