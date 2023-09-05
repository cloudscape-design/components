// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { waitFor } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import { describeEachAppLayout, renderComponent, isDrawerClosed } from './utils';
import AppLayout, { AppLayoutProps } from '../../../lib/components/app-layout';

describeEachAppLayout(() => {
  test('opens tools drawer', () => {
    let ref: AppLayoutProps.Ref | null = null;
    const { wrapper } = renderComponent(<AppLayout ref={newRef => (ref = newRef)} />);
    expect(isDrawerClosed(wrapper.findTools())).toBe(true);
    act(() => ref!.openTools());
    expect(isDrawerClosed(wrapper.findTools())).toBe(false);
  });

  test('focuses tools close button', () => {
    let ref: AppLayoutProps.Ref | null = null;
    const { wrapper } = renderComponent(<AppLayout ref={newRef => (ref = newRef)} toolsOpen={true} />);
    expect(isDrawerClosed(wrapper.findTools())).toBe(false);
    act(() => ref!.focusToolsClose());
    expect(wrapper.findToolsClose().getElement()).toHaveFocus();
  });

  test('allows to change focus after programmatically opening the drawer', async () => {
    // sample component that reproduces how this functionality should be done in a real app
    function App() {
      const layoutRef = React.useRef<AppLayoutProps.Ref>(null);
      const buttonRef = React.useRef<HTMLButtonElement>(null);
      const handleOpenTools = async () => {
        layoutRef.current!.openTools();
        await new Promise(resolve => setTimeout(resolve, 0));
        buttonRef.current!.focus();
      };
      return (
        <AppLayout
          ref={layoutRef}
          content={
            <button id="open-tools" onClick={handleOpenTools}>
              Open tools
            </button>
          }
          tools={
            <button ref={buttonRef} id="custom-button">
              Click me
            </button>
          }
        />
      );
    }

    const { wrapper } = renderComponent(<App />);
    wrapper.find('#open-tools')!.click();
    await waitFor(() => {
      expect(wrapper.find('#custom-button')!.getElement()).toEqual(document.activeElement);
    });
  });
});
