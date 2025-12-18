/**
 * @jest-environment node
 */
/* eslint-disable header/header */
// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

import { useStickyFooter } from '../../../lib/components/drawer/use-sticky-footer';

function TestComponent() {
  const drawerRef = React.useRef<HTMLDivElement>(null);
  const footerRef = React.useRef<HTMLDivElement>(null);
  const { isSticky } = useStickyFooter({ drawerRef, footerRef });

  return (
    <div ref={drawerRef}>
      <div>Content</div>
      <div ref={footerRef}>Footer {isSticky ? 'sticky' : 'not sticky'}</div>
    </div>
  );
}

test('renders without errors in server-side environment', () => {
  const content = renderToStaticMarkup(<TestComponent />);

  // Should render with initial isSticky state (true)
  expect(content).toContain('Footer sticky');
});
