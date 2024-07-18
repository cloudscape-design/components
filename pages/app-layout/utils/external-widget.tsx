// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useImperativeHandle, useState } from 'react';
import ReactDOM, { unmountComponentAtNode } from 'react-dom';

import Drawer from '~components/drawer';
import awsuiPlugins from '~components/internal/plugins';

const searchParams = new URL(location.hash.substring(1), location.href).searchParams;

const Content = React.forwardRef((props, ref) => {
  const [resized, setResized] = useState(false);

  useImperativeHandle(ref, () => setResized);

  useEffect(() => {
    console.log('mounted');
    return () => console.log('unmounted');
  }, []);
  return (
    <Drawer header={<h2>Security</h2>}>
      I am runtime drawer, <span data-testid="current-size">resized: {`${resized}`}</span>
    </Drawer>
  );
});

const setSizeRef = React.createRef<(resized: boolean) => void>();

awsuiPlugins.appLayout.registerDrawer({
  id: 'security',

  ariaLabels: {
    closeButton: 'Security close button',
    content: 'Security drawer content',
    triggerButton: 'Security trigger button',
    resizeHandle: 'Security resize handle',
  },

  trigger: {
    iconSvg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
      <rect x="2" y="7" width="12" height="7" fill="none" stroke="currentColor" stroke-width="2" />
      <path d="M4,7V5a4,4,0,0,1,8,0V7" fill="none" stroke="currentColor" stroke-width="2" />
    </svg>`,
  },

  defaultActive: !!searchParams.get('force-default-active'),

  resizable: true,
  defaultSize: 320,

  onResize: event => {
    setSizeRef.current?.(true);
    console.log('resize', event.detail);
  },

  mountContent: container => {
    ReactDOM.render(<Content ref={setSizeRef} />, container);
  },
  unmountContent: container => unmountComponentAtNode(container),
});

awsuiPlugins.appLayout.registerDrawer({
  id: 'circle',

  ariaLabels: {
    closeButton: 'Close button',
    content: 'Content',
    triggerButton: 'Trigger button',
    resizeHandle: 'Resize handle',
  },

  trigger: {
    iconSvg: `<svg viewBox="0 0 16 16" focusable="false">
      <circle stroke-width="2" stroke="currentColor" fill="none" cx="8" cy="8" r="7" />
      <circle stroke-width="2" stroke="currentColor" fill="none" cx="8" cy="8" r="3" />
    </svg>`,
  },

  mountContent: container => {
    ReactDOM.render(<>Nothing to see here</>, container);
  },
  unmountContent: container => unmountComponentAtNode(container),
});
