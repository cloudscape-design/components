// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { renderComponent } from './utils';
import AppLayout from '../../../lib/components/app-layout';
import { waitFor } from '@testing-library/react';
import { useAppLayoutContext } from '../../../lib/components/internal/context/app-layout-context';

describe('set context values for footer and header', () => {
  test('to their corresponding heights', async () => {
    function Content() {
      const contextValues = useAppLayoutContext();
      return (
        <>
          <div id="header-height">{contextValues.stickyOffsetTop}</div>
          <div id="footer-height">{contextValues.stickyOffsetBottom}</div>
        </>
      );
    }
    function App() {
      return (
        <>
          <div style={{ height: 55 }} id="header" />
          <AppLayout headerSelector="#header" footerSelector="#footer" content={<Content />} />
          <div style={{ height: 83 }} id="footer" />
        </>
      );
    }

    const { wrapper } = renderComponent(<App />);
    await waitFor(() => {
      expect(wrapper.find('#header-height')!.getElement()).toHaveTextContent('55');
    });
    await waitFor(() => {
      expect(wrapper.find('#footer-height')!.getElement()).toHaveTextContent('83');
    });
  });

  test('to zeros when there is no footer and header', async () => {
    function Content() {
      const contextValues = useAppLayoutContext();
      return (
        <>
          <div id="header-height">{contextValues.stickyOffsetTop}</div>
          <div id="footer-height">{contextValues.stickyOffsetBottom}</div>
        </>
      );
    }
    function App() {
      return <AppLayout content={<Content />} />;
    }

    const { wrapper } = renderComponent(<App />);
    await waitFor(() => {
      expect(wrapper.find('#header-height')!.getElement()).toHaveTextContent('0');
    });
    await waitFor(() => {
      expect(wrapper.find('#footer-height')!.getElement()).toHaveTextContent('0');
    });
  });
});
