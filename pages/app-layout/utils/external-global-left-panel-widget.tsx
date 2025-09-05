// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import ReactDOM, { unmountComponentAtNode } from 'react-dom';

import { Box } from '~components';
import { registerLeftDrawer } from '~components/internal/plugins/widget';

import styles from '../styles.scss';

const AIDrawer = () => {
  return (
    <Box padding="m">
      <Box variant="h2" padding={{ bottom: 'm' }}>
        Chat demo
      </Box>
      {new Array(100).fill(null).map((_, index) => (
        <div key={index}>Tela content</div>
      ))}
    </Box>
  );
};

registerLeftDrawer({
  id: 'amazon-q',
  resizable: true,
  isExpandable: true,
  defaultSize: 420,
  preserveInactiveContent: true,

  ariaLabels: {
    closeButton: 'Close AI Panel drawer',
    content: 'AI Panel',
    triggerButton: 'AI Panel',
    resizeHandle: 'Resize handle',
    expandedModeButton: 'Expanded mode button',
    exitExpandedModeButton: 'Console',
  },

  trigger: {
    customIcon: `
      <svg width="94" height="24" viewBox="0 0 94 24" fill="none" focusable="false" aria-hidden="true">
        <rect width="94" height="24" rx="4" fill="url(#paint0_linear_145_32649)"/>
        <defs>
          <linearGradient id="paint0_linear_145_32649" x1="135.919" y1="21" x2="108.351" y2="74.1863" gradientUnits="userSpaceOnUse">
            <stop stop-color="#B8E7FF"/>
            <stop offset="0.255" stop-color="#0099FF"/>
            <stop offset="0.514134" stop-color="#5C7FFF"/>
            <stop offset="0.732534" stop-color="#8575FF"/>
            <stop offset="1" stop-color="#962EFF"/>
          </linearGradient>
        </defs>
      </svg>
    `,
  },

  onResize: event => {
    console.log('resize', event.detail);
  },
  onToggle: event => {
    console.log('toggle', event.detail);
  },

  mountContent: container => {
    ReactDOM.render(<AIDrawer />, container);
  },
  unmountContent: container => unmountComponentAtNode(container),

  mountHeader: container => {
    ReactDOM.render(<div className={styles['ai-panel-logo']}>AI Panel</div>, container);
  },
  unmountHeader: container => unmountComponentAtNode(container),

  headerActions: [
    {
      type: 'menu-dropdown',
      id: 'more-actions',
      text: 'More actions',
      items: [
        {
          id: 'add',
          iconName: 'add-plus',
          text: 'Add',
        },
        {
          id: 'remove',
          iconName: 'remove',
          text: 'Remove',
        },
      ],
    },
    {
      type: 'icon-button',
      id: 'add',
      iconName: 'add-plus',
      text: 'Add',
    },
  ],

  onHeaderActionClick: ({ detail }) => {
    console.log('onHeaderActionClick: ', detail);
  },
});
