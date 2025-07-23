// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { act, waitFor } from '@testing-library/react';

import AppLayout, { AppLayoutProps } from '../../../lib/components/app-layout';
import { describeEachAppLayout, renderComponent } from './utils';

describeEachAppLayout({ themes: ['classic', 'refresh', 'refresh-toolbar'] }, () => {
  test('opens tools drawer', () => {
    let ref: AppLayoutProps.Ref | null = null;
    const { wrapper } = renderComponent(<AppLayout ref={newRef => (ref = newRef)} />);
    expect(wrapper.findOpenToolsPanel()).toBeFalsy();
    act(() => ref!.openTools());
    expect(wrapper.findOpenToolsPanel()).toBeTruthy();
  });

  test('focuses tools close button', () => {
    let ref: AppLayoutProps.Ref | null = null;
    const { wrapper } = renderComponent(<AppLayout ref={newRef => (ref = newRef)} toolsOpen={true} />);
    expect(wrapper.findOpenToolsPanel()).toBeTruthy();
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
