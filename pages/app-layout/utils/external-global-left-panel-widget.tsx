// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import ReactDOM, { unmountComponentAtNode } from 'react-dom';

import { Box } from '~components';
import ButtonGroup from '~components/button-group';
import awsuiPlugins from '~components/internal/plugins';

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

awsuiPlugins.appLayout.registerDrawer({
  id: 'amazon-q',
  type: 'global-ai',
  resizable: true,
  isExpandable: true,
  defaultSize: 500,
  preserveInactiveContent: true,

  ariaLabels: {
    closeButton: 'Close button',
    content: 'Amazon Q',
    triggerButton: 'Trigger button for ai drawer',
    resizeHandle: 'Resize handle',
    exitExpandedModeButton: 'Service Console',
  },

  trigger: {
    customIcon: `
      <svg width="58" height="32" viewBox="0 0 58 32" focusable="false" aria-hidden="true">
        <rect width="58" height="32" rx="4" fill="url(#paint0_radial_102_125756)"/>
        <defs>
          <radialGradient id="paint0_radial_102_125756" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(63.1768 -2.85617) rotate(151.113) scale(78.0669 84.498)">
            <stop stop-color="#B8E7FF"/>
            <stop offset="0.3" stop-color="#0099FF"/>
            <stop offset="0.45" stop-color="#5C7FFF"/>
            <stop offset="0.6" stop-color="#8575FF"/>
            <stop offset="0.8" stop-color="#962EFF"/>
          </radialGradient>
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
    ReactDOM.render(
      <div style={{ inlineSize: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>logo</div>
        <ButtonGroup
          variant="icon"
          ariaLabel="Chat actions"
          items={[
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
          ]}
        />
      </div>,
      container
    );
  },
  unmountHeader: container => unmountComponentAtNode(container),
});
