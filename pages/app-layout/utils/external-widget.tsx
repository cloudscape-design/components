// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useImperativeHandle, useRef, useState } from 'react';
import ReactDOM, { unmountComponentAtNode } from 'react-dom';

import Drawer from '~components/drawer';
import awsuiPlugins from '~components/internal/plugins';

import { Counter, CustomDrawerContent } from './content-blocks';

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
  onToggle: event => {
    console.log('security drawer state change', event.detail);
  },

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
    ReactDOM.render(<div>Nothing to see here</div>, container);
  },
  unmountContent: container => unmountComponentAtNode(container),
});

const AutoIncrementCounter: React.FC<{
  onVisibilityChange?: (callback: (isVisible: boolean) => void) => void;
}> = ({ children, onVisibilityChange }) => {
  const [count, setCount] = useState(0);
  const isPaused = useRef(false);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isPaused.current) {
        setCount(prevCount => prevCount + 1);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (onVisibilityChange) {
      onVisibilityChange((isVisible: boolean) => {
        isPaused.current = !isVisible;
      });
    }
  }, [onVisibilityChange]);

  return (
    <div>
      <h3>Auto Increment Counter</h3>
      <div>Count: {count}</div>
      {children}
    </div>
  );
};

awsuiPlugins.appLayout.registerDrawer({
  id: 'circle-global',
  type: 'global',
  defaultActive: false,
  resizable: true,
  defaultSize: 350,
  preserveInactiveContent: true,

  ariaLabels: {
    closeButton: 'Close button',
    content: 'Content',
    triggerButton: 'Trigger button',
    resizeHandle: 'Resize handle',
  },
  onToggle: console.log,

  trigger: {
    iconSvg: `<svg viewBox="0 0 16 16" focusable="false">
      <circle stroke-width="2" stroke="currentColor" fill="none" cx="8" cy="8" r="7" />
      <circle stroke-width="2" stroke="currentColor" fill="none" cx="8" cy="8" r="3" />
    </svg>`,
  },

  onResize: event => {
    console.log('resize', event.detail);
  },

  mountContent: (container, mountContext) => {
    ReactDOM.render(
      <AutoIncrementCounter onVisibilityChange={mountContext?.onVisibilityChange}>
        global widget content circle 1
        {new Array(100).fill(null).map((_, index) => (
          <div key={index}>{index}</div>
        ))}
        <div data-testid="circle-global-bottom-content">circle-global bottom content</div>
      </AutoIncrementCounter>,
      container
    );
  },
  unmountContent: container => unmountComponentAtNode(container),
});

awsuiPlugins.appLayout.registerDrawer({
  id: 'circle2-global',
  type: 'global',
  defaultActive: false,
  resizable: true,
  defaultSize: 320,

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
    ReactDOM.render(
      <>
        <Counter id="circle2-global" />
        global widget content circle 2
      </>,
      container
    );
  },
  unmountContent: container => unmountComponentAtNode(container),
});

awsuiPlugins.appLayout.registerDrawer({
  id: 'circle3-global',
  type: 'global',
  defaultActive: false,
  resizable: true,
  defaultSize: 320,

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
    ReactDOM.render(
      <>
        <Counter id="circle3-global" />
        global widget content circle 3
      </>,
      container
    );
  },
  unmountContent: container => unmountComponentAtNode(container),
});

awsuiPlugins.appLayout.registerDrawer({
  id: 'circle4-global',
  type: 'global',
  defaultActive: false,
  resizable: true,
  defaultSize: 320,

  ariaLabels: {
    closeButton: 'Close button',
    content: 'Content',
    triggerButton: 'Trigger button',
    resizeHandle: 'Resize handle',
  },
  onToggle: event => console.log(event.detail),

  mountContent: container => {
    ReactDOM.render(<CustomDrawerContent />, container);
  },
  unmountContent: container => unmountComponentAtNode(container),
});
