// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useRef, useState } from 'react';
import ReactDOM, { unmountComponentAtNode } from 'react-dom';

import awsuiPlugins from '~components/internal/plugins';

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

  isExpandable: true,

  ariaLabels: {
    closeButton: 'Close button',
    content: 'Content',
    triggerButton: 'Trigger button',
    resizeHandle: 'Resize handle',
  },
  onToggle: event => {
    console.log('circle-global drawer on toggle', event.detail);
  },

  trigger: {
    iconSvg: `<svg viewBox="0 0 16 16" focusable="false">
<path stroke-width="2" stroke="currentColor" fill="none"  d="M13.8131 1H6.55C6.51852 1 6.48889 1.01482 6.47 1.04L2.12 6.84C2.07056 6.90592 2.1176 7 2.2 7H6.32902C6.4055 7 6.45367 7.08237 6.41617 7.14903L2.19647 14.6507C2.1454 14.7415 2.24981 14.8401 2.33753 14.784L14.2121 7.18423C14.2963 7.13037 14.2582 7 14.1582 7H10.1869C10.107 7 10.0593 6.91099 10.1036 6.84453L13.8964 1.15547C13.9407 1.08901 13.893 1 13.8131 1Z" />
</svg>
`,
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
